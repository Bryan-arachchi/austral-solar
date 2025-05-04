import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { CATEGORY } from 'src/Types/category.types';

@Schema({
  timestamps: true,
})
export class Product {
  _id: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({
    required: true,
    type: String,
    enum: Object.values(CATEGORY),
  })
  category: CATEGORY;

  @Prop({ required: true, type: Number, min: 0 })
  wattage: number;

  @Prop({ type: Number, min: 0 })
  voltage: number;

  @Prop({ type: String })
  dimensions: string;

  @Prop({ type: Number, min: 0 })
  weight: number;

  @Prop({ type: String })
  manufacturer: string;

  @Prop({ type: String })
  warranty: string;

  @Prop({ type: Number, default: 0, min: 0 })
  stock: number;

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;
}

export type ProductDocument = HydratedDocument<Product>;

const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.plugin(mongoosePaginate);

export { ProductSchema };
