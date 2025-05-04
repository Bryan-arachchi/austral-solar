import { IsMongoId, IsArray, IsNumber, Min, IsString, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ description: 'The ID of the product' })
  @IsMongoId()
  product: string;

  @ApiProperty({ description: 'The quantity of the product', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  client: string;

  @ApiProperty({
    description: 'The array of products in the order',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  products: OrderItemDto[];

  @ApiPropertyOptional({ description: 'Additional notes for the order' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'The payment method used' })
  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
