import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionType } from 'generated/prisma';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { TopupDto } from './dto/topup.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string) {
    return {
      message: 'Lấy lịch sử giao dịch thành công',
      transactions: await this.prisma.transaction.findMany({
        where: { userId },
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
}
