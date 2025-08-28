'use client';

import { useRouter } from 'next/navigation';
import BalanceCard from './components/balance-card';
import ActionCard from './components/action-card';
import TransactionTable from './components/transaction-table';
import { TransactionDialogs } from './components/transaction-dialogs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/login');
  };

  const reloadData = () => {
    setLoading(true);
    setError('');
    fetchAll();
  };

  const fetchAll = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const userRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const userData = userRes.data?.data?.user;
      setUser(userData);

      const walletRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/wallets/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setWallet(walletRes.data?.data?.wallet);

      const transactionsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/transactions/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setTransactions(transactionsRes.data?.data?.transactions || []);
    } catch (err) {
      setError('Lỗi: Không thể lấy dữ liệu từ máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <Skeleton className="h-10 w-64 mb-8" />
        <Skeleton className="h-24 w-full mb-10 rounded-xl" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  if (!user || !wallet)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>
            Không tìm thấy thông tin người dùng hoặc ví
          </AlertDescription>
        </Alert>
      </div>
    );

  const transactionsForTable = transactions.map((tx) => ({
    ...tx,
    createdAt:
      tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
  }));

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">
        Chào mừng, {user ? user.name : '...'}!
      </h1>

      <BalanceCard balance={Number(wallet.balance)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
        <ActionCard
          title="Nạp tiền"
          description="Tăng số dư ví của bạn"
          action="topup"
        />
        <ActionCard
          title="Rút tiền"
          description="Rút tiền về tài khoản ngân hàng"
          action="withdraw"
        />
        <ActionCard
          title="Chuyển tiền"
          description="Gửi tiền cho người dùng khác"
          action="transfer"
        />
      </div>
      <TransactionTable transactions={transactionsForTable} />

      <TransactionDialogs
        balance={Number(wallet.balance)}
        onSuccess={reloadData}
      />

      <div className="flex justify-end mt-8">
        <Button variant="destructive" onClick={handleLogout}>
          Đăng xuất
        </Button>
      </div>
    </div>
  );
}
