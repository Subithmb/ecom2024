import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { comparePassword, encodePassword } from 'src/util/bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generateToken } from 'src/util/jwtAuthService';
import { LoginResponse } from './type/typo';
import { CreateUserDto } from './dto/createUser.dto.';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>, // eslint-disable-line no-unused-vars
    private readonly jwtService: JwtService, // eslint-disable-line no-unused-vars
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await encodePassword(createUserDto.password);

    const userData: Partial<User> = {
      ...createUserDto,
      password,
    };

    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = generateToken(user, this.jwtService);
    return { user, token };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async findUserById(userId: string): Promise<any> {
    return await this.userModel.find({ userId }).populate('productId').exec();
  }
}
