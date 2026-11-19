'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { useCart } from '@/context/CartContext';
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingBag,
  Heart,
  Check,
  Clock,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: 'everyday' | 'evening' | 'unisex' | 'mens' | 'womens';
  concentration: string;
  price: number;
  originalPrice: number;
  badge: string;
  badgeVariant: 'burgundy' | 'dark' | 'discount';
  image: string;
  notes: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  longevity: string;
  isUpcoming?: boolean;
  launchDate?: string;
}

const allCatalogProducts: ProductItem[] = [
  // 1. Live Launch Product 1
  {
    id: 'high-class',
    slug: 'high-class',
    name: 'HIGH CLASS',
    subtitle: 'Everyday Fragrance • Sophisticated Daily Wear',
    category: 'everyday',
    concentration: 'Eau de Parfum • 50ml',
    price: 1499,
    originalPrice: 1999,
    badge: 'Bestseller',
    badgeVariant: 'burgundy',
    image: '/images/products/high-class-front.jpg',
    notes: 'Italian Bergamot • Iris • Virginia Cedar • White Amber',
    topNotes: ['Italian Bergamot', 'French Lavender', 'Pink Pepper'],
    heartNotes: ['Iris Absolute', 'Cardamom', 'Clary Sage'],
    baseNotes: ['Virginia Cedarwood', 'White Amber', 'Cashmere Musk'],
    longevity: '10–12 Hours',
    isUpcoming: false,
  },
  // 2. Live Launch Product 2
  {
    id: 'black',
    slug: 'black',
    name: 'BLACK',
    subtitle: 'Evening Fragrance • Party & Nocturnal Celebrations',
    category: 'evening',
    concentration: 'Eau de Parfum • 50ml',
    price: 1699,
    originalPrice: 2299,
    badge: 'Trending',
    badgeVariant: 'dark',
    image: '/images/products/black-front.jpg',
    notes: 'Black Pepper • Smoky Incense • Labdanum • Tuscan Leather',
    topNotes: ['Black Pepper', 'Smoked Bergamot', 'Nutmeg'],
    heartNotes: ['Smoky Frankincense', 'Rich Tobacco', 'Clove'],
    baseNotes: ['Tuscan Leather', 'Dark Amber Resin', 'Patchouli'],
    longevity: '14+ Hours',
    isUpcoming: false,
  },
  // 3. Upcoming Vault Product 1
  {
    id: 'royal-oud',
    slug: 'royal-oud',
    name: 'THE PRIVATE VAULT: ROYAL OUD',
    subtitle: 'Extrait de Parfum • Niche Agarwood Reserve',
    category: 'unisex',
    concentration: 'Extrait de Parfum • 50ml',
    price: 2499,
    originalPrice: 3299,
    badge: 'Coming Soon',
    badgeVariant: 'discount',
    image: '/images/collections/col-unisex.jpg',
    notes: 'Cambodian Oud • Damascus Rose • Birch Tar • Golden Amber',
    topNotes: ['Saffron', 'Smoked Birch', 'Cardamom'],
    heartNotes: ['Damascus Rose', 'Cambodian Oud', 'Coriander'],
    baseNotes: ['Amber Resin', 'Sandalwood', 'Civet Accord'],
    longevity: '18+ Hours',
    isUpcoming: true,
    launchDate: 'Winter 2026',
  },
  // 4. Upcoming Vault Product 2
  {
    id: 'velvet-rose',
    slug: 'velvet-rose',
    name: 'THE PRIVATE VAULT: VELVET ROSE',
    subtitle: 'Extrait de Parfum • Luminous Floral Amber',
    category: 'womens',
    concentration: 'Extrait de Parfum • 50ml',
    price: 2299,
    originalPrice: 2999,
    badge: 'Coming Soon',
    badgeVariant: 'discount',
    image: '/images/collections/col-womens.jpg',
    notes: 'Turkish Rose • Red Currant • Ambergris • Bourbon Vanilla',
    topNotes: ['Red Currant', 'Mandarin Essence', 'Pink Freesia'],
    heartNotes: ['Turkish Rose Absolute', 'Magnolia', 'Peony'],
    baseNotes: ['Bourbon Vanilla', 'Ambergris', 'White Musk'],
    longevity: '12–14 Hours',
    isUpcoming: true,
    launchDate: 'Winter 2026',
  },
  // 5. Upcoming Vault Product 3
  {
    id: 'imperial-amber',
    slug: 'imperial-amber',
    name: 'THE PRIVATE VAULT: IMPERIAL AMBER',
    subtitle: 'Extrait de Parfum • Spicy Resinous Warmth',
    category: 'mens',
    concentration: 'Extrait de Parfum • 50ml',
    price: 2399,
    originalPrice: 3199,
    badge: 'Coming Soon',
    badgeVariant: 'discount',
    image: '/images/collections/col-mens.jpg',
    notes: 'Spiced Nutmeg • Royal Amber • Cinnamon Bark • Tonka Bean',
    topNotes: ['Cinnamon Bark', 'Wild Cardamom', 'Sweet Orange'],
    heartNotes: ['Royal Amber', 'Roasted Coffee Bean', 'Orris Root'],
    baseNotes: ['Roasted Tonka Bean', 'Benzoin', 'Smoked Vetiver'],
    longevity: '16+ Hours',
    isUpcoming: true,
    launchDate: 'Winter 2026',
  },
];

