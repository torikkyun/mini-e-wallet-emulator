import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from 'generated/prisma';
import { PaginationQueryDto } from 'src/common/dtos/pagination.dto';

export class SearchTransactionDto extends PaginationQueryDto {
  @ApiProperty({ required: false, enum: TransactionType })
  type?: TransactionType;

  @ApiProperty({ required: false })
  email?: string;
}
