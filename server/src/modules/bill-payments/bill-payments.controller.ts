import { Controller, Post, Body } from '@nestjs/common';
import { BillPaymentsService } from './bill-payments.service';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { CreateBillPaymentDto } from './dto/create-bill-payment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/bill-payments')
@ApiTags('bill-payments')
export class BillPaymentsController {
  constructor(private readonly billPaymentsService: BillPaymentsService) {}

  @Post()
  @ApiBearerAuth()
  async payBill(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateBillPaymentDto,
  ) {
    return this.billPaymentsService.payBill(user, dto);
  }
}
