import { IsString, IsNotEmpty, IsInt, Min, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemInputDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @IsInt()
  @Min(0)
  quantity: number;
}

export class MergeCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInputDto)
  items: CartItemInputDto[];
}

export class CalculateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemInputDto)
  items: CartItemInputDto[];

  @IsOptional()
  @IsEnum(['PREPAID', 'COD'])
  paymentMethod?: 'PREPAID' | 'COD';

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsOptional()
  @IsString()
  pinCode?: string;
}

