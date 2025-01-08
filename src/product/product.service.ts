import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './product.schema';
import { ProductDto } from './productDto';

@Injectable()
export class ProductService {
  /* eslint-disable */
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  /* eslint-enable */
  async create(productDto: ProductDto): Promise<Product> {
    const createdProduct = new this.productModel(productDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findProductById(productId: string): Promise<any> {
    return await this.productModel.findById(productId).exec();
  }
}
