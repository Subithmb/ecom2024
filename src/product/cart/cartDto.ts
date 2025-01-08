import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  // IsPositive,
  IsString,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';

export class PriceDetailsDto {
  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  finalPrice: number;

  @IsNumber()
  @Min(0)
  totalAmountSaved: number;
}

export class ProductDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  @Max(10)
  quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DiscountDto)
  discount: DiscountDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => PriceDetailsDto)
  priceDetails: PriceDetailsDto;
}

export class DiscountDto {
  @IsString()
  @IsNotEmpty()
  discountKey: string;

  @IsNumber()
  @Min(0)
  discountValue: number;
}

export class CartDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];

  @IsNumber()
  @Min(0)
  totalAmount: number;
}
