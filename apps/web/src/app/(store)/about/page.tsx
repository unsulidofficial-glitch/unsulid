import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { Sparkles, Shield, Heart, Award, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Our Story & Philosophy | UNSULID® Fine Fragrances',
  description:
    'Discover the story of UNSULID: Accessible luxury perfumes engineered for modern self-expression, blended with master perfume oils in Surat, India.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-[#F8F1E7] text-[#0B0B0B] py-12 sm:py-16">
      <Container>
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The UNSULID® Philosophy</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#0B0B0B] tracking-tight mb-6">
            More Than a Fragrance.{' '}
            <span className="text-[#5B0F18] italic block sm:inline">An Identity.</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#7A6E64] leading-relaxed">
            Founded with a singular conviction: that true olfactory luxury should not be gated behind prohibitive markup, European middlemen, or generic mass-market scents. We craft high-concentration perfumes designed specifically to endure the vibrant Indian climate.
          </p>
        </div>

        {/* Story Section with Visual Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#460910] text-white p-8 sm:p-14 mb-16 shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-2 font-sans">
              Surat Fragrance Atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal mb-4">
              Formulated Where Heritage Meets Modern Precision
            </h2>
            <p className="font-sans text-xs sm:text-sm text-white/85 leading-relaxed mb-6">
              Our central atelier in Surat, Gujarat serves as our creative laboratory, batch testing studio, and logistics dispatch hub. Every bottle of <strong className="text-white">HIGH CLASS</strong> and <strong className="text-white">BLACK</strong> is macerated for a minimum of 45 days, allowing delicate top notes and deep balsamic resins to marry harmoniously.
            </p>
            <div className="flex items-center gap-6 text-xs font-sans text-[#F8F1E7]">
              <div>
                <strong className="font-serif text-2xl text-[#C6A15B] block">18%</strong>
                <span>Oil Concentration (EDP)</span>
              </div>
              <div className="w-[1px] h-8 bg-white/20" />
              <div>
                <strong className="font-serif text-2xl text-[#C6A15B] block">100%</strong>
                <span>IFRA Certified Oils</span>
              </div>
              <div className="w-[1px] h-8 bg-white/20" />
              <div>
                <strong className="font-serif text-2xl text-[#C6A15B] block">0%</strong>
                <span>Harsh Synthetics</span>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#C6A15B_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-[#E6D9C9] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F1E7] text-[#5B0F18] flex items-center justify-center mb-5">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#0B0B0B] font-medium mb-2">
              IFRA Certified Safety
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#7A6E64] leading-relaxed">
              We adhere strictly to International Fragrance Association guidelines, ensuring skin-safe elegance without phthalates, synthetic parabens, or animal testing.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E6D9C9] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F1E7] text-[#5B0F18] flex items-center justify-center mb-5">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#0B0B0B] font-medium mb-2">
              Engineered Longevity
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#7A6E64] leading-relaxed">
              Formulated specifically for tropical warmth and humidity. Our fixatives hold fast for 12+ hours without turning sour or disappearing on skin.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E6D9C9] shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F1E7] text-[#5B0F18] flex items-center justify-center mb-5">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#0B0B0B] font-medium mb-2">
              Accessible Luxury
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#7A6E64] leading-relaxed">
              By removing luxury department markups and licensing middlemen, we deliver bespoke international fragrance standards directly to your doorstep.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-3xl p-10 border border-[#E6D9C9] max-w-2xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-normal mb-3">
            Experience the Inaugural Duo
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#7A6E64] leading-relaxed mb-6">
            Discover HIGH CLASS for daytime presence and BLACK for midnight allure.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/shop"
              className="px-7 py-3 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-xs font-sans font-semibold hover:bg-[#741522] transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3 rounded-full bg-transparent border border-[#0B0B0B] text-[#0B0B0B] text-xs font-sans font-semibold hover:bg-[#0B0B0B] hover:text-white transition-colors"
            >
              Contact Atelier
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
