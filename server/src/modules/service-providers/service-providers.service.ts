import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/prisma.service';

@Injectable()
export class ServiceProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.serviceProvider.findMany();
  }
}
