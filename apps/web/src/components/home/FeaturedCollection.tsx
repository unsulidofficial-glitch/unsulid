import React from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import CollectionCard from './CollectionCard';
import { CollectionItem } from '@/types/product';
import { cn } from '@/lib/utils';

export const launchCollections: CollectionItem[] = [
  {
    id: 'everyday-collection',
    title: 'Everyday Fragrances',
    description:
      'Refined daytime compositions crafted for office, university, and daily sophistication.',
    slug: '/collections/everyday',
    image: '/images/collections/everyday.svg',
    badge: 'DAY SIGNATURE',
  },
  {
    id: 'party-collection',
    title: 'Party & Evening Wear',
    description:
      'Magnetic nocturnal fragrances designed for celebrations, evening events, and nightlife.',
    slug: '/collections/party',
    image: '/images/collections/party.svg',
    badge: 'NIGHT WEAR',
  },
  {
    id: 'vault-collection',
    title: 'The Private Vault',
    description:
      'Archival and upcoming limited editions currently in formulation by our perfumers.',
    slug: '/collections/upcoming',
    image: '/images/collections/upcoming.svg',
    badge: 'COMING SOON',
    isUpcoming: true,
  },
];

export interface FeaturedCollectionProps {
  collections?: CollectionItem[];
  className?: string;
}

export const FeaturedCollection: React.FC<FeaturedCollectionProps> = ({
  collections = launchCollections,
  className,
}) => {
  return (
    <section
      aria-label="Fragrance Collections"
      className={cn('w-full section-padding bg-brand-cream', className)}
    >
      <Container>
        <SectionHeading
          eyebrow="CURATED EDITIONS"
          title="Explore Our Collections"
          highlightWord="Collections"
          description="Tailored olfactory profiles curated for distinct lifestyles, daily confidence, and nocturnal magnetism."
          actionHref="/collections"
          actionLabel="View All Collections"
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((item) => (
            <CollectionCard key={item.id} collection={item} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedCollection;

