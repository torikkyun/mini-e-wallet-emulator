'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Zap,
  Wifi,
  Droplets,
  Phone,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useUser } from '../components/user-context';
import { useWallet } from '../components/wallet-context';
import axios from 'axios';

interface Bill {
  id: string;
  type: 'electricity' | 'water' | 'internet' | 'phone';
  company: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

const billTypes = [
  { value: 'electricity', label: 'Điện', icon: Zap, color: 'bg-yellow-500' },
  { value: 'water', label: 'Nước', icon: Droplets, color: 'bg-blue-500' },
  { value: 'internet', label: 'Internet', icon: Wifi, color: 'bg-purple-500' },
  { value: 'phone', label: 'Điện thoại', icon: Phone, color: 'bg-green-500' },
];

const mockBills: Bill[] = [
  {
    id: '1',
    type: 'electricity',
    company: 'EVN HCMC',
    accountNumber: 'PE123456789',
    amount: 450000,
    dueDate: '2025-09-15',
    status: 'pending',
    description: 'Tiền điện tháng 8/2025',
  },
  {
    id: '2',
    type: 'water',
    company: 'Sawaco',
    accountNumber: 'SW987654321',
    amount: 180000,
    dueDate: '2025-09-20',
    status: 'pending',
    description: 'Tiền nước tháng 8/2025',
  },
  {
    id: '3',
    type: 'internet',
    company: 'FPT Telecom',
    accountNumber: 'FPT555666777',
    amount: 300000,
    dueDate: '2025-09-12',
    status: 'overdue',
    description: 'Cước internet tháng 8/2025',
  },
  {
    id: '4',
    type: 'phone',
    company: 'Viettel',
    accountNumber: '0123456789',
    amount: 150000,
    dueDate: '2025-08-30',
    status: 'paid',
    description: 'Cước điện thoại tháng 8/2025',
  },
];

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { user } = useUser();
  const { wallet, reloadWallet } = useWallet();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBills(mockBills);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || bill.type === selectedType;
    return matchesSearch && matchesType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getBillTypeInfo = (type: string) => {
    return billTypes.find((t) => t.value === type) || billTypes[0];
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Đã thanh toán
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Quá hạn
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Chờ thanh toán
          </Badge>
        );
    }
  };

  const handlePayBill = async () => {
    if (!selectedBill || !wallet) return;

    if (wallet.balance < selectedBill.amount) {
      alert('Số dư không đủ để thanh toán hóa đơn này!');
      return;
    }

    setPaying(true);
    try {
      // Simulate payment API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update bill status
      setBills((prev) =>
        prev.map((bill) =>
          bill.id === selectedBill.id
            ? { ...bill, status: 'paid' as const }
            : bill,
        ),
      );

      setPaymentSuccess(true);
      await reloadWallet();

      setTimeout(() => {
        setPaymentDialogOpen(false);
        setPaymentSuccess(false);
        setSelectedBill(null);
      }, 2000);
    } catch (error) {
      alert('Có lỗi xảy ra khi thanh toán!');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Thanh toán hóa đơn</h1>
        <p className="text-muted-foreground">
          Quản lý và thanh toán các hóa đơn tiện ích
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm hóa đơn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Loại hóa đơn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {billTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBills.map((bill) => {
          const typeInfo = getBillTypeInfo(bill.type);
          const Icon = typeInfo.icon;

          return (
            <Card key={bill.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`p-2 rounded-lg ${typeInfo.color} text-white`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{bill.company}</CardTitle>
                      <CardDescription>{typeInfo.label}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(bill.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Số tài khoản
                  </Label>
                  <p className="font-mono text-sm">{bill.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Mô tả</Label>
                  <p className="text-sm">{bill.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Hạn thanh toán
                    </Label>
                    <p className="text-sm font-medium">
                      {formatDate(bill.dueDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Label className="text-sm text-muted-foreground">
                      Số tiền
                    </Label>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(bill.amount)}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  disabled={bill.status === 'paid'}
                  onClick={() => {
                    setSelectedBill(bill);
                    setPaymentDialogOpen(true);
                  }}
                >
                  {bill.status === 'paid' ? 'Đã thanh toán' : 'Thanh toán'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredBills.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Không tìm thấy hóa đơn
            </h3>
            <p className="text-muted-foreground">
              Thử thay đổi bộ lọc tìm kiếm của bạn
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Xác nhận thanh toán</span>
            </DialogTitle>
            <DialogDescription>
              Vui lòng kiểm tra thông tin thanh toán
            </DialogDescription>
          </DialogHeader>

          {selectedBill && (
            <div className="space-y-4">
              {paymentSuccess ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    Thanh toán thành công!
                  </h3>
                  <p className="text-muted-foreground">
                    Hóa đơn đã được thanh toán
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Nhà cung cấp:
                      </span>
                      <span className="font-medium">
                        {selectedBill.company}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Số tài khoản:
                      </span>
                      <span className="font-mono">
                        {selectedBill.accountNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mô tả:</span>
                      <span>{selectedBill.description}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Số tiền thanh toán:</span>
                      <span className="text-primary">
                        {formatCurrency(selectedBill.amount)}
                      </span>
                    </div>
                  </div>

                  {wallet && wallet.balance < selectedBill.amount && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Số dư không đủ</AlertTitle>
                      <AlertDescription>
                        Bạn cần có ít nhất {formatCurrency(selectedBill.amount)}{' '}
                        để thanh toán hóa đơn này. Số dư hiện tại:{' '}
                        {formatCurrency(wallet.balance)}
                      </AlertDescription>
                    </Alert>
                  )}

                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPaymentDialogOpen(false)}
                      disabled={paying}
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handlePayBill}
                      disabled={
                        paying ||
                        (wallet && wallet.balance < selectedBill.amount)
                      }
                      className="min-w-[100px]"
                    >
                      {paying ? 'Đang xử lý...' : 'Thanh toán'}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
