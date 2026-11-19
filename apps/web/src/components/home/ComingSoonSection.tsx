import React from 'react';
import { Sparkles, Bell, Lock } from 'lucide-react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

export interface ComingSoonSectionProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({
  title = 'THE PRIVATE VAULT',
  subtitle = 'Something extraordinary is on the horizon.',
  badge = 'COMING SOON',
  className,
}) => {
  return (
    <section
      aria-label="Upcoming Fragrance Releases"
      className={cn(
        'w-full section-padding bg-brand-black text-brand-cream border-t border-brand-border-dark relative overflow-hidden',
        className
      )}
    >
      {/* Subtle Background Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-72 sm:h-[300px] max-w-full bg-brand-burgundy/20 rounded-full blur-[80px] pointer-events-none overflow-hidden"
      />

      <Container className="relative z-10">
        <SectionHeading
          eyebrow="FUTURE HORIZONS"
          title={title}
          highlightWord="Vault"
          tone="dark"
          description={subtitle}
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Upcoming Card 1 */}
          <div className="relative p-6 sm:p-8 rounded-luxury border border-brand-border-dark bg-brand-black-soft/60 backdrop-blur-md flex flex-col justify-between group hover:border-brand-gold/30 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-brand-burgundy text-brand-cream">
                {badge}
              </span>
              <span className="text-[11px] font-sans text-brand-gold tracking-widest uppercase flex items-center gap-1">
                <Lock className="w-3 h-3 text-brand-gold" />
                VAULT ARCHIVE
              </span>
            </div>

            <div className="my-6">
              <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-tight mb-2">
                Seasonal Capsule
              </h3>
              <p className="font-sans text-xs sm:text-sm text-brand-cream/70 leading-relaxed">
                A limited-production olfactory profile formulated specifically for climate transitions and elevated occasions.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-gold">
              <span className="flex items-center gap-1.5 font-sans tracking-wider uppercase text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                In Olfactory Formulation
              </span>
              <span className="text-white/40 font-mono text-[11px]">UNRELEASED</span>
            </div>
          </div>

          {/* Upcoming Card 2 */}
          <div className="relative p-6 sm:p-8 rounded-luxury border border-brand-border-dark bg-brand-black-soft/60 backdrop-blur-md flex flex-col justify-between group hover:border-brand-gold/30 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-brand-gold text-brand-black">
                {badge}
              </span>
              <span className="text-[11px] font-sans text-brand-gold tracking-widest uppercase flex items-center gap-1">
                <Lock className="w-3 h-3 text-brand-gold" />
                DISCOVERY SUITE
              </span>
            </div>

            <div className="my-6">
              <h3 className="font-serif text-2xl sm:text-3xl text-white tracking-tight mb-2">
                The Dual Discovery Set
              </h3>
              <p className="font-sans text-xs sm:text-sm text-brand-cream/70 leading-relaxed">
                An intimate presentation coffret featuring miniature flacons of HIGH CLASS and BLACK for comprehensive personal sampling.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-gold">
              <span className="flex items-center gap-1.5 font-sans tracking-wider uppercase text-[11px]">
                <Bell className="w-3.5 h-3.5" />
                Packaging in Production
              </span>
              <span className="text-white/40 font-mono text-[11px]">UNRELEASED</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ComingSoonSection;
