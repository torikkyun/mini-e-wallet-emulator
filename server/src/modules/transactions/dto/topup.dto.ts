import { ApiProperty } from '@nestjs/swagger';

export class TopupDto {
  @ApiProperty({ example: 100000 })
  amount: number;

  @ApiProperty({ required: false, example: 'Nạp tiền vào tài khoản' })
  description?: string;
}
