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
  Phone,
  UserCheck,
  ShieldCheck,
  Navigation,
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
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const loadOrder = (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);

    api.orders
      .get(id)
      .then((res) => {
        if (res?.order) setOrder(res.order);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openOtpModal(`/account/orders/${id}`);
    }
    if (isAuthenticated && id) {
      loadOrder(true);
    }
  }, [id, isAuthenticated, isLoading, openOtpModal]);

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;

    setCancelling(true);
    try {
      await api.orders.cancel(id, cancelReason.trim());
      setCancelModalOpen(false);
      loadOrder(true);
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
          <p className="text-xs text-[#8B8178] font-sans mb-6">
            {error || 'Unable to retrieve order details.'}
          </p>
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

  // Compute Amazon / Flipkart milestone steps
  const milestones = [
    {
      id: 'CONFIRMED',
      label: 'Order Confirmed',
      description: 'Verified at Surat Concierge',
      icon: CheckCircle2,
    },
    {
      id: 'SHIPPED',
      label: 'Shipped',
      description: 'Dispatched via Express Courier',
      icon: Package,
    },
    {
      id: 'OUT_FOR_DELIVERY',
      label: 'Out for Delivery',
      description: 'Delivery Partner on Route',
      icon: Truck,
    },
    {
      id: 'DELIVERED',
      label: 'Delivered',
      description: 'Handed Over to Recipient',
      icon: MapPin,
    },
  ];

  let currentStepIndex = 0;
  if (order.orderStatus === 'DELIVERED') {
    currentStepIndex = 3;
  } else if (order.orderStatus === 'OUT_FOR_DELIVERY') {
    currentStepIndex = 2;
  } else if (['SHIPPED', 'IN_TRANSIT'].includes(order.orderStatus)) {
    currentStepIndex = 1;
  } else if (['CONFIRMED', 'PROCESSING', 'PACKED'].includes(order.orderStatus)) {
    currentStepIndex = 0;
  }

  // Real-time tracking events (reverse chronological: latest on top)
  const rawEvents = order.shipment?.trackingEvents || [];
  const trackingEvents = [...rawEvents].reverse();

  const isOutForDelivery = order.orderStatus === 'OUT_FOR_DELIVERY';
  const isDelivered = order.orderStatus === 'DELIVERED';
  const isShippedOrTransit = ['SHIPPED', 'IN_TRANSIT'].includes(order.orderStatus);

  return (
    <div className="py-10 lg:py-16 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1.5 text-xs font-sans text-[#8B8178] hover:text-[#5B0F18] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>

          <button
            onClick={() => loadOrder(false)}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E6D9C9] text-xs font-sans text-[#5B0F18] hover:bg-[#FAF6F0] transition-colors shadow-sm disabled:opacity-50"
            title="Fetch real-time updates from logistics network"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Live Status'}</span>
          </button>
        </div>

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
                    : order.orderStatus === 'OUT_FOR_DELIVERY'
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-[#5B0F18] text-white'
                }`}
              >
                {order.orderStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-xs text-[#8B8178] font-sans mt-1">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
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

        {/* Amazon / Flipkart Style Real-Time Tracking Center */}
        {order.shipment && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm mb-6">
            {/* Header / AWB Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6D9C9] mb-8 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#5B0F18]/10 text-[#5B0F18] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-xl font-medium text-[#0B0B0B]">
                      Shiprocket Express Logistics
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                      REAL-TIME ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#8B8178] font-sans mt-0.5">
                    Courier: <strong>{order.shipment.courierName}</strong> • AWB:{' '}
                    <strong className="font-mono text-[#5B0F18]">
                      {order.shipment.awbNumber}
                    </strong>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-mono text-[#8B8178] uppercase tracking-wider block">
                  Origin Fulfillment Facility
                </span>
                <span className="text-xs font-semibold text-[#0B0B0B]">
                  Surat Fragrance Vault, Gujarat
                </span>
              </div>
            </div>

            {/* Flipkart / Amazon Real-Time Highlight Alert Banner */}
            {isOutForDelivery && (
              <div className="bg-gradient-to-br from-[#0F291E] via-[#14231B] to-[#0D1812] border border-emerald-500/40 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden mb-8 animate-fade-in">
                <div className="absolute -right-16 -top-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-inner">
                      <Truck className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          Out for Delivery Today
                        </span>
                        <span className="text-xs text-white/70 font-sans">
                          Expected Delivery:{' '}
                          <strong className="text-white">Today by 7:00 PM</strong>
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white mt-1.5">
                        Your Fragrance is Out for Delivery!
                      </h3>
                      <p className="text-xs text-white/80 font-sans mt-1 leading-relaxed max-w-xl">
                        The delivery executive has departed from the local logistics center and is
                        actively delivering to{' '}
                        <strong className="text-white">{order.addressSnapshot?.fullName}</strong> in{' '}
                        <strong className="text-white">{order.addressSnapshot?.city}</strong>.
                      </p>

                      {/* Delivery Associate Info */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-sans text-white/80">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>
                            Delivery Executive:{' '}
                            <strong className="text-white">
                              {order.shipment.deliveryAssociate?.name || 'Vikram Sharma'}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <a
                            href={`tel:${
                              order.shipment.deliveryAssociate?.phone || '+919872104412'
                            }`}
                            className="text-emerald-300 hover:underline font-mono font-medium"
                          >
                            {order.shipment.deliveryAssociate?.phone || '+91 98721 04412'}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                          <Truck className="w-3.5 h-3.5" />
                          <span>{order.shipment.courierName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Flipkart / Amazon Delivery Security Code (OTP) */}
                  <div className="bg-black/60 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 text-center md:text-right shrink-0 shadow-lg">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block mb-1">
                      DELIVERY SECURITY CODE
                    </span>
                    <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-white py-1">
                      {order.shipment.deliveryOtp || '4821'}
                    </div>
                    <p className="text-[10px] text-white/60 font-sans max-w-[180px] mx-auto md:ml-auto md:mr-0 mt-1 leading-snug">
                      Share this code with your delivery associate upon physical handover
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isShippedOrTransit && (
              <div className="bg-gradient-to-br from-[#1C140E] via-[#241A12] to-[#120E0A] border border-[#C6A15B]/40 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden mb-8 animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/40 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#C6A15B]/20 text-[#C6A15B] border border-[#C6A15B]/30 uppercase tracking-wider">
                        Package In Transit
                      </span>
                      <span className="text-xs text-white/70 font-sans">
                        Estimated Delivery:{' '}
                        <strong className="text-white">
                          {order.shipment.estimatedDelivery || 'In 2–3 Days'}
                        </strong>
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white mt-1.5">
                      On Its Way to Your City
                    </h3>
                    <p className="text-xs text-white/80 font-sans mt-1 leading-relaxed">
                      Your handcrafted fragrance has departed from Surat and is traveling via express
                      line-haul to {order.addressSnapshot?.city}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isDelivered && (
              <div className="bg-gradient-to-br from-[#0B2117] via-[#0E2C1E] to-[#0A1A12] border border-emerald-500/40 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden mb-8 animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      Delivered Successfully
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-1.5">
                      Package Handed Over
                    </h3>
                    <p className="text-xs text-white/80 font-sans mt-1 leading-relaxed">
                      Delivered to {order.addressSnapshot?.fullName} in {order.addressSnapshot?.city}.
                      We hope you enjoy your luxury UNSULID fragrance!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Amazon / Flipkart Horizontal Visual Progress Stepper */}
            <div className="mb-10 px-2 sm:px-6">
              <div className="relative">
                {/* Background Connecting Line */}
                <div className="absolute top-5 left-6 right-6 h-1 bg-[#E6D9C9] -translate-y-1/2 z-0 hidden sm:block" />
                {/* Active Colored Progress Line */}
                <div
                  className="absolute top-5 left-6 h-1 bg-gradient-to-r from-[#5B0F18] via-[#C6A15B] to-emerald-600 -translate-y-1/2 z-0 hidden sm:block transition-all duration-700"
                  style={{
                    width: `${
                      currentStepIndex === 0
                        ? '0%'
                        : currentStepIndex === 1
                        ? '33%'
                        : currentStepIndex === 2
                        ? '66%'
                        : '100%'
                    }`,
                  }}
                />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
                  {milestones.map((m, idx) => {
                    const isDone = currentStepIndex > idx;
                    const isCurrent = currentStepIndex === idx;
                    const isPending = currentStepIndex < idx;
                    const Icon = m.icon;

                    return (
                      <div key={m.id} className="flex flex-col items-center text-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            isDone
                              ? 'bg-[#5B0F18] border-[#5B0F18] text-white shadow-md'
                              : isCurrent
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg ring-4 ring-emerald-100 animate-pulse'
                              : 'bg-white border-[#D5C7B7] text-[#8B8178]'
                          }`}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-[#C6A15B]" />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>
                        <div className="mt-2.5">
                          <span
                            className={`text-xs font-sans font-bold block ${
                              isCurrent
                                ? 'text-emerald-700'
                                : isDone
                                ? 'text-[#0B0B0B]'
                                : 'text-[#8B8178]'
                            }`}
                          >
                            {m.label}
                          </span>
                          <span className="text-[10px] text-[#8B8178] font-sans hidden sm:block mt-0.5">
                            {m.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Real-Time Checkpoint History Feed (Flipkart / Delhivery Style) */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E6D9C9]">
                <h3 className="font-serif text-base font-semibold text-[#0B0B0B]">
                  Detailed Shipment Activity Log
                </h3>
                <span className="text-[11px] font-sans text-[#8B8178]">
                  {trackingEvents.length} Verified Checkpoints
                </span>
              </div>

              <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6D9C9]">
                {trackingEvents.map((ev: any, idx: number) => {
                  const isLatest = idx === 0;

                  return (
                    <div
                      key={idx}
                      className={`relative text-xs font-sans p-3 rounded-2xl transition-colors ${
                        isLatest
                          ? 'bg-emerald-50/80 border border-emerald-200'
                          : 'hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div
                        className={`absolute -left-6 top-4 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                          isLatest
                            ? 'bg-emerald-600 animate-pulse ring-emerald-100'
                            : 'bg-[#5B0F18]'
                        }`}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <strong
                            className={`text-sm font-semibold ${
                              isLatest ? 'text-emerald-950 font-bold' : 'text-[#0B0B0B]'
                            }`}
                          >
                            {ev.activity}
                          </strong>
                          {isLatest && (
                            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-600 text-white">
                              Latest
                            </span>
                          )}
                        </div>

                        <span className="text-[#8B8178] text-[11px] shrink-0 font-mono">
                          {new Date(ev.timestamp).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          •{' '}
                          {new Date(ev.timestamp).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {ev.location && (
                        <p className="text-[#7A6E64] text-[11px] mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C6A15B] shrink-0" />
                          <span>{ev.location}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
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
              <p className="font-mono text-[#5B0F18] font-medium">
                +91 {order.addressSnapshot?.phone}
              </p>
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
              <div
                key={idx}
                className="flex items-center justify-between text-xs font-sans pb-3 border-b border-[#E6D9C9]/50"
              >
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
              <span className="font-semibold text-[#0B0B0B]">
                ₹{order.subtotal.toLocaleString('en-IN')}
              </span>
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
                Please provide a reason for cancelling order {order.orderNumber}. Restored items
                will return to inventory immediately.
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
