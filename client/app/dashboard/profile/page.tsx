'use client';

import { useUser } from '../components/user-context';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import Cropper from 'react-easy-crop';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import getCroppedImg from '@/lib/crop-image';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.name ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string>(
    user?.avatar ?? '',
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setAvatarPreview(user?.avatar ?? '');
    setAvatarFile(null);
    setChanged(false);
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setRawImage(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImage(reader.result as string);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (!rawImage || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(rawImage, croppedAreaPixels);
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setAvatarPreview(croppedUrl);
    setAvatarFile(
      new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' }),
    );
    setChanged(true);
    setCropModalOpen(false);
    toast.info('Đã cắt ảnh đại diện');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setChanged(e.target.value !== user.name || !!avatarFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('name', name);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const updatedUser = res.data?.data?.user;
      setUser(updatedUser);
      setChanged(false);
      toast.success('Cập nhật thông tin thành công');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch {
      toast.error('Cập nhật thất bại');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={avatarPreview} alt={name} />
                <AvatarFallback>{name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="avatar">Ảnh đại diện</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mt-2"
                  disabled={loading}
                  ref={inputRef}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="name">Tên</Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                required
                className="mt-2"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="mt-2"
              />
            </div>
            <div>
              <Label>Số tài khoản</Label>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground font-mono text-sm">
                <CreditCard className="w-4 h-4" />
                {user.accountNumber}
              </div>
            </div>
            <div>
              <Label>Ngày tạo tài khoản</Label>
              <div className="mt-2 text-muted-foreground mb-6">
                {new Date(user.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || !changed}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cắt ảnh đại diện</DialogTitle>
          </DialogHeader>
          {rawImage && (
            <div>
              <div style={{ position: 'relative', width: '100%', height: 300 }}>
                <Cropper
                  image={rawImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="mt-4 flex flex-col items-center">
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={([value]) => setZoom(value)}
                  className="w-3/4"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleCancelCrop();
                setCropModalOpen(false);
              }}
            >
              Hủy
            </Button>
            <Button type="button" onClick={handleCropSave}>
              Lưu ảnh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
