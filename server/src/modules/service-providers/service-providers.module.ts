import { Module } from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { ServiceProvidersController } from './service-providers.controller';
import { PrismaService } from '@core/prisma/prisma.service';

@Module({
  controllers: [ServiceProvidersController],
  providers: [ServiceProvidersService, PrismaService],
})
export class ServiceProvidersModule {}
