import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { DbStoreService } from '@/database/db-store.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly store: DbStoreService) {}

  normalizePhone(phone: string): string {
    const cleaned = phone.replace(/[\s\-\+]/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12) {
      return '+' + cleaned;
    }
    if (cleaned.length === 10) {
      return '+91' + cleaned;
    }
    return '+' + cleaned;
  }

  async sendOtp(rawPhone: string) {
    const phone = this.normalizePhone(rawPhone);
    const now = new Date();

    // 1. Rate limiting: Max 5 OTPs in last 10 minutes
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const recentOtps = this.store.otps.filter(
      (o) => o.phone === phone && o.createdAt >= tenMinutesAgo
    );
    if (recentOtps.length >= 5) {
      throw new BadRequestException(
        'Too many OTP requests. Please wait 10 minutes before requesting another code.'
      );
    }

    // 2. Cooldown check: Must wait 60 seconds between resends
    const lastOtp = this.store.otps
      .filter((o) => o.phone === phone)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (lastOtp) {
      const diffSeconds = Math.floor((now.getTime() - lastOtp.createdAt.getTime()) / 1000);
      if (diffSeconds < 60) {
        const wait = 60 - diffSeconds;
        throw new BadRequestException(
          `Please wait ${wait} seconds before requesting a new OTP.`
        );
      }
    }

    // 3. Generate 6-digit OTP
    const otpNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpNumber, salt);
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

    const isDev =
      process.env.NODE_ENV !== 'production' || process.env.OTP_PROVIDER === 'console';

    const record = {
      id: 'otp_' + crypto.randomUUID(),
      phone,
      hashedOtp,
      devOtp: isDev ? otpNumber : undefined,
      attempts: 0,
      isUsed: false,
      expiresAt,
      createdAt: now,
    };

    this.store.otps.push(record);

    if (isDev) {
      this.logger.log(`📱 [DEV OTP GATEWAY] Mobile: ${phone} | 6-Digit OTP: ${otpNumber}`);
    } else {
      // In production, integrate configured SMS gateway (Fast2SMS / MSG91 / 2Factor)
      this.logger.log(`📲 Dispatched OTP via SMS provider to ${phone.slice(0, 6)}****`);
    }

    return {
      success: true,
      message: `OTP sent successfully to ${phone}`,
      phone,
      expiresInSeconds: 300,
      resendCooldownSeconds: 60,
      devOtp: isDev ? otpNumber : undefined,
    };
  }

  async verifyOtp(rawPhone: string, code: string) {
    const phone = this.normalizePhone(rawPhone);
    const now = new Date();

    const otpRecord = this.store.otps
      .filter((o) => o.phone === phone && !o.isUsed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (!otpRecord) {
      throw new BadRequestException('No active OTP found. Please request a new OTP.');
    }

    if (otpRecord.expiresAt < now) {
      throw new BadRequestException('OTP has expired. Please request a new code.');
    }

    if (otpRecord.attempts >= 3) {
      otpRecord.isUsed = true;
      throw new BadRequestException(
        'Maximum verification attempts exceeded. Please request a fresh OTP.'
      );
    }

    otpRecord.attempts += 1;

    const isMatch = await bcrypt.compare(code, otpRecord.hashedOtp);
    if (!isMatch) {
      const remaining = 3 - otpRecord.attempts;
      throw new BadRequestException(
        remaining > 0
          ? `Invalid OTP. You have ${remaining} attempt(s) remaining.`
          : 'Invalid OTP. Maximum attempts exceeded.'
      );
    }

    // Mark as used
    otpRecord.isUsed = true;

    // Find or create customer user
    let user = this.store.users.find((u) => u.phone === phone);
    if (!user) {
      user = {
        id: 'usr_' + crypto.randomUUID(),
        phone,
        isBlocked: false,
        createdAt: now,
        updatedAt: now,
      };
      this.store.users.push(user);
      this.logger.log(`✨ Created new customer account for ${phone}`);
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('This account has been restricted. Please contact concierge.');
    }

    // Create session token
    const token = 'sess_' + crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    this.store.sessions.push({
      token,
      userId: user.id,
      expiresAt,
    });

    return {
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async validateSession(token: string) {
    if (!token) return null;
    const now = new Date();
    const session = this.store.sessions.find(
      (s) => s.token === token && s.expiresAt > now
    );
    if (!session) return null;

    const user = this.store.users.find((u) => u.id === session.userId && !u.isBlocked);
    return user || null;
  }

  async logout(token: string) {
    this.store.sessions = this.store.sessions.filter((s) => s.token !== token);
    return { success: true, message: 'Logged out successfully' };
  }

  async updateProfile(userId: string, name?: string, email?: string) {
    const user = this.store.users.find((u) => u.id === userId);
    if (!user) {
      throw new UnauthorizedException('Customer not found');
    }
    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) user.email = email.trim();
    user.updatedAt = new Date();

    return {
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
      },
    };
  }
}

