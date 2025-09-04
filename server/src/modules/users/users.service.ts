import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findOne({ id }: { id: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return {
      message: 'Lấy thông tin người dùng thành công',
      user,
    };
  }

  async update(
    { id }: { id: string },
    updateUserDto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        avatar: avatar
          ? `${this.configService.get('STATIC_URL')}/avatars/${avatar.filename}`
          : undefined,
      },
    });

    return {
      message: 'Cập nhật thông tin người dùng thành công',
      user,
    };
  }
}
