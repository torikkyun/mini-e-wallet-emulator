import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TransactionType } from 'generated/prisma';
import { TopupDto } from './dto/topup.dto';
import { TransferDto } from './dto/transfer.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { PrismaService } from '@core/prisma/prisma.service';
import { PaginatedResponseDto } from '@common/dtos/pagination.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(
    { id }: { id: string },
    { page = 1, limit = 10, skip, type, email }: SearchTransactionDto,
  ): Promise<PaginatedResponseDto<Prisma.TransactionGetPayload<object>>> {
    const where: Prisma.TransactionWhereInput = {
      userId: id,
      ...(type && { type }),
      ...(email && {
        toUser: {
          email: { contains: email, mode: 'insensitive' },
        },
      }),
    };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          toUser: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      message: 'Lấy lịch sử giao dịch thành công',
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async topup(
    { id }: { id: string },
    { amount, description }: TopupDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          userId: id,
          type: TransactionType.topup,
          amount,
          description,
        },
      }),
      this.prisma.wallet.update({
        where: { userId: id },
        data: { balance: { increment: amount } },
      }),
    ]);

    return {
      message: 'Nạp tiền thành công',
      transaction,
    };
  }

  async withdraw(
    { id }: { id: string },
    { amount, description }: WithdrawDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    if (wallet.balance < amount)
      throw new BadRequestException('Số dư không đủ');

    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          userId: id,
          type: TransactionType.withdraw,
          amount,
          description,
        },
      }),
      this.prisma.wallet.update({
        where: { userId: id },
        data: { balance: { decrement: amount } },
      }),
    ]);

    return {
      message: 'Rút tiền thành công',
      transaction,
    };
  }

  async transfer(
    { id }: { id: string },
    { accountNumber, amount, description }: TransferDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    const toUser = await this.prisma.user.findUnique({
      where: { accountNumber },
    });
    if (!toUser) throw new NotFoundException('Người nhận không tồn tại');

    if (id === toUser.id)
      throw new BadRequestException('Không thể chuyển cho chính mình');

    const fromWallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });
    if (!fromWallet) throw new NotFoundException('Ví người gửi không tồn tại');
    if (fromWallet.balance < amount)
      throw new BadRequestException('Số dư không đủ');

    const toWallet = await this.prisma.wallet.findUnique({
      where: { userId: toUser.id },
    });
    if (!toWallet) throw new NotFoundException('Ví người nhận không tồn tại');

    const [transferOut] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          userId: id,
          toUserId: toUser.id,
          type: TransactionType.transferOut,
          amount,
          description,
        },
      }),
      this.prisma.transaction.create({
        data: {
          userId: toUser.id,
          toUserId: id,
          type: TransactionType.transferIn,
          amount,
          description: 'Nhận tiền từ tài khoản khác',
        },
      }),
      this.prisma.wallet.update({
        where: { userId: id },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.wallet.update({
        where: { userId: toUser.id },
        data: { balance: { increment: amount } },
      }),
    ]);

    return {
      message: 'Chuyển tiền thành công',
      transaction: transferOut,
    };
  }
}
