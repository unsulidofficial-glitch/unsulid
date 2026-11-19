'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ProductDetailData } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface ProductPurchasePanelProps {
  product: ProductDetailData;
  className?: string;
}

export const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
  className,
}) => {
  const router = useRouter();
  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.availableSizes[0] || '50 ml Eau de Parfum');
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFav = isWishlisted(product.slug);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.gallery[0]?.src || '/images/products/high-class-front.jpg',
      size: selectedSize,
      quantity,
      pricePlaceholder: product.pricePlaceholder,
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    }, 400);
  };

  const handleBuyNow = () => {
    addToCart({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.gallery[0]?.src || '/images/products/high-class-front.jpg',
      size: selectedSize,
      quantity,
      pricePlaceholder: product.pricePlaceholder,
    });
    router.push('/cart');
  };

  return (
    <div className={cn('flex flex-col text-left w-full', className)}>
      {/* Brand & Badge Top Header */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className="text-[11px] font-sans uppercase tracking-[0.25em] text-[#C6A15B] font-semibold">
          {product.brand}® FINE FRAGRANCES
        </span>

        <span
          className={cn(
            'px-2.5 py-0.5 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase border border-white/10 shadow-sm',
            product.palette.badgeBg,
            product.palette.badgeText
          )}
        >
          {product.badge}
        </span>
      </div>

      {/* Main Product Title */}
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-5xl text-[#0B0B0B] font-normal tracking-tight mb-2">
        {product.name}
      </h1>

      {/* Editorial Headline */}
      <p className="font-serif text-lg sm:text-xl text-[#5B0F18] italic font-normal mb-3 leading-snug">
        “{product.headline}”
      </p>

      {/* Editorial Description */}
      <p className="font-sans text-xs sm:text-sm text-[#554D46] leading-relaxed mb-6">
        {product.description}
      </p>

      {/* Occasion Tags Strip */}
      <div className="mb-6">
        <span className="text-[10px] uppercase tracking-widest text-[#7A6E64] font-sans font-semibold block mb-2">
          SUITED OCCASIONS
        </span>
        <div className="flex flex-wrap gap-1.5">
          {product.occasions.map((occ) => (
            <span
              key={occ}
              className="px-3 py-1 rounded-full text-[11px] font-sans font-medium bg-[#EFE7DC] text-[#4A423B] border border-[#E0D4C5]"
            >
              {occ}
            </span>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="border-t border-[#E6D9C9] my-1 mb-6" />

      {/* Bottle Size Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-sans mb-2">
          <span className="uppercase tracking-widest text-[#7A6E64] font-semibold text-[10px]">
            VOLUME & CONCENTRATION
          </span>
          <span className="text-[#5B0F18] font-medium text-[11px]">
            {product.stockStatus}
          </span>
        </div>

        <div className="flex gap-2.5">
          {product.availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={cn(
                'flex-1 py-3 px-4 rounded-xl text-xs font-sans font-semibold border-2 transition-all flex items-center justify-between',
                selectedSize === size
                  ? 'border-[#5B0F18] bg-[#FAF5EE] text-[#0B0B0B] shadow-sm'
                  : 'border-[#E6D9C9] bg-white text-[#7A6E64] hover:border-[#0B0B0B]'
              )}
            >
              <span>{size}</span>
              <span className="text-[10px] uppercase font-bold text-[#C6A15B]">
                Inaugural
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Tag */}
      <div className="mb-6 flex flex-wrap items-baseline gap-3">
        <span className="font-serif text-3xl font-semibold text-[#0B0B0B]">
          {product.pricePlaceholder}
        </span>
        {product.originalPrice && (
          <span className="text-sm font-sans line-through text-[#7A6E64]">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        )}
        <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-sans font-semibold">
          Free Express Shipping (Over ₹999)
        </span>
      </div>

      {/* Quantity & CTA Actions */}
      <div className="flex flex-col gap-3.5 mb-7">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#D5C7B7] rounded-pill bg-white px-2 py-1 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B0B0B] hover:bg-[#F8F1E7] transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="w-8 text-center font-sans text-sm font-semibold text-[#0B0B0B]">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(5, q + 1))}
              disabled={quantity >= 5}
              aria-label="Increase quantity"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#0B0B0B] hover:bg-[#F8F1E7] transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Primary Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={cn(
              'flex-1 py-3.5 px-6 rounded-pill text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] select-none',
              isAdded
                ? 'bg-[#1D6F42] text-white'
                : 'bg-[#5B0F18] text-[#F8F1E7] hover:bg-[#741522]'
            )}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.slug)}
            aria-label={isFav ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            className={cn(
              'w-12 h-12 rounded-full border border-[#D5C7B7] flex items-center justify-center transition-colors shrink-0 shadow-sm',
              isFav
                ? 'bg-[#5B0F18] text-white border-[#5B0F18]'
                : 'bg-white text-[#0B0B0B] hover:text-[#5B0F18] hover:border-[#5B0F18]'
            )}
          >
            <Heart className={cn('w-4 h-4', isFav && 'fill-current text-white')} />
          </button>
        </div>

        {/* Buy Now / Direct Checkout Button */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full py-3.5 px-6 rounded-pill bg-[#0B0B0B] text-[#F8F1E7] hover:bg-[#262626] text-xs sm:text-sm font-sans font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-sm select-none"
        >
          <span>Buy Now • Launch Allocation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Trust & Guarantee Tokens */}
      <div className="pt-5 border-t border-[#E6D9C9] flex flex-col gap-2.5 text-xs text-[#554D46] font-sans">
        <div className="flex items-center gap-2.5">
          <Truck className="w-4 h-4 text-[#5B0F18] shrink-0" />
          <span>Pan-India complimentary expedited shipping on launch orders.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#5B0F18] shrink-0" />
          <span>Serialized Authenticity Seal • Tamper-proof luxury slide coffret.</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#C6A15B] shrink-0" />
          <span>Artisanal Formulation • Climate-optimized wear ritual.</span>
        </div>
      </div>
    </div>
  );
};

export default ProductPurchasePanel;

