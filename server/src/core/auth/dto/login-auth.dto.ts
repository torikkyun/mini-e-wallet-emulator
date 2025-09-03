import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ example: 'duc@gmail.com' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}
