import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class NotifyPaymentDto {
  @ApiProperty({
    description: 'Merchant ID provided by PayHere',
    example: 'M123456',
  })
  @IsString()
  @IsNotEmpty()
  merchant_id: string;

  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 'ORD-12345',
  })
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty({
    description: 'Amount of the payment as reported by PayHere',
    example: '100.00',
  })
  @IsString()
  @IsNotEmpty()
  payhere_amount: string;

  @ApiProperty({
    description: 'Currency of the payment as reported by PayHere',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  payhere_currency: string;

  @ApiProperty({
    description: 'Status code of the payment',
    example: '2',
  })
  @IsString()
  @IsNotEmpty()
  status_code: string;

  @ApiProperty({
    description: 'MD5 signature for payment verification',
    example: 'a1b2c3d4e5f6g7h8i9j0',
  })
  @IsString()
  @IsNotEmpty()
  md5sig: string;
}
