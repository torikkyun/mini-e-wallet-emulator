import { ApiProperty } from '@nestjs/swagger';
import { TopupDto } from './topup.dto';
import { IsString } from 'class-validator';

export class TransferDto extends TopupDto {
  @IsString()
  @ApiProperty({
    example: '1000000001',
  })
  accountNumber: string;
}
