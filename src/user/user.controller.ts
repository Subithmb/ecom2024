import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { LoginResponse } from './type/typo';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadFileToCloudinary } from 'src/util/cloudinary';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/createUser.dto.';

@Controller('user')
export class UserController {
  /* eslint-disable */
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}
  /* eslint-enable */

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<User> {
    let cloudinaryUrl: string | null = null;

    if (file) {
      try {
        const uploadResult = await uploadFileToCloudinary(
          file,
          this.configService,
        );
        cloudinaryUrl = uploadResult.cloudinaryUrl;
      } catch (error) {
        throw new HttpException(
          `Failed to upload image: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    if (cloudinaryUrl) {
      createUserDto.image = cloudinaryUrl;
    }
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async loginUser(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ): Promise<LoginResponse> {
    return this.userService.login(body.email, body.password);
  }

  // @Post('upload-dummy')
  // @UseInterceptors(FileInterceptor('filetest', multerOptions))
  // async uploadDummyFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file, 'file object');
  //   console.log(file.buffer, 'file buffer');
  //   return await uploadFileToCloudinary(file, this.configService);
  // }
}
