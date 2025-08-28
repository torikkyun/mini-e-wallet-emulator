import { ApiProperty } from '@nestjs/swagger';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: 'Trần Đình Phúc Đức' })
  name: string;
}
