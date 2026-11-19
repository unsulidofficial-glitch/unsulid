import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Lock } from 'lucide-react';
import { CollectionItem } from '@/types/product';
import { cn } from '@/lib/utils';

export interface CollectionCardProps {
  collection: CollectionItem;
  className?: string;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  className,
}) => {
  const isUpcoming = collection.isUpcoming;

  const cardContent = (
    <div
      className={cn(
        'group relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-luxury overflow-hidden border transition-all duration-500 ease-out',
        isUpcoming
          ? 'border-brand-border-dark bg-brand-black cursor-default'
          : 'border-brand-border/60 hover:border-brand-burgundy/40 hover:shadow-luxury-hover cursor-pointer',
        className
      )}
    >
      {/* Background Image */}
      <Image
        src={collection.image}
        alt={collection.title}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn(
          'object-cover object-center transition-transform duration-700 ease-out',
          !isUpcoming && 'group-hover:scale-105',
          isUpcoming && 'opacity-60'
        )}
      />

      {/* Atmospheric Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          isUpcoming
            ? 'bg-gradient-to-t from-brand-black via-brand-black/70 to-brand-black/40'
            : 'bg-gradient-to-t from-brand-black/90 via-brand-black/40 to-transparent group-hover:from-brand-black/95'
        )}
      />

      {/* Card Header Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        {collection.badge && (
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-sans font-semibold tracking-widest uppercase border',
              isUpcoming
                ? 'bg-brand-black/80 text-brand-gold border-brand-gold/40'
                : 'bg-brand-burgundy text-brand-cream border-transparent'
            )}
          >
            {collection.badge}
          </span>
        )}

        {isUpcoming && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-sans font-bold tracking-widest uppercase bg-brand-black/80 text-brand-cream border border-brand-border-dark">
            <Lock className="w-3 h-3 text-brand-gold" />
            <span>VAULT</span>
          </span>
        )}
      </div>

      {/* Card Bottom Content */}
      <div className="absolute inset-x-4 bottom-4 z-10 flex flex-col text-left">
        <h3 className="font-serif text-xl sm:text-2xl text-white tracking-tight">
          {collection.title}
        </h3>

        <p className="font-sans text-xs sm:text-sm text-brand-cream/80 mt-1 line-clamp-2 leading-relaxed">
          {collection.description}
        </p>

        {/* Action Link / Status */}
        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
          {isUpcoming ? (
            <span className="text-xs font-sans font-semibold tracking-wider text-brand-gold uppercase flex items-center gap-1.5">
              <span>COMING SOON</span>
            </span>
          ) : (
            <span className="text-xs font-sans font-semibold tracking-wider text-brand-cream group-hover:text-brand-gold transition-colors uppercase flex items-center gap-1.5">
              <span>EXPLORE</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          )}

          {!isUpcoming && (
            <div className="w-7 h-7 rounded-full bg-white/10 group-hover:bg-brand-gold group-hover:text-brand-black text-white flex items-center justify-center transition-all duration-300">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isUpcoming) {
    return cardContent;
  }

  return <Link href={collection.slug}>{cardContent}</Link>;
};

export default CollectionCard;

