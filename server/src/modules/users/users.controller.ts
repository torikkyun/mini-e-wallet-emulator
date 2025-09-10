import {
  Controller,
  Get,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { FileValidationPipe } from '@common/pipes/file-validation.pipe';
import { Prisma } from 'generated/prisma';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  findOne(@CurrentUser() user: { id: string }): Promise<{
    message: string;
    user: Omit<Prisma.UserGetPayload<object>, 'password'>;
  }> {
    return this.usersService.findOne(user);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  update(
    @CurrentUser() user: { id: string },
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(new FileValidationPipe()) avatar?: Express.Multer.File,
  ): Promise<{
    message: string;
    user: Omit<Prisma.UserGetPayload<object>, 'password'>;
  }> {
    return this.usersService.update(user, updateUserDto, avatar);
  }
}
