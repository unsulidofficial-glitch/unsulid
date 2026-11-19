import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Moon } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

export interface OccasionCardItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  ctaText: string;
  href: string;
  image: string;
  accent: 'burgundy' | 'dark';
}

const occasionCards: OccasionCardItem[] = [
  {
    id: 'everyday-occasion',
    tag: 'DAY RITUAL',
    title: 'EVERYDAY FRAGRANCES',
    description: 'Your signature for everyday confidence.',
    ctaText: 'Explore HIGH CLASS',
    href: '/product/high-class',
    image: '/images/collections/everyday.svg',
    accent: 'burgundy',
  },
  {
    id: 'party-occasion',
    tag: 'NOCTURNAL STATEMENT',
    title: 'PARTY & EVENING',
    description: 'Make every entrance unforgettable.',
    ctaText: 'Explore BLACK',
    href: '/product/black',
    image: '/images/collections/party.svg',
    accent: 'dark',
  },
];

export interface ShopByOccasionProps {
  className?: string;
}

export const ShopByOccasion: React.FC<ShopByOccasionProps> = ({ className }) => {
  return (
    <section
      aria-label="Shop Fragrance By Occasion"
      className={cn('w-full section-padding bg-brand-cream border-t border-brand-border/40', className)}
    >
      <Container>
        <SectionHeading
          eyebrow="TAILORED OCCASIONS"
          title="Find Your Moment"
          highlightWord="Moment"
          description="Curated for the rhythms of modern life—from morning composure in academic and professional spaces to magnetic evening celebration."
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
          {occasionCards.map((card) => {
            const isDark = card.accent === 'dark';

            return (
              <Link
                key={card.id}
                href={card.href}
                className={cn(
                  'group relative overflow-hidden rounded-luxury border transition-all duration-500 ease-out flex flex-col justify-end p-6 sm:p-8 min-h-[380px] sm:min-h-[440px] shadow-sm hover:shadow-luxury-hover block cursor-pointer',
                  isDark
                    ? 'border-brand-border-dark bg-brand-black'
                    : 'border-brand-border bg-gradient-to-br from-brand-burgundy to-brand-burgundy-dark'
                )}
              >
                {/* Background Image Container */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80"
                />

                {/* Atmospheric Dark Gradient Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-300',
                    isDark
                      ? 'bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent'
                      : 'bg-gradient-to-t from-brand-burgundy-dark via-brand-burgundy/60 to-transparent'
                  )}
                />

                {/* Top Tag */}
                <div className="absolute top-5 left-5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-sans font-semibold tracking-widest text-brand-gold uppercase">
                  {isDark ? (
                    <Moon className="w-3 h-3 text-brand-gold" />
                  ) : (
                    <Sparkles className="w-3 h-3 text-brand-gold" />
                  )}
                  <span>{card.tag}</span>
                </div>

                {/* Bottom Content Body */}
                <div className="relative z-10 flex flex-col items-start text-left">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                    {card.title}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-brand-cream/80 mt-2 max-w-sm leading-relaxed">
                    {card.description}
                  </p>

                  <div className="mt-6 pt-4 border-t border-white/15 w-full flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans font-semibold tracking-wider text-white group-hover:text-brand-gold uppercase transition-colors">
                      <span>{card.ctaText}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </span>

                    <span className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center group-hover:bg-brand-gold group-hover:text-brand-black transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ShopByOccasion;

