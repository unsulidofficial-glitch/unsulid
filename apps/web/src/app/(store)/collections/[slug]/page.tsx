'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, ArrowLeft, Star, Heart, Check, Sparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollectionMeta {
  title: string;
  tagline: string;
  description: string;
  bannerImage: string;
}

const collectionDatabase: Record<string, CollectionMeta> = {
  mens: {
    title: "Men's Collection",
    tagline: 'Precision • Magnetism • Refinement',
    description:
      'Curated fragrances for the contemporary man. Balanced with crisp Mediterranean bergamot, Virginia cedar, smoky woods, and rich leather notes that hold their character across all hours.',
    bannerImage: '/images/collections/col-mens.jpg',
  },
  womens: {
    title: "Women's Collection",
    tagline: 'Elegance • Luminosity • Seduction',
    description:
      'A master study in floral-amber sophistication. Blended with Grasse jasmine, velvety Damascus rose, and creamy warm vanilla amber for day-to-evening presence.',
    bannerImage: '/images/collections/col-womens.jpg',
  },
  unisex: {
    title: 'Unisex Collection',
    tagline: 'Artisanal • Transcendent • Niche',
    description:
      'Olfactory compositions engineered without gender restrictions. Harmonizing bright citrus, sparkling spices, and hypnotic balsamic resins for the confident individual.',
    bannerImage: '/images/collections/col-unisex.jpg',
  },
  new: {
    title: 'New Arrivals & Launch Series',
    tagline: 'Inaugural Debut • 2026 Edition',
    description:
      'Discover UNSULID’s premiere launch duo: HIGH CLASS and BLACK. Handcrafted with 18% oil concentration (Eau de Parfum) for unparalleled longevity in the Indian climate.',
    bannerImage: '/images/collections/col-new.jpg',
  },
};

const defaultCollection: CollectionMeta = {
  title: 'Fragrance Collection',
  tagline: 'Signature Scents for Every Mood',
  description:
    'Experience our luxury perfume line-up crafted in Surat, India with world-class IFRA-compliant fragrance oils.',
  bannerImage: '/images/banners/hero-desktop-4k.jpg',
};

// The 2 Real Launch Products
const launchProducts = [
  {
    id: 'high-class',
    slug: 'high-class',
    name: 'HIGH CLASS',
    subtitle: 'Everyday Fragrance • Daily Ritual',
    concentration: 'Eau de Parfum • 50ml',
    price: 1499,
    originalPrice: 1999,
    badge: 'Bestseller',
    badgeVariant: 'burgundy' as const,
    image: '/images/products/high-class-front.jpg',
    hoverImage: '/images/products/high-class-lifestyle.jpg',
    notes: 'Italian Bergamot • Iris • Cedarwood • White Musk',
    longevity: '10–12 Hours',
    description:
      'An invigorating daytime signature with crisp citrus opening and warm woody trail, ideal for office, college, and daytime events.',
  },
  {
    id: 'black',
    slug: 'black',
    name: 'BLACK',
    subtitle: 'Evening Fragrance • Party & Night Out',
    concentration: 'Eau de Parfum • 50ml',
    price: 1699,
    originalPrice: 2299,
    badge: 'Trending',
    badgeVariant: 'dark' as const,
    image: '/images/products/black-front.jpg',
    hoverImage: '/images/products/black-lifestyle.jpg',
    notes: 'Black Pepper • Smoky Incense • Amber Resin • Leather',
    longevity: '14+ Hours',
    description:
      'A deeply hypnotic nocturnal statement with spiced smoke and sensual resinous warmth, engineered for nightlife and celebrations.',
  },
];

