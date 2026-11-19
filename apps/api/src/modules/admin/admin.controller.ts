import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  AdminLoginDto,
  CreateProductDto,
  UpdateProductPriceDto,
  CreateCouponDto,
  UpdateCouponDto,
  UpdateShippingSettingsDto,
  UpdateCodSettingsDto,
  UpdatePaymentSettingsDto,
  UpdateStorefrontSettingsDto,
  UpdateOrderStatusDto,
} from './admin.dto';
import { AdminGuard, Roles } from './admin.guard';
import { Response } from 'express';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.adminService.login(dto);

    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('unsulid_admin_token', result.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });

    return result;
  }

  @Post('auth/logout')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('unsulid_admin_token', { path: '/' });
    return { success: true, message: 'Admin logged out successfully' };
  }

  @Get('auth/me')
  @UseGuards(AdminGuard)
  async getAdminProfile(@Req() req: any) {
    return {
      success: true,
      admin: {
        id: req.admin.id,
        email: req.admin.email,
        name: req.admin.name,
        role: req.admin.role,
      },
    };
  }

  // 11A. Dashboard Overview KPIs
  @Get('dashboard/stats')
  @UseGuards(AdminGuard)
  getDashboardStats() {
    return {
      success: true,
      stats: this.adminService.getDashboardStats(),
    };
  }

  // 11B. Product Management
  @Get('products')
  @UseGuards(AdminGuard)
  getAllProducts() {
    return {
      success: true,
      products: this.adminService.getAllProducts(),
    };
  }

  @Post('products')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER')
  createProduct(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.adminService.createProduct(req.admin.email, dto);
  }

  @Put('products/:slugOrId/price')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'PRODUCT_MANAGER')
  updateProductPrice(
    @Req() req: any,
    @Param('slugOrId') slugOrId: string,
    @Body() dto: UpdateProductPriceDto
  ) {
    return this.adminService.updateProductPrice(req.admin.email, slugOrId, dto);
  }

  @Delete('products/:slugOrId')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  deleteProduct(@Req() req: any, @Param('slugOrId') slugOrId: string) {
    return this.adminService.deleteProduct(req.admin.email, slugOrId);
  }

  // 11C. Coupons Management
  @Get('coupons')
  @UseGuards(AdminGuard)
  getAllCoupons() {
    return {
      success: true,
      coupons: this.adminService.getAllCoupons(),
    };
  }

  @Post('coupons')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  createCoupon(@Req() req: any, @Body() dto: CreateCouponDto) {
    return this.adminService.createCoupon(req.admin.email, dto);
  }

  @Put('coupons/:id/toggle')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  toggleCoupon(@Req() req: any, @Param('id') id: string) {
    return this.adminService.toggleCoupon(req.admin.email, id);
  }

  @Delete('coupons/:id')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN')
  deleteCoupon(@Req() req: any, @Param('id') id: string) {
    return this.adminService.deleteCoupon(req.admin.email, id);
  }

  // 11D. Shipping Settings
  @Put('settings/shipping')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateShippingSettings(@Req() req: any, @Body() dto: UpdateShippingSettingsDto) {
    return this.adminService.updateShippingSettings(req.admin.email, dto);
  }

  // 11E. COD Settings
  @Put('settings/cod')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateCodSettings(@Req() req: any, @Body() dto: UpdateCodSettingsDto) {
    return this.adminService.updateCodSettings(req.admin.email, dto);
  }

  // 11F. Payment Settings
  @Put('settings/payments')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN')
  updatePaymentSettings(@Req() req: any, @Body() dto: UpdatePaymentSettingsDto) {
    return this.adminService.updatePaymentSettings(req.admin.email, dto);
  }

  // 11G. Storefront Settings
  @Put('settings/storefront')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  updateStorefrontSettings(@Req() req: any, @Body() dto: UpdateStorefrontSettingsDto) {
    return this.adminService.updateStorefrontSettings(req.admin.email, dto);
  }

  // 11H. Customer Management
  @Get('customers')
  @UseGuards(AdminGuard)
  getAllCustomers(@Query('search') search?: string) {
    return {
      success: true,
      customers: this.adminService.getAllCustomers(search),
    };
  }

  @Put('customers/:id/toggle-block')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  toggleBlockCustomer(@Req() req: any, @Param('id') id: string) {
    return this.adminService.toggleBlockCustomer(req.admin.email, id);
  }

  // 11I. Order Management
  @Get('orders')
  @UseGuards(AdminGuard)
  getAllOrders(
    @Query('status') status?: string,
    @Query('paymentMethod') paymentMethod?: string,
    @Query('search') search?: string
  ) {
    return {
      success: true,
      orders: this.adminService.getAllOrders({ status, paymentMethod, search }),
    };
  }

  @Put('orders/:id/status')
  @UseGuards(AdminGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'ORDER_MANAGER')
  updateOrderStatus(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto
  ) {
    return this.adminService.updateOrderStatus(req.admin.email, id, dto);
  }

  @Get('reports/orders/export')
  @UseGuards(AdminGuard)
  exportOrdersToCsv(@Res() res: Response) {
    const csvData = this.adminService.exportOrdersToCsv();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="unsulid-orders-report.csv"');
    return res.status(200).send(csvData);
  }

  // 14. Audit Logs
  @Get('audit-logs')
  @UseGuards(AdminGuard)
  getAuditLogs() {
    return {
      success: true,
      logs: this.adminService.getAuditLogs(),
    };
  }
}

