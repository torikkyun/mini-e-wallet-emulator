import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { BillPaymentsService } from './bill-payments.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateBillPaymentDto } from './dto/create-bill-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SearchBillPaymentDto } from './dto/search-bill-payment.dto';
import { PaginatedResponseDto } from '@common/dtos/pagination.dto';
import { Prisma } from 'generated/prisma';
import { PayBillPaymentDto } from './dto/pay-bill-payment.dto';

@Controller('api/bill-payments')
@ApiTags('bill-payments')
export class BillPaymentsController {
  constructor(private readonly billPaymentsService: BillPaymentsService) {}

  @Get()
  @ApiBearerAuth()
  async getAllBills(
    @CurrentUser() user: { id: string },
    @Query() dto: SearchBillPaymentDto,
  ): Promise<PaginatedResponseDto<Prisma.BillPaymentGetPayload<object>>> {
    return this.billPaymentsService.findAllBills(user, dto);
  }

  @Post()
  @ApiBearerAuth()
  async createBill(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateBillPaymentDto,
  ) {
    return this.billPaymentsService.createBill(user, dto);
  }

  @Post('pay')
  @ApiBearerAuth()
  async payBill(
    @CurrentUser() user: { id: string },
    @Body() dto: PayBillPaymentDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    return this.billPaymentsService.payBill(user, dto);
  }
}
