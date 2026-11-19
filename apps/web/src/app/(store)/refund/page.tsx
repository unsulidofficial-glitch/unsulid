import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { RotateCcw, PackageCheck, AlertTriangle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Refund & Return Policy | UNSULID® Fine Fragrances',
  description:
    'UNSULID Return & Replacement Policy. 100% Authenticity Guarantee and transit damage resolution charter.',
};

export default function RefundPage() {
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
            <RotateCcw className="w-4 h-4" />
            <span>Customer Satisfaction Charter</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B0B0B] tracking-tight mb-4">
            Refund &amp; Return Policy
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#7A6E64] leading-relaxed max-w-2xl">
            Because personal luxury fragrances represent intimate sensory rituals, our return charter balances personal hygiene standards with uncompromising customer care.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 font-sans text-sm text-[#0B0B0B]/85 leading-relaxed">
          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <PackageCheck className="w-5 h-5 text-[#C6A15B]" />
              1. Damaged or Defective Deliveries
            </h2>
            <p className="mb-3 text-[#7A6E64]">
              Every UNSULID parcel is packaged in rigid, foam-cushioned luxury presentation boxes sealed at our Surat distribution hub. In the rare event that your shipment arrives with outer transit damage, atomizer failure, or spillage:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#7A6E64] mb-3">
              <li>Notify our concierge within <strong>48 hours</strong> of parcel receipt.</li>
              <li>Share an unboxing photograph or short video highlighting the damaged seal/bottle.</li>
              <li>An express replacement unit will be dispatched immediately via BlueDart Air at zero cost.</li>
            </ul>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-[#C6A15B]" />
              2. Hygiene &amp; Olfactory Integrity
            </h2>
            <p className="mb-3 text-[#7A6E64]">
              In accordance with international cosmetic hygiene standards, fragrance bottles that have been unsealed or sprayed cannot be accepted for resale or return based on subjective scent preference.
            </p>
            <p className="text-[#7A6E64]">
              Unopened, sealed boxes retaining original shrink-wrap and tamper-evident seals may be returned within <strong>7 days</strong> of delivery for store credit or refund.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <RotateCcw className="w-5 h-5 text-[#C6A15B]" />
              3. Refund Processing
            </h2>
            <p className="mb-3 text-[#7A6E64]">
              Approved refunds are credited directly back to the original source:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#7A6E64]">
              <li><strong>Prepaid Orders (Razorpay):</strong> Reversal appears in your bank account / UPI within 5–7 business days.</li>
              <li><strong>Cash on Delivery (COD):</strong> Bank transfer (NEFT/IMPS) processed upon verifying beneficiary account details.</li>
            </ul>
          </section>
        </div>
      </Container>
    </div>
  );
}

