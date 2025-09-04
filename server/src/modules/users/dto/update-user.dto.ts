import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @ApiProperty({ required: false, example: 'Nguyễn Văn Đức' })
  name?: string;

  @IsOptional()
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
  })
  avatar?: any;
}
