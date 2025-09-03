import { PrismaService } from '@core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({ id }: { id: string }) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId: id },
    });

    if (!wallet) {
      throw new BadRequestException(
        'Người dùng chưa tạo tài khoản hoặc chưa đăng nhập',
      );
    }

    return {
      message: 'Lấy thông tin ví thành công',
      wallet,
    };
  }
}
