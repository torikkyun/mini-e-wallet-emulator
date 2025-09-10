import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BillType } from 'generated/prisma';

export class CreateBillPaymentDto {
  @IsEnum(BillType)
  @IsNotEmpty()
  @ApiProperty({ enum: BillType })
  billType: BillType;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: 'uuid' })
  providerId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ type: Number, example: 100000 })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: false })
  description?: string;
}
