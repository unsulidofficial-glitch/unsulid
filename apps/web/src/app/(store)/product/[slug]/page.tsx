import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import Container from '@/components/ui/Container';
import NewsletterSection from '@/components/home/NewsletterSection';
import ProductGallery from '@/components/products/ProductGallery';
import ProductPurchasePanel from '@/components/products/ProductPurchasePanel';
import StickyMobileAddToCart from '@/components/products/StickyMobileAddToCart';
import ProductStorySection from '@/components/products/ProductStorySection';
import ProductPresentationSection from '@/components/products/ProductPresentationSection';
import ProductPoliciesSection from '@/components/products/ProductPoliciesSection';
import ProductFAQSection from '@/components/products/ProductFAQSection';
import RelatedFragranceSection from '@/components/products/RelatedFragranceSection';
import { getProductBySlug, getAllProductSlugs } from '@/data/products';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return getAllProductSlugs().map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return {
      title: 'Product Not Found | UNSULID®',
    };
  }

  const title = `${product.name} Eau de Parfum 50ml | UNSULID® Fine Fragrances`;
  const description = `${product.description} ${product.brandPositioning}`;
  const url = `https://unsulid.com/product/${product.slug}`;
  const ogImage = product.gallery[0]?.src || '/images/banners/hero-desktop-4k.jpg';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'UNSULID® Fine Fragrances',
      images: [
        {
          url: ogImage,
          width: 1000,
          height: 1250,
          alt: `${product.name} 50ml Eau de Parfum Flacon`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  // Schema.org structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `UNSULID ${product.name} 50ml Eau de Parfum`,
    image: product.gallery.map((g) => `https://unsulid.com${g.src}`),
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'UNSULID',
    },
    category: product.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: '0',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F1E7] text-[#0B0B0B] selection:bg-[#5B0F18] selection:text-[#F8F1E7] w-full max-w-full overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* TOP ANNOUNCEMENT BAR */}
      <AnnouncementBar message="Discover the world of UNSULID | Complimentary Pan-India Delivery" />

      {/* BURGUNDY LUXURY HEADER */}
      <Header />

      {/* MAIN VIEWPORT FLOW */}
      <main id="main-content" className="flex-1 flex flex-col w-full max-w-full min-w-0 overflow-x-hidden">
        {/* Breadcrumb Navigation Bar */}
        <div className="w-full bg-[#F4EDE2] border-b border-[#E6D9C9] py-3 text-xs font-sans text-[#7A6E64]">
          <Container>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
              <Link href="/" className="hover:text-[#5B0F18] transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              <Link href="/shop" className="hover:text-[#5B0F18] transition-colors">
                Shop Fragrances
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
              <span className="text-[#0B0B0B] font-semibold">
                {product.name}
              </span>
            </nav>
          </Container>
        </div>

        {/* PRIMARY PRODUCT SHOWCASE (2-Column Desktop Grid / Stacked Mobile) */}
        <section aria-label="Product Showcase" className="w-full py-8 sm:py-14 bg-[#FAF5EE]">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start max-w-7xl mx-auto">
              {/* Left Column: Interactive Product Gallery (7 cols on lg) */}
              <div className="lg:col-span-7 w-full">
                <ProductGallery
                  images={product.gallery}
                  productName={product.name}
                />
              </div>

              {/* Right Column: Sticky Product Purchase Panel (5 cols on lg) */}
              <div className="lg:col-span-5 w-full lg:sticky lg:top-24">
                <ProductPurchasePanel product={product} />
              </div>
            </div>
          </Container>
        </section>

        {/* EDITORIAL OLFACTORY STORY */}
        <ProductStorySection product={product} />

        {/* CRAFTSMANSHIP & PRESENTATION */}
        <ProductPresentationSection product={product} />

        {/* BRAND POLICIES & CONCIERGE ASSURANCE */}
        <ProductPoliciesSection themeMode={product.palette.themeMode} />

        {/* FREQUENTLY ASKED QUESTIONS */}
        <ProductFAQSection
          faqs={product.faqs}
          productName={product.name}
          themeMode={product.palette.themeMode}
        />

        {/* SCENT WARDROBE PARTNER (LINKING HIGH CLASS & BLACK) */}
        <RelatedFragranceSection currentProduct={product} />

        {/* VIP NEWSLETTER */}
        <NewsletterSection />
      </main>

      {/* MOBILE STICKY ADD TO CART BAR */}
      <StickyMobileAddToCart product={product} />

      {/* LUXURY FOOTER */}
      <Footer />

      {/* MOBILE BOTTOM NAVIGATION DOCK */}
      <BottomNav />
    </div>
  );
}
