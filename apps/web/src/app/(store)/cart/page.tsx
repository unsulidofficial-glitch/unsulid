'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    breakdown,
  } = useCart();
  const { isAuthenticated, openOtpModal } = useAuth();
  const router = useRouter();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(
    null
  );

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponLoading(true);
    setCouponMessage(null);
    const result = await applyCoupon(couponInput.trim());
    setCouponLoading(false);

    if (result.success) {
      setCouponMessage({ text: result.message, isError: false });
      setCouponInput('');
    } else {
      setCouponMessage({ text: result.message, isError: true });
    }
  };

  const handleCheckoutClick = () => {
    if (!isAuthenticated) {
      openOtpModal('/checkout');
    } else {
      router.push('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 lg:py-28 bg-[#FAF6F0] min-h-[70vh] flex items-center">
        <Container className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#5B0F18]/10 text-[#5B0F18] flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 stroke-[1.25]" />
          </div>
          <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-semibold block mb-2">
            YOUR PRIVILEGED SELECTION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal mb-4">
            Your Cart is Empty
          </h1>
          <p className="font-sans text-sm text-[#8B8178] mb-8 leading-relaxed">
            Discover our inaugural fragrances HIGH CLASS and BLACK, formulated to define your presence from day to night.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#5B0F18] text-[#F8F1E7] font-sans text-sm font-semibold hover:bg-[#741522] transition-all shadow-md"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Container>
      </div>
    );
  }

  const freeShippingProgress = Math.min(
    100,
    Math.round((breakdown.subtotal / breakdown.freeShippingThreshold) * 100)
  );

  return (
    <div className="py-10 lg:py-16 bg-[#FAF6F0] min-h-screen">
      <Container>
        {/* Header */}
        <div className="mb-8 border-b border-[#E6D9C9] pb-5 flex items-end justify-between">
          <div>
            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-semibold block mb-1">
              SHOPPING BAG
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal">
              Review Your Selection
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-sans text-[#8B8178] hover:text-[#5B0F18] underline transition-colors"
          >
            Clear Bag
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm">
          <div className="flex items-center justify-between text-xs font-sans mb-2">
            <span className="flex items-center gap-2 font-medium text-[#0B0B0B]">
              <Truck className="w-4 h-4 text-[#5B0F18]" />
              {breakdown.subtotal >= breakdown.freeShippingThreshold ? (
                <span className="text-emerald-700 font-semibold">
                  Congratulations! You unlocked complimentary Express Shipping.
                </span>
              ) : (
                <span>
                  Add <strong className="text-[#5B0F18]">₹{breakdown.amountNeededForFreeShipping}</strong> more for complimentary delivery.
                </span>
              )}
            </span>
            <span className="font-bold text-[#5B0F18]">{freeShippingProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FAF6F0] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C6A15B] to-[#5B0F18] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => {
              const unitPrice = item.slug === 'black' ? 1699 : 1499;
              const itemTotal = unitPrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#E6D9C9]/60">
                      <Image
                        src={item.image || `/images/products/${item.slug}-front.jpg`}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-[#C6A15B]">
                        {item.category || 'Fine Fragrance'}
                      </span>
                      <h2 className="font-serif text-lg sm:text-xl text-[#0B0B0B] font-medium leading-tight">
                        <Link href={`/product/${item.slug}`} className="hover:text-[#5B0F18]">
                          {item.name}
                        </Link>
                      </h2>
                      <p className="text-xs text-[#8B8178] font-sans mt-0.5">
                        {item.size || '50 ml Eau de Parfum'}
                      </p>
                      <div className="mt-2 text-sm font-sans font-semibold text-[#5B0F18]">
                        ₹{unitPrice.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E6D9C9]/50">
                    <div className="flex items-center border border-[#E6D9C9] rounded-xl overflow-hidden bg-[#FAF6F0]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 text-[#0B0B0B] hover:bg-[#E6D9C9] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3.5 font-sans font-semibold text-xs text-[#0B0B0B]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 text-[#0B0B0B] hover:bg-[#E6D9C9] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="font-serif text-base sm:text-lg font-bold text-[#0B0B0B]">
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] font-sans text-red-700 hover:text-red-900 flex items-center gap-1 mt-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-5">
            {/* Coupon Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm">
              <label className="block text-xs uppercase font-sans font-bold tracking-wider text-[#0B0B0B] mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#5B0F18]" />
                Privilege Offer / Coupon
              </label>

              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-mono font-bold text-xs text-emerald-800">
                        {appliedCoupon}
                      </span>
                      <p className="text-[11px] text-emerald-700 font-sans">
                        ₹{breakdown.discountTotal} saved on this order
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs font-sans text-red-700 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 font-mono text-xs uppercase text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading || !couponInput.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#5B0F18] text-white font-sans text-xs font-semibold hover:bg-[#741522] transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-[11px] font-sans ${
                        couponMessage.isError ? 'text-red-700' : 'text-emerald-700'
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                  <p className="text-[10px] text-[#8B8178] font-sans">
                    Try code <strong className="text-[#5B0F18]">WELCOME10</strong> for 10% inaugural discount!
                  </p>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm">
              <h2 className="font-serif text-xl text-[#0B0B0B] font-medium mb-4 pb-3 border-b border-[#E6D9C9]">
                Order Breakdown
              </h2>

              <div className="space-y-2.5 text-xs font-sans text-[#7A6E64]">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-[#0B0B0B]">
                    ₹{breakdown.subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {breakdown.discountTotal > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Savings</span>
                    <span>-₹{breakdown.discountTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping &amp; Logistics</span>
                  <span className="font-semibold text-[#0B0B0B]">
                    {breakdown.shippingFee === 0 ? (
                      <span className="text-emerald-700">COMPLIMENTARY</span>
                    ) : (
                      `₹${breakdown.shippingFee}`
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#E6D9C9] flex justify-between items-baseline">
                  <span className="font-serif text-base font-semibold text-[#0B0B0B]">
                    Payable Amount
                  </span>
                  <span className="font-serif text-2xl font-bold text-[#5B0F18]">
                    ₹{breakdown.grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-[#8B8178] text-right">Includes all taxes and duties</p>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckoutClick}
                className="mt-6 w-full py-4 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-4 pt-4 border-t border-[#E6D9C9]/60 flex items-center justify-center gap-2 text-[11px] font-sans text-[#8B8178]">
                <ShieldCheck className="w-4 h-4 text-[#5B0F18]" />
                <span>Encrypted 256-bit Checkout &amp; Surat Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
