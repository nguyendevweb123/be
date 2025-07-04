import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop({ required: true, unique:true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' }) role: string;
}


export const UserSchema = SchemaFactory.createForClass(User);


export interface User extends Document {
  _id: string; // hoặc Types.ObjectId nếu bạn cần
  email: string;
  password: string;
  role: string;
}