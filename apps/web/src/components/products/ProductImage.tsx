import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  aspectRatio?: 'portrait' | 'square';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  priority = false,
  className,
  aspectRatio = 'portrait',
}) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-luxury bg-brand-cream-dark/30 group',
        aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
    </div>
  );
};

export default ProductImage;

