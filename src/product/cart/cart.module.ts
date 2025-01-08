import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart, CartSchema } from './cart.schema';
import { Product, ProductSchema } from '../product.schema';
import { ProductService } from '../product.service';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    UserModule,
  ],
  controllers: [CartController],
  providers: [CartService, ProductService],
})
export class CartModule {}
