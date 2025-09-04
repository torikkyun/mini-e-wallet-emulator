import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(
    files: Record<string, Express.Multer.File[]> | Express.Multer.File,
  ) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const fiveMb = 5 * 1024 * 1024;

    if (
      files &&
      typeof files === 'object' &&
      'images' in files &&
      Array.isArray(files.images)
    ) {
      files.images.forEach((file) => {
        if (!allowedTypes.includes(file.mimetype)) {
          throw new BadRequestException(
            'Chỉ chấp nhận file ảnh jpg, jpeg, png',
          );
        }

        if (file.size > fiveMb) {
          throw new BadRequestException('Kích thước file tối đa là 5MB');
        }
      });
      return files.images;
    }

    if (files && typeof files === 'object' && 'mimetype' in files) {
      if (!allowedTypes.includes((files as Express.Multer.File).mimetype)) {
        throw new BadRequestException('Chỉ chấp nhận file ảnh jpg, jpeg, png');
      }

      if ((files as Express.Multer.File).size > fiveMb) {
        throw new BadRequestException('Kích thước file tối đa là 5MB');
      }
    }

    return files;
  }
}
