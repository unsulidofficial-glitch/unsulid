import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('UNSULID_API');
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  // 1. Security Headers (Helmet)
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. Cookie Parser for HTTP-only cookies
  app.use(cookieParser());

  // 3. Robust CORS Configuration supporting localhost on ANY port (3000, 3001, 3002, etc.)
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-side requests)
      if (!origin) {
        return callback(null, true);
      }

      // Allow any localhost or 127.0.0.1 port (e.g. :3000, :3001, :3002, :3003, etc.)
      const isLocalhost = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost) {
        return callback(null, true);
      }

      // Allow configured frontendUrl (supports comma-separated list)
      const allowedOrigins = frontendUrl.split(',').map((u) => u.trim().replace(/\/$/, ''));
      if (allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
        return callback(null, true);
      }

      // Allow any Vercel preview or production deployment (*.vercel.app)
      try {
        const originUrl = new URL(origin);
        if (
          originUrl.hostname.endsWith('.vercel.app') ||
          originUrl.hostname.endsWith('.onrender.com') ||
          originUrl.hostname === 'localhost'
        ) {
          return callback(null, true);
        }
        for (const allowed of allowedOrigins) {
          try {
            if (originUrl.hostname === new URL(allowed).hostname) {
              return callback(null, true);
            }
          } catch {}
        }
      } catch {}

      return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-session-token',
      'x-admin-token',
      'x-razorpay-signature',
    ],
  });

  // 4. Global API Prefix (excluding root route, health check, and /api manifest)
  app.setGlobalPrefix('api', {
    exclude: ['/', 'health', 'api'],
  });

  // 5. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  await app.listen(port);
  logger.log(`🚀 UNSULID API is running on http://localhost:${port}/api`);
  logger.log(`🔒 Allowed CORS Origin: ${frontendUrl}`);
}
bootstrap();
