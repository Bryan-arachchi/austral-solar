import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUrl,
  MaxLength,
  MinLength,
  IsArray,
  ValidateNested,
  IsPhoneNumber,
  IsNumber,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { userTypes } from 'src/Types/user.types';

class GeoJSONPointDto {
  @ApiProperty({ description: 'The type of the geolocation point', enum: ['Point'], example: 'Point' })
  @IsEnum(['Point'])
  type: 'Point';

  @ApiProperty({ description: 'The coordinates of the location [longitude, latitude]', example: [80.016433, 7.077674] })
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  coordinates: number[];
}

export class CreateUserDto {
  @ApiProperty({ description: 'The first name of the user' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'The last name of the user' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({ description: "The URL of the user's avatar" })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiProperty({ description: 'The types of the user', enum: userTypes, isArray: true })
  @IsArray()
  @IsEnum(userTypes, { each: true })
  type: userTypes[];

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Whether login is enabled for the user', default: false })
  @IsOptional()
  @IsBoolean()
  loginEnabled?: boolean;

  @ApiPropertyOptional({ description: 'The authentication state of the user' })
  @IsOptional()
  @IsString()
  authState?: string;

  @ApiPropertyOptional({ description: 'The geolocation of the user' })
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoJSONPointDto)
  location?: GeoJSONPointDto;

  @ApiPropertyOptional({ description: 'The contact number of the user' })
  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @ApiPropertyOptional({ description: 'The address of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  address?: string;

  @ApiPropertyOptional({ description: 'The city of the user' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @ApiPropertyOptional({ description: 'The country of the user', default: 'Sri Lanka' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  country?: string;
}
