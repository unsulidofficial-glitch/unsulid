import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroSectionProps {
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section
      aria-label="Hero Showcase"
      className={cn('relative w-full overflow-hidden', className)}
    >
      {/* ================================================================
          DESKTOP HERO — NyroScents-style split layout
          Text LEFT on dark burgundy | Perfume bottles RIGHT (banner image)
          ================================================================ */}
      <div
        className="hidden lg:block relative w-full min-h-[560px] xl:min-h-[640px]"
        style={{ background: '#460910' }}
      >
        {/* Full-bleed hero banner — both bottles appear on the right half */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/banners/hero-desktop-4k.jpg"
            alt="UNSULID HIGH CLASS and BLACK Eau de Parfum on marble"
            fill
            priority
            unoptimized
            className="object-cover object-center select-none"
          />
          {/* Strong left-side gradient so the HTML text panel is always readable */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, #460910 0%, #460910 32%, rgba(70,9,16,0.90) 46%, rgba(70,9,16,0.50) 60%, rgba(70,9,16,0.10) 78%, transparent 92%)',
            }}
          />
          {/* Bottom edge fade into cream background */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{ background: 'linear-gradient(to top, #460910 0%, transparent 100%)' }}
          />
        </div>

        {/* HTML Text content — LEFT panel */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 xl:px-12 2xl:px-20 flex items-center min-h-[560px] xl:min-h-[640px] py-16">
          <div className="flex flex-col items-start max-w-[460px]">
            {/* Category eyebrow — gold, uppercase tracking */}
            <span className="text-[11px] font-sans uppercase tracking-[0.28em] text-[#C6A15B] font-semibold mb-4 block">
              LUXURY FRAGRANCES
            </span>

            {/* Main headline */}
            <h1 className="font-serif text-[2.6rem] xl:text-[3.1rem] text-white font-normal leading-[1.1] mb-5">
              Signature Scents for{' '}
              <span className="italic font-normal text-[#F8F1E7]">Every Mood</span>
            </h1>

            {/* Gold accent divider */}
            <div className="w-12 h-[1.5px] bg-[#C6A15B] mb-5" />

            {/* Body copy */}
            <p className="font-sans text-sm xl:text-[15px] text-white/85 leading-relaxed mb-9 max-w-[380px]">
              Premium, long-lasting perfumes crafted for those who leave a lasting impression.
            </p>

            {/* CTA Buttons — matching NyroScents reference */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#F8F1E7] text-[#0B0B0B] font-sans text-sm font-semibold hover:bg-white transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 select-none"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-transparent border border-white/40 text-white font-sans text-sm font-medium hover:border-white hover:bg-white/10 transition-all select-none"
              >
                <div className="w-5 h-5 rounded-full border border-white/80 flex items-center justify-center shrink-0">
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                </div>
                <span>Discover Our Story</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          MOBILE HERO — Use the pre-designed mobile hero image as-is
          (hero-mobile-4k.jpg already has text, bottles, and button designs baked in)
          Add transparent clickable overlays over the button regions
          ================================================================ */}
      <div
        className="block lg:hidden relative w-full overflow-hidden bg-[#460910]"
      >
        {/* Hidden semantic content for screen readers & SEO */}
        <div className="sr-only">
          <span>DISCOVER UNSULID</span>
          <h1>Signature Scents for Every Mood</h1>
          <p>Premium, long-lasting perfumes crafted for those who leave a lasting impression.</p>
          <p>Featuring UNSULID HIGH CLASS and BLACK, Eau de Parfum 50ml.</p>
        </div>

        {/* Full-bleed mobile hero image — fixed aspect ratio container */}
        <div
          className="relative w-full"
          style={{ aspectRatio: '682 / 1024' }}
        >
          <Image
            src="/images/banners/hero-mobile-4k.jpg"
            alt="UNSULID Luxury Fragrances – Signature Scents for Every Mood (HIGH CLASS & BLACK)"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-top select-none w-full h-full"
          />

          {/* Transparent click overlay — "Explore Collection" button region in the image */}
          <Link
            href="/shop"
            aria-label="Shop Collection"
            className="absolute z-10 inset-x-[12%] rounded-full transition-all duration-200 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] cursor-pointer"
            style={{ top: '75.5%', height: '7%' }}
          >
            <span className="sr-only">Shop Collection</span>
          </Link>

          {/* Transparent click overlay — "Our Story" button region in the image */}
          <Link
            href="/about"
            aria-label="Discover Our Story"
            className="absolute z-10 inset-x-[12%] rounded-full transition-all duration-200 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A15B] cursor-pointer"
            style={{ top: '84%', height: '7%' }}
          >
            <span className="sr-only">Discover Our Story</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
