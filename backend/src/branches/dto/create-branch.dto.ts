import { IsString, IsNotEmpty, ValidateNested, IsArray, IsNumber, IsEnum, IsEmail, IsOptional, IsPhoneNumber, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class GeoJSONPointDto {
  @ApiProperty({ description: 'The type of the geolocation point', enum: ['Point'], example: 'Point' })
  @IsEnum(['Point'])
  type: 'Point';

  @ApiProperty({ description: 'The coordinates of the location [longitude, latitude]', example: [0, 0] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class CreateBranchDto {
  @ApiProperty({ description: 'The name of the branch' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The name of the branch location' })
  @IsString()
  @IsNotEmpty()
  locationName: string;

  @ApiProperty({ description: 'The geolocation of the branch' })
  @ValidateNested()
  @Type(() => GeoJSONPointDto)
  location: GeoJSONPointDto;

  @ApiPropertyOptional({ description: 'The phone number of the branch' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'The email address of the branch' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Image of a branch' })
  @IsString()
  @IsNotEmpty()
  image: string;
}
