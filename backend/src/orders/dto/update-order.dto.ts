import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { ORDER_STATUS } from 'src/Types/order.types';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  status: ORDER_STATUS;
  isPaid?: boolean;
  paidAt?: Date;
}
