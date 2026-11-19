'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface NewsletterSectionProps {
  heading?: string;
  description?: string;
  ctaText?: string;
  className?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  heading = 'The Privileged Circle',
  description = 'Be the first to discover new fragrances, exclusive launches, and stories from UNSULID.',
  ctaText = 'Join the Circle',
  className,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    // Client-side simulation of feedback state (frontend only)
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail('');
    }, 500);
  };

  return (
    <section
      id="newsletter"
      aria-label="Newsletter & Brand Circle"
      className={cn(
        'w-full section-padding bg-brand-cream border-t border-brand-border/60 text-brand-black transition-colors',
        className
      )}
    >
      <Container size="narrow">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          {/* Eyebrow */}
          <span className="text-luxury text-brand-burgundy mb-3">
            PRIVATE MEMBERSHIP
          </span>

          {/* Heading */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-brand-black leading-[1.15] mb-4">
            {heading.replace('Circle', '')}
            <span className="italic font-normal text-brand-burgundy">
              Circle
            </span>
          </h2>

          {/* Description */}
          <p className="font-sans text-xs sm:text-sm text-brand-muted leading-relaxed mb-8 max-w-md">
            {description}
          </p>

          {/* Form / Success state */}
          {isSubmitted ? (
            <div className="flex items-center gap-2 p-4 rounded-luxury bg-brand-burgundy/5 border border-brand-burgundy/20 text-brand-burgundy text-xs sm:text-sm font-sans animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-burgundy" />
              <span>Thank you. You have been added to the private UNSULID invitation list.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-brand-muted absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  aria-label="Email address for newsletter"
                  className="w-full bg-white border border-brand-border rounded-pill py-3.5 pl-11 pr-4 text-xs sm:text-sm font-sans text-brand-black placeholder:text-brand-muted focus:outline-none focus:border-brand-burgundy transition-colors shadow-sm"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
                className="shrink-0 py-3.5 font-medium"
              >
                {isLoading ? 'Joining...' : ctaText}
              </Button>
            </form>
          )}

          <p className="text-[11px] text-brand-muted/70 font-sans mt-4">
            We value your privacy. No spam, only rare olfactory announcements.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default NewsletterSection;
