import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Zap,
  Wifi,
  Droplets,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Filter,
} from 'lucide-react';

const billTypes = [
  { value: 'electricity', label: 'Điện', icon: Zap, color: 'bg-yellow-500' },
  { value: 'water', label: 'Nước', icon: Droplets, color: 'bg-blue-500' },
  { value: 'internet', label: 'Internet', icon: Wifi, color: 'bg-purple-500' },
  { value: 'phone', label: 'Điện thoại', icon: Phone, color: 'bg-green-500' },
];

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ thanh toán' },
  { value: 'success', label: 'Đã thanh toán' },
  { value: 'failed', label: 'Thất bại' },
  { value: 'cancelled', label: 'Đã hủy' },
];

interface BillFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  statusCounts: {
    all: number;
    pending: number;
    success: number;
    failed: number;
    cancelled: number;
  };
  totalItems: number;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
}

export default function BillFilters({
  selectedStatus,
  setSelectedStatus,
  selectedType,
  setSelectedType,
  statusCounts,
  totalItems,
  filterOpen,
  setFilterOpen,
}: BillFiltersProps) {
  return (
    <>
      {/* Desktop & Tablet */}
      <div className="hidden md:block">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {statusOptions.find((s) => s.value === selectedStatus)?.label} (
              {totalItems})
            </h2>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Trạng thái</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <Button
                  key={status.value}
                  variant={
                    selectedStatus === status.value ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedStatus(status.value)}
                  className="flex items-center gap-1"
                >
                  {status.value === 'pending' && <Clock className="h-3 w-3" />}
                  {status.value === 'success' && (
                    <CheckCircle className="h-3 w-3" />
                  )}
                  {status.value === 'failed' && (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  {status.value === 'cancelled' && <X className="h-3 w-3" />}
                  {status.label}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {statusCounts[status.value as keyof typeof statusCounts]}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Loại hóa đơn</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                Tất cả loại
              </Button>
              {billTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={
                      selectedType === type.value ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSelectedType(type.value)}
                    className="gap-1"
                  >
                    <Icon className="h-3 w-3" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {statusOptions.find((s) => s.value === selectedStatus)?.label} (
            {totalItems})
          </h2>
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                Bộ lọc
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Bộ lọc hóa đơn</SheetTitle>
                <SheetDescription>
                  Lọc hóa đơn theo trạng thái và loại
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6 px-4">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <div className="space-y-2">
                    {statusOptions.map((status) => (
                      <Button
                        key={status.value}
                        variant={
                          selectedStatus === status.value
                            ? 'default'
                            : 'outline'
                        }
                        className="w-full justify-between"
                        onClick={() => {
                          setSelectedStatus(status.value);
                          setFilterOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          {status.value === 'pending' && (
                            <Clock className="h-4 w-4" />
                          )}
                          {status.value === 'success' && (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          {status.value === 'failed' && (
                            <AlertCircle className="h-4 w-4" />
                          )}
                          {status.value === 'cancelled' && (
                            <X className="h-4 w-4" />
                          )}
                          {status.label}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {
                            statusCounts[
                              status.value as keyof typeof statusCounts
                            ]
                          }
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Loại hóa đơn</Label>
                  <div className="space-y-2">
                    <Button
                      variant={selectedType === 'all' ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedType('all')}
                    >
                      Tất cả loại
                    </Button>
                    {billTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.value}
                          variant={
                            selectedType === type.value ? 'default' : 'outline'
                          }
                          className="w-full justify-start gap-2"
                          onClick={() => setSelectedType(type.value)}
                        >
                          <div
                            className={`p-1 rounded ${type.color} text-white`}
                          >
                            <Icon className="h-3 w-3" />
                          </div>
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {statusOptions.map((status) => (
            <Button
              key={status.value}
              variant={selectedStatus === status.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status.value)}
              className="flex items-center gap-1 flex-shrink-0"
            >
              {status.value === 'pending' && <Clock className="h-3 w-3" />}
              {status.value === 'success' && (
                <CheckCircle className="h-3 w-3" />
              )}
              {status.value === 'failed' && <AlertCircle className="h-3 w-3" />}
              {status.value === 'cancelled' && <X className="h-3 w-3" />}
              {status.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {statusCounts[status.value as keyof typeof statusCounts]}
              </Badge>
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
