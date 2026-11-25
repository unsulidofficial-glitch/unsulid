import { Injectable, Logger } from '@nestjs/common';
import { DbStoreService } from '@/database/db-store.service';

export interface TrackingEvent {
  status: string;
  activity: string;
  location?: string;
  timestamp: Date;
  isCompleted?: boolean;
  isActive?: boolean;
}

export interface RealTimeTrackingData {
  orderNumber: string;
  orderStatus: string;
  awbNumber: string;
  courierName: string;
  pickupLocation: string;
  destinationCity: string;
  destinationState: string;
  recipientName: string;
  estimatedDelivery: string;
  deliveryOtp: string;
  deliveryAssociate: {
    name: string;
    phone: string;
    courier: string;
  };
  currentMilestoneIndex: number;
  events: TrackingEvent[];
}

@Injectable()
export class ShiprocketService {
  private readonly logger = new Logger(ShiprocketService.name);

  constructor(private readonly store: DbStoreService) {
    this.logger.log('📦 Shiprocket Logistics service initialized (Surat Factory Origin)');
  }

  async createShipmentForOrder(order: any) {
    const couriers = [
      'Delhivery Surface',
      'BlueDart Express Air',
      'Xpressbees Direct',
      'DTDC Prime',
    ];
    const assignedCourier = couriers[Math.floor(Math.random() * couriers.length)];
    const awbNumber = 'AWB' + Math.floor(100000000 + Math.random() * 900000000);

    const shipment = {
      awbNumber,
      courierName: assignedCourier,
      status: 'AWB_ASSIGNED',
      pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || 'UNSULID_SURAT',
      estimatedDelivery: 'Expected in 2-3 Days',
      deliveryOtp: '4821',
      deliveryAssociate: {
        name: 'Vikram Sharma',
        phone: '+91 98721 04412',
        courier: assignedCourier,
      },
      trackingEvents: [] as TrackingEvent[],
    };

    order.shipment = shipment;
    this.syncTrackingEventsForStatus(order);

    this.logger.log(
      `📦 Created shipment for order ${order.orderNumber}: AWB ${awbNumber} via ${assignedCourier} from ${shipment.pickupLocation}`
    );

    return shipment;
  }

