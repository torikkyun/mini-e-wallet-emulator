import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Transaction = {
  id: number;
  type: string;
  amount: number;
  toUser?: { name: string } | null;
  createdAt: string;
};

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const formatType = (type: string) => {
    switch (type) {
      case 'topup':
        return 'Nạp tiền';
      case 'withdraw':
        return 'Rút tiền';
      case 'transfer_out':
        return 'Chuyển tiền';
      case 'transfer_in':
        return 'Nhận tiền';
      default:
        return type;
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Thời gian</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Người nhận/gửi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                Chưa có giao dịch nào
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  {new Date(tx.createdAt).toLocaleString('vi-VN')}
                </TableCell>
                <TableCell>{formatType(tx.type)}</TableCell>
                <TableCell
                  className={
                    tx.type === 'transfer_in' || tx.type === 'topup'
                      ? 'text-green-600 font-medium'
                      : 'text-red-600'
                  }
                >
                  {tx.type === 'transfer_in' || tx.type === 'topup' ? '+' : '-'}{' '}
                  {formatAmount(tx.amount)}
                </TableCell>
                <TableCell>{tx.toUser?.name || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