// Upcoming Fragrances (The Private Vault)
const upcomingFragrances = [
  {
    id: 'vault-royal-oud',
    name: 'THE PRIVATE VAULT: ROYAL OUD',
    concentration: 'Extrait de Parfum • 50ml',
    badge: 'Coming Soon',
    notes: 'Cambodian Agarwood • Damask Rose • Smoked Birch',
    launchWindow: 'Winter 2026',
    image: '/images/collections/col-unisex.jpg',
  },
  {
    id: 'vault-velvet-rose',
    name: 'THE PRIVATE VAULT: VELVET ROSE',
    concentration: 'Extrait de Parfum • 50ml',
    badge: 'Coming Soon',
    notes: 'French Rose • Red Currant • Ambergris',
    launchWindow: 'Winter 2026',
    image: '/images/collections/col-womens.jpg',
  },
];

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = (typeof params?.slug === 'string' ? params.slug : 'new').toLowerCase();
  const collection = collectionDatabase[slug] || defaultCollection;

  const { addToCart, toggleWishlist, isWishlisted } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  const handleAddToCart = (product: (typeof launchProducts)[0]) => {
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
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-[#7A6E64] mb-6">
          <Link href="/" className="hover:text-[#5B0F18] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-[#5B0F18] transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-[#5B0F18] font-medium">{collection.title}</span>
        </div>

        {/* Collection Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#460910] text-white p-8 sm:p-12 mb-12 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block mb-3 font-sans">
              {collection.tagline}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-white mb-4">
              {collection.title}
            </h1>
            <p className="font-sans text-sm sm:text-base text-white/85 leading-relaxed">
              {collection.description}
            </p>
          </div>
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${collection.bannerImage})` }}
          />
        </div>

        {/* Section 1: Debut Launch Products (Available for Purchase) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6D9C9]">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-normal">
                Available In This Collection
              </h2>
              <p className="text-xs font-sans text-[#7A6E64] mt-1">
                2 Launch Edition master perfumes ready for immediate Surat express dispatch.
              </p>
            </div>
            <span className="text-xs font-sans font-semibold text-[#5B0F18] bg-white px-3 py-1.5 rounded-full border border-[#E6D9C9]">
              2 Products Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {launchProducts.map((prod) => {
              const wishlisted = isWishlisted(prod.slug);
              const isAdded = addedSlug === prod.slug;

              return (
                <div
                  key={prod.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-[#E6D9C9] p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    {/* Header line with badge & wishlist */}
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

                    {/* Product Info */}
                    <div className="flex items-center gap-1 text-[#C6A15B] mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      <span className="text-[11px] font-sans font-medium text-[#7A6E64] ml-1">
                        4.9 (Verified Owners)
                      </span>
                    </div>

                    <Link href={`/product/${prod.slug}`}>
                      <h3 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-medium hover:text-[#5B0F18] transition-colors mb-1">
                        {prod.name}
                      </h3>
                    </Link>
                    <span className="text-xs font-sans text-[#5B0F18] font-semibold block mb-2">
                      {prod.subtitle} • {prod.concentration}
                    </span>
                    <p className="text-xs sm:text-sm font-sans text-[#7A6E64] leading-relaxed mb-4">
                      {prod.description}
                    </p>

                    <div className="p-3 rounded-xl bg-[#F8F1E7] border border-[#E6D9C9] text-xs font-sans text-[#0B0B0B]/80 mb-6">
                      <strong className="text-[#5B0F18] block mb-0.5">Olfactory Pyramid:</strong>
                      <span>{prod.notes}</span>
                    </div>
                  </div>

                  {/* Pricing and Action */}
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
                        Details
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

        {/* Section 2: The Private Vault / Upcoming Fragrances */}
        <div className="bg-white/60 border border-[#E6D9C9] rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confidential Olfactory Pipeline</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-normal mb-2">
              The Private Vault — Upcoming Editions
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#7A6E64] leading-relaxed">
              Formulations currently aging in oak casks at our Surat atelier. Reserved for future release to our privileged circle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {upcomingFragrances.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-[#E6D9C9] rounded-2xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#C6A15B] bg-[#F8F1E7] px-2.5 py-1 rounded-full border border-[#E6D9C9]">
                      {item.badge}
                    </span>
                    <span className="text-xs font-sans text-[#7A6E64] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#5B0F18]" />
                      <span>{item.launchWindow}</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-medium text-[#0B0B0B] mb-1">
                    {item.name}
                  </h3>
                  <span className="text-xs font-sans text-[#5B0F18] font-semibold block mb-2">
                    {item.concentration}
                  </span>
                  <p className="text-xs font-sans text-[#7A6E64]">
                    <strong>Featured Notes:</strong> {item.notes}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E6D9C9] flex items-center justify-between">
                  <span className="text-[11px] font-sans text-[#7A6E64] italic">
                    Notification access upon debut
                  </span>
                  <Link
                    href="/#newsletter"
                    className="text-xs font-sans font-semibold text-[#5B0F18] hover:text-[#741522] transition-colors"
                  >
                    Join Waitlist →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

