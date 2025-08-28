import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng ký</CardTitle>
          <CardDescription>
            Tạo tài khoản mới để sử dụng ví điện tử
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input id="confirmPassword" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Đăng ký
                </Button>
                <Button variant="outline" className="w-full">
                  Đăng ký với Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Đã có tài khoản?{' '}
              <a href="/login" className="underline underline-offset-4">
                Đăng nhập
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
