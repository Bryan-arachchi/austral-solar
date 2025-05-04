import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { ORDER_STATUS } from 'src/Types/order.types';

@Schema({ _id: false })
class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 1 })
  quantity: number;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;
}

@Schema({
  timestamps: true,
})
export class Order {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  client: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  products: OrderItem[];

  @Prop({ required: true, type: Number, min: 0 })
  totalPrice: number;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branch: Types.ObjectId;

  @Prop({ type: String, enum: ORDER_STATUS, default: ORDER_STATUS.PENDING })
  status: string;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: Date })
  deliveryDate: Date;

  @Prop({ type: Boolean, default: false })
  isPaid: boolean;

  @Prop({ type: Date })
  paidAt: Date;

  createdAt: Date;
}

export type OrderDocument = HydratedDocument<Order>;

const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.plugin(mongoosePaginate);

export { OrderSchema };
