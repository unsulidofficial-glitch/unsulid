import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemInputDto } from '@/modules/cart/cart.dto';
import { CreateAddressDto } from '@/modules/users/address.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  addressId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @IsEnum(['PREPAID', 'COD'], { message: 'Payment method must be PREPAID or COD' })
  paymentMethod: 'PREPAID' | 'COD';

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInputDto)
  items?: CartItemInputDto[];
}

export class CancelOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Cancellation reason is required' })
  reason: string;
}

