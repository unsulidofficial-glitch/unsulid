import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlightWord?: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'light' | 'dark';
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  highlightWord,
  description,
  align = 'center',
  tone = 'light',
  actionHref,
  actionLabel,
  className,
}) => {
  const isDark = tone === 'dark';

  // If highlightWord is provided, render it with serif italic accent
  const renderTitle = () => {
    if (!highlightWord) {
      return title;
    }

    const parts = title.split(new RegExp(`(${highlightWord})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={index} className="font-serif italic font-normal text-brand-burgundy dark:text-brand-gold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className={cn('flex flex-col', align === 'center' ? 'items-center mx-auto' : 'items-start')}>
          {eyebrow && (
            <span
              className={cn(
                'text-luxury mb-3',
                isDark ? 'text-brand-gold' : 'text-brand-burgundy'
              )}
            >
              {eyebrow}
            </span>
          )}

          <h2
            className={cn(
              'font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.15]',
              isDark ? 'text-white' : 'text-brand-black'
            )}
          >
            {renderTitle()}
          </h2>

          {description && (
            <p
              className={cn(
                'mt-4 font-sans text-sm sm:text-base max-w-2xl leading-relaxed',
                isDark ? 'text-brand-cream/80' : 'text-brand-muted',
                align === 'center' ? 'mx-auto' : ''
              )}
            >
              {description}
            </p>
          )}
        </div>

        {actionHref && actionLabel && (
          <Link
            href={actionHref}
            className={cn(
              'group inline-flex items-center gap-1.5 text-xs sm:text-sm font-sans font-medium tracking-wide transition-colors duration-200 shrink-0 self-start md:self-end',
              isDark
                ? 'text-brand-gold hover:text-white'
                : 'text-brand-burgundy hover:text-brand-burgundy-hover'
            )}
          >
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default SectionHeading;

