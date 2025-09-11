import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';
import { useWallet } from '../../components/wallet-context';
import axios from 'axios';

interface Bill {
  id: string;
  type: string;
  company: string;
  accountNumber: string;
  amount: number;
  dueDate: string;
  status: string;
  description: string;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBill: Bill | null;
  onPaymentSuccess: () => void;
}

export default function PaymentDialog({
  open,
  onOpenChange,
  selectedBill,
  onPaymentSuccess,
}: PaymentDialogProps) {
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { wallet, reloadWallet } = useWallet();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handlePayBill = async () => {
    if (!selectedBill || !wallet) return;

    if (wallet.balance < selectedBill.amount) {
      alert('Số dư không đủ để thanh toán hóa đơn này!');
      return;
    }

    setPaying(true);
    try {
      const accessToken = localStorage.getItem('accessToken');

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/bill-payments/pay`,
        {
          billPaymentId: selectedBill.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        setPaymentSuccess(true);
        await reloadWallet();
        onPaymentSuccess();

        setTimeout(() => {
          onOpenChange(false);
          setPaymentSuccess(false);
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán!';
      alert(errorMessage);
    } finally {
      setPaying(false);
    }
  };

  const handleClose = () => {
    if (!paying) {
      onOpenChange(false);
      setPaymentSuccess(false);
    }
  };

  if (!selectedBill) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Xác nhận thanh toán</span>
          </DialogTitle>
          <DialogDescription>
            Vui lòng kiểm tra thông tin thanh toán
          </DialogDescription>
        </DialogHeader>

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
                  <span className="text-muted-foreground">Nhà cung cấp:</span>
                  <span className="font-medium">{selectedBill.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-mono">
                    {selectedBill.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mô tả:</span>
                  <span className="text-right max-w-[200px] break-words">
                    {selectedBill.description}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Số tiền thanh toán:</span>
                  <span className="text-primary">
                    {formatCurrency(selectedBill.amount)}
                  </span>
                </div>
                {wallet && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Số dư hiện tại:</span>
                    <span>{formatCurrency(wallet.balance)}</span>
                  </div>
                )}
              </div>

              {wallet && wallet.balance < selectedBill.amount && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Số dư không đủ</AlertTitle>
                  <AlertDescription>
                    Bạn cần có ít nhất {formatCurrency(selectedBill.amount)} để
                    thanh toán hóa đơn này. Số dư hiện tại:{' '}
                    {formatCurrency(wallet.balance)}
                  </AlertDescription>
                </Alert>
              )}

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={paying}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handlePayBill}
                  disabled={
                    paying || !!(wallet && wallet.balance < selectedBill.amount)
                  }
                  className="min-w-[100px]"
                >
                  {paying ? 'Đang xử lý...' : 'Thanh toán'}
                </Button>
              </DialogFooter>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
