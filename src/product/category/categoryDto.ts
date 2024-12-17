import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CategoryDto {
  @IsString()
  name: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean = true;

  @IsBoolean()
  @IsOptional()
  isDelete: boolean = true;
}
