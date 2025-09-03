import { PaginationDto } from '@common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'generated/prisma';

export class SearchTransactionDto extends PaginationDto {
  @ApiProperty({ required: false, enum: TransactionType })
  type?: TransactionType;

  @ApiProperty({ required: false })
  email?: string;
}
