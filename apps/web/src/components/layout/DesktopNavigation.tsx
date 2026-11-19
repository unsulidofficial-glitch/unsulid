'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export interface DesktopNavigationProps {
  className?: string;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Desktop Navigation"
      className={cn('hidden md:flex items-center gap-8 lg:gap-10', className)}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname?.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative py-1 text-xs lg:text-sm font-sans uppercase tracking-[0.18em] transition-colors duration-200 select-none',
              isActive
                ? 'text-brand-burgundy font-semibold'
                : 'text-brand-black/80 hover:text-brand-burgundy font-medium'
            )}
          >
            {item.label}

            {/* Active / Hover Burgundy Line Indicator */}
            <span
              className={cn(
                'absolute -bottom-1 left-0 h-[2px] bg-brand-burgundy transition-all duration-300 ease-out',
                isActive
                  ? 'w-full'
                  : 'w-0 group-hover:w-full group-hover:bg-brand-burgundy/60'
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default DesktopNavigation;

