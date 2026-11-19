'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ArrowUpRight } from 'lucide-react';
import { Product } from '@/types/product';
import ProductImage from './ProductImage';
import ProductBadge from './ProductBadge';
import ProductPrice from './ProductPrice';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  product: Product;
  className?: string;
  onWishlistToggle?: (productId: string, isWishlisted: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className,
  onWishlistToggle,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = !isWishlisted;
    setIsWishlisted(newState);
    onWishlistToggle?.(product.id, newState);
  };

  const ctaLabel = product.ctaText || `Discover ${product.name}`;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-luxury border border-brand-border/60 bg-white p-4 sm:p-5 transition-all duration-500 ease-out hover:border-brand-burgundy/40 hover:shadow-luxury-hover',
        className
      )}
    >
      {/* Product Image Frame */}
      <div className="relative w-full overflow-hidden rounded-[2px] bg-brand-cream/60">
        <Link href={`/product/${product.slug}`} tabIndex={-1} aria-label={`View details for ${product.name}`}>
          <ProductImage
            src={product.image}
            alt={`${product.name} - ${product.category}`}
          />
        </Link>

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none z-10">
          <div className="flex flex-col gap-1.5 pointer-events-auto">
            {product.badge && (
              <ProductBadge
                label={product.badge}
                variant={product.slug === 'black' ? 'dark' : 'burgundy'}
              />
            )}
            <ProductBadge
              label={product.occasion}
              variant="cream"
              className="backdrop-blur-sm bg-brand-cream/90"
            />
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={cn(
              'pointer-events-auto inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 shadow-sm backdrop-blur-md',
              isWishlisted
                ? 'bg-brand-burgundy text-white'
                : 'bg-white/90 text-brand-black hover:text-brand-burgundy hover:bg-white'
            )}
          >
            <Heart
              className={cn('w-4 h-4', isWishlisted && 'fill-current text-white')}
            />
          </button>
        </div>

        {/* Quick View Details Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-2 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hidden sm:block">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center justify-center gap-1.5 w-full py-3 px-4 rounded-pill bg-brand-black/90 text-brand-cream text-xs font-sans font-medium tracking-wider backdrop-blur-md hover:bg-brand-burgundy transition-colors shadow-lg uppercase"
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="flex flex-col flex-1 pt-4">
        {/* Category & Availability row */}
        <div className="flex items-center justify-between text-xs text-brand-muted mb-1.5">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-burgundy">
            {product.category}
          </span>
          <span className="text-[11px] font-sans font-medium text-brand-muted">
            {product.availability}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-serif text-2xl sm:text-3xl text-brand-black tracking-tight group-hover:text-brand-burgundy transition-colors">
          <Link href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-xs sm:text-sm text-brand-muted leading-relaxed min-h-[40px]">
          {product.description}
        </p>

        {/* Spacer & Bottom Row */}
        <div className="mt-auto pt-5 flex items-center justify-between border-t border-brand-border/40">
          <ProductPrice
            price={product.price}
            placeholder={product.pricePlaceholder || 'Launch Edition'}
          />

          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold tracking-wider text-brand-burgundy hover:text-brand-burgundy-hover uppercase transition-colors"
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
