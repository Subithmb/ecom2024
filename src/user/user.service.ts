import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { encodePassword } from 'src/util/bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>, // eslint-disable-line no-unused-vars
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    return users;
  }

  async create(user: User): Promise<User> {
    const password = await encodePassword(user?.password);
    const res = await this.userModel.create({ ...user, password });
    return res;
  }
}
