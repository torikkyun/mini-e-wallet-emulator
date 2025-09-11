import { PaginationDto } from '@common/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TransactionType } from 'generated/prisma';

export class SearchTransactionDto extends PaginationDto {
  @IsOptional()
  @IsEnum(TransactionType)
  @ApiProperty({ required: false, enum: TransactionType })
  type?: TransactionType;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  accountNumber?: string;
}
