import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | UNSULID® Fine Fragrances',
  description:
    'UNSULID Privacy Policy. Understand how we protect your customer data, secure transactions, and maintain absolute confidentiality.',
};

export default function PrivacyPage() {
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
            <ShieldCheck className="w-4 h-4" />
            <span>UNSULID® Privacy Charter</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B0B0B] tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#7A6E64] leading-relaxed max-w-2xl">
            Effective Date: November 2026. At UNSULID, safeguarding your privacy and personal data is as essential as the precision of our fragrance formulations.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 font-sans text-sm text-[#0B0B0B]/85 leading-relaxed">
          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <Eye className="w-5 h-5 text-[#C6A15B]" />
              1. Information We Collect
            </h2>
            <p className="mb-4">
              When you interact with the UNSULID digital storefront, we collect information necessary to fulfill your fragrance orders and provide personalized concierge support:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#7A6E64]">
              <li>
                <strong className="text-[#0B0B0B]">Authentication Data:</strong> Mobile phone numbers for 6-digit OTP dispatch and verification. We do not store plain-text OTPs; hashes are ephemeral and expire in 5 minutes.
              </li>
              <li>
                <strong className="text-[#0B0B0B]">Delivery Information:</strong> Full name, shipping address, landmark, PIN code, and contact coordinates for Shiprocket Surat logistics.
              </li>
              <li>
                <strong className="text-[#0B0B0B]">Order &amp; Transaction Details:</strong> Products purchased (HIGH CLASS, BLACK), quantities, coupon redemptions, and payment method selected (Prepaid via Razorpay or COD).
              </li>
              <li>
                <strong className="text-[#0B0B0B]">Technical Telemetry:</strong> Device identifiers, browser type, and anonymous session telemetry for performance optimization.
              </li>
            </ul>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#C6A15B]" />
              2. Payment &amp; Financial Security
            </h2>
            <p className="mb-3 text-[#7A6E64]">
              UNSULID does not store, process, or transmit credit card numbers, debit card details, or UPI MPINs on our servers.
            </p>
            <p className="text-[#7A6E64]">
              All digital transactions are encrypted via TLS 1.3 and processed directly through Razorpay, a PCI-DSS Level 1 compliant gateway. Cash on Delivery (COD) transactions are validated through one-time authentication prior to dispatch from our Surat distribution studio.
            </p>
          </section>

          <section className="bg-white/70 backdrop-blur-sm border border-[#E6D9C9] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl text-[#5B0F18] font-normal mb-3 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#C6A15B]" />
              3. Data Retention &amp; Customer Rights
            </h2>
            <p className="mb-3 text-[#7A6E64]">
              You hold complete sovereignty over your profile. At any time, you may request:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#7A6E64] mb-4">
              <li>A complete export of your order history and saved delivery addresses.</li>
              <li>Immediate rectification of your profile name, contact email, or delivery destinations.</li>
              <li>Erasure of your customer profile subject to statutory tax and invoice retention obligations.</li>
            </ul>
            <p className="text-xs text-[#7A6E64] italic">
              For privacy inquiries, contact our Data Protection Concierge at <span className="text-[#5B0F18] font-semibold">concierge@unsulid.com</span> or via the Surat Fragrance Studio care desk.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}

