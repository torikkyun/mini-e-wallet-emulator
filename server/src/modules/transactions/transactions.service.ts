import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionType } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TopupDto } from './dto/topup.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string) {
    return {
      message: 'Lấy lịch sử giao dịch thành công',
      transactions: await this.prisma.transaction.findMany({
        where: { userId },
        include: {
          toUser: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
    };
  }

  async topup({ id }: { id: string }, { amount, description }: TopupDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const transaction = await this.prisma.transaction.create({
      data: {
        userId: id,
        type: TransactionType.topup,
        amount,
        description,
      },
    });

    await this.prisma.wallet.update({
      where: { userId: id },
      data: { balance: { increment: amount } },
    });

    return {
      message: 'Nạp tiền thành công',
      transaction,
    };
  }

  async withdraw({ id }: { id: string }, { amount, description }: WithdrawDto) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < amount)
      throw new BadRequestException('Số dư không đủ');

    const transaction = await this.prisma.transaction.create({
      data: {
        userId: id,
        type: TransactionType.withdraw,
        amount,
        description,
      },
    });

    await this.prisma.wallet.update({
      where: { userId: id },
      data: { balance: { decrement: amount } },
    });

    return {
      message: 'Rút tiền thành công',
      transaction,
    };
  }

  async transfer(
    { id }: { id: string },
    { email, amount, description }: TransferDto,
  ) {
    // Tìm user nhận qua email
    const toUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!toUser) throw new NotFoundException('Người nhận không tồn tại');

    if (id === toUser.id)
      throw new BadRequestException('Không thể chuyển cho chính mình');

    return await this.prisma.$transaction(async (prisma) => {
      const fromWallet = await prisma.wallet.findUnique({
        where: { userId: id },
      });
      if (!fromWallet)
        throw new NotFoundException('Ví người gửi không tồn tại');
      if (fromWallet.balance < amount)
        throw new BadRequestException('Số dư không đủ');

      const toWallet = await prisma.wallet.findUnique({
        where: { userId: toUser.id },
      });
      if (!toWallet) throw new NotFoundException('Ví người nhận không tồn tại');

      await prisma.wallet.update({
        where: { userId: id },
        data: { balance: { decrement: amount } },
      });

      await prisma.wallet.update({
        where: { userId: toUser.id },
        data: { balance: { increment: amount } },
      });

      const transferOut = await prisma.transaction.create({
        data: {
          userId: id,
          toUserId: toUser.id,
          type: TransactionType.transferOut,
          amount,
          description,
        },
      });

      await prisma.transaction.create({
        data: {
          userId: toUser.id,
          toUserId: id,
          type: TransactionType.transferIn,
          amount,
          description,
        },
      });

      return {
        message: 'Chuyển tiền thành công',
        transaction: transferOut,
      };
    });
  }
}
