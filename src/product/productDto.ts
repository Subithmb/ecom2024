import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { SpecificationType } from './product.schema';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  highlights: string[];

  @IsOptional()
  @IsString()
  seller?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  specification: SpecificationType[];

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  images: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  bankOffer?: string[];

  @IsMongoId()
  @IsNotEmpty()
  category: string;
}
