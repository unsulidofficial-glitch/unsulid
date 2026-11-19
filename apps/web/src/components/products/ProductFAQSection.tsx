'use client';

import React, { useState } from 'react';
import Container from '@/components/ui/Container';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductFAQSectionProps {
  faqs: FAQItem[];
  productName: string;
  themeMode?: 'burgundy' | 'dark';
  className?: string;
}

export const ProductFAQSection: React.FC<ProductFAQSectionProps> = ({
  faqs,
  productName,
  themeMode = 'burgundy',
  className,
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const isDark = themeMode === 'dark';

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      aria-label={`${productName} Frequently Asked Questions`}
      className={cn(
        'w-full py-16 sm:py-20 border-t',
        isDark
          ? 'bg-[#121212] text-[#F8F1E7] border-white/10'
          : 'bg-[#F8F1E7] text-[#0B0B0B] border-[#E6D9C9]',
        className
      )}
    >
      <Container size="narrow">
        <div className="max-w-2xl mx-auto text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-sans font-semibold tracking-wider uppercase border border-current/20">
            <HelpCircle className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>KNOWLEDGE &amp; CARE</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-inherit font-normal tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-xs sm:text-sm opacity-75 font-sans leading-relaxed">
            Essential guidance regarding the wear ritual, storage, and launch edition of {productName}.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3 max-w-2xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={cn(
                  'rounded-2xl border transition-all duration-200 overflow-hidden',
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white border-[#E6D9C9]'
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-left font-serif text-base sm:text-lg font-medium transition-colors hover:text-[#C6A15B]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 shrink-0 transition-transform duration-300 text-[#C6A15B]',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm font-sans opacity-80 leading-relaxed border-t border-current/10 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default ProductFAQSection;

