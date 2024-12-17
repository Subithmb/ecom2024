import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsNotEmpty, IsString } from 'class-validator';

export class SpecificationType {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

@Schema({
  timestamps: true,
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Number, default: null })
  rating?: number;

  @Prop({ required: true, type: [String] })
  highlights: string[];

  @Prop({ type: String, default: null })
  seller?: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    type: SpecificationType,
  })
  specification: { key: string; value: string }[];

  @Prop({ required: true, type: [String] })
  images: string[];

  @Prop({
    type: [String],
    default: [],
  })
  bankOffer?: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
