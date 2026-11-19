export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  occasion: string;
  description: string;
  image: string;
  secondaryImage?: string;
  price?: number;
  pricePlaceholder?: string;
  badge?: string;
  availability: 'Available' | 'Coming Soon' | 'Pre-Order';
  isLaunchEdition?: boolean;
  ctaText?: string;
}

export interface CollectionItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  badge?: string;
  ctaText?: string;
  isUpcoming?: boolean;
}
