'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowLeft,
  XCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { isAuthenticated, isLoading, openOtpModal } = useAuth();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const loadOrder = () => {
    setLoading(true);
    api.orders
      .get(id)
      .then((res) => {
        if (res?.order) setOrder(res.order);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openOtpModal(`/account/orders/${id}`);
    }
    if (isAuthenticated && id) {
      loadOrder();
    }
  }, [id, isAuthenticated, isLoading, openOtpModal]);

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    setCancelling(true);
    try {
      await api.orders.cancel(id, cancelReason.trim());
      setCancelModalOpen(false);
      loadOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <div className="py-20 bg-[#FAF6F0] min-h-[60vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-[#5B0F18]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="py-20 bg-[#FAF6F0] min-h-[60vh] flex items-center justify-center">
        <Container className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h1 className="font-serif text-2xl text-[#0B0B0B] mb-2">Order Not Found</h1>
          <p className="text-xs text-[#8B8178] font-sans mb-6">{error || 'Unable to retrieve order details.'}</p>
          <Link
            href="/account/orders"
            className="px-6 py-2.5 rounded-full bg-[#5B0F18] text-white text-xs font-semibold"
          >
            Back to Orders
          </Link>
        </Container>
      </div>
    );
  }

  const isCancellable = ['PENDING', 'PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING'].includes(
    order.orderStatus
  );

  return (
    <div className="py-10 lg:py-16 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container className="max-w-4xl mx-auto">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-[#8B8178] hover:text-[#5B0F18] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        {/* Order Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0B0B0B]">
                {order.orderNumber}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase ${
                  order.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-[#5B0F18] text-white'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-[#8B8178] font-sans mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {isCancellable && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-4 py-2 rounded-full border border-red-300 text-red-700 text-xs font-sans font-semibold hover:bg-red-50 transition-colors self-start sm:self-center"
            >
              Cancel Order
            </button>
          )}
        </div>

        {/* Shiprocket Logistics & Tracking Timeline */}
        {order.shipment && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm mb-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6D9C9] mb-6">
              <div className="flex items-center gap-3">
                <Truck className="w-6 h-6 text-[#5B0F18]" />
                <div>
                  <h2 className="font-serif text-xl font-medium text-[#0B0B0B]">
                    Shiprocket Express Tracking
                  </h2>
                  <p className="text-xs text-[#8B8178] font-sans">
                    Courier: <strong>{order.shipment.courierName}</strong> • AWB:{' '}
                    <strong className="font-mono text-[#5B0F18]">{order.shipment.awbNumber}</strong>
                  </p>
                </div>
              </div>
              <span className="text-xs font-sans text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-semibold">
                Origin: Surat Facility
              </span>
            </div>

            {/* Stepper */}
            <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6D9C9]">
              {order.shipment.trackingEvents?.map((ev: any, idx: number) => (
                <div key={idx} className="relative text-xs font-sans">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#5B0F18] ring-4 ring-white" />
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <strong className="text-[#0B0B0B] text-sm font-semibold">{ev.activity}</strong>
                    <span className="text-[#8B8178] text-[11px]">
                      {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-[#7A6E64] text-[11px] mt-0.5">{ev.location}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Delivery Address Snapshot */}
          <div className="p-6 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm">
            <h2 className="font-serif text-lg font-medium text-[#0B0B0B] mb-3 pb-2 border-b border-[#E6D9C9] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5B0F18]" />
              Shipping Address
            </h2>
            <div className="text-xs font-sans text-[#7A6E64] leading-relaxed space-y-1">
              <strong className="text-[#0B0B0B] block text-sm">
                {order.addressSnapshot?.fullName}
              </strong>
              <p className="font-mono text-[#5B0F18] font-medium">+91 {order.addressSnapshot?.phone}</p>
              <p>
                {order.addressSnapshot?.houseBuilding}, {order.addressSnapshot?.streetLocality}
              </p>
              <p>
                {order.addressSnapshot?.city}, {order.addressSnapshot?.state} —{' '}
                <strong>{order.addressSnapshot?.pinCode}</strong>
              </p>
              {order.addressSnapshot?.deliveryInstructions && (
                <p className="italic text-[#8B8178] mt-2">
                  Instructions: {order.addressSnapshot?.deliveryInstructions}
                </p>
              )}
            </div>
          </div>

          {/* Payment Snapshot */}
          <div className="p-6 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm">
            <h2 className="font-serif text-lg font-medium text-[#0B0B0B] mb-3 pb-2 border-b border-[#E6D9C9]">
              Payment Information
            </h2>
            <div className="text-xs font-sans text-[#7A6E64] space-y-2">
              <div className="flex justify-between">
                <span>Method:</span>
                <strong className="text-[#0B0B0B] uppercase">{order.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <strong className="text-emerald-700 uppercase">{order.paymentStatus}</strong>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span>Razorpay ID:</span>
                  <span className="font-mono text-[#0B0B0B]">{order.razorpayPaymentId}</span>
                </div>
              )}
              {order.couponCode && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Applied:</span>
                  <strong className="font-mono">{order.couponCode}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Items & Breakdown */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm mb-6">
          <h2 className="font-serif text-xl font-medium text-[#0B0B0B] mb-4 pb-3 border-b border-[#E6D9C9]">
            Order Items
          </h2>

          <div className="space-y-4 mb-6">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between text-xs font-sans pb-3 border-b border-[#E6D9C9]/50">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-16 rounded-xl bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#E6D9C9]">
                    <Image
                      src={item.image || `/images/products/high-class-front.jpg`}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <strong className="text-base font-serif text-[#0B0B0B] block">
                      {item.productName}
                    </strong>
                    <span className="text-[#8B8178]">
                      SKU: {item.productSku} • Qty: {item.quantity}
                    </span>
                    <div className="text-[#5B0F18] font-semibold mt-0.5">
                      ₹{item.unitPrice.toLocaleString('en-IN')} each
                    </div>
                  </div>
                </div>
                <span className="font-serif text-lg font-bold text-[#0B0B0B]">
                  ₹{item.subtotal.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="max-w-xs ml-auto space-y-2 text-xs font-sans text-[#7A6E64]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#0B0B0B]">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {order.discountTotal > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount:</span>
                <span>-₹{order.discountTotal.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee:</span>
              <span className="font-semibold text-[#0B0B0B]">
                {order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}
              </span>
            </div>
            {order.codFee > 0 && (
              <div className="flex justify-between text-amber-900 font-medium">
                <span>COD Handling Fee:</span>
                <span>+₹{order.codFee}</span>
              </div>
            )}
            <div className="pt-3 border-t border-[#E6D9C9] flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-[#0B0B0B]">Grand Total:</span>
              <span className="font-serif text-2xl font-bold text-[#5B0F18]">
                ₹{order.grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Cancel Modal */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-3xl border border-[#E6D9C9] p-6 shadow-2xl">
              <h2 className="font-serif text-xl font-medium text-[#0B0B0B] mb-2">Cancel Order</h2>
              <p className="text-xs text-[#8B8178] font-sans mb-4">
                Please provide a reason for cancelling order {order.orderNumber}. Restored items will return to inventory immediately.
              </p>
              <form onSubmit={handleCancelOrder} className="space-y-4">
                <textarea
                  required
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Ordered by mistake / Need to update address..."
                  className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl p-3 text-xs font-sans text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-[#D5C7B7] text-xs font-sans font-semibold text-[#8B8178]"
                  >
                    Keep Order
                  </button>
                  <button
                    type="submit"
                    disabled={cancelling || !cancelReason.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-red-700 text-white text-xs font-sans font-semibold hover:bg-red-800 disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

