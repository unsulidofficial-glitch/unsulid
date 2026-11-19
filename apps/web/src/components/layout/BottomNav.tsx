'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingBag, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const bottomNavItems: BottomNavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: LayoutGrid },
  { label: 'Collections', href: '/collections', icon: ShoppingBag },
  { label: 'Wishlist', href: '/account?tab=wishlist', icon: Heart },
  { label: 'Account', href: '/account', icon: User },
];

export interface BottomNavProps {
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className }) => {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#F8F1E7] border-t border-[#E6D9C9] shadow-[0_-2px_10px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-1 pb-safe">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors select-none',
                isActive
                  ? 'text-[#5B0F18] font-semibold'
                  : 'text-[#7A6E64] hover:text-[#0B0B0B]'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 transition-transform duration-200',
                  isActive ? 'fill-current text-[#5B0F18]' : 'text-[#7A6E64]'
                )}
              />
              <span className="text-[11px] font-sans mt-1 leading-none tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
