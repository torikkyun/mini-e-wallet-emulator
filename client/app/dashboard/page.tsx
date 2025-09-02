'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import BalanceCard from './components/balance-card';
import ActionCard from './components/action-card';
import TransactionTable from './components/transaction-table';
import { TransactionDialogs } from './components/transaction-dialogs';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [debouncedEmail, setDebouncedEmail] = useState(searchEmail);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingTable, setLoadingTable] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const fetchTransactions = async (params = {}) => {
    setLoadingTable(true);
    const accessToken = localStorage.getItem('accessToken');
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/transactions/`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          page,
          limit,
          type: type || undefined,
          email: debouncedEmail || undefined,
          ...params,
        },
      },
    );
    setTransactions(res.data?.data?.transactions || []);
    setPagination(res.data?.data?.pagination || { total: 0, totalPages: 1 });
    setLoadingTable(false);
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

      await fetchTransactions();
    } catch (err) {
      setError('Lỗi: Không thể lấy dữ liệu từ máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, limit, type, debouncedEmail]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(searchEmail);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchEmail]);

  if (loading)
    return (
      <div className="flex h-screen">
        <main className="flex-1 overflow-y-auto container mx-auto p-6 max-w-6xl pt-16 md:pt-6">
          <Skeleton className="h-10 w-48 mb-8" />
          <Skeleton className="h-24 w-full mb-10 rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <Skeleton className="h-10 w-[160px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
          <div className="flex justify-end mt-2 gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </main>
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
    <>
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
      <div className="flex flex-wrap gap-4 mb-4">
        <Select
          value={type === '' ? 'all' : type}
          onValueChange={(value) => {
            setType(value === 'all' ? '' : value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="topup">Nạp tiền</SelectItem>
            <SelectItem value="withdraw">Rút tiền</SelectItem>
            <SelectItem value="transferOut">Chuyển tiền</SelectItem>
            <SelectItem value="transferIn">Nhận tiền</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Tìm theo email"
          value={searchEmail}
          onChange={(e) => {
            setSearchEmail(e.target.value);
            setPage(1);
          }}
          className="w-[200px]"
        />
      </div>
      <TransactionTable
        transactions={transactionsForTable}
        loading={loadingTable}
      />
      <div className="flex justify-end mt-2 gap-2">
        <Button
          variant="outline"
          disabled={page <= 1}
          onClick={() => {
            setPage(page - 1);
            fetchTransactions({ page: page - 1 });
          }}
        >
          Trước
        </Button>
        <span className="flex items-center px-2 text-sm">
          Trang {page} / {pagination.totalPages}
        </span>
        <Button
          variant="outline"
          disabled={page >= pagination.totalPages}
          onClick={() => {
            setPage(page + 1);
            fetchTransactions({ page: page + 1 });
          }}
        >
          Sau
        </Button>
      </div>
      <TransactionDialogs
        balance={Number(wallet.balance)}
        onSuccess={reloadData}
      />
    </>
  );
}
