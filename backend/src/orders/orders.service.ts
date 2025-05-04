import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderRepository } from './order.repository';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { BranchesService } from '../branches/branches.service';
import { PayhereService } from 'src/payhere/payhere.service';
import { InitiatePaymentDto } from 'src/payhere/dto/initiate-payment.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly branchesService: BranchesService,
    @Inject(forwardRef(() => PayhereService)) private readonly payhereService: PayhereService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const user = await this.usersService.findOne({ _id: createOrderDto.client });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const products = await this.productsService.findMany(createOrderDto.products.map((p) => p.product));

    if (products.length !== createOrderDto.products.length) {
      throw new NotFoundException('Some products not found');
    }

    for (const product of products) {
      const orderProduct = createOrderDto.products.find((p) => p.product === product._id.toString());
      if (!orderProduct) {
        throw new NotFoundException(`Product ${product._id} not found in order`);
      }
      if (product.stock < orderProduct.quantity) {
        throw new NotFoundException(`Product ${product._id} out of stock`);
      }
    }

    // Calculate total price and validate products
    let totalPrice = 0;
    const productsWithPrice = await Promise.all(
      createOrderDto.products.map(async (item) => {
        const product = await this.productsService.findOne(item.product);
        if (!product) {
          throw new NotFoundException(`Product ${item.product} not found`);
        }
        totalPrice += product.price * item.quantity;
        return { ...item, price: product.price };
      }),
    );

    // Find nearest branch
    const nearestBranch = await this.branchesService.findNearest(user.location.coordinates[0], user.location.coordinates[1], 500000);
    if (!nearestBranch) {
      throw new NotFoundException('No branch found');
    }

    for (const product of products) {
      const orderProduct = createOrderDto.products.find((p) => p.product === product._id.toString());
      product.stock -= orderProduct.quantity;
      await product.save();
    }

    const orderData = {
      ...createOrderDto,
      products: productsWithPrice,
      totalPrice,
      branch: nearestBranch._id,
    };

    const createdOrder = await this.orderRepository.create(orderData);

    // Initiate payment
    const paymentInitiationData: InitiatePaymentDto = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      phone: user.phoneNumber,
      address: user.address,
      city: user.city,
      country: 'Sri Lanka',
      order_id: createdOrder._id.toString(),
      items: createdOrder.products.map((p) => p.product.toString()),
      currency: 'LKR',
      amount: createdOrder.totalPrice,
    };

    const paymentData = await this.payhereService.initiatePayment(paymentInitiationData);

    return {
      order: createdOrder,
      paymentData,
    };
  }

  getPaginatedList({ filter, options }: { filter?: { [key: string]: any }; options: { [key: string]: any } }) {
    return this.orderRepository.getPaginatedList({ filter, options });
  }

  findOne(id: string) {
    return this.orderRepository.findById(id);
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderRepository.update(id, updateOrderDto);
  }

  remove(id: string) {
    return this.orderRepository.findByIdAndDelete(id);
  }
}
