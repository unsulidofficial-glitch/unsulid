import React from 'react';
import Container from '@/components/ui/Container';
import { ProductDetailData } from '@/data/products';
import { ShieldCheck, Sparkles, Box, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductPresentationSectionProps {
  product: ProductDetailData;
  className?: string;
}

export const ProductPresentationSection: React.FC<ProductPresentationSectionProps> = ({
  product,
  className,
}) => {
  const isBlack = product.slug === 'black';

  const specs = [
    {
      icon: Box,
      title: 'Architectural Flacon',
      desc: product.presentation.flaconSpecs,
    },
    {
      icon: Wind,
      title: 'Precision Micro-Diffusion',
      desc: product.presentation.atomiserSpecs,
    },
    {
      icon: Sparkles,
      title: 'Slide-Out Presentation Coffret',
      desc: product.presentation.packagingSpecs,
    },
    {
      icon: ShieldCheck,
      title: 'Inaugural Batch 01',
      desc: product.presentation.batchNote,
    },
  ];

  return (
    <section
      aria-label="Product Presentation & Packaging"
      className={cn(
        'w-full py-16 sm:py-20 border-t',
        isBlack
          ? 'bg-[#121212] text-[#F8F1E7] border-white/10'
          : 'bg-[#F8F1E7] text-[#0B0B0B] border-[#E6D9C9]',
        className
      )}
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-14">
          <span
            className={cn(
              'text-xs font-sans uppercase tracking-[0.25em] font-semibold block mb-2.5',
              isBlack ? 'text-[#C6A15B]' : 'text-[#5B0F18]'
            )}
          >
            TACTILE LUXURY
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-inherit font-normal tracking-tight">
            The Packaging &amp; Presentation
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm opacity-80 font-sans max-w-lg mx-auto leading-relaxed">
            Every bottle of {product.name} is treated as an enduring aesthetic object, from unboxing through the final ceremonial mist.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={cn(
                  'p-6 rounded-2xl border transition-all duration-300 flex flex-col text-left group',
                  isBlack
                    ? 'bg-white/5 border-white/10 hover:border-[#C6A15B]/50'
                    : 'bg-white border-[#E6D9C9] hover:border-[#5B0F18]/50 shadow-sm'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105',
                    isBlack
                      ? 'bg-white/10 text-[#C6A15B]'
                      : 'bg-[#FAF5EE] text-[#5B0F18]'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="font-serif text-lg font-medium mb-2 text-inherit">
                  {item.title}
                </h3>

                <p className="font-sans text-xs opacity-75 leading-relaxed mt-auto">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ProductPresentationSection;

