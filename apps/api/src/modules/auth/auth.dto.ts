import { IsString, IsNotEmpty, Matches, Length, IsOptional, IsEmail } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(/^(\+91[\-\s]?)?[6789]\d{9}$/, {
    message: 'Please enter a valid 10-digit Indian mobile number',
  })
  phone: string;
}

export class VerifyOtpDto {
  @IsString()
  @IsNotEmpty({ message: 'Mobile number is required' })
  @Matches(/^(\+91[\-\s]?)?[6789]\d{9}$/, {
    message: 'Please enter a valid 10-digit Indian mobile number',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
}

