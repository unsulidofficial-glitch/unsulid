import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Fragrance Collections | UNSULID® Fine Fragrances',
  description:
    'Explore UNSULID fragrance collections: Men’s, Women’s, Unisex, and New Arrivals. Crafted with IFRA-compliant master perfume oils in Surat, India.',
};

const collections = [
  {
    slug: 'mens',
    title: "Men's Collection",
    subtitle: 'Commanding • Structured • Magnetic',
    description:
      'Fragrances designed with crisp bergamot, cedarwood, smoky amber, and leather accords for the assertive gentleman.',
    image: '/images/collections/col-mens.jpg',
    featuredPerfumes: ['HIGH CLASS', 'BLACK'],
    tag: 'Active Release',
  },
  {
    slug: 'womens',
    title: "Women's Collection",
    subtitle: 'Luminous • Elegant • Enveloping',
    description:
      'Luminous floral bouquets, velvet rose, white jasmine, and creamy vanilla musk tailored for sophisticated daily wear and gala evenings.',
    image: '/images/collections/col-womens.jpg',
    featuredPerfumes: ['HIGH CLASS (Allure Edition)', 'VELVET ROSE (Vault)'],
    tag: 'Trending',
  },
  {
    slug: 'unisex',
    title: 'Unisex Collection',
    subtitle: 'Genderless • Boundary-Breaking • Niche',
    description:
      'Artisanal formulations that transcend traditional boundaries. Balanced between citrus freshness and dark resinous depth.',
    image: '/images/collections/col-unisex.jpg',
    featuredPerfumes: ['HIGH CLASS', 'BLACK', 'ROYAL OUD'],
    tag: 'Signature Choice',
  },
  {
    slug: 'new',
    title: 'New Arrivals & Vault',
    subtitle: 'Debut Launches • Limited Edition',
    description:
      'Our inaugural launch perfumes HIGH CLASS and BLACK, alongside confidential previews from The Private Vault.',
    image: '/images/collections/col-new.jpg',
    featuredPerfumes: ['HIGH CLASS (50ml)', 'BLACK (50ml)'],
    tag: 'NEW LAUNCH',
  },
];

export default function CollectionsPage() {
  return (
    <div className="w-full bg-[#F8F1E7] text-[#0B0B0B] py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Olfactory Realms</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B0B0B] tracking-tight mb-4">
            Explore Our{' '}
            <span className="text-[#5B0F18] font-normal">Collections</span>
          </h1>
          <p className="font-sans text-sm sm:text-base text-[#7A6E64] leading-relaxed">
            Every collection is conceived as an emotional territory. From fresh morning clarity to midnight allure, discover the scent profile crafted for your presence.
          </p>
        </div>

        {/* Collection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/collections/${col.slug}`}
              className="group relative flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E6D9C9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image banner */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-brand-burgundy">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute top-4 right-4 bg-[#5B0F18] text-[#F8F1E7] text-[10px] font-sans font-semibold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  {col.tag}
                </span>
              </div>

              {/* Text content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#C6A15B] font-semibold block mb-1.5">
                    {col.subtitle}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-normal mb-3 group-hover:text-[#5B0F18] transition-colors">
                    {col.title}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#7A6E64] leading-relaxed mb-6">
                    {col.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E6D9C9] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {col.featuredPerfumes.map((p, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-sans font-medium bg-[#F8F1E7] text-[#5B0F18] px-2.5 py-1 rounded-full"
                      >
                        {p}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-sans font-semibold text-[#5B0F18] group-hover:translate-x-1 transition-transform">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
