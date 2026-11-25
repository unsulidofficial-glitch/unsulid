'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  AlertCircle,
  MapPin,
  RefreshCw,
  UserCheck,
  Phone,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { api } from '@/lib/api';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.orders.tracking(orderNumber.trim());
      if (res?.tracking) {
        setTracking(res.tracking);
      } else {
        setError('No tracking information found for this order.');
      }
    } catch (err: any) {
      setError(
        'Unable to locate tracking details. Please verify the order number (e.g. UNS-2026-1001) or check your account.'
      );
    } finally {
      setLoading(false);
    }
  };

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
  if (tracking?.orderStatus === 'DELIVERED') {
    currentStepIndex = 3;
  } else if (tracking?.orderStatus === 'OUT_FOR_DELIVERY') {
    currentStepIndex = 2;
  } else if (['SHIPPED', 'IN_TRANSIT'].includes(tracking?.orderStatus)) {
    currentStepIndex = 1;
  } else if (['CONFIRMED', 'PROCESSING', 'PACKED'].includes(tracking?.orderStatus)) {
    currentStepIndex = 0;
  }

  const rawEvents = tracking?.events || [];
  const trackingEvents = [...rawEvents].reverse();

  const isOutForDelivery = tracking?.orderStatus === 'OUT_FOR_DELIVERY';
  const isDelivered = tracking?.orderStatus === 'DELIVERED';
  const isShippedOrTransit = ['SHIPPED', 'IN_TRANSIT'].includes(tracking?.orderStatus);

  return (
    <div className="py-12 lg:py-20 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase font-sans tracking-[0.28em] text-[#C6A15B] font-bold block mb-2">
            UNSULID® LOGISTICS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal mb-3">
            Track Your Fragrance
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8178] font-sans max-w-md mx-auto">
            Enter your order reference number to follow your handcrafted batch on its journey from
            our Surat facility to your doorstep in real time.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-md mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-sans font-medium text-[#0B0B0B] mb-2">
                Order Reference Number
              </label>
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#8B8178] absolute left-4" />
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. UNS-2026-1001"
                  className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl py-3.5 pl-11 pr-4 font-mono text-sm uppercase text-[#0B0B0B] placeholder:text-[#8B8178]/50 focus:outline-none focus:border-[#5B0F18]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="w-full py-3.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>{loading ? 'Connecting to Logistics Network...' : 'Track Live Shipment'}</span>
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-sans mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Tracking Lookup Note</p>
              <p className="leading-relaxed">{error}</p>
              <Link
                href="/account/orders"
                className="inline-block mt-2 font-semibold text-[#5B0F18] hover:underline"
              >
                Go to My Account Orders →
              </Link>
            </div>
          </div>
        )}

        {/* Amazon / Flipkart Style Real-Time Tracking Center */}
        {tracking && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-lg mb-8 animate-fade-in">
            {/* Header / AWB Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E6D9C9] mb-8 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C6A15B] font-bold">
                    ORDER {tracking.orderNumber}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    LIVE REAL-TIME
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-[#0B0B0B]">
                  {tracking.orderStatus.replace(/_/g, ' ')}
                </h2>
                <p className="text-xs text-[#8B8178] font-sans mt-0.5">
                  Courier: <strong>{tracking.courierName}</strong> • AWB:{' '}
                  <strong className="font-mono text-[#5B0F18]">{tracking.awbNumber}</strong>
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <button
                  onClick={() => handleTrack()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E6D9C9] text-xs font-sans text-[#5B0F18] hover:bg-white transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <span className="text-[11px] text-[#8B8178] font-sans">
                  Origin: Surat Vault, Gujarat
                </span>
              </div>
            </div>

            {/* Out for Delivery Live Alert Banner */}
            {isOutForDelivery && (
              <div className="bg-gradient-to-br from-[#0F291E] via-[#14231B] to-[#0D1812] border border-emerald-500/40 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden mb-8 animate-fade-in">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Truck className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                          Out for Delivery Today
                        </span>
                        <span className="text-xs text-white/70 font-sans">
                          Expected Delivery: <strong className="text-white">Today by 7:00 PM</strong>
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-white mt-1.5">
                        Your Package is Out for Delivery!
                      </h3>
                      <p className="text-xs text-white/80 font-sans mt-1 leading-relaxed">
                        The delivery partner has departed from the local logistics center and is
                        en route to deliver to <strong className="text-white">{tracking.recipientName}</strong> in{' '}
                        <strong className="text-white">{tracking.destinationCity}</strong>.
                      </p>

                      {/* Delivery Partner Details */}
                      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs font-sans text-white/80">
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          <span>
                            Delivery Executive:{' '}
                            <strong className="text-white">
                              {tracking.deliveryAssociate?.name || 'Vikram Sharma'}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-emerald-400" />
                          <a
                            href={`tel:${tracking.deliveryAssociate?.phone || '+919872104412'}`}
                            className="text-emerald-300 hover:underline font-mono"
                          >
                            {tracking.deliveryAssociate?.phone || '+91 98721 04412'}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Security OTP Code */}
                  <div className="bg-black/60 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 text-center md:text-right shrink-0 shadow-lg">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block mb-1">
                      DELIVERY SECURITY CODE
                    </span>
                    <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-widest text-white py-1">
                      {tracking.deliveryOtp || '4821'}
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
                          {tracking.estimatedDelivery || 'In 2–3 Days'}
                        </strong>
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white mt-1.5">
                      On Its Way to Your City
                    </h3>
                    <p className="text-xs text-white/80 font-sans mt-1 leading-relaxed">
                      Your handcrafted fragrance has departed from Surat and is traveling via express
                      logistics to {tracking.destinationCity}.
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
                      Delivered to {tracking.recipientName} in {tracking.destinationCity}. Thank you
                      for choosing UNSULID!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Amazon / Flipkart Horizontal Progress Stepper */}
            <div className="mb-10 px-2 sm:px-6">
              <div className="relative">
                <div className="absolute top-5 left-6 right-6 h-1 bg-[#E6D9C9] -translate-y-1/2 z-0 hidden sm:block" />
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

            {/* Detailed Checkpoint Feed */}
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E6D9C9]">
                <h3 className="font-serif text-base font-semibold text-[#0B0B0B]">
                  Shipment Checkpoints &amp; Transit Log
                </h3>
                <span className="text-[11px] font-sans text-[#8B8178]">
                  {trackingEvents.length} Events Verified
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
                              Active
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
      </Container>
    </div>
  );
}
