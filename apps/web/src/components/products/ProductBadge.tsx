import React from 'react';
import { cn } from '@/lib/utils';

export interface ProductBadgeProps {
  label: string;
  variant?: 'burgundy' | 'gold' | 'dark' | 'cream' | 'subtle';
  className?: string;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  label,
  variant = 'burgundy',
  className,
}) => {
  const variantStyles = {
    burgundy: 'bg-brand-burgundy text-brand-cream border-transparent',
    gold: 'bg-brand-gold text-brand-black border-transparent font-medium',
    dark: 'bg-brand-black text-brand-cream border-brand-border-dark',
    cream: 'bg-brand-cream text-brand-burgundy border-brand-border',
    subtle: 'bg-brand-cream-dark/60 text-brand-muted border-transparent',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-sans font-medium uppercase tracking-wider border shadow-sm select-none',
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
};

export default ProductBadge;

