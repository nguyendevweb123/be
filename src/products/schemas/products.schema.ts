import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['active', 'disable'], default: 'active' })
  status: string;
  @Prop({ required: false }) // không bắt buộc, tránh lỗi nếu thiếu
image: string;

}

export const ProductSchema = SchemaFactory.createForClass(Product);
