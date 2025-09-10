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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

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

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  // Thêm state cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(9);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const { user } = useUser();
  const { wallet, reloadWallet } = useWallet();

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/bill-payments?page=${currentPage}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          },
        );
        const apiBills = res.data?.data?.data || [];
        const pagination = res.data?.data?.pagination || {};

        const mappedBills: Bill[] = apiBills.map((item: any) => ({
          id: item.id,
          type: item.billType,
          company: item.provider?.name || '',
          accountNumber: item.provider?.accountNumber || '',
          amount: item.amount,
          dueDate: item.createdAt,
          status:
            item.status === 'success'
              ? 'paid'
              : item.status === 'pending'
                ? 'pending'
                : 'overdue',
          description: item.description || '',
        }));

        setBills(mappedBills);
        setTotalPages(pagination.totalPages || 1);
        setTotalItems(pagination.total || 0);
      } catch (err) {
        setBills([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      setLoading(false);
    };

    fetchBills();
  }, [currentPage, limit]); // Thêm currentPage và limit vào dependency

  // Filter chỉ áp dụng trên client-side cho dữ liệu đã load
  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || bill.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Reset về page 1 khi filter thay đổi
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, selectedType]);

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
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Có lỗi xảy ra khi thanh toán!';
      alert(errorMessage);
    } finally {
      setPaying(false);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showEllipsis = totalPages > 7;

    if (showEllipsis) {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => setCurrentPage(page as number)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
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
            <Card
              key={bill.id}
              className="hover:shadow-md transition-shadow h-full flex flex-col"
            >
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
                  <Label className="text-sm text-muted-foreground">
                    Số tài khoản
                  </Label>
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
                    <p className="text-sm font-medium">
                      {formatDate(bill.dueDate)}
                    </p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <Label className="text-sm text-muted-foreground">
                      Số tiền
                    </Label>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(bill.amount)}
                    </p>
                  </div>
                </div>
                <Button
                  className="w-full mt-auto"
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

      {/* Pagination */}
      {!loading && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Hiển thị {Math.min(limit, filteredBills.length)} trên {totalItems}{' '}
            hóa đơn
          </div>
          {renderPagination()}
        </div>
      )}

      {filteredBills.length === 0 && !loading && (
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
                        !!(wallet && wallet.balance < selectedBill.amount)
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
