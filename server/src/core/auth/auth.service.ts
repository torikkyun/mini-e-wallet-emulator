import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User } from 'generated/prisma';
import { PrismaService } from '@core/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    name,
    email,
    password,
  }: RegisterAuthDto): Promise<{ message: string; email: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (user) throw new ConflictException('Email đã được đăng ký');

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        wallet: {
          create: {
            currency: 'VND',
          },
        },
      },
    });

    return { message: 'Đăng ký tài khoản thành công', email };
  }

  async login({ email, password }: LoginAuthDto): Promise<{
    message: string;
    accessToken: string;
    user: Omit<User, 'password'>;
  }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password: _password, ...userData } = user;
      const accessToken = await this.jwtService.signAsync({
        id: user.id,
      });

      return {
        message: 'Đăng nhập thành công',
        accessToken,
        user: userData,
      };
    }

    throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
  }
}
