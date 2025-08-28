import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register({ name, email, password }: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('Email đã được đăng ký');

    const hashed = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { name, email, password: hashed },
    });

    await this.prisma.wallet.create({
      data: {
        userId: user.id,
        balance: 0,
        currency: 'VND',
      },
    });

    return { message: 'Đăng ký thành công', email: user.email };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user)
      throw new UnauthorizedException('Người dùng chưa đăng ký tài khoản');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Mật khẩu không đúng');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Đăng nhập thành công',
      accessToken: token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
