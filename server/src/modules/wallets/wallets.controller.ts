import { Controller, Get } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('api/wallets')
@ApiTags('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiBearerAuth()
  findOne(@CurrentUser() user: { id: string }) {
    return this.walletsService.findOne(user);
  }
}