const categoryTabs = [
  { id: 'all', label: 'All Fragrances' },
  { id: 'live', label: 'Launch Edition (2 Available)' },
  { id: 'everyday', label: 'Everyday (HIGH CLASS)' },
  { id: 'evening', label: 'Evening (BLACK)' },
  { id: 'upcoming', label: 'The Private Vault (Upcoming)' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTab, setSelectedTab] = useState<'all' | 'live' | 'everyday' | 'evening' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    let list = [...allCatalogProducts];

    // Filter by Tab
    if (selectedTab === 'live') {
      list = list.filter((p) => !p.isUpcoming);
    } else if (selectedTab === 'upcoming') {
      list = list.filter((p) => p.isUpcoming);
    } else if (selectedTab === 'everyday') {
      list = list.filter((p) => p.category === 'everyday' || p.slug === 'high-class');
    } else if (selectedTab === 'evening') {
      list = list.filter((p) => p.category === 'evening' || p.slug === 'black');
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.notes.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedTab, searchQuery, sortBy]);

  const liveProducts = filteredProducts.filter((p) => !p.isUpcoming);
  const upcomingProducts = filteredProducts.filter((p) => p.isUpcoming);

  const handleAddToCart = (product: ProductItem) => {
    addToCart({
      slug: product.slug,
      name: product.name,
      category: product.subtitle,
      image: product.image,
      size: '50ml',
      quantity: 1,
      pricePlaceholder: `₹${product.price.toLocaleString('en-IN')}`,
    });
    setAddedSlug(product.slug);
    setTimeout(() => setAddedSlug(null), 2500);
  };

  return (
    <div className="w-full bg-[#F8F1E7] text-[#0B0B0B] py-8 sm:py-14">
      <Container>
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-2 font-sans">
            Boutique Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#0B0B0B] tracking-tight mb-3">
            Shop All{' '}
            <span className="text-[#5B0F18] font-normal">Fragrances</span>
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#7A6E64] leading-relaxed">
            Discover our inaugural launch perfumes HIGH CLASS and BLACK, alongside confidential previews from The Private Vault.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#E6D9C9] shadow-sm mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Live Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by perfume name, notes (e.g. Bergamot, Pepper)..."
              className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-full py-2.5 pl-10 pr-10 text-xs sm:text-sm font-sans text-[#0B0B0B] placeholder:text-[#7A6E64] focus:outline-none focus:border-[#5B0F18] focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-[#7A6E64] absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-[#7A6E64] hover:text-[#5B0F18] absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-[#7A6E64]" />
            <span className="text-xs font-sans text-[#7A6E64]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FAF6F0] border border-[#E6D9C9] rounded-full px-3 py-1.5 text-xs font-sans text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categoryTabs.map((tab) => {
            const isActive = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id as any)}
                className={cn(
                  'px-5 py-2 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all select-none',
                  isActive
                    ? 'bg-[#5B0F18] text-[#F8F1E7] shadow-sm'
                    : 'bg-white border border-[#E6D9C9] text-[#0B0B0B] hover:border-[#5B0F18]'
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Results Summary */}
        {searchQuery.trim() && (
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E6D9C9] text-xs font-sans text-[#7A6E64]">
            <span>
              Showing {filteredProducts.length} result(s) for &ldquo;<strong>{searchQuery}</strong>&rdquo;
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-[#5B0F18] font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6D9C9] max-w-lg mx-auto my-12">
            <Search className="w-10 h-10 text-[#C6A15B] mx-auto mb-4" />
            <h3 className="font-serif text-2xl text-[#0B0B0B] font-normal mb-2">
              No Fragrances Found
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[#7A6E64] leading-relaxed mb-6">
              We couldn&rsquo;t find any fragrance matching &ldquo;{searchQuery}&rdquo;. Try adjusting your search term or view our debut launch collection.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedTab('all');
              }}
              className="px-6 py-2.5 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-xs font-sans font-semibold hover:bg-[#741522] transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* SECTION 1: AVAILABLE LAUNCH PERFUMES (2 LIVE PRODUCTS) */}
        {liveProducts.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-normal">
                  Inaugural Launch Edition{' '}
                  <span className="text-[#5B0F18] text-base font-sans font-normal ml-2">
                    (Ready to Ship)
                  </span>
                </h2>
                <p className="text-xs font-sans text-[#7A6E64] mt-0.5">
                  Exclusive debut formulations available for immediate pan-India dispatch.
                </p>
              </div>
              <span className="hidden sm:inline-block text-xs font-sans font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ● In Stock
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {liveProducts.map((prod) => {
                const wishlisted = isWishlisted(prod.slug);
                const isAdded = addedSlug === prod.slug;

                return (
                  <div
                    key={prod.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-[#E6D9C9] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#5B0F18] text-[#F8F1E7]">
                          {prod.badge}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(prod.slug)}
                          aria-label="Save to Wishlist"
                          className="p-2 rounded-full text-[#7A6E64] hover:text-[#5B0F18] hover:bg-[#F8F1E7] transition-colors"
                        >
                          <Heart
                            className={cn(
                              'w-4 h-4',
                              wishlisted && 'fill-[#5B0F18] text-[#5B0F18]'
                            )}
                          />
                        </button>
                      </div>

                      {/* Product Image */}
                      <Link
                        href={`/product/${prod.slug}`}
                        className="block relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF6F0] mb-6 group/img"
                      >
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-center transition-transform duration-500 group-hover/img:scale-105"
                        />
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-[#C6A15B] mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                        <span className="text-[11px] font-sans font-medium text-[#7A6E64] ml-1">
                          4.9 (Verified)
                        </span>
                      </div>

                      {/* Title & Notes */}
                      <Link href={`/product/${prod.slug}`}>
                        <h3 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-medium hover:text-[#5B0F18] transition-colors mb-1">
                          {prod.name}
                        </h3>
                      </Link>
                      <span className="text-xs font-sans text-[#5B0F18] font-semibold block mb-2">
                        {prod.subtitle} • {prod.concentration}
                      </span>

                      <div className="p-3 rounded-xl bg-[#F8F1E7] border border-[#E6D9C9] text-xs font-sans text-[#0B0B0B]/80 mb-6">
                        <strong className="text-[#5B0F18] block mb-0.5">Key Accords:</strong>
                        <span>{prod.notes}</span>
                        <div className="flex items-center gap-4 mt-2 text-[11px] text-[#7A6E64]">
                          <span>Longevity: <strong>{prod.longevity}</strong></span>
                          <span>•</span>
                          <span>Concentration: <strong>18% EDP</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Add to Cart */}
                    <div className="pt-4 border-t border-[#E6D9C9] flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-2xl text-[#0B0B0B] font-semibold">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs font-sans line-through text-[#7A6E64]">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[10px] font-sans text-emerald-700 font-semibold">
                          Free Express Shipping (Over ₹999)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${prod.slug}`}
                          className="px-4 py-2.5 rounded-full border border-[#0B0B0B] text-xs font-sans font-semibold text-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-white transition-colors"
                        >
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(prod)}
                          disabled={isAdded}
                          className={cn(
                            'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-sans font-semibold transition-all shadow-sm',
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
        )}

        {/* SECTION 2: THE PRIVATE VAULT (UPCOMING FRAGRANCES) */}
        {upcomingProducts.length > 0 && (
          <div className="bg-white/60 border border-[#E6D9C9] rounded-3xl p-8 sm:p-12 mb-12">
            <div className="max-w-2xl mb-8">
              <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Confidential Release Pipeline</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-normal mb-2">
                The Private Vault — Upcoming Editions
              </h2>
              <p className="text-xs sm:text-sm font-sans text-[#7A6E64] leading-relaxed">
                Extrait de Parfum concentrations maturing in temperature-controlled oak casks at our Surat atelier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingProducts.map((vault) => (
                <div
                  key={vault.id}
                  className="bg-white border border-[#E6D9C9] rounded-2xl p-6 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C6A15B] bg-[#F8F1E7] px-2.5 py-1 rounded-full border border-[#E6D9C9]">
                        {vault.badge}
                      </span>
                      <span className="text-xs font-sans text-[#7A6E64] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#5B0F18]" />
                        <span>{vault.launchDate}</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#0B0B0B] mb-1">
                      {vault.name}
                    </h3>
                    <span className="text-xs font-sans text-[#5B0F18] font-semibold block mb-2">
                      {vault.concentration}
                    </span>
                    <p className="text-xs font-sans text-[#7A6E64] mb-4">
                      <strong>Featured Notes:</strong> {vault.notes}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E6D9C9] flex items-center justify-between">
                    <span className="text-[11px] font-sans text-[#7A6E64] italic">
                      Private waitlist only
                    </span>
                    <Link
                      href="/#newsletter"
                      className="text-xs font-sans font-semibold text-[#5B0F18] hover:text-[#741522] transition-colors inline-flex items-center gap-1"
                    >
                      <span>Notify Me</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-[60vh] flex items-center justify-center bg-[#F8F1E7]">
          <div className="w-8 h-8 rounded-full border-2 border-[#5B0F18] border-t-transparent animate-spin" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
