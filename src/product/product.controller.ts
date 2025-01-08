import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { ProductDto } from './productDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { uploadFileToCloudinary } from 'src/util/cloudinary';
import { CategoryService } from './category/category.service';
import { JwtGuard } from 'src/util/jwt.guard';

@Controller('product')
export class ProductController {
  /* eslint-disable */
  constructor(
    private readonly productService: ProductService,
    private readonly configService: ConfigService,
    private readonly categoryService: CategoryService,
  ) {}
  /* eslint-enable */

  @Post()
  @UseGuards(JwtGuard)
  @UseInterceptors(FilesInterceptor('images[]'))
  async create(
    @Body() productDto: ProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Product> {
    const cloudinaryUrls: string[] = [];
    const categoryExists = await this.categoryService.findById(
      productDto.category,
    );
    if (!categoryExists) {
      throw new HttpException(
        'Category does not exist. Please provide a valid category ID.',
        HttpStatus.BAD_REQUEST,
      );
    }
    //................
    if (images && images.length > 0) {
      try {
        for (const image of images) {
          const cloudinaryResult = await uploadFileToCloudinary(
            image,
            this.configService,
          );
          cloudinaryUrls.push(cloudinaryResult.cloudinaryUrl);
        }
      } catch (error) {
        throw new HttpException(
          `Failed to upload image: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    if (cloudinaryUrls.length > 0) {
      productDto.images = cloudinaryUrls;
    }

    return this.productService.create(productDto);
  }

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll();
  }
}
