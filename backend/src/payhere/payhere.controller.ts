import { Controller, Post, Body, HttpCode, HttpStatus, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PayhereService } from './payhere.service';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { NotifyPaymentDto } from './dto/notify-payment-dto';

@ApiTags('Payhere')
@Controller({ path: 'Payhere', version: '1' })
export class PayhereController {
  constructor(private readonly payhereService: PayhereService) {}

  @Post('initiate-payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate a payment' })
  @ApiResponse({ status: 200, description: 'Payment initiated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  initiatePayment(@Body() initiatePaymentDto: InitiatePaymentDto) {
    return this.payhereService.initiatePayment(initiatePaymentDto);
  }

  @Post('notify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Payment notification endpoint' })
  @ApiResponse({ status: 200, description: 'Notification processed successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  notifyPayment(@Body() notifyPaymentDto: NotifyPaymentDto) {
    return this.payhereService.notifyPayment(notifyPaymentDto);
  }
  @Get('cancel/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel a payment' })
  @ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  cancelPayment(@Param('orderId') orderId: string) {
    return this.payhereService.handleCancellation(orderId);
  }
}
