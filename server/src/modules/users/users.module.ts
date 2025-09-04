import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '@core/prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: '../static/avatars',
        filename: (_req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const newFileName = `${uuidv4()}${fileExtName}`;
          cb(null, newFileName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
