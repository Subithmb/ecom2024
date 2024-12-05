import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user.schema';

export const generateToken = (user: User, jwtService: JwtService): string => {
  const payload = { email: user.email, sub: user._id };
  return jwtService.sign(payload, {
    secret: process.env.JWT_SECRET_KEY,
  });
};

export const verifyToken = (token: string, jwtService: JwtService) => {
  return jwtService.verify(token);
};
