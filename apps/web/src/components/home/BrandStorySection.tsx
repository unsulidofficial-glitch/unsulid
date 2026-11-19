import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface BrandStorySectionProps {
  heading?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  imageSrc?: string;
  className?: string;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({
  heading = 'More Than a Fragrance. An Identity.',
  description = 'At UNSULID, we believe fragrance is more than something you wear. It is an expression of personality, presence, and individuality.',
  ctaText = 'Discover Our Story',
  ctaHref = '/about',
  imageSrc = '/images/banners/brand-story.svg',
  className,
}) => {
  return (
    <section
      aria-label="Brand Story"
      className={cn(
        'w-full section-padding bg-brand-cream border-t border-brand-border/40 overflow-hidden',
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Editorial Image Side */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-luxury overflow-hidden shadow-2xl border border-brand-border/60 bg-brand-black group">
              <Image
                src={imageSrc}
                alt="UNSULID Editorial Fragrance Philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
              />

              {/* Inset Vignette Frame */}
              <div className="absolute inset-0 border border-brand-gold/20 m-3 rounded-[2px] pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded bg-brand-black/80 backdrop-blur-md border border-white/10 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="text-[11px] font-sans text-brand-cream tracking-wide">
                  Affordable Premium Luxury • Curated for India
                </span>
              </div>
            </div>
          </div>

          {/* Story Copy Side */}
          <div className="lg:col-span-7 flex flex-col items-start text-left max-w-xl">
            <span className="text-luxury text-brand-burgundy mb-3">
              THE PHILOSOPHY
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-brand-black leading-[1.15] mb-6">
              More Than a Fragrance.{' '}
              <span className="italic font-normal text-brand-burgundy">
                An Identity.
              </span>
            </h2>

            <p className="font-sans text-sm sm:text-base text-brand-muted leading-relaxed mb-6">
              {description}
            </p>

            <p className="font-sans text-xs sm:text-sm text-brand-muted/90 leading-relaxed mb-8">
              We set out to challenge the compromise between mass-produced body sprays and inaccessible international designer markup. With high-density formulation, weighted architectural flacons, and distinct daytime and nocturnal profiles, UNSULID delivers the complete luxury ritual to your daily life.
            </p>

            {/* Principles Pills */}
            <div className="grid grid-cols-2 gap-4 w-full mb-8 pt-6 border-t border-brand-border/50">
              <div className="flex flex-col">
                <span className="font-serif text-lg text-brand-black">Dual Signatures</span>
                <span className="text-xs text-brand-muted mt-0.5">HIGH CLASS &amp; BLACK</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg text-brand-black">Tactile Luxury</span>
                <span className="text-xs text-brand-muted mt-0.5">Heavy Glass &amp; Unboxing</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              href={ctaHref}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BrandStorySection;

