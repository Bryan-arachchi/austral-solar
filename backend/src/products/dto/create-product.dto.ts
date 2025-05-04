import { IsString, IsNumber, IsArray, IsOptional, Min, IsBoolean, ArrayMinSize, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CATEGORY } from 'src/Types/category.types';

export class CreateProductDto {
  @ApiProperty({ description: 'The name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The description of the product' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'The price of the product' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Array of image URLs for the product' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  images: string[];

  @ApiProperty({ description: 'The category of the product', enum: CATEGORY })
  @IsEnum(CATEGORY)
  category: CATEGORY;

  @ApiProperty({ description: 'The wattage of the product' })
  @IsNumber()
  @Min(0)
  wattage: number;

  @ApiPropertyOptional({ description: 'The voltage of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  voltage?: number;

  @ApiPropertyOptional({ description: 'The dimensions of the product' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ description: 'The weight of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'The manufacturer of the product' })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({ description: 'The warranty information of the product' })
  @IsOptional()
  @IsString()
  warranty?: string;

  @ApiPropertyOptional({ description: 'The stock quantity of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ description: 'Whether the product is available' })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
