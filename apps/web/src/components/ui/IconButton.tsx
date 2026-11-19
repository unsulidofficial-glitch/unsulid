import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  href?: string;
  icon: React.ReactNode;
  badgeCount?: number;
  variant?: 'light' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  'aria-label': ariaLabel,
  href,
  icon,
  badgeCount,
  variant = 'light',
  size = 'md',
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  const variantStyles = {
    light: 'text-brand-black hover:text-brand-burgundy hover:bg-brand-black/5',
    dark: 'text-brand-cream hover:text-white hover:bg-white/10',
    ghost: 'text-inherit hover:bg-black/5 dark:hover:bg-white/5',
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  const content = (
    <>
      <span className="flex items-center justify-center">{icon}</span>
      {typeof badgeCount === 'number' && badgeCount >= 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-brand-burgundy text-white text-[10px] font-sans font-bold flex items-center justify-center rounded-full border-2 border-brand-cream"
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      )}
      <span className="sr-only">{ariaLabel}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClasses}
      aria-label={ariaLabel}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default IconButton;

