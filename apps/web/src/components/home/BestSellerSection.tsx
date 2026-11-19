import React from 'react';
import Container from '@/components/ui/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ProductCard from '@/components/products/ProductCard';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

export const launchProducts: Product[] = [
  {
    id: 'prod_high_class',
    slug: 'high-class',
    name: 'HIGH CLASS',
    subtitle: 'Everyday Fragrance',
    category: 'Everyday Fragrance',
    occasion: 'Daily Wear',
    description:
      'An expression of effortless sophistication, designed for your everyday moments.',
    image: '/images/products/high-class-bottle-hd.jpg',
    badge: 'LAUNCH EDITION',
    availability: 'Available',
    pricePlaceholder: 'Launch Edition',
    isLaunchEdition: true,
    ctaText: 'Discover HIGH CLASS',
  },
  {
    id: 'prod_black',
    slug: 'black',
    name: 'BLACK',
    subtitle: 'Party Wear Fragrance',
    category: 'Evening Fragrance',
    occasion: 'Party Wear',
    description:
      'A bold fragrance identity for evenings, celebrations, and unforgettable moments.',
    image: '/images/products/black-bottle-hd.jpg',
    badge: 'NOCTURNAL STATEMENT',
    availability: 'Available',
    pricePlaceholder: 'Launch Edition',
    isLaunchEdition: true,
    ctaText: 'Discover BLACK',
  },
];

export interface BestSellerSectionProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  className?: string;
}

export const BestSellerSection: React.FC<BestSellerSectionProps> = ({
  products = launchProducts,
  title = 'Discover Your Signature',
  subtitle = 'Two fragrances. Two expressions. One identity.',
  eyebrow = 'THE INAUGURAL DUO',
  className,
}) => {
  return (
    <section
      aria-label="Featured Signature Fragrances"
      className={cn(
        'w-full section-padding bg-brand-cream-light/50 border-t border-brand-border/40',
        className
      )}
    >
      <Container>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          highlightWord="Signature"
          description={subtitle}
          actionHref="/shop"
          actionLabel="Explore All Fragrances"
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 max-w-5xl mx-auto gap-8 lg:gap-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BestSellerSection;
