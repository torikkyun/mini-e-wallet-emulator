import { ApiProperty } from '@nestjs/swagger';
import { TopupDto } from './topup.dto';

export class TransferDto extends TopupDto {
  @ApiProperty({
    example: '68b07b3eeab0aee1f2997f63',
  })
  toUserId: string;
}
