import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

class PriceDetail {
  @IsString()
  @IsNotEmpty()
  discountKey: string;

  @IsNumber()
  @IsNotEmpty()
  discountValue: number;
}

class Product {
  @Prop({ required: true, type: Types.ObjectId, ref: `Product` })
  productId: Types.ObjectId;

  @Prop({
    required: true,
    type: Number,
    validate: {
      validator: (value: number) => value <= 10,
      message: 'Quantity must be less than or equal to 10',
    },
  })
  quantity: number;

  @Prop({
    required: true,
    type: [{ discountKey: { type: String }, discountValue: { type: Number } }],
  })
  discount: PriceDetail[];

  @Prop({
    required: true,
    type: {
      price: { type: Number, required: true, default: 0 },
      finalPrice: { type: Number, required: true, default: 0 },
      totalAmountSaved: { type: Number, required: true, default: 0 },
    },
  })
  priceDetails: {
    price: number;
    finalPrice: number;
    totalAmountSaved: number;
  };
}

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: {
          type: Number,
          required: true,
          validate: {
            validator: (value: number) => value <= 10,
            message: 'Quantity must be less than or equal to 10',
          },
        },
        discount: [
          {
            discountKey: { type: String, required: true },
            discountValue: { type: Number, required: true },
          },
        ],
        priceDetails: {
          price: { type: Number, required: true, default: 0 },
          finalPrice: { type: Number, required: true, default: 0 },
          totalAmountSaved: { type: Number, required: true, default: 0 },
        },
      },
    ],
  })
  products: Product[];

  @Prop({
    required: true,
    type: Number,
    default: 0,
  })
  totalAmount: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
