'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, User, ShoppingCart, ChevronDown, X } from 'lucide-react';
import MobileMenu from './MobileMenu';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export interface HeaderProps {
  cartCount?: number;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount: propCartCount,
  className,
}) => {
  const { cartCount: liveCount } = useCart();
  const effectiveCartCount = propCartCount !== undefined ? propCartCount : liveCount;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const shopSubmenu = [
    { label: 'All Fragrances', href: '/shop', desc: 'Browse the entire UNSULID fragrance catalog' },
    { label: 'HIGH CLASS', href: '/product/high-class', desc: 'Everyday Fragrance • Daily Elegance • ₹1,499' },
    { label: 'BLACK', href: '/product/black', desc: 'Evening Fragrance • Bold Presence • ₹1,699' },
    { label: 'The Inaugural Duo', href: '/product/high-class', desc: 'Day to Night Wardrobe Set • ₹2,599' },
  ];

  const collectionsSubmenu = [
    { label: 'All Collections', href: '/collections', desc: 'Explore all curated olfactory worlds' },
    { label: "Men's Collection", href: '/collections/mens', desc: 'Refined woods, spices, and amber accords' },
    { label: "Women's Collection", href: '/collections/womens', desc: 'Sensual florals and luminous gourmands' },
    { label: 'Unisex Collection', href: '/collections/unisex', desc: 'Genderless minimalist signature blends' },
    { label: 'New Arrivals', href: '/collections/new', desc: 'Latest releases and inaugural launches' },
  ];

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop', hasDropdown: true, dropdownKey: 'shop', items: shopSubmenu },
    { label: 'Collections', href: '/collections', hasDropdown: true, dropdownKey: 'collections', items: collectionsSubmenu },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header
        role="banner"
        className={cn(
          'sticky top-0 z-40 w-full max-w-full overflow-hidden transition-all duration-300 bg-[#460910] text-white border-b border-white/10 shadow-md',
          isScrolled && 'bg-[#3A070D]/95 backdrop-blur-md shadow-lg',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2">
          {/* Mobile Left: Menu Toggle Button */}
          <div className="flex items-center md:hidden shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="p-1 text-white/90 hover:text-white transition-colors"
            >
              <Menu className="w-5 h-5 stroke-[1.75]" />
            </button>
          </div>

          {/* Logo with Perfume Flacon Icon (Matches Reference Mockup) */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 select-none group min-w-0"
            aria-label="UNSULID Fine Fragrances"
          >
            {/* Minimalist Perfume Flacon Line Icon */}
            <div className="w-7 h-7 sm:w-10 sm:h-10 relative flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-white/95"
              >
                {/* Sprayer cap */}
                <rect x="15" y="6" width="10" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                <rect x="17" y="11" width="6" height="3" stroke="currentColor" strokeWidth="1.2" />
                {/* Flacon body */}
                <rect x="9" y="14" width="22" height="20" rx="3" stroke="currentColor" strokeWidth="1.5" />
                {/* Label rectangle */}
                <rect x="13" y="18" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1" strokeDasharray="1 1" opacity="0.6" />
              </svg>
            </div>

            {/* Brand Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-0.5">
                <span className="font-serif text-xl sm:text-3xl font-medium tracking-[0.12em] text-white">
                  UNSULID
                </span>
                <span className="text-[9px] text-white/80 font-sans -mt-1.5">®</span>
              </div>
              <span className="text-[7.5px] sm:text-[9px] tracking-[0.25em] font-sans text-brand-gold font-medium uppercase -mt-0.5">
                FINE FRAGRANCES
              </span>
            </div>
          </Link>

          {/* Desktop Center: Navigation Links */}
          <nav
            aria-label="Desktop Navigation"
            className="hidden md:flex items-center gap-7 lg:gap-9"
          >
            {navLinks.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname?.startsWith(item.href);

              if (item.hasDropdown && item.items) {
                const isOpen = openDropdown === item.dropdownKey;

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.dropdownKey || null)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'relative py-2 flex items-center gap-1 text-[13px] lg:text-sm font-sans font-medium transition-colors select-none tracking-normal',
                        isActive
                          ? 'text-white'
                          : 'text-white/80 hover:text-white'
                      )}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={cn(
                          'w-3.5 h-3.5 opacity-70 transition-transform duration-200',
                          isOpen && 'rotate-180'
                        )}
                      />

                      {/* Active Indicator Underline */}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C63A48] rounded-full"
                        />
                      )}
                    </Link>

                    {/* Luxury Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute top-full left-0 w-72 bg-[#2D050B] border border-[#C6A15B]/30 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95">
                        <div className="flex flex-col gap-1">
                          {item.items.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setOpenDropdown(null)}
                              className="px-3.5 py-2.5 rounded-xl hover:bg-white/10 transition-colors block group/sub"
                            >
                              <div className="text-xs font-semibold text-white group-hover/sub:text-[#C6A15B] transition-colors">
                                {sub.label}
                              </div>
                              {sub.desc && (
                                <div className="text-[10px] text-white/50 font-sans mt-0.5 line-clamp-1">
                                  {sub.desc}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative py-2 flex items-center gap-1 text-[13px] lg:text-sm font-sans font-medium transition-colors select-none tracking-normal',
                    isActive
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  <span>{item.label}</span>

                  {/* Active Indicator Underline */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C63A48] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons (Search, User, Shopping Cart) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Search Icon */}
            <button
              type="button"
              onClick={() => setIsSearchOpen((prev) => !prev)}
              aria-label="Search perfumes"
              className="p-1 sm:p-1.5 text-white/90 hover:text-white transition-colors"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Account Icon (Matches Reference Image 1 & 2) */}
            <Link
              href="/account"
              aria-label="User Account"
              className="inline-flex p-1 sm:p-1.5 text-white/90 hover:text-white transition-colors"
            >
              <User className="w-5 h-5 stroke-[1.75]" />
            </Link>

            {/* Shopping Cart Icon with Red Badge */}
            <Link
              href="/cart"
              aria-label={`Shopping Cart with ${effectiveCartCount} items`}
              className="relative p-1 sm:p-1.5 text-white/90 hover:text-white transition-colors"
            >
              <ShoppingCart className="w-5 h-5 stroke-[1.75]" />
              <span
                aria-hidden="true"
                className="absolute top-0.5 right-0.5 min-w-[17px] h-[17px] px-1 bg-[#D91B24] text-white text-[10px] font-sans font-bold flex items-center justify-center rounded-full transition-transform"
              >
                {effectiveCartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {isSearchOpen && (
          <div className="w-full bg-[#3A070D] border-t border-white/10 py-3 px-4 sm:px-6 transition-all duration-300">
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-white/60 absolute left-4" />
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fragrances by name or mood (e.g. HIGH CLASS, BLACK)..."
                  className="w-full bg-black/40 border border-white/20 rounded-pill py-2.5 pl-11 pr-10 text-xs sm:text-sm font-sans text-white placeholder:text-white/50 focus:outline-none focus:border-brand-gold"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  aria-label="Close search"
                  className="absolute right-3 text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        cartCount={effectiveCartCount}
      />
    </>
  );
};

export default Header;
