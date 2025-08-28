import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TopupDto } from './dto/topup.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

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
}
