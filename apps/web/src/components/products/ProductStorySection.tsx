import React from 'react';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import { ProductDetailData } from '@/data/products';
import { Sparkles, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductStorySectionProps {
  product: ProductDetailData;
  className?: string;
}

export const ProductStorySection: React.FC<ProductStorySectionProps> = ({
  product,
  className,
}) => {
  const isBlack = product.slug === 'black';

  return (
    <section
      aria-label={`${product.name} Olfactory Story`}
      className={cn(
        'w-full py-16 sm:py-24 border-t',
        isBlack
          ? 'bg-[#0B0B0B] text-[#F8F1E7] border-white/10'
          : 'bg-[#F4ECE1] text-[#0B0B0B] border-[#E6D9C9]',
        className
      )}
    >
      <Container>
        {/* Top Eyebrow & Title */}
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <span
            className={cn(
              'text-xs font-sans uppercase tracking-[0.25em] font-semibold block mb-3',
              isBlack ? 'text-[#C6A15B]' : 'text-[#5B0F18]'
            )}
          >
            {product.story.eyebrow}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight leading-tight">
            {product.story.title}
          </h2>
        </div>

        {/* 2-Column Editorial Grid: Image & Story Prose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto mb-16">
          {/* Editorial Scene Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <Image
                src={product.gallery[3]?.src || product.gallery[0].src}
                alt={`${product.name} Editorial Scene`}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Decorative Inset Frame */}
              <div className="absolute inset-0 border border-[#C6A15B]/30 m-3 rounded-xl pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-xs text-[#F8F1E7]">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                <span className="font-sans tracking-wide">
                  {product.category} • {product.brandPositioning}
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Prose & Identity Pillars */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <div className="flex flex-col gap-5 text-sm sm:text-base leading-relaxed font-sans opacity-90 mb-8">
              {product.story.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* 3 Lifestyle Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-current/15 mb-8">
              {product.story.pillars.map((pillar, idx) => (
                <div key={idx} className="flex flex-col">
                  <span
                    className={cn(
                      'font-serif text-base sm:text-lg mb-1',
                      isBlack ? 'text-white' : 'text-[#0B0B0B]'
                    )}
                  >
                    {pillar.title}
                  </span>
                  <span className="text-xs font-sans opacity-75 leading-relaxed">
                    {pillar.desc}
                  </span>
                </div>
              ))}
            </div>

            {/* Editorial Quote */}
            <blockquote
              className={cn(
                'relative p-5 rounded-xl border flex items-start gap-3.5 italic font-serif text-base sm:text-lg leading-snug',
                isBlack
                  ? 'bg-white/5 border-white/10 text-[#F8F1E7]'
                  : 'bg-white/60 border-[#E6D9C9] text-[#5B0F18]'
              )}
            >
              <Quote className="w-5 h-5 shrink-0 opacity-60 mt-0.5" />
              <p>{product.story.quote}</p>
            </blockquote>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductStorySection;

