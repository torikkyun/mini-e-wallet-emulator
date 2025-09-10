import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class PayBillPaymentDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ type: String, format: 'uuid' })
  billPaymentId: string;
}
