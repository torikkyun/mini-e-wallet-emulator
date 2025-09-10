import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateBillPaymentDto } from './dto/create-bill-payment.dto';
import { PrismaService } from '@core/prisma/prisma.service';
import { BillStatus, TransactionType } from 'generated/prisma';

@Injectable()
export class BillPaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async payBill(
    { id }: { id: string },
    { billType, providerId, amount, description }: CreateBillPaymentDto,
  ) {
    const provider = await this.prisma.serviceProvider.findUnique({
      where: { id: providerId, isActive: true },
    });
    if (!provider) throw new NotFoundException('Provider not found');

    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });
    if (!wallet || wallet.balance < amount)
      throw new BadRequestException('Insufficient balance');

    return this.prisma.$transaction(async (prisma) => {
      const transaction = await prisma.transaction.create({
        data: {
          userId: id,
          type: TransactionType.payBill,
          amount: amount,
          description: description,
        },
      });

      const billPayment = await prisma.billPayment.create({
        data: {
          transactionId: transaction.id,
          billType: billType,
          providerId: providerId,
          customerCode: id,
          amount: amount,
          description: description,
          status: BillStatus.success,
          paidAt: new Date(),
        },
      });

      await prisma.wallet.update({
        where: { userId: id },
        data: { balance: { decrement: amount } },
      });

      return billPayment;
    });
  }
}
