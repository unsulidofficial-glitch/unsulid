import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getRoot(@Req() req: Request, @Res() res: Response) {
    const acceptsHtml = req.headers.accept?.includes('text/html');
    if (acceptsHtml) {
      // Browser navigation to http://localhost:3000/ -> seamlessly redirect to the Storefront UI on port 3001
      return res.redirect(302, 'http://localhost:3001');
    }
    return res.status(200).json({
      status: 'ok',
      service: 'UNSULID® Fine Fragrances API Engine',
      version: '1.0.0',
      storefront: 'http://localhost:3001',
      documentation: 'http://localhost:3000/api',
    });
  }

  @Get('api')
  getApiManifest(@Req() req: Request, @Res() res: Response) {
    const acceptsHtml = req.headers.accept?.includes('text/html');
    if (acceptsHtml) {
      // Browser navigation to http://localhost:3000/api -> seamlessly redirect to the Storefront UI on port 3001
      return res.redirect(302, 'http://localhost:3001');
    }
    return res.status(200).json({
      status: 'ok',
      service: 'UNSULID® Fine Fragrances API Engine',
      version: '1.0.0',
      storefront: 'http://localhost:3001',
      documentation: 'http://localhost:3000/api',
      endpoints: {
        health: '/health',
        auth: '/api/auth',
        products: '/api/products',
        cart: '/api/cart',
        orders: '/api/orders',
        admin: '/api/admin',
        settings: '/api/settings',
      },
    });
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'UNSULID API',
      timestamp: new Date().toISOString(),
      storefront: 'http://localhost:3001',
    };
  }
}


