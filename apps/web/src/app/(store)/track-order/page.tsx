'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Truck, ArrowRight, Package, CheckCircle2, AlertCircle } from 'lucide-react';
import Container from '@/components/ui/Container';
import { api } from '@/lib/api';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [tracking, setTracking] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setTracking(null);

    try {
      const res = await api.orders.tracking(orderNumber.trim());
      if (res?.tracking) {
        setTracking(res.tracking);
      } else {
        setError('No tracking information found for this order.');
      }
    } catch (err: any) {
      setError(
        'Unable to locate tracking details. Please ensure you are logged into your account or verify the order reference.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 lg:py-20 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[10px] uppercase font-sans tracking-[0.28em] text-[#C6A15B] font-bold block mb-2">
            UNSULID® LOGISTICS
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal mb-3">
            Track Your Fragrance
          </h1>
          <p className="text-xs sm:text-sm text-[#8B8178] font-sans max-w-md mx-auto">
            Enter your order reference number to follow your handcrafted batch on its journey from our Surat facility to your doorstep.
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
                  className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl py-3 pl-11 pr-4 font-mono text-sm uppercase text-[#0B0B0B] placeholder:text-[#8B8178]/50 focus:outline-none focus:border-[#5B0F18]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !orderNumber.trim()}
              className="w-full py-3.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>{loading ? 'Locating Shipment...' : 'Track Live Shipment'}</span>
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

        {/* Tracking Result View */}
        {tracking && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-lg animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6D9C9] mb-6">
              <div>
                <span className="text-[10px] uppercase font-sans tracking-widest text-[#C6A15B] font-bold block mb-1">
                  SHIPMENT STATUS: {tracking.orderStatus}
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#0B0B0B]">
                  {tracking.orderNumber}
                </h2>
                <p className="text-xs text-[#8B8178] font-sans mt-0.5">
                  Courier: <strong>{tracking.courierName}</strong> • AWB:{' '}
                  <strong className="font-mono text-[#5B0F18]">{tracking.awbNumber}</strong>
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-sans font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Surat Dispatch Origin
              </span>
            </div>

            {/* Stepper Events */}
            <div className="space-y-4 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6D9C9]">
              {tracking.events?.map((ev: any, idx: number) => (
                <div key={idx} className="relative text-xs font-sans">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#5B0F18] ring-4 ring-white" />
                  <div className="flex justify-between items-baseline">
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
      </Container>
    </div>
  );
}

