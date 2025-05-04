import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel, PaginateResult } from 'mongoose';
import { createSortObject } from 'src/utils';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderRepository {
  constructor(@InjectModel(Order.name) private orderModel: PaginateModel<Order>) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async getPaginatedList({ filter, options }: { filter?: { [key: string]: any }; options: { [key: string]: any } }): Promise<PaginateResult<Order>> {
    if (options?.sortBy) {
      options.sort = createSortObject(options.sortBy);
    }
    delete options.sortBy;

    if (filter?.client) {
      filter.client = filter.client._id;
    }

    const populateOptions = [
      { path: 'client', select: 'firstName lastName email' },
      {
        path: 'products.product',
        select: 'name price description category',
      },
      { path: 'branch', select: 'name locationName location' },
    ];

    return this.orderModel.paginate(
      {},
      {
        ...filter,
        ...options,
        populate: populateOptions,
        lean: true, // This makes the returned documents plain JavaScript objects
      },
    );
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderModel.findById(id).populate('client', 'firstName lastName email').populate('products.product', 'name price').populate('branch', 'name locationName').exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .populate('client', 'firstName lastName email')
      .populate('products.product', 'name price')
      .populate('branch', 'name locationName')
      .lean()
      .exec();
  }

  async findByIdAndDelete(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
