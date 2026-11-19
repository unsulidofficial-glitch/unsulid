'use client';

import React, { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ChevronLeft, ChevronRight, ArrowRight, ShoppingBag, Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface BestsellerProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  type: string;
  badge?: string;
  badgeVariant?: 'burgundy' | 'dark' | 'discount';
  image: string;
  href: string;
  price: number;
  originalPrice: number;
  filterCategory: string;
}

const bestsellerProducts: BestsellerProduct[] = [
  {
    id: 'high-class',
    slug: 'high-class',
    name: 'HIGH CLASS',
    category: 'Everyday Fragrance • Daily Wear',
    type: 'Eau de Parfum • 50ml',
    badge: 'Bestseller',
    badgeVariant: 'burgundy',
    image: '/images/products/high-class-front.jpg',
    href: '/product/high-class',
    price: 1499,
    originalPrice: 1999,
    filterCategory: 'Eau de Parfum',
  },
  {
    id: 'black',
    slug: 'black',
    name: 'BLACK',
    category: 'Evening Fragrance • Party Wear',
    type: 'Eau de Parfum • 50ml',
    badge: 'New',
    badgeVariant: 'dark',
    image: '/images/products/black-front.jpg',
    href: '/product/black',
    price: 1699,
    originalPrice: 2299,
    filterCategory: 'Eau de Parfum',
  },
  {
    id: 'duo-set',
    slug: 'high-class',
    name: 'THE INAUGURAL DUO',
    category: 'Day to Night Fragrance Wardrobe',
    type: 'Luxury Series • 2 x 50ml',
    badge: '-20%',
    badgeVariant: 'discount',
    image: '/images/banners/hero-desktop-4k.jpg',
    href: '/product/high-class',
    price: 2599,
    originalPrice: 3299,
    filterCategory: 'Luxury Series',
  },
];

const filterCategories = [
  'All',
  'Eau de Parfum',
  'Eau de Toilette',
  'Attar (Oil Based)',
  'Luxury Series',
];

export interface BestsellersSectionProps {
  className?: string;
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({ className }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [addedSlug, setAddedSlug] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { isWishlisted, toggleWishlist, addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'All') return bestsellerProducts;
    return bestsellerProducts.filter((p) => p.filterCategory === activeFilter);
  }, [activeFilter]);

  const handleAddToCart = (e: React.MouseEvent, product: BestsellerProduct) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      size: '50ml',
      quantity: 1,
      pricePlaceholder: `₹${product.price.toLocaleString('en-IN')}`,
    });

    setAddedSlug(product.id);
    setTimeout(() => setAddedSlug(null), 2500);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Bestseller Perfumes"
      className={cn('w-full py-10 sm:py-16 bg-[#F8F1E7] border-t border-[#E6D9C9]', className)}
    >
      <Container>
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B0B0B] font-normal tracking-tight">
              Best<span className="text-[#5B0F18]">sellers</span>
            </h2>

            {/* Mobile View All */}
            <Link
              href="/shop"
              className="sm:hidden inline-flex items-center gap-1 text-xs font-sans font-medium text-[#5B0F18]"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Desktop Filter Pills & Pagination */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {filterCategories.map((cat) => {
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveFilter(cat)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-xs font-sans transition-all whitespace-nowrap',
                      isActive
                        ? 'bg-[#5B0F18] text-white font-medium shadow-sm'
                        : 'bg-transparent text-[#7A6E64] hover:text-[#0B0B0B]'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2 pl-2">
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Previous product"
                className="w-8 h-8 rounded-full border border-[#D5C7B7] flex items-center justify-center text-[#7A6E64] hover:border-[#0B0B0B] hover:text-[#0B0B0B] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Next product"
                className="w-8 h-8 rounded-full border border-[#D5C7B7] flex items-center justify-center text-[#7A6E64] hover:border-[#0B0B0B] hover:text-[#0B0B0B] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Row (Mobile Horizontal Scroll / Desktop Grid) */}
        <div
          ref={scrollContainerRef}
          className="w-full max-w-full overflow-x-auto pb-4 sm:pb-0 scrollbar-none min-w-0"
        >
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">
            {filteredProducts.map((product) => {
              const isFav = isWishlisted(product.id);
              const isAdded = addedSlug === product.id;

              return (
                <div
                  key={product.id}
                  className="group relative flex flex-col bg-white rounded-2xl border border-[#E6D9C9] overflow-hidden p-3.5 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 w-[260px] sm:w-auto shrink-0 justify-between"
                >
                  <div>
                    {/* Image Showcase Frame — Entirely Clickable */}
                    <Link
                      href={product.href}
                      className="block relative w-full aspect-[4/5] rounded-xl bg-[#F4EDE2] overflow-hidden group/img cursor-pointer"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover/img:scale-105"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        {product.badge && (
                          <span
                            className={cn(
                              'px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-sans font-semibold tracking-wider text-white shadow-sm',
                              product.badgeVariant === 'burgundy' && 'bg-[#5B0F18]',
                              product.badgeVariant === 'dark' && 'bg-[#0B0B0B]',
                              product.badgeVariant === 'discount' && 'bg-[#7A1220]'
                            )}
                          >
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Top Right Wishlist Heart Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        aria-label={`Add ${product.name} to wishlist`}
                        className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-[#0B0B0B] hover:text-[#5B0F18] transition-colors"
                      >
                        <Heart
                          className={cn(
                            'w-4 h-4',
                            isFav && 'fill-[#5B0F18] text-[#5B0F18]'
                          )}
                        />
                      </button>
                    </Link>

                    {/* Card Information */}
                    <div className="flex flex-col pt-3 sm:pt-4">
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-semibold text-[#5B0F18] mb-0.5 font-sans">
                        {product.category}
                      </span>

                      <h3 className="font-serif text-lg sm:text-2xl text-[#0B0B0B] font-medium tracking-tight group-hover:text-[#5B0F18] transition-colors">
                        <Link href={product.href} className="block">
                          {product.name}
                        </Link>
                      </h3>

                      <span className="text-[11px] sm:text-xs text-[#7A6E64] font-sans mt-0.5">
                        {product.type}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and Action Row */}
                  <div className="mt-4 pt-3 border-t border-[#E6D9C9] flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl sm:text-2xl font-semibold text-[#0B0B0B]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-[#7A6E64] font-sans line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold font-sans">
                        Free Express Ship
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={product.href}
                        className="w-full py-2.5 rounded-full border border-[#0B0B0B] text-center text-xs font-sans font-semibold text-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-white transition-colors"
                      >
                        Details
                      </Link>

                      <button
                        type="button"
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={isAdded}
                        className={cn(
                          'w-full py-2.5 rounded-full text-xs font-sans font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5',
                          isAdded
                            ? 'bg-emerald-700 text-white'
                            : 'bg-[#5B0F18] text-[#F8F1E7] hover:bg-[#741522]'
                        )}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default BestsellersSection;
