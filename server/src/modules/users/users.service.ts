import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '@core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Prisma } from 'generated/prisma';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async findOne({ id }: { id: string }): Promise<{
    message: string;
    user: Omit<Prisma.UserGetPayload<object>, 'password'>;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    return {
      message: 'Lấy thông tin người dùng thành công',
      user,
    };
  }

  async update(
    { id }: { id: string },
    updateUserDto: UpdateUserDto,
    avatar?: Express.Multer.File,
  ): Promise<{
    message: string;
    user: Omit<Prisma.UserGetPayload<object>, 'password'>;
  }> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        avatar: avatar
          ? `${this.configService.get('STATIC_URL')}/avatars/${avatar.filename}`
          : undefined,
      },
      omit: { password: true },
    });

    return {
      message: 'Cập nhật thông tin người dùng thành công',
      user,
    };
  }

  // async changePassword({ id }: { id: string }): Promise<{ message: string }> {
  //   return {
  //     message: 'Đổi mật khẩu thành công',
  //   };
  // }
}
