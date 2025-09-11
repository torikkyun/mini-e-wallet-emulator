import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Wifi, Droplets, Phone } from 'lucide-react';

interface Bill {
  id: string;
  type: 'electricity' | 'water' | 'internet' | 'phone';
  company: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  description: string;
}

const billTypes = [
  { value: 'electricity', label: 'Điện', icon: Zap, color: 'bg-yellow-500' },
  { value: 'water', label: 'Nước', icon: Droplets, color: 'bg-blue-500' },
  { value: 'internet', label: 'Internet', icon: Wifi, color: 'bg-purple-500' },
  { value: 'phone', label: 'Điện thoại', icon: Phone, color: 'bg-green-500' },
];

interface BillCardProps {
  bill: Bill;
  onPayClick: (bill: Bill) => void;
}

export default function BillCard({ bill, onPayClick }: BillCardProps) {
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
      case 'success':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
            Đã thanh toán
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-200">
            Thất bại
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200">
            Đã hủy
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200">
            Chờ thanh toán
          </Badge>
        );
    }
  };

  const canPay = bill.status === 'pending';

  const getButtonText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Đã thanh toán';
      case 'failed':
        return 'Thanh toán thất bại';
      case 'cancelled':
        return 'Đã hủy';
      case 'pending':
      default:
        return 'Thanh toán';
    }
  };

  const typeInfo = getBillTypeInfo(bill.type);
  const Icon = typeInfo.icon;

  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start space-x-2 min-w-0 flex-1">
            <div
              className={`p-2 rounded-lg ${typeInfo.color} text-white flex-shrink-0 mt-1`}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg leading-tight line-clamp-2">
                {bill.company}
              </CardTitle>
              <CardDescription className="leading-tight">
                {typeInfo.label}
              </CardDescription>
            </div>
          </div>
          <div className="flex-shrink-0 self-start lg:mt-1">
            {getStatusBadge(bill.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex-1 flex flex-col">
        <div>
          <Label className="text-sm text-muted-foreground">Số tài khoản</Label>
          <p className="font-mono text-sm">{bill.accountNumber}</p>
        </div>
        <div className="flex-1">
          <Label className="text-sm text-muted-foreground">Mô tả</Label>
          <p className="text-sm line-clamp-2">{bill.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 sm:gap-4">
          <div className="flex-shrink-0">
            <Label className="text-sm text-muted-foreground">
              Hạn thanh toán
            </Label>
            <p className="text-sm font-medium">{formatDate(bill.dueDate)}</p>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <Label className="text-sm text-muted-foreground">Số tiền</Label>
            <p className="text-sm font-bold text-primary">
              {formatCurrency(bill.amount)}
            </p>
          </div>
        </div>
        <Button
          className="w-full mt-auto"
          disabled={!canPay}
          onClick={() => canPay && onPayClick(bill)}
          variant={canPay ? 'default' : 'secondary'}
        >
          {getButtonText(bill.status)}
        </Button>
      </CardContent>
    </Card>
  );
}
