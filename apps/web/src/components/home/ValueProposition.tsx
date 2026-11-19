import React from 'react';
import Container from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export interface ValueItem {
  id: string;
  title: string;
  subtitle: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;
}

// Minimalist line-art SVG icons matching the reference design
const LeafIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const RosetteBadgeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const FlaskIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M10 2v5.5L4.5 17.5A3 3 0 0 0 7.1 22h9.8a3 3 0 0 0 2.6-4.5L14 7.5V2" />
    <path d="M8.5 2h7" />
    <path d="M6 16h12" />
  </svg>
);

const BoxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const TruckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.24-4.05a1 1 0 0 0-.78-.38H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </svg>
);

const valueItems: ValueItem[] = [
  {
    id: 'long-lasting',
    title: 'Long Lasting',
    subtitle: 'Upto 12+ Hours',
    icon: LeafIcon,
  },
  {
    id: 'premium-quality',
    title: 'Premium Quality',
    subtitle: 'IFRA Compliant',
    icon: RosetteBadgeIcon,
  },
  {
    id: 'expertly-crafted',
    title: 'Expertly Crafted',
    subtitle: 'Unique Blends',
    icon: FlaskIcon,
  },
  {
    id: 'secure-packaging',
    title: 'Secure Packaging',
    subtitle: 'Safe & Elegant',
    icon: BoxIcon,
  },
  {
    id: 'pan-india-delivery',
    title: 'Pan India Delivery',
    subtitle: 'Fast & Reliable',
    icon: TruckIcon,
  },
];

export interface ValuePropositionProps {
  className?: string;
}

export const ValueProposition: React.FC<ValuePropositionProps> = ({ className }) => {
  return (
    <section
      aria-label="Product Guarantees"
      className={cn(
        'w-full bg-[#F8F1E7] border-b border-[#E6D9C9] py-5 sm:py-8',
        className
      )}
    >
      <Container>
        {/* MOBILE VIEW: 5 items with vertical dividers matching luxury reference */}
        <div className="grid grid-cols-5 divide-x divide-[#E6D9C9] lg:hidden text-center py-1">
          {valueItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex flex-col items-center justify-center px-0.5 sm:px-1">
                <Icon className="w-5 h-5 text-[#0B0B0B] mb-1.5 shrink-0" />
                <span className="font-sans font-semibold text-[9px] sm:text-[10px] text-[#0B0B0B] leading-tight">
                  {item.title}
                </span>
                <span className="font-sans text-[8px] sm:text-[9px] text-[#7A6E64] mt-0.5 leading-tight">
                  {item.subtitle}
                </span>
              </div>
            );
          })}
        </div>

        {/* DESKTOP VIEW: Exact match to Reference Image 2 (5 columns with vertical dividers) */}
        <div className="hidden lg:grid lg:grid-cols-5 lg:divide-x lg:divide-[#E6D9C9]">
          {valueItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3.5 px-4 xl:px-6 justify-center"
              >
                <div className="text-[#0B0B0B] shrink-0">
                  <Icon className="w-7 h-7 xl:w-8 xl:h-8" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-sans font-semibold text-xs xl:text-sm text-[#0B0B0B] leading-tight">
                    {item.title}
                  </span>
                  <span className="font-sans text-[11px] xl:text-xs text-[#7A6E64] mt-0.5 leading-tight">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ValueProposition;
