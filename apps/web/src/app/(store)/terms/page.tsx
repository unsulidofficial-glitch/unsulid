import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { Scale, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | UNSULID® Fine Fragrances',
  description:
    'UNSULID Terms & Conditions. Operating agreements, order acceptance, intellectual property, and luxury standards.',
};

export default function TermsPage() {
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
            <Scale className="w-4 h-4" />
            <span>Operating Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B0B0B] tracking-tight mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#7A6E64] leading-relaxed max-w-2xl">
            Welcome to UNSULID®. By browsing our boutique storefront or purchasing our fragrances, you agree to these terms governed under the laws of Gujarat, India.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-10 font-sans text-sm text-[#0B0B0B]/85 leading-relaxed">
          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#C6A15B]" />
              1. Boutique Orders &amp; Contract Acceptance
            </h2>
            <p className="mb-3 text-[#7A6E64]">
              Receipt of an order confirmation number (e.g. <span className="font-mono text-[#5B0F18] font-semibold">UNS-2026-XXXX</span>) signifies acknowledgement of your order. UNSULID reserves the prerogative to accept or decline any order in circumstances including, but not limited to, inventory allocation, verification discrepancies, or unserviceable postal codes.
            </p>
            <p className="text-[#7A6E64]">
              Each bottle of <strong className="text-[#0B0B0B]">HIGH CLASS</strong> and <strong className="text-[#0B0B0B]">BLACK</strong> is batch-inspected prior to sealing. Orders are non-transferable once processed for Surat factory dispatch.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#C6A15B]" />
              2. Transparent Pricing &amp; Promotional Codes
            </h2>
            <p className="mb-3 text-[#7A6E64]">
              All fragrance prices are quoted in Indian Rupees (₹) and are inclusive of applicable Goods and Services Tax (GST). Promotional coupons (such as <span className="font-mono text-[#5B0F18]">WELCOME10</span>) must be applied at checkout prior to final settlement.
            </p>
            <p className="text-[#7A6E64]">
              Cash on Delivery (COD) carries a nominal handling fee of ₹50 to cover secure courier currency handling. Orders eligible for complimentary shipping (subtotals of ₹999 or greater) will reflect free delivery automatically.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#C6A15B]" />
              3. Intellectual Property Rights
            </h2>
            <p className="text-[#7A6E64]">
              The trademarks <strong className="text-[#0B0B0B]">UNSULID®</strong>, <strong className="text-[#0B0B0B]">HIGH CLASS</strong>, <strong className="text-[#0B0B0B]">BLACK</strong>, our signature flacon designs, visual assets, olfactory formulations, and brand aesthetics are protected proprietary assets. Unauthorized reproduction, commercial distribution, or imitation is strictly prohibited.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}

