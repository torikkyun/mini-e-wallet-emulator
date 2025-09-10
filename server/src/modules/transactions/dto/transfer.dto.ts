import { ApiProperty } from '@nestjs/swagger';
import { TopupDto } from './topup.dto';

export class TransferDto extends TopupDto {
  @ApiProperty({
    example: '1000000001',
  })
  accountNumber: string;
}
