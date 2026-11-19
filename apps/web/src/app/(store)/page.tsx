import React from 'react';
import type { Metadata } from 'next';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import HeroSection from '@/components/home/HeroSection';
import ValueProposition from '@/components/home/ValueProposition';
import CollectionsSection from '@/components/home/CollectionsSection';
import BestsellersSection from '@/components/home/BestsellersSection';
import ShopByOccasion from '@/components/home/ShopByOccasion';
import BrandStorySection from '@/components/home/BrandStorySection';
import ComingSoonSection from '@/components/home/ComingSoonSection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'UNSULID® Fine Fragrances | Luxury Perfumes',
  description:
    'Experience UNSULID®: Affordable premium luxury fragrances. Discover our inaugural perfumes HIGH CLASS and BLACK, crafted for everyday presence and evening celebration.',
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F1E7] text-[#0B0B0B] selection:bg-[#5B0F18] selection:text-[#F8F1E7] w-full max-w-full overflow-x-hidden">
      {/* SECTION 1: TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar message="Free Shipping on Orders Above ₹999 | 100% Authentic Fragrances" />

      {/* SECTION 2: BURGUNDY LUXURY HEADER */}
      <Header />

      {/* MAIN VIEWPORT FLOW */}
      <main id="main-content" className="flex-1 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden">
        {/* SECTION 3: HERO CAMPAIGN (Scents That Define Your Presence.) */}
        <HeroSection />

        {/* SECTION 4: VALUE PROPOSITION (5 Benefit Guarantees) */}
        <ValueProposition />

        {/* SECTION 5: EXPLORE OUR COLLECTIONS (Men's, Women's, Unisex, New Arrivals) */}
        <CollectionsSection />

        {/* SECTION 6: BESTSELLERS SHOWCASE (HIGH CLASS & BLACK Launch Edition with Category Pills) */}
        <BestsellersSection />

        {/* SECTION 7: SHOP BY OCCASION (Find Your Moment - Everyday & Party/Evening) */}
        <ShopByOccasion />

        {/* SECTION 8: BRAND STORY (More Than a Fragrance. An Identity.) */}
        <BrandStorySection />

        {/* SECTION 9: COMING SOON (THE PRIVATE VAULT) */}
        <ComingSoonSection />

        {/* SECTION 10: NEWSLETTER (The Privileged Circle) */}
        <NewsletterSection />
      </main>

      {/* SECTION 11: LUXURY FOOTER */}
      <Footer />

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <BottomNav />
    </div>
  );
}
