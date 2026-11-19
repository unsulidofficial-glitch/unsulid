import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductDetailData } from '@/data/products';
import { cn } from '@/lib/utils';

export interface RelatedFragranceSectionProps {
  currentProduct: ProductDetailData;
  className?: string;
}

export const RelatedFragranceSection: React.FC<RelatedFragranceSectionProps> = ({
  currentProduct,
  className,
}) => {
  const counterpart = currentProduct.counterpart;
  const isDark = currentProduct.slug === 'black';

  return (
    <section
      aria-label="The Scent Wardrobe Partner"
      className={cn(
        'w-full py-16 sm:py-24 border-t',
        isDark
          ? 'bg-[#0B0B0B] text-[#F8F1E7] border-white/10'
          : 'bg-[#F4ECE1] text-[#0B0B0B] border-[#E6D9C9]',
        className
      )}
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-14">
          <span
            className={cn(
              'text-xs font-sans uppercase tracking-[0.25em] font-semibold block mb-2.5',
              isDark ? 'text-[#C6A15B]' : 'text-[#5B0F18]'
            )}
          >
            COMPLETE YOUR SCENT WARDROBE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight">
            {counterpart.relation}
          </h2>
          <p className="mt-2 text-xs sm:text-sm opacity-75 font-sans max-w-md mx-auto leading-relaxed">
            UNSULID is architected as a dual olfactory wardrobe—crafted for seamless transition between daily composure and nocturnal magnetism.
          </p>
        </div>

        {/* Counterpart Showcase Card */}
        <div
          className={cn(
            'max-w-4xl mx-auto rounded-3xl border overflow-hidden p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center',
            isDark
              ? 'bg-[#181818] border-white/10'
              : 'bg-white border-[#E6D9C9]'
          )}
        >
          {/* Counterpart Image */}
          <div className="md:col-span-5 relative">
            <Link
              href={`/product/${counterpart.slug}`}
              className="block relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/50 group"
            >
              <Image
                src={counterpart.image}
                alt={counterpart.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-[#C6A15B] text-[#0B0B0B]">
                {counterpart.slug === 'black' ? 'NIGHT WEAR' : 'DAY RITUAL'}
              </div>
            </Link>
          </div>

          {/* Counterpart Information */}
          <div className="md:col-span-7 flex flex-col text-left">
            <span
              className={cn(
                'text-[11px] uppercase tracking-widest font-semibold font-sans mb-1',
                isDark ? 'text-[#C6A15B]' : 'text-[#5B0F18]'
              )}
            >
              {counterpart.category}
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-3">
              <Link
                href={`/product/${counterpart.slug}`}
                className="hover:text-[#C6A15B] transition-colors"
              >
                {counterpart.name}
              </Link>
            </h3>

            <p className="font-sans text-xs sm:text-sm opacity-80 leading-relaxed mb-6">
              {counterpart.description}
            </p>

            <div className="flex items-center gap-2 text-xs font-sans opacity-70 mb-8">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>50ml Eau de Parfum • Inaugural Batch 01</span>
            </div>

            <div>
              <Link
                href={`/product/${counterpart.slug}`}
                className={cn(
                  'inline-flex items-center gap-2 px-7 py-3.5 rounded-pill text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5',
                  isDark
                    ? 'bg-[#C6A15B] text-[#0B0B0B] hover:bg-white'
                    : 'bg-[#5B0F18] text-[#F8F1E7] hover:bg-[#741522]'
                )}
              >
                <span>Discover {counterpart.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RelatedFragranceSection;

