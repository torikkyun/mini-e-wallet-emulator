import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { PrismaService } from '@core/prisma/prisma.service';

@Module({
  controllers: [WalletsController],
  providers: [WalletsService, PrismaService],
})
export class WalletsModule {}
