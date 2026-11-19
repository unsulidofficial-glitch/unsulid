import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, UpdateProfileDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.verifyOtp(dto.phone, dto.otp);

    // Set secure HTTP-only cookie (false on localhost HTTP, true on HTTPS production)
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('unsulid_session', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      path: '/',
    });

    return result;
  }

  @Get('me')
  async getProfile(@Req() req: Request) {
    const token =
      req.cookies?.unsulid_session ||
      (req.headers['authorization']?.startsWith('Bearer ')
        ? req.headers['authorization'].substring(7)
        : null) ||
      (req.headers['x-session-token'] as string);

    if (!token) {
      return {
        success: true,
        authenticated: false,
        user: null,
      };
    }

    const user = await this.authService.validateSession(token);
    if (!user) {
      return {
        success: true,
        authenticated: false,
        user: null,
      };
    }

    return {
      success: true,
      authenticated: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  @Put('profile')
  @UseGuards(AuthGuard)
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.user.id, dto.name, dto.email);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token =
      req.cookies?.unsulid_session ||
      (req.headers['authorization']?.startsWith('Bearer ')
        ? req.headers['authorization'].substring(7)
        : null);

    if (token) {
      await this.authService.logout(token);
    }

    res.clearCookie('unsulid_session', { path: '/' });
    return { success: true, message: 'Logged out successfully' };
  }
}

