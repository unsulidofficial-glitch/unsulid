import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, CancelOrderDto } from './orders.dto';
import { AuthGuard } from '@/modules/auth/auth.guard';
import { ShiprocketService } from '@/modules/shipping/shiprocket.service';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly shiprocketService: ShiprocketService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, dto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMyOrders(@Req() req: any) {
    const orders = await this.ordersService.listUserOrders(req.user.id);
    return { success: true, orders };
  }

  // Public Order Tracking Endpoint (e.g. UNS-2026-1001 or ord_xxx)
  @Get(':id/tracking')
  async getTracking(@Param('id') id: string) {
    const order = this.ordersService['store'].orders.find(
      (o: any) => o.id === id || o.orderNumber === id.toUpperCase()
    );
    if (!order) {
      throw new NotFoundException(`Order ${id} not found.`);
    }

    let tracking = await this.shiprocketService.getTrackingTimeline(order.id);
    if (!tracking) {
      order.shipment = await this.shiprocketService.createShipmentForOrder(order);
      tracking = await this.shiprocketService.getTrackingTimeline(order.id);
    }

    return { success: true, tracking };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrderDetail(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.getOrder(req.user.id, id);
    return { success: true, order };
  }

  @Post(':id/cancel')
  @UseGuards(AuthGuard)
  async cancelOrder(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: CancelOrderDto
  ) {
    return this.ordersService.cancelOrder(req.user.id, id, dto.reason);
  }
}
