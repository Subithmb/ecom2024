import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleEnum } from 'src/util/enumUtil';
import { Document } from 'mongoose';

export class Phone {
  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  phoneNumber: string;
}

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop()
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  role: RoleEnum;

  @Prop()
  image: string;

  @Prop({ required: true })
  phone: Phone;
}

export const UserSchema = SchemaFactory.createForClass(User);
