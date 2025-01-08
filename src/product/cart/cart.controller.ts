import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CartDto } from './cartDto';
import { UserService } from '../../user/user.service';
import { ProductService } from '../product.service';
import { JwtGuard } from 'src/util/jwt.guard';
import { Cart } from './cart.schema';

@Controller('cart')
export class CartController {
  /* eslint-disable */
  constructor(
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  @Get('user/:userId')
  @UseGuards(JwtGuard)
  async getCartItems(@Param('userId') userId: string) {
    try {
      const userExists = await this.userService.findUserById(userId);
      if (!userExists) {
        throw new NotFoundException('User not found');
      }
      const cartItems = await this.cartService.getCartItemsByUserId(userId);
      if (!cartItems) {
        throw new NotFoundException('No cart items found for this user');
      }

      return {
        success: true,
        data: cartItems,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('add')
  @UseGuards(JwtGuard)
  async createCart(@Body() cartDto: CartDto) {
    try {
      const userExists = await this.userService.findUserById(cartDto.userId);
      if (!userExists) {
        throw new NotFoundException('User not found');
      }

      let cart: Cart = await this.cartService.getCartByUserId(cartDto.userId);
      const product = await this.productService.findProductById(
        cartDto.products[0].productId,
      );
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const quantity = 1;
      const discountDetails = product?.discount || [];
      const totalDiscount = Array.isArray(discountDetails)
        ? discountDetails.reduce(
            (total, discount) => total + (discount.value || 0),
            0,
          )
        : 0;

      const totalAmountSaved = totalDiscount * quantity;
      const finalPrice = (product.price - totalDiscount) * quantity;

      const newProduct = {
        productId: cartDto.products[0].productId as any,
        quantity,
        discount: discountDetails,
        priceDetails: {
          price: product.price,
          finalPrice,
          totalAmountSaved,
        },
      };

      if (cart) {
        const existingProductIndex = cart.products.findIndex(
          (p) => p.productId.toString() === newProduct.productId.toString(),
        );

        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += quantity;
          cart.products[existingProductIndex].priceDetails.finalPrice +=
            finalPrice;
          cart.products[existingProductIndex].priceDetails.totalAmountSaved +=
            totalAmountSaved;
        } else {
          cart.products.push(newProduct);
        }

        cart.totalAmount = cart.products.reduce(
          (total, product) => total + product.priceDetails.finalPrice,
          0,
        );

        cart = await this.cartService.updateCart(cart?._id as any, cart);
      } else {
        const newCart = {
          userId: cartDto.userId,
          products: [newProduct],
          totalAmount: finalPrice,
        };

        cart = await this.cartService.createCart(newCart);
      }

      return {
        success: true,
        data: cart,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('changeCount/:userId')
  @UseGuards(JwtGuard)
  async changeCartItemQuantity(
    @Param('userId') userId: string,
    @Body() body: { productId: string; quantity: number },
  ) {
    try {
      const { productId, quantity } = body;

      if (quantity < 1 || quantity > 10) {
        throw new BadRequestException('Quantity must be between 1 and 10');
      }

      const cart: Cart = await this.cartService.getCartItemsByUserId(userId);
      if (!cart) {
        throw new NotFoundException('Cart not found for the user');
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId._id.toString() === productId,
      );
      console.log(cart.products, 'productIndex');

      if (productIndex === -1) {
        throw new NotFoundException('Product not found in the cart');
      }

      const product = await this.productService.findProductById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      if (quantity > product.quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available quantity is ${product.quantity}`,
        );
      }

      cart.products[productIndex].quantity = quantity;

      const price = product.price * quantity;
      const discountDetails = product.discount || [];
      const totalAmountSaved = discountDetails.reduce(
        (total, discount) => total + (discount.value || 0),
        0,
      );
      const finalPrice = price - totalAmountSaved;

      cart.products[productIndex].priceDetails.price = price;
      cart.products[productIndex].priceDetails.finalPrice = finalPrice;
      cart.products[productIndex].priceDetails.totalAmountSaved =
        totalAmountSaved;

      cart.totalAmount = cart.products.reduce(
        (total, product) => total + product.priceDetails.finalPrice,
        0,
      );

      const updatedCart = await this.cartService.updateCart(
        cart._id as any,
        cart,
      );

      return {
        success: true,
        data: updatedCart,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete('removeProduct/:userId')
  async removeProductFromCart(
    @Param('userId') userId: string,
    @Body() body: { productId: string },
  ) {
    try {
      const { productId } = body;

      const cart = await this.cartService.getCartItemsByUserId(userId);
      if (!cart) {
        throw new NotFoundException('Cart not found for the user');
      }

      const productIndex = cart.products.findIndex(
        (product) => product.productId._id.toString() === productId,
      );

      if (productIndex === -1) {
        throw new NotFoundException('Product not found in the cart');
      }
      cart.products.splice(productIndex, 1);

      cart.totalAmount = cart.products.reduce(
        (total, product) => total + product.priceDetails.finalPrice,
        0,
      );

      const updatedCart = await this.cartService.updateCart(
        cart._id as any,
        cart,
      );

      return {
        success: true,
        data: updatedCart,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //............................................
}
