import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { Truck, MapPin, Clock, ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Policy | UNSULID® Fine Fragrances',
  description:
    'UNSULID Shipping & Logistics Policy. Surat central hub dispatch, BlueDart Express Air timelines, and complimentary delivery thresholds.',
};

export default function ShippingPage() {
  return (
    <div className="w-full bg-[#F8F1E7] text-[#0B0B0B] py-12 sm:py-16">
      <Container className="max-w-4xl">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.2em] text-[#5B0F18] font-semibold hover:text-[#741522] mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </Link>

        {/* Page Header */}
        <div className="border-b border-[#E6D9C9] pb-8 mb-10">
          <div className="flex items-center gap-2 text-[#C6A15B] text-xs font-sans uppercase tracking-[0.25em] font-semibold mb-3">
            <Truck className="w-4 h-4" />
            <span>Pan-India Logistics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B0B0B] tracking-tight mb-4">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#7A6E64] leading-relaxed max-w-2xl">
            All UNSULID fragrances are blended, inspected, and dispatched directly from our state-of-the-art facility in Surat, Gujarat.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 font-sans text-sm text-[#0B0B0B]/85 leading-relaxed">
          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-[#C6A15B]" />
              1. Dispatch &amp; Delivery Timelines
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="p-4 rounded-xl bg-[#F8F1E7] border border-[#E6D9C9]">
                <span className="font-serif text-base font-medium text-[#5B0F18] block mb-1">
                  Metro Cities (Tier 1)
                </span>
                <p className="text-xs text-[#7A6E64]">
                  Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Ahmedabad: <strong>2 to 4 Business Days</strong>.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F8F1E7] border border-[#E6D9C9]">
                <span className="font-serif text-base font-medium text-[#5B0F18] block mb-1">
                  Rest of India (Tier 2 &amp; 3)
                </span>
                <p className="text-xs text-[#7A6E64]">
                  All serviceable regional pin codes: <strong>4 to 7 Business Days</strong> via surface express.
                </p>
              </div>
            </div>
            <p className="text-xs text-[#7A6E64]">
              Orders placed before 2:00 PM IST on business days are processed for same-day dispatch from our Surat warehouse.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
              2. Shipping Charges &amp; Complimentary Threshold
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-[#7A6E64]">
              <li>
                <strong className="text-[#0B0B0B]">Complimentary Shipping:</strong> All orders with a subtotal of <strong>₹999 or more</strong> qualify for free express shipping nationwide.
              </li>
              <li>
                <strong className="text-[#0B0B0B]">Standard Shipping:</strong> A flat delivery charge of ₹99 applies to orders below ₹999.
              </li>
              <li>
                <strong className="text-[#0B0B0B]">Cash on Delivery (COD):</strong> A nominal fee of ₹50 is applied to cover specialized courier cash remittance handling.
              </li>
            </ul>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-[#C6A15B]" />
              3. Live Surat Parcel Tracking
            </h2>
            <p className="mb-4 text-[#7A6E64]">
              Upon dispatch, a unique Shiprocket Air Waybill (AWB) is generated and linked to your order number (<span className="font-mono text-[#5B0F18]">UNS-2026-XXXX</span>). You can track your consignment in real time anytime using our online portal.
            </p>
            <Link
              href="/track-order"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-xs font-sans font-semibold hover:bg-[#741522] transition-colors shadow-sm"
            >
              <span>Track Your Consignment Now</span>
            </Link>
          </section>
        </div>
      </Container>
    </div>
  );
}

