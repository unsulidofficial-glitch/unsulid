'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export const CartToast: React.FC = () => {
  const { lastAddedItem, dismissToast } = useCart();

  if (!lastAddedItem) return null;

  return (
    <aside
      aria-live="polite"
      aria-label="Item added to cart notification"
      className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 max-w-sm w-full bg-[#1A0407] text-[#F8F1E7] border border-[#C6A15B]/40 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-black shrink-0 border border-white/10">
          <Image
            src={lastAddedItem.image}
            alt={lastAddedItem.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-[#C6A15B] font-medium uppercase tracking-wider mb-0.5">
            <Check className="w-3.5 h-3.5" />
            <span>Added to Bag</span>
          </div>

          <h4 className="font-serif text-base text-white truncate font-medium">
            {lastAddedItem.name}
          </h4>

          <p className="text-xs text-white/70 font-sans mt-0.5">
            {lastAddedItem.size} • Qty {lastAddedItem.quantity}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/cart"
              onClick={dismissToast}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#F8F1E7] hover:text-white underline underline-offset-4 tracking-wide"
            >
              <span>View Cart</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <Link
              href="/checkout"
              onClick={dismissToast}
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#C6A15B] text-[#0B0B0B] text-xs font-semibold hover:bg-white transition-colors"
            >
              Checkout
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={dismissToast}
          aria-label="Close notification"
          className="text-white/60 hover:text-white transition-colors p-1 -mr-1 -mt-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default CartToast;

