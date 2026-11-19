import React from 'react';
import { cn } from '@/lib/utils';

export interface ProductPriceProps {
  price?: number;
  placeholder?: string;
  className?: string;
}

export const ProductPrice: React.FC<ProductPriceProps> = ({
  price,
  placeholder = 'Pricing to be announced',
  className,
}) => {
  if (typeof price === 'number' && price > 0) {
    return (
      <div className={cn('flex items-baseline gap-2', className)}>
        <span className="font-sans font-semibold text-base sm:text-lg text-brand-black">
          ₹{price.toLocaleString('en-IN')}
        </span>
        <span className="text-[11px] text-brand-muted uppercase tracking-wider">
          Incl. of all taxes
        </span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold" />
      <span className="font-sans text-xs sm:text-sm font-medium text-brand-muted tracking-wide">
        {placeholder}
      </span>
    </div>
  );
};

export default ProductPrice;

