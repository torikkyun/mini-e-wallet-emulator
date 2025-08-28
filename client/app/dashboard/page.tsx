import { redirect } from 'next/navigation';
import BalanceCard from './components/balance-card';
import ActionCard from './components/action-card';
import TransactionTable from './components/transaction-table';
import { TransactionDialogs } from './components/transaction-dialogs';

export default async function DashboardPage() {
  // const session = await getServerSession(authOptions);
  // if (!session) redirect('/login');

  // const user = await prisma.user.findUnique({
  //   where: { email: session.user?.email! },
  //   include: {
  //     wallet: true,
  //     transactions: {
  //       orderBy: { createdAt: 'desc' },
  //       take: 10,
  //     },
  //   },
  // });

  const user = {
    id: '1',
    name: 'Nguyễn Văn A',
    email: 'a@example.com',
    wallet: {
      id: '1',
      balance: 100000,
    },
    transactions: [
      {
        id: 1,
        type: 'topup',
        amount: 100000,
        createdAt: new Date(),
      },
    ],
  };

  // if (!user || !user.wallet) {
  //   return <div>Lỗi: Không tìm thấy thông tin ví</div>;
  // }

  const { wallet, transactions } = user;
  const transactionsForTable = transactions.map((tx) => ({
    ...tx,
    createdAt:
      tx.createdAt instanceof Date ? tx.createdAt.toISOString() : tx.createdAt,
  }));

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Chào mừng, {user.name}!</h1>

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

      <TransactionDialogs balance={Number(wallet.balance)} />
    </div>
  );
}
