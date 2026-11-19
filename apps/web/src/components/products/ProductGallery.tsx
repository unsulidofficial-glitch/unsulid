'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ProductGalleryItem } from '@/data/products';
import { cn } from '@/lib/utils';

export interface ProductGalleryProps {
  images: ProductGalleryItem[];
  productName: string;
  className?: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const activeImage = images[activeIndex] || images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < images.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Magnifying Zoom coordinates
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setMousePos({ x, y });
  };

  // Keyboard navigation for fullscreen lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, images.length]);

  return (
    <div className={cn('flex flex-col gap-4 sm:gap-6 w-full', className)}>
      {/* MAIN SHOWCASE FRAME */}
      <div
        className="group relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-[#120305] border border-[#E6D9C9]/30 shadow-md cursor-crosshair select-none"
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Base Image */}
        <Image
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          className={cn(
            'object-cover object-center transition-all duration-300 ease-out',
            isZooming ? 'opacity-0 lg:opacity-0' : 'opacity-100'
          )}
        />

        {/* Magnifying Loupe Zoom (Desktop Only on hover) */}
        {isZooming && (
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none bg-no-repeat transition-opacity duration-150"
            style={{
              backgroundImage: `url(${activeImage.src})`,
              backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
              backgroundSize: '250%',
            }}
          />
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-2">
          {/* Zoom Instruction Tag (Desktop) */}
          <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-sans font-medium text-white/90 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3 h-3 text-[#C6A15B]" />
            Hover to Inspect
          </span>

          {/* Fullscreen Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFullscreen(true);
            }}
            aria-label="View image in fullscreen"
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-[#C6A15B] flex items-center justify-center transition-colors shadow-sm"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Left / Right Chevron Arrows on Main Image */}
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none hover:bg-black/80 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={() => setActiveIndex((prev) => Math.min(images.length - 1, prev + 1))}
          disabled={activeIndex === images.length - 1}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white flex items-center justify-center disabled:opacity-20 disabled:pointer-events-none hover:bg-black/80 transition-colors"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Active View Label Tag */}
        <div className="absolute bottom-3.5 left-3.5 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-sans font-semibold tracking-widest text-[#C6A15B] uppercase">
          {activeImage.label}
        </div>

        {/* Mobile Swipe Pagination Dots */}
        <div className="absolute bottom-3.5 right-3.5 z-20 flex sm:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md">
          {images.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                idx === activeIndex
                  ? 'w-4 bg-[#C6A15B]'
                  : 'bg-white/40'
              )}
            />
          ))}
        </div>
      </div>

      {/* THUMBNAILS GALLERY STRIP */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 w-full">
        {images.map((img, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show ${img.label} for ${productName}`}
              className={cn(
                'group relative aspect-[4/5] rounded-xl overflow-hidden border-2 transition-all duration-200 bg-[#1A0407]',
                isActive
                  ? 'border-[#C6A15B] ring-2 ring-[#C6A15B]/30 shadow-md scale-[1.02]'
                  : 'border-[#E6D9C9]/40 opacity-70 hover:opacity-100 hover:border-white/60'
              )}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 25vw, 150px"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <span className="sr-only">{img.label}</span>
              <div
                className={cn(
                  'absolute bottom-0 inset-x-0 py-0.5 text-[8.5px] sm:text-[9.5px] font-sans font-medium text-center uppercase tracking-wider transition-colors',
                  isActive
                    ? 'bg-[#C6A15B] text-[#0B0B0B] font-bold'
                    : 'bg-black/60 text-white/80'
                )}
              >
                {img.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} image viewer`}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* Top Bar with Title and Close */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-30">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6A15B]">
                UNSULID® GALLERY
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-normal">
                {productName} • {activeImage.label}
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen gallery"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Image Showcase */}
          <div className="relative w-full max-w-4xl h-[70vh] sm:h-[80vh] flex items-center justify-center select-none">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              className="object-contain"
            />
          </div>

          {/* Bottom Thumbnails & Controls */}
          <div className="absolute bottom-6 inset-x-4 flex items-center justify-center gap-4 z-30">
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
              aria-label="Previous image"
              className="w-9 h-9 rounded-full bg-white/15 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs text-white/80 font-sans tracking-widest uppercase">
              {activeIndex + 1} / {images.length}
            </span>

            <button
              type="button"
              onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
              aria-label="Next image"
              className="w-9 h-9 rounded-full bg-white/15 text-white hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

