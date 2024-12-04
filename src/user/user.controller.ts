import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {} // eslint-disable-line no-unused-vars

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
  @Post()
  async createUser(
    @Body()
    user,
  ): Promise<User> {
    return this.userService.create(user);
  }
}
