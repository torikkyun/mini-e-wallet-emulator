import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TopupDto } from './dto/topup.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('api/transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiBearerAuth()
  getTransactionHistory(
    @CurrentUser() user: { id: string },
    @Query() searchTransactionDto: SearchTransactionDto,
  ) {
    return this.transactionsService.findAllByUserId(user, searchTransactionDto);
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
