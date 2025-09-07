import { Module } from '@nestjs/common';
import { BillPaymentsService } from './bill-payments.service';
import { BillPaymentsController } from './bill-payments.controller';
import { PrismaService } from '@core/prisma/prisma.service';

@Module({
  controllers: [BillPaymentsController],
  providers: [BillPaymentsService, PrismaService],
})
export class BillPaymentsModule {}
