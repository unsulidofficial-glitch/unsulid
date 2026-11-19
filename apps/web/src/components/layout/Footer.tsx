import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import Container from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      role="contentinfo"
      className={cn('w-full bg-brand-black text-brand-cream border-t border-brand-border-dark pt-16 pb-24 md:pb-16', className)}
    >
      <Container>
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand Column (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 flex flex-col pr-0 lg:pr-8">
            <Link href="/" className="inline-block select-none mb-4">
              <span className="font-serif text-3xl tracking-[0.25em] font-medium text-white block">
                UNSULID
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-brand-gold font-sans font-medium block mt-0.5">
                FINE FRAGRANCES
              </span>
            </Link>

            <p className="font-sans text-xs sm:text-sm text-brand-cream/70 leading-relaxed max-w-sm">
              UNSULID is a modern direct-to-consumer fragrance house crafting accessible premium luxury perfumes for everyday rituals and nocturnal statements. Designed for the Indian lifestyle.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-brand-gold">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="tracking-widest uppercase font-medium">Affordable Luxury • Made in India</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col">
            <h4 className="font-serif text-base text-white tracking-wider mb-4 uppercase">
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-sans text-brand-cream/70">
              <li>
                <Link href="/" className="hover:text-brand-gold transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-brand-gold transition-colors">
                  Shop All Fragrances
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-brand-gold transition-colors">
                  Fragrance Collections
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-gold transition-colors">
                  Our Story &amp; Philosophy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-gold transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Fragrances Column */}
          <div className="flex flex-col">
            <h4 className="font-serif text-base text-white tracking-wider mb-4 uppercase">
              The Fragrances
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-sans text-brand-cream/70">
              <li>
                <Link
                  href="/product/high-class"
                  className="hover:text-brand-gold transition-colors flex items-center justify-between group"
                >
                  <span>HIGH CLASS (Day)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link
                  href="/product/black"
                  className="hover:text-brand-gold transition-colors flex items-center justify-between group"
                >
                  <span>BLACK (Night)</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <span className="text-brand-muted/70 flex items-center gap-1.5 cursor-not-allowed">
                  <span>The Vault Releases</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand-border-dark text-brand-gold">
                    Soon
                  </span>
                </span>
              </li>
            </ul>
          </div>

          {/* Customer Care & Socials */}
          <div className="flex flex-col">
            <h4 className="font-serif text-base text-white tracking-wider mb-4 uppercase">
              Customer Care
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs font-sans text-brand-cream/70 mb-6">
              <li>
                <Link href="/track-order" className="hover:text-brand-gold transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-brand-gold transition-colors">
                  My Account
                </Link>
              </li>
              <li className="text-brand-muted">
                <span>Support: </span>
                <span className="text-brand-cream/60 select-all">[Email Placeholder]</span>
              </li>
              <li className="text-brand-muted">
                <span>Inquiries: </span>
                <span className="text-brand-cream/60 select-all">[Contact Placeholder]</span>
              </li>
            </ul>

            <h5 className="text-[11px] font-sans font-semibold text-brand-gold tracking-widest uppercase mb-2">
              Connect
            </h5>
            <div className="flex items-center gap-3 text-xs text-brand-cream/70">
              <span className="hover:text-white cursor-pointer transition-colors">[Instagram]</span>
              <span className="hover:text-white cursor-pointer transition-colors">[Facebook]</span>
              <span className="hover:text-white cursor-pointer transition-colors">[X / Twitter]</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-brand-cream/60 font-sans">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} UNSULID. All rights reserved.</span>
            <span className="text-brand-gold">•</span>
            <span>Temporary Identity Mockup</span>
          </div>

          {/* Legal Policies */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/refund" className="hover:text-white transition-colors">
              Refund &amp; Return Policy
            </Link>
            <Link href="/shipping" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

