import { IsString, IsNotEmpty, Matches, IsOptional, IsBoolean } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @Matches(/^(\+91[\-\s]?)?[6789]\d{9}$/, {
    message: 'Please enter a valid 10-digit Indian phone number',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'House/flat/building details are required' })
  houseBuilding: string;

  @IsString()
  @IsNotEmpty({ message: 'Street, sector, or locality is required' })
  streetLocality: string;

  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  state: string;

  @IsString()
  @IsNotEmpty({ message: '6-digit PIN code is required' })
  @Matches(/^[1-9][0-9]{5}$/, { message: 'Please enter a valid 6-digit Indian PIN code' })
  pinCode: string;

  @IsOptional()
  @IsString()
  deliveryInstructions?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateAddressDto extends CreateAddressDto {}

