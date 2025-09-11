'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { useBills } from './hooks/use-bills';
import BillFilters from './components/bill-filters';
import BillCard from './components/bill-card';
import BillPagination from './components/bill-pagination';
import PaymentDialog from './components/payment-dialog';

export default function BillsPage() {
  const {
    bills,
    loading,
    selectedType,
    setSelectedType,
    selectedStatus,
    setSelectedStatus,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems,
    statusCounts,
    setBills,
  } = useBills();

  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const handlePayClick = (bill: any) => {
    setSelectedBill(bill);
    setPaymentDialogOpen(true);
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

      <BillFilters
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        statusCounts={statusCounts}
        totalItems={totalItems}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bills.map((bill) => (
          <BillCard key={bill.id} bill={bill} onPayClick={handlePayClick} />
        ))}
      </div>

      <BillPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        billsLength={bills.length}
        limit={9}
        onPageChange={setCurrentPage}
      />

      {bills.length === 0 && !loading && (
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

      <PaymentDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        selectedBill={selectedBill}
        onPaymentSuccess={() => {
          setBills((prev) =>
            prev.map((bill) =>
              bill.id === selectedBill.id
                ? { ...bill, status: 'success' as const }
                : bill,
            ),
          );
        }}
      />
    </div>
  );
}
