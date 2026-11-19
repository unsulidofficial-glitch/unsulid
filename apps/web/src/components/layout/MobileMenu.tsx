'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Search, ChevronRight, User, ShoppingBag, Sparkles } from 'lucide-react';
import { navItems } from './DesktopNavigation';
import { cn } from '@/lib/utils';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  cartCount = 0,
}) => {
  const pathname = usePathname();

  // Prevent background scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onClose();
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 md:hidden flex"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-brand-cream shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-border/60">
          <Link
            href="/"
            onClick={onClose}
            className="font-serif text-xl tracking-[0.25em] text-brand-black font-semibold uppercase"
          >
            UNSULID
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="w-9 h-9 inline-flex items-center justify-center rounded-full text-brand-black hover:text-brand-burgundy hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar in Mobile Menu */}
        <div className="p-5 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search perfumes (e.g. HIGH CLASS, BLACK)..."
              aria-label="Search fragrances"
              className="w-full bg-white border border-brand-border rounded-pill py-2.5 pl-10 pr-4 text-xs font-sans text-brand-black placeholder:text-brand-muted focus:outline-none focus:border-brand-burgundy"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>

        {/* Primary Navigation Links */}
        <nav className="flex-1 px-5 py-2 divide-y divide-brand-border/40">
          <div className="py-2 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center justify-between py-3 px-3 rounded-luxury text-sm font-sans uppercase tracking-[0.18em] transition-colors',
                    isActive
                      ? 'bg-brand-burgundy text-brand-cream font-semibold'
                      : 'text-brand-black hover:bg-black/5'
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    className={cn('w-4 h-4', isActive ? 'text-brand-cream' : 'text-brand-muted')}
                  />
                </Link>
              );
            })}
          </div>

          {/* Quick Fragrance Direct Links */}
          <div className="py-4">
            <span className="text-[11px] font-sans font-semibold text-brand-burgundy uppercase tracking-widest px-3 block mb-2">
              Launch Editions
            </span>
            <div className="flex flex-col gap-1">
              <Link
                href="/product/high-class"
                onClick={onClose}
                className="flex items-center justify-between py-2.5 px-3 rounded text-xs font-sans text-brand-black hover:bg-black/5"
              >
                <span>HIGH CLASS — Everyday</span>
                <span className="text-[10px] text-brand-muted uppercase">Day</span>
              </Link>
              <Link
                href="/product/black"
                onClick={onClose}
                className="flex items-center justify-between py-2.5 px-3 rounded text-xs font-sans text-brand-black hover:bg-black/5"
              >
                <span>BLACK — Party Wear</span>
                <span className="text-[10px] text-brand-muted uppercase">Night</span>
              </Link>
            </div>
          </div>

          {/* Secondary Account & Tracking Links */}
          <div className="py-4 flex flex-col gap-2">
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-3 py-2 px-3 text-xs font-sans text-brand-black hover:text-brand-burgundy transition-colors"
            >
              <User className="w-4 h-4 text-brand-muted" />
              <span>My Account</span>
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-between py-2 px-3 text-xs font-sans text-brand-black hover:text-brand-burgundy transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4 text-brand-muted" />
                <span>Shopping Bag</span>
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-brand-burgundy text-white rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Drawer Footer */}
        <div className="p-5 border-t border-brand-border/60 bg-brand-cream-dark/30">
          <div className="flex items-center gap-2 text-xs text-brand-muted font-sans mb-1">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
            <span>Affordable Premium Luxury Fragrances</span>
          </div>
          <p className="text-[11px] text-brand-muted/70 tracking-wider uppercase">
            Curated for the Indian Taste
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

