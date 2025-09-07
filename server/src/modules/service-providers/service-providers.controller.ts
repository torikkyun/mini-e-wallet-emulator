import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceProvidersService } from './service-providers.service';

@Controller('service-providers')
export class ServiceProvidersController {
  constructor(
    private readonly serviceProvidersService: ServiceProvidersService,
  ) {}
}
