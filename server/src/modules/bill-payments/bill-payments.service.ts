import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBillPaymentDto } from './dto/create-bill-payment.dto';
import { PrismaService } from '@core/prisma/prisma.service';
import { BillStatus, TransactionType } from 'generated/prisma';
import { SearchBillPaymentDto } from './dto/search-bill-payment.dto';
import { Prisma } from 'generated/prisma';
import { PaginatedResponseDto } from '@common/dtos/pagination.dto';
import { PayBillPaymentDto } from './dto/pay-bill-payment.dto';

@Injectable()
export class BillPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllBills(
    { id }: { id: string },
    { page = 1, limit = 10, skip, status, billType }: SearchBillPaymentDto,
  ): Promise<PaginatedResponseDto<Prisma.BillPaymentGetPayload<object>>> {
    const where: Prisma.BillPaymentWhereInput = {
      ...(status && { status }),
      ...(billType && { billType }),
      customerCode: id,
    };

    const [bills, total] = await Promise.all([
      this.prisma.billPayment.findMany({
        where,
        include: {
          provider: true,
          transaction: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.billPayment.count({ where }),
    ]);

    return {
      message: 'Lấy danh sách hóa đơn thành công',
      data: bills,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createBill(
    { id }: { id: string },
    { billType, providerId, amount, description }: CreateBillPaymentDto,
  ): Promise<{
    message: string;
    billPayment: Prisma.BillPaymentGetPayload<object>;
  }> {
    const provider = await this.prisma.serviceProvider.findUnique({
      where: { id: providerId, isActive: true },
    });
    if (!provider) throw new NotFoundException('Nhà cung cấp không tồn tại');

    const billPayment = await this.prisma.billPayment.create({
      data: {
        billType,
        providerId,
        customerCode: id,
        amount,
        description,
        status: BillStatus.pending,
      },
    });

    return {
      message: 'Tạo hóa đơn thành công',
      billPayment,
    };
  }

  async payBill(
    { id }: { id: string },
    { billPaymentId }: PayBillPaymentDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    const billPayment = await this.prisma.billPayment.findUnique({
      where: { id: billPaymentId },
      include: { provider: true },
    });
    if (!billPayment) throw new NotFoundException('Hóa đơn không tồn tại');

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });
    if (!wallet || wallet.balance < billPayment.amount)
      throw new BadRequestException('Số dư không đủ');

    const transaction = await this.prisma.transaction.create({
      data: {
        userId: id,
        type: TransactionType.payBill,
        amount: billPayment.amount,
        description: billPayment.description,
      },
    });

    await this.prisma.$transaction([
      this.prisma.billPayment.update({
        where: { id: billPaymentId },
        data: {
          transactionId: transaction.id,
          status: BillStatus.success,
          paidAt: new Date(),
        },
      }),
      this.prisma.wallet.update({
        where: { userId: id },
        data: { balance: { decrement: billPayment.amount } },
      }),
    ]);

    return {
      message: 'Thanh toán hóa đơn thành công',
      transaction,
    };
  }
}
