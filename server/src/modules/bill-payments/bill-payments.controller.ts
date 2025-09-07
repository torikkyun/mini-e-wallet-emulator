import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillPaymentsService } from './bill-payments.service';

@Controller('bill-payments')
export class BillPaymentsController {
  constructor(private readonly billPaymentsService: BillPaymentsService) {}
}
