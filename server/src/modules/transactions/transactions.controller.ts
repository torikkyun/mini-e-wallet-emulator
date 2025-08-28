import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TopupDto } from './dto/topup.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';

@Controller('api/transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiBearerAuth()
  getTransactionHistory(@CurrentUser() user: { id: string }) {
    return this.transactionsService.findAllByUserId(user.id);
  }

  @Post('topup')
  @ApiBearerAuth()
  topup(@CurrentUser() user: { id: string }, @Body() topupDto: TopupDto) {
    return this.transactionsService.topup(user, topupDto);
  }

  @Post('withdraw')
  @ApiBearerAuth()
  withdraw(
    @CurrentUser() user: { id: string },
    @Body() withdrawDto: WithdrawDto,
  ) {
    return this.transactionsService.withdraw(user, withdrawDto);
  }

  @Post('transfer')
  @ApiBearerAuth()
  transfer(
    @CurrentUser() user: { id: string },
    @Body() transferDto: TransferDto,
  ) {
    return this.transactionsService.transfer(user, transferDto);
  }
}
