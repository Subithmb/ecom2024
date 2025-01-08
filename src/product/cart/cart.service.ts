import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './cart.schema';
import { CartDto } from './cartDto';

const productPopulateSelectFields = '_id name price images';

@Injectable()
export class CartService {
  /* eslint-disable */
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  async addCartItem(cartDto: CartDto) {
    try {
      const newCart = new this.cartModel(cartDto);
      return await newCart.save();
    } catch (error) {
      throw new Error('Failed to create cart item: ' + error.message);
    }
  }

  async getCartItemsByUserId(userId: string) {
    try {
      return await this.cartModel
        .findOne({ userId })
        .populate({
          path: 'products.productId',
          select: productPopulateSelectFields,
        })
        .exec();
    } catch (error) {
      throw new Error('Failed to fetch cart items: ' + error.message);
    }
  }

  async findCartById(cartId: string) {
    return await this.cartModel.findById(cartId).exec();
  }

  async deleteCartItem(cartId: string) {
    const result = await this.cartModel.findByIdAndDelete(cartId).exec();
    if (!result) {
      throw new NotFoundException('Cart item not found');
    }
    return result;
  }

  async updateCartItemById(
    cartId: string,
    quantity: number,
    price: number,
    finalPrice: number,
    totalAmountSaved: number,
  ) {
    const updatedCartItem = await this.cartModel
      .findByIdAndUpdate(
        cartId,
        {
          quantity,
          priceDetails: {
            price,
            finalPrice,
            totalAmountSaved,
          },
        },
        { new: true },
      )
      .exec();

    if (!updatedCartItem) {
      throw new NotFoundException('Cart item not found');
    }

    return updatedCartItem;
  }
  //...............................................

  async createCart(newCart: any): Promise<Cart> {
    const cart = new this.cartModel(newCart);
    return await cart.save();
  }

  async updateCart(cartId: string, updateData: any): Promise<Cart> {
    return await this.cartModel
      .findByIdAndUpdate(cartId, updateData, { new: true })
      .exec();
  }

  async getCartByUserId(userId: string): Promise<Cart | null> {
    return await this.cartModel.findOne({ userId }).exec();
  }
}
