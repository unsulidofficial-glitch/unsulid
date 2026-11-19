import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  fullWidth = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-pill tracking-wide';

  const variantStyles = {
    primary:
      'bg-brand-burgundy text-brand-cream hover:bg-brand-burgundy-hover hover:text-white shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-transparent text-brand-black border border-brand-border hover:border-brand-black hover:bg-brand-black/5 active:translate-y-0',
    outline:
      'bg-transparent text-brand-cream border border-brand-cream/30 hover:border-brand-cream hover:bg-brand-cream/10 active:translate-y-0',
    ghost:
      'bg-transparent text-brand-black hover:text-brand-burgundy hover:bg-brand-black/5',
    gold:
      'bg-brand-gold text-brand-black hover:bg-brand-gold-hover shadow-luxury hover:-translate-y-0.5 active:translate-y-0 font-semibold',
    cream:
      'bg-brand-cream text-brand-black hover:bg-white shadow-luxury hover:-translate-y-0.5 active:translate-y-0',
  };

  const sizeStyles = {
    sm: 'text-xs px-4 py-2 gap-1.5 min-h-[36px]',
    md: 'text-sm px-6 py-3 gap-2 min-h-[44px]',
    lg: 'text-base px-8 py-3.5 gap-2.5 min-h-[50px]',
  };

  const combinedClasses = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  );

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
};

export default Button;

