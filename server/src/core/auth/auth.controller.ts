import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Public } from '@common/decorators/public.decorator';
import { User } from 'generated/prisma';

@Controller('api/auth')
@Public()
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerAuthDto: RegisterAuthDto): Promise<{
    message: string;
    email: string;
  }> {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<{
    message: string;
    accessToken: string;
    user: Omit<User, 'password'>;
  }> {
    return this.authService.login(loginAuthDto);
  }
}
