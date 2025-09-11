import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class TopupDto {
  @IsNumber()
  @ApiProperty({ example: 100000 })
  amount: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  description?: string;
}
