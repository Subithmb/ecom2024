import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { RoleEnum } from 'src/util/enumUtil';
import { Phone } from '../schemas/user.schema';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  phone: Phone;
}
