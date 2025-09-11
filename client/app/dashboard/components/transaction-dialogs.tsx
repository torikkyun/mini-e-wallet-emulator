'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import axios from 'axios';

type Action = 'topup' | 'withdraw' | 'transfer';

export function TransactionDialogs({
  balance,
  onSuccess,
}: {
  balance: number;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState<Action | null>(null);
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setOpen(customEvent.detail);
    };
    window.addEventListener('open-dialog', handler);
    return () => window.removeEventListener('open-dialog', handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast('Số tiền không hợp lệ');
      setIsSubmitting(false);
      return;
    }

    if (open === 'withdraw' && numAmount > balance) {
      toast('Số dư không đủ');
      setIsSubmitting(false);
      return;
    }

    if (open === 'transfer' && (!accountNumber || accountNumber === '')) {
      toast('Vui lòng nhập số tài khoản người nhận');
      setIsSubmitting(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (open === 'topup') {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions/topup`,
          {
            amount: numAmount,
            description: 'Nạp tiền vào tài khoản',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (onSuccess) onSuccess();
      } else if (open === 'withdraw') {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions/withdraw`,
          {
            amount: numAmount,
            description: 'Rút tiền từ tài khoản',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (onSuccess) onSuccess();
      } else if (open === 'transfer') {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/transactions/transfer`,
          {
            amount: numAmount,
            accountNumber,
            description: 'Chuyển tiền đến tài khoản khác',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      toast(err?.response?.data?.message || 'Có lỗi xảy ra');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setOpen(null);
    setAmount('');
    setAccountNumber('');
  };

  function formatCurrency(value: string) {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return Number(number).toLocaleString('vi-VN');
  }

  function parseCurrency(value: string) {
    return value.replace(/\D/g, '');
  }

  const dialogTitle =
    {
      topup: 'Nạp tiền',
      withdraw: 'Rút tiền',
      transfer: 'Chuyển tiền',
    }[open!] || '';

  return (
    <>
      {(['topup', 'withdraw', 'transfer'] as const).map((action) => (
        <Dialog
          key={action}
          open={open === action}
          onOpenChange={(isOpen) => !isOpen && setOpen(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label>Số tiền (đ)</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(amount)}
                  onChange={(e) => {
                    const raw = parseCurrency(e.target.value);
                    setAmount(raw);
                  }}
                  placeholder="Nhập số tiền"
                  required
                />
              </div>

              {open === 'transfer' && (
                <div className="space-y-3">
                  <Label>Số tài khoản người nhận</Label>
                  <Input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="1000000001"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(null)}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
