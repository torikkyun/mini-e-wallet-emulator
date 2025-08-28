import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BalanceCard({ balance }: { balance: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Số dư ví</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">
          {new Intl.NumberFormat('vi-VN').format(balance)} đ
        </p>
        <p className="mt-1">Tài khoản chính</p>
      </CardContent>
    </Card>
  );
}
