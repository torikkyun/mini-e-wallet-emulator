import { ApiProperty } from '@nestjs/swagger';
import { TopupDto } from './topup.dto';

export class TransferDto extends TopupDto {
  @ApiProperty({
    example: 'duc@gmail.com',
  })
  email: string;
}
