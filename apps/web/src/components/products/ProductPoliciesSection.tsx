import React from 'react';
import Container from '@/components/ui/Container';
import { Truck, RotateCcw, Award, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProductPoliciesSectionProps {
  className?: string;
  themeMode?: 'burgundy' | 'dark';
}

export const ProductPoliciesSection: React.FC<ProductPoliciesSectionProps> = ({
  className,
  themeMode = 'burgundy',
}) => {
  const isDark = themeMode === 'dark';

  const policies = [
    {
      icon: Truck,
      title: 'Pan-India Delivery',
      subtitle: 'Complimentary on Launch Orders',
      desc: 'All consignments are packed in impact-resistant, temperature-stabilized outer packaging and dispatched via insured express couriers with live tracking.',
    },
    {
      icon: RotateCcw,
      title: 'Integrity Seal Policy',
      subtitle: 'Unopened Return Window',
      desc: 'Due to the personal nature of fine fragrance, returns and exchanges are honored on unopened, factory-sealed presentation coffrets within 7 days of delivery.',
    },
    {
      icon: Award,
      title: 'Why Choose UNSULID?',
      subtitle: 'Accessible Luxury Without Markup',
      desc: 'We bypass unnecessary retail middlemen and exorbitant licensing markups to invest directly in higher oil concentrations, custom heavy glass, and pure presence.',
    },
    {
      icon: Headphones,
      title: 'Concierge Support',
      subtitle: 'Direct Brand Communication',
      desc: 'Have questions regarding application ritual, storage, or gifting? Our fragrance advisory team is directly accessible via our concierge desk.',
    },
  ];

  return (
    <section
      aria-label="Shipping, Returns and Brand Assurance"
      className={cn(
        'w-full py-14 sm:py-16 border-t',
        isDark
          ? 'bg-[#0B0B0B] text-[#F8F1E7] border-white/10'
          : 'bg-[#FAF5EE] text-[#0B0B0B] border-[#E6D9C9]',
        className
      )}
    >
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {policies.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div key={idx} className="flex flex-col text-left">
                <div
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center mb-3.5',
                    isDark
                      ? 'bg-white/10 text-[#C6A15B]'
                      : 'bg-[#5B0F18]/10 text-[#5B0F18]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="font-serif text-lg font-medium text-inherit mb-0.5">
                  {p.title}
                </h3>

                <span
                  className={cn(
                    'text-[10px] uppercase font-sans tracking-wider font-semibold mb-2',
                    isDark ? 'text-[#C6A15B]' : 'text-[#5B0F18]'
                  )}
                >
                  {p.subtitle}
                </span>

                <p className="font-sans text-xs opacity-75 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ProductPoliciesSection;

