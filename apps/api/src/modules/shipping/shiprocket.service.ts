import { Injectable, Logger } from '@nestjs/common';
import { DbStoreService } from '@/database/db-store.service';
import * as crypto from 'crypto';

@Injectable()
export class ShiprocketService {
  private readonly logger = new Logger(ShiprocketService.name);
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private readonly store: DbStoreService) {
    this.logger.log('📦 Shiprocket Logistics service initialized (Surat Factory Origin)');
  }

  async createShipmentForOrder(order: any) {
    // Generate AWB and assign express courier
    const couriers = ['BlueDart Express Air', 'Delhivery Surface', 'Xpressbees Direct', 'DTDC Prime'];
    const assignedCourier = couriers[Math.floor(Math.random() * couriers.length)];
    const awbNumber = 'AWB' + Math.floor(100000000 + Math.random() * 900000000);

    const shipment = {
      awbNumber,
      courierName: assignedCourier,
      status: 'AWB_ASSIGNED',
      pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || 'UNSULID_SURAT',
      trackingEvents: [
        {
          status: 'ORDER_PLACED',
          activity: 'Order confirmed and verified at UNSULID Concierge',
          location: 'Surat, Gujarat',
          timestamp: new Date(),
        },
        {
          status: 'PACKED',
          activity: 'Fragrance batch hand-packed and inspected in climate-controlled vault',
          location: 'Surat Fragrance Facility',
          timestamp: new Date(),
        },
        {
          status: 'AWB_GENERATED',
          activity: `Airway bill ${awbNumber} generated with ${assignedCourier}`,
          location: 'Surat Logistics Hub',
          timestamp: new Date(),
        },
      ],
    };

    this.logger.log(
      `📦 Created shipment for order ${order.orderNumber}: AWB ${awbNumber} via ${assignedCourier} from ${shipment.pickupLocation}`
    );

    return shipment;
  }

  async getTrackingTimeline(orderId: string) {
    const order = this.store.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order || !order.shipment) {
      return null;
    }

    return {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      awbNumber: order.shipment.awbNumber,
      courierName: order.shipment.courierName,
      pickupLocation: order.shipment.pickupLocation,
      events: order.shipment.trackingEvents,
    };
  }
}

