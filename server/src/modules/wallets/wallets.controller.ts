import { Controller, Get } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Prisma } from 'generated/prisma';

@Controller('api/wallets')
@ApiTags('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiBearerAuth()
  findOne(@CurrentUser() user: { id: string }): Promise<{
    message: string;
    wallet: Prisma.WalletGetPayload<object>;
  }> {
    return this.walletsService.findOne(user);
  }
}
