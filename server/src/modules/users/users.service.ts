import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({ id }: { id: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return {
      message: 'Lấy thông tin người dùng thành công',
      user,
    };
  }

  async update({ id }: { id: string }, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return {
      message: 'Cập nhật thông tin người dùng thành công',
      user,
    };
  }
}
