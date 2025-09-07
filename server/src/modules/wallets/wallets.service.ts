import { PrismaService } from '@core/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';

@Injectable()
export class WalletsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne({ id }: { id: string }): Promise<{
    message: string;
    wallet: Prisma.WalletGetPayload<object>;
  }> {
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
