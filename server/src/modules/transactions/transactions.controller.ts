import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TopupDto } from './dto/topup.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { SearchTransactionDto } from './dto/search-transaction.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { PaginatedResponseDto } from '@common/dtos/pagination.dto';
import { Prisma } from 'generated/prisma';

@Controller('api/transactions')
@ApiTags('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiBearerAuth()
  getTransactionHistory(
    @CurrentUser() user: { id: string },
    @Query() searchTransactionDto: SearchTransactionDto,
  ): Promise<PaginatedResponseDto<Prisma.TransactionGetPayload<object>>> {
    return this.transactionsService.findAllByUserId(user, searchTransactionDto);
  }

  @Post('topup')
  @ApiBearerAuth()
  topup(
    @CurrentUser() user: { id: string },
    @Body() topupDto: TopupDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    return this.transactionsService.topup(user, topupDto);
  }

  @Post('withdraw')
  @ApiBearerAuth()
  withdraw(
    @CurrentUser() user: { id: string },
    @Body() withdrawDto: WithdrawDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    return this.transactionsService.withdraw(user, withdrawDto);
  }

  @Post('transfer')
  @ApiBearerAuth()
  transfer(
    @CurrentUser() user: { id: string },
    @Body() transferDto: TransferDto,
  ): Promise<{
    message: string;
    transaction: Prisma.TransactionGetPayload<object>;
  }> {
    return this.transactionsService.transfer(user, transferDto);
  }
}
