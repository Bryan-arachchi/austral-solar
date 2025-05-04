import { IsString, IsNumber, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitiatePaymentDto {
  @ApiProperty({
    description: 'First name of the customer',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Last name of the customer',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Email address of the customer',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Phone number of the customer',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Address of the customer',
    example: '123 Main St',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'City of the customer',
    example: 'New York',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Country of the customer',
    example: 'USA',
  })
  @IsString()
  @IsNotEmpty()
  country: string = 'Sri Lanka';

  @ApiProperty({
    description: 'Unique identifier for the order',
    example: 'ORD-12345',
  })
  @IsString()
  @IsNotEmpty()
  order_id: string;

  @ApiProperty({
    description: 'List of items in the order',
    example: ['Item 1', 'Item 2'],
  })
  @IsArray()
  @IsNotEmpty()
  items: string[];

  @ApiProperty({
    description: 'Currency code for the transaction',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  currency: string = 'LKR';

  @ApiProperty({
    description: 'Total amount of the transaction',
    example: 100.0,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
