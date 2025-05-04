import { Injectable, BadRequestException, InternalServerErrorException, Logger, forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto-js';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { NotifyPaymentDto } from './dto/notify-payment-dto';
import { OrdersService } from 'src/orders/orders.service';
import { ORDER_STATUS } from 'src/Types/order.types';
import { EmailService } from 'src/email/email.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class PayhereService {
  private readonly logger = new Logger(PayhereService.name);

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => OrdersService)) private ordersService: OrdersService,
    private readonly emailService: EmailService,
    private readonly productsService: ProductsService,
  ) {}

  initiatePayment(initiatePaymentDto: InitiatePaymentDto) {
    try {
      const merchantId = this.configService.get<string>('MERCHANT_ID');
      const merchantSecret = this.configService.get<string>('MERCHANT_SECRET');
      const domain = this.configService.get<string>('BACKEND_URL');
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');

      this.logger.log(`Initiating payment for order: ${initiatePaymentDto.order_id}`);

      const amountFormatted = parseFloat(initiatePaymentDto.amount.toString()).toLocaleString('en-us', { minimumFractionDigits: 2 }).replaceAll(',', '');
      const hashedSecret = crypto.MD5(merchantSecret).toString().toUpperCase();
      const hash = crypto
        .MD5(merchantId + initiatePaymentDto.order_id + amountFormatted + initiatePaymentDto.currency + hashedSecret)
        .toString()
        .toUpperCase();

      const formData = {
        sandbox: true,
        preapprove: true,
        merchant_id: merchantId,
        return_url: `${frontendUrl}/payment-success`,
        cancel_url: `${domain}/v1/payhere/cancel/${initiatePaymentDto.order_id}`,
        notify_url: `${domain}/v1/payhere/notify`,
        ...initiatePaymentDto,
        amount: amountFormatted,
        hash,
      };

      this.logger.debug('Payment initiation data prepared', formData);

      return formData;
    } catch (error) {
      this.logger.error(`Error initiating payment: ${error.message}`, error.stack);
      throw new BadRequestException(error.message);
    }
  }

  async notifyPayment(notifyPaymentDto: NotifyPaymentDto) {
    try {
      const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = notifyPaymentDto;
      const merchantSecret = this.configService.get<string>('MERCHANT_SECRET');

      this.logger.log(`Processing payment notification for order: ${order_id}`);

      const localMd5sig = crypto
        .MD5(`${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${crypto.MD5(merchantSecret).toString().toUpperCase()}`)
        .toString()
        .toUpperCase();

      if (localMd5sig === md5sig && status_code === '2') {
        this.logger.log(`Payment successful for order: ${order_id}`);
        //TODO have to implement the order Status Update and send the email to customer

        const order: any = await this.ordersService.update(order_id, {
          status: ORDER_STATUS.PAID,
          isPaid: true,
          paidAt: new Date(),
        });
        this.logger.log(order);

        const html = await this.emailService.renderTemplate('order-created.hbs', {
          customerName: `${order.client.firstName} ${order.client.lastName}`,
          orderId: order._id,
          orderDate: order.createdAt.toLocaleDateString(),
          deliveryDate: order.deliveryDate ? order.deliveryDate.toLocaleDateString() : 'To be determined',
          branchName: order.branch.name,
          status: order.status,
          products: order.products.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            total: item.quantity * item.product.price,
          })),
          totalPrice: order.totalPrice,
          notes: order.notes,
          orderTrackingUrl: `${this.configService.get<string>('FRONTEND_URL')}/orders/${order._id}`,
        });

        await this.emailService.sendEmail([order.client.email], 'Your Order Confirmation', html);

        return { message: 'Payment successful' };
      } else {
        this.logger.warn(`Payment verification failed for order: ${order_id}`);
        return { message: 'Payment verification failed' };
      }
    } catch (error) {
      this.logger.error(`Error processing payment notification: ${error.message}`, error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async handleCancellation(orderId: string) {
    this.logger.log(`Handling cancellation for order: ${orderId}`);

    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status === ORDER_STATUS.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === ORDER_STATUS.PAID) {
      throw new BadRequestException('Cannot cancel a paid order');
    }

    for (const product of order.products) {
      const productData = await this.productsService.findOne(product.product.toString());
      if (!productData) {
        throw new NotFoundException(`Product ${product.product} not found`);
      }

      productData.stock += product.quantity;
      await productData.save();
    }

    const updatedOrder: any = await this.ordersService.update(orderId, {
      status: ORDER_STATUS.CANCELLED,
    });

    const html = await this.emailService.renderTemplate('order-cancellation.hbs', {
      customerName: `${updatedOrder.client.firstName} ${updatedOrder.client.lastName}`,
      orderId: updatedOrder._id,
      orderDate: updatedOrder.createdAt.toLocaleDateString(),
      cancellationDate: new Date().toLocaleDateString(),
      branchName: updatedOrder.branch.name,
      deliveryDate: updatedOrder.deliveryDate ? updatedOrder.deliveryDate.toLocaleDateString() : 'Not specified',
      products: updatedOrder.products.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price.toFixed(2),
        total: (item.quantity * item.product.price).toFixed(2),
      })),
      totalPrice: order.totalPrice.toFixed(2),
      notes: order.notes,
      customerSupportUrl: `${this.configService.get<string>('FRONTEND_URL')}/contact`,
    });

    await this.emailService.sendEmail([updatedOrder.client.email], 'Your Order Has Been Cancelled', html);

    this.logger.log(`Order ${orderId} cancelled successfully`);
    return { message: 'Order cancelled successfully', order: updatedOrder };
  }
}
