import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export interface CollectionCardData {
  id: string;
  title: string;
  image: string;
  href: string;
  badge?: string;
}

const collectionCards: CollectionCardData[] = [
  {
    id: 'mens',
    title: "Men's Collection",
    image: '/images/collections/col-mens.jpg',
    href: '/collections/mens',
  },
  {
    id: 'womens',
    title: "Women's Collection",
    image: '/images/collections/col-womens.jpg',
    href: '/collections/womens',
  },
  {
    id: 'unisex',
    title: 'Unisex Collection',
    image: '/images/collections/col-unisex.jpg',
    href: '/collections/unisex',
  },
  {
    id: 'new-arrivals',
    title: 'New Arrivals',
    image: '/images/collections/col-new.jpg',
    href: '/collections/new',
    badge: 'NEW',
  },
];

export interface CollectionsSectionProps {
  className?: string;
}

export const CollectionsSection: React.FC<CollectionsSectionProps> = ({ className }) => {
  return (
    <section
      aria-label="Explore Fragrance Collections"
      className={cn('w-full py-10 sm:py-14 bg-[#F8F1E7]', className)}
    >
      <Container>
        {/* Section header — matches reference exactly */}
        <div className="flex items-center justify-between mb-5 sm:mb-7">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B0B0B] font-normal tracking-tight">
            Explore Our{' '}
            <span className="text-[#5B0F18] font-normal">Collections</span>
          </h2>

          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-medium text-[#5B0F18] hover:text-[#741522] transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cards grid:
            - Mobile: 3 cards (last card hidden)
            - Desktop: 4 cards
            The collection JPGs already have text + arrow baked in — use as pure image cards */}
        <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 w-full">
          {collectionCards.map((card, idx) => (
            <Link
              key={card.id}
              href={card.href}
              aria-label={card.title}
              className={cn(
                'group relative block w-full overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300',
                'aspect-[3/2] sm:aspect-[16/10] lg:aspect-[3/2]',
                idx === 3 && 'hidden lg:block'
              )}
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
              />
              {/* Hover brightness overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CollectionsSection;