  syncTrackingEventsForStatus(order: any, targetStatus?: string) {
    if (targetStatus) {
      order.orderStatus = targetStatus;
    }

    if (!order.shipment) {
      const couriers = ['Delhivery Surface', 'BlueDart Express Air', 'Xpressbees Direct', 'DTDC Prime'];
      const assignedCourier = couriers[Math.floor(Math.random() * couriers.length)];
      const awbNumber = 'AWB' + Math.floor(100000000 + Math.random() * 900000000);
      order.shipment = {
        awbNumber,
        courierName: assignedCourier,
        status: 'AWB_ASSIGNED',
        pickupLocation: 'UNSULID_SURAT',
        trackingEvents: [],
      };
    }

    const courier = order.shipment.courierName || 'Delhivery Surface';
    const awb = order.shipment.awbNumber || 'AWB848319763';
    const city = order.addressSnapshot?.city || 'Your City';
    const state = order.addressSnapshot?.state || 'India';
    const pinCode = order.addressSnapshot?.pinCode ? `(${order.addressSnapshot.pinCode})` : '';
    const recipient = order.addressSnapshot?.fullName || 'Recipient';
    const status = order.orderStatus || 'CONFIRMED';
    const baseTime = new Date(order.createdAt || Date.now()).getTime();

    // Deterministic 4-digit Delivery Security Code (like Amazon/Flipkart OTP)
    const num = parseInt(order.orderNumber?.replace(/\D/g, '') || '1001', 10);
    const deliveryOtp = String(((num * 73 + 1234) % 9000) + 1000);

    const associates: Record<string, { name: string; phone: string }> = {
      'Delhivery Surface': { name: 'Vikram Sharma', phone: '+91 98721 04412' },
      'BlueDart Express Air': { name: 'Arun Verma', phone: '+91 98114 77291' },
      'Xpressbees Direct': { name: 'Suresh Patel', phone: '+91 99250 88314' },
      'DTDC Prime': { name: 'Ramesh Nair', phone: '+91 97401 22983' },
    };
    const associate = associates[courier] || { name: 'Vikram Sharma', phone: '+91 98721 04412' };

    const events: TrackingEvent[] = [
      {
        status: 'ORDER_PLACED',
        activity: 'Order confirmed and verified at UNSULID Concierge',
        location: 'Surat, Gujarat',
        timestamp: new Date(baseTime),
        isCompleted: true,
      },
      {
        status: 'PACKED',
        activity: 'Fragrance batch hand-packed and inspected in climate-controlled vault',
        location: 'Surat Fragrance Facility',
        timestamp: new Date(baseTime + 15 * 60 * 1000),
        isCompleted: true,
      },
      {
        status: 'AWB_GENERATED',
        activity: `Airway bill ${awb} generated with ${courier}`,
        location: 'Surat Logistics Hub',
        timestamp: new Date(baseTime + 30 * 60 * 1000),
        isCompleted: true,
      },
    ];

    const hasShipped = ['SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
    const hasTransit = ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
    const hasOutForDelivery = ['OUT_FOR_DELIVERY', 'DELIVERED'].includes(status);
    const hasDelivered = status === 'DELIVERED';
    const isCancelled = status === 'CANCELLED';

    if (hasShipped) {
      events.push({
        status: 'SHIPPED',
        activity: `Dispatched from Surat Logistics Hub via line-haul express to ${city}`,
        location: 'Surat Express Line-Haul Terminal, Gujarat',
        timestamp: new Date(baseTime + 2 * 60 * 60 * 1000),
        isCompleted: true,
      });
    }

    if (hasTransit) {
      events.push({
        status: 'IN_TRANSIT',
        activity: 'Arrived at National Transit Transshipment Hub & automated sorting complete',
        location: 'Regional Hub, Western Logistics Corridor',
        timestamp: new Date(baseTime + 6 * 60 * 60 * 1000),
        isCompleted: true,
      });
      events.push({
        status: 'REACHED_CITY',
        activity: `Package received at destination city delivery center ${pinCode}`,
        location: `${city} Logistics Hub, ${state}`,
        timestamp: new Date(baseTime + 14 * 60 * 60 * 1000),
        isCompleted: true,
      });
    }

    if (hasOutForDelivery) {
      // Use current time or order updated time for the Out for delivery checkpoint
      const outTime = order.updatedAt ? new Date(order.updatedAt) : new Date(baseTime + 18 * 60 * 60 * 1000);
      events.push({
        status: 'OUT_FOR_DELIVERY',
        activity: `Out for delivery! Courier delivery executive (${associate.name}) has departed with your package`,
        location: `${city} Hub — Delivering to ${recipient}`,
        timestamp: outTime,
        isCompleted: true,
        isActive: status === 'OUT_FOR_DELIVERY',
      });
    }

    if (hasDelivered) {
      const deliveredTime = order.updatedAt ? new Date(order.updatedAt) : new Date(baseTime + 22 * 60 * 60 * 1000);
      events.push({
        status: 'DELIVERED',
        activity: `Package delivered successfully! Handed over to recipient (${recipient})`,
        location: `${city}, ${state} ${pinCode}`,
        timestamp: deliveredTime,
        isCompleted: true,
        isActive: true,
      });
    }

    if (isCancelled) {
      events.push({
        status: 'CANCELLED',
        activity: 'Order cancelled upon request. Delivery halted and shipment recalled to Surat',
        location: 'Surat Fulfillment Center',
        timestamp: order.updatedAt ? new Date(order.updatedAt) : new Date(),
        isCompleted: true,
        isActive: true,
      });
    }

    let estimatedDelivery = 'Expected in 2-3 Days';
    let currentMilestoneIndex = 0; // 0: Confirmed, 1: Shipped, 2: In Transit, 3: Out for Delivery, 4: Delivered

    if (status === 'DELIVERED') {
      estimatedDelivery = 'Delivered';
      currentMilestoneIndex = 4;
    } else if (status === 'OUT_FOR_DELIVERY') {
      estimatedDelivery = 'Today by 7:00 PM';
      currentMilestoneIndex = 3;
    } else if (status === 'IN_TRANSIT') {
      estimatedDelivery = 'Expected in 1-2 Days';
      currentMilestoneIndex = 2;
    } else if (status === 'SHIPPED') {
      estimatedDelivery = 'Expected in 2-3 Days';
      currentMilestoneIndex = 1;
    } else if (status === 'CANCELLED') {
      estimatedDelivery = 'Cancelled';
      currentMilestoneIndex = -1;
    }

    order.shipment.deliveryOtp = deliveryOtp;
    order.shipment.deliveryAssociate = {
      ...associate,
      courier,
    };
    order.shipment.estimatedDelivery = estimatedDelivery;
    order.shipment.currentMilestoneIndex = currentMilestoneIndex;
    order.shipment.trackingEvents = events;

    return order.shipment;
  }

  async getTrackingTimeline(orderId: string): Promise<RealTimeTrackingData | null> {
    const order = this.store.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) {
      return null;
    }

    if (!order.shipment) {
      await this.createShipmentForOrder(order);
    } else {
      this.syncTrackingEventsForStatus(order);
    }

    const city = order.addressSnapshot?.city || 'Destination Hub';
    const state = order.addressSnapshot?.state || 'India';

    return {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      awbNumber: order.shipment.awbNumber,
      courierName: order.shipment.courierName,
      pickupLocation: order.shipment.pickupLocation || 'UNSULID_SURAT',
      destinationCity: city,
      destinationState: state,
      recipientName: order.addressSnapshot?.fullName || 'Recipient',
      estimatedDelivery: order.shipment.estimatedDelivery,
      deliveryOtp: order.shipment.deliveryOtp,
      deliveryAssociate: order.shipment.deliveryAssociate,
      currentMilestoneIndex: order.shipment.currentMilestoneIndex,
      events: order.shipment.trackingEvents,
    };
  }
}
