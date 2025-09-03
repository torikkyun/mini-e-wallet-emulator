import { ApiProperty } from '@nestjs/swagger';
import { LoginAuthDto } from './login-auth.dto';

export class RegisterAuthDto extends LoginAuthDto {
  @ApiProperty({ example: 'Trần Đình Phúc Đức' })
  name: string;
}
