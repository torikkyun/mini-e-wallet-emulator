'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

type Action = 'topup' | 'withdraw' | 'transfer';

export function TransactionDialogs({ balance }: { balance: number }) {
  const [open, setOpen] = useState<Action | null>(null);
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      setOpen(customEvent.detail);
    };
    window.addEventListener('open-dialog', handler);
    return () => window.removeEventListener('open-dialog', handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      toast('Số tiền không hợp lệ');
      return;
    }

    if (open === 'withdraw' && numAmount > balance) {
      toast('Số dư không đủ');
      return;
    }

    if (open === 'transfer' && (!email || email === '')) {
      toast('Vui lòng nhập email người nhận');
      return;
    }

    // Gọi API ở đây (sau này thay bằng fetch)
    console.log(
      `${open} ${numAmount} đ`,
      open === 'transfer' ? `to ${email}` : '',
    );

    toast(
      `${open === 'topup' ? 'Nạp' : open === 'withdraw' ? 'Rút' : 'Chuyển'} tiền thành công!`,
    );
    setOpen(null);
    setAmount('');
    setEmail('');
  };

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
          {/* <DialogTrigger asChild>
            <Button className="hidden" />
          </DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <Label>Số tiền (đ)</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số tiền"
                  required
                />
              </div>

              {open === 'transfer' && (
                <div className="space-y-3">
                  <Label>Email người nhận</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="flex-1">
                  Xác nhận
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(null)}
                  className="flex-1"
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
