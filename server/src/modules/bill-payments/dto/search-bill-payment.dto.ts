import { PaginationDto } from '@common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { BillStatus, BillType } from 'generated/prisma';

export class SearchBillPaymentDto extends PaginationDto {
  @ApiProperty({ required: false, enum: BillStatus })
  status?: BillStatus;

  @ApiProperty({ required: false, enum: BillType })
  billType?: BillType;
}
