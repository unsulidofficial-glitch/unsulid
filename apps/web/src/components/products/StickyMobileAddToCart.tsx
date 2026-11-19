'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Check } from 'lucide-react';
import { ProductDetailData } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface StickyMobileAddToCartProps {
  product: ProductDetailData;
}

export const StickyMobileAddToCart: React.FC<StickyMobileAddToCartProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once user scrolls past the top hero/purchase panel (~500px)
      setIsVisible(window.scrollY > 480);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdd = () => {
    addToCart({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.gallery[0]?.src || '/images/products/high-class-front.jpg',
      size: product.availableSizes[0] || '50 ml Eau de Parfum',
      quantity: 1,
      pricePlaceholder: product.pricePlaceholder,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!isVisible) return null;

  return (
    <div
      aria-label="Quick purchase bar"
      className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-[#FAF5EE] border-t border-[#E6D9C9] px-4 py-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] animate-in slide-in-from-bottom-2 duration-200"
    >
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative w-10 h-12 rounded-md overflow-hidden bg-black shrink-0 border border-black/10">
            <Image
              src={product.gallery[0]?.src || '/images/products/high-class-front.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif text-sm font-semibold text-[#0B0B0B] truncate">
              {product.name}
            </span>
            <span className="text-[10px] text-[#7A6E64] font-sans">
              {product.pricePlaceholder} • 50ml
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            'py-2.5 px-5 rounded-pill text-xs font-sans font-semibold tracking-wider uppercase transition-colors flex items-center gap-1.5 shadow-sm shrink-0 select-none',
            isAdded
              ? 'bg-[#1D6F42] text-white'
              : 'bg-[#5B0F18] text-[#F8F1E7] hover:bg-[#741522]'
          )}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StickyMobileAddToCart;

