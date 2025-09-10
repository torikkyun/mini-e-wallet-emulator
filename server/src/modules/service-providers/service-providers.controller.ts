import { Controller, Get } from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('api/service-providers')
@ApiTags('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}

  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.serviceProvidersService.findAll();
  }
}
