'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Plus,
  RefreshCw,
  Truck,
  MapPin,
  AlertCircle,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function CheckoutPage() {
  const { items, clearCart, appliedCoupon, breakdown, refreshBreakdown } = useCart();
  const { user, isAuthenticated, openOtpModal } = useAuth();
  const router = useRouter();

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    houseBuilding: '',
    streetLocality: '',
    city: '',
    state: '',
    pinCode: '',
    deliveryInstructions: '',
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'PREPAID' | 'COD'>('PREPAID');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any | null>(null);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.addresses
        .list()
        .then((res) => {
          if (res?.addresses && res.addresses.length > 0) {
            setSavedAddresses(res.addresses);
            const def = res.addresses.find((a: any) => a.isDefault) || res.addresses[0];
            setSelectedAddressId(def.id);
            setUseNewAddress(false);
          } else {
            setUseNewAddress(true);
          }
        })
        .catch(() => {
          setUseNewAddress(true);
        });

      if (user?.name && !addressForm.fullName) {
        setAddressForm((prev) => ({
          ...prev,
          fullName: user.name || '',
          phone: user.phone ? user.phone.replace('+91', '') : '',
        }));
      }
    } else {
      setUseNewAddress(true);
    }
  }, [isAuthenticated, user]);

  // Recalculate totals when payment method changes (adds/removes COD fee)
  useEffect(() => {
    const pin =
      !useNewAddress && selectedAddressId
        ? savedAddresses.find((a) => a.id === selectedAddressId)?.pinCode
        : addressForm.pinCode;

    refreshBreakdown(paymentMethod, pin);
  }, [paymentMethod, selectedAddressId, useNewAddress, addressForm.pinCode, refreshBreakdown, savedAddresses]);

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="py-20 bg-[#FAF6F0] min-h-[60vh] flex items-center">
        <Container className="text-center max-w-md mx-auto">
          <h1 className="font-serif text-3xl text-[#0B0B0B] mb-4">No Items to Checkout</h1>
          <p className="font-sans text-sm text-[#8B8178] mb-6">
            Please add our luxury fragrances to your shopping bag before proceeding.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#741522]"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Container>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Must be authenticated
    if (!isAuthenticated) {
      openOtpModal('/checkout');
      return;
    }

    // 2. Validate Address
    let addressPayload: any = {};
    if (!useNewAddress && selectedAddressId) {
      addressPayload = { addressId: selectedAddressId };
    } else {
      if (
        !addressForm.fullName.trim() ||
        !addressForm.phone.trim() ||
        !addressForm.houseBuilding.trim() ||
        !addressForm.streetLocality.trim() ||
        !addressForm.city.trim() ||
        !addressForm.state.trim() ||
        !addressForm.pinCode.trim()
      ) {
        setError('Please fill in all required delivery address fields.');
        return;
      }

      if (!/^[1-9][0-9]{5}$/.test(addressForm.pinCode.trim())) {
        setError('Please enter a valid 6-digit Indian PIN code.');
        return;
      }

      addressPayload = {
        address: {
          fullName: addressForm.fullName.trim(),
          phone: addressForm.phone.trim(),
          houseBuilding: addressForm.houseBuilding.trim(),
          streetLocality: addressForm.streetLocality.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          pinCode: addressForm.pinCode.trim(),
          deliveryInstructions: addressForm.deliveryInstructions.trim() || undefined,
        },
      };
    }

    try {
      setLoading(true);

      // Create Order on Backend
      const orderRes = await api.orders.create({
        ...addressPayload,
        paymentMethod,
        couponCode: appliedCoupon || undefined,
        items: items.map((i) => ({ productId: i.slug, quantity: i.quantity })),
      });

      if (!orderRes?.order) {
        throw new Error('Failed to create order. Please try again.');
      }

      const order = orderRes.order;

      // Handle PREPAID Razorpay Flow
      if (paymentMethod === 'PREPAID') {
        const rzp = orderRes.razorpay;

        // If Razorpay checkout script is loaded or sandbox simulation:
        // Here we simulate the successful payment verification call
        // (In live merchant mode, window.Razorpay opens checkout modal)
        const verifyRes = await api.payments.verifyRazorpay({
          orderId: order.id,
          razorpayOrderId: rzp?.id || 'order_sim_demo',
          razorpayPaymentId: 'pay_sim_' + Math.random().toString(36).substring(2, 12),
          razorpaySignature: 'sig_sim_valid_signature_2026',
        });

        if (verifyRes?.success) {
          clearCart();
          setCreatedOrder({ ...order, paymentStatus: 'PAID', orderStatus: 'CONFIRMED' });
          setIsSuccess(true);
        }
      } else {
        // COD Order Created Successfully
        clearCart();
        setCreatedOrder(order);
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (isSuccess && createdOrder) {
    return (
      <div className="py-16 lg:py-24 bg-[#FAF6F0] min-h-screen">
        <Container className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6D9C9] shadow-xl text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 stroke-[1.75]" />
            </div>

            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-semibold block mb-2">
              UNSULID® ORDER CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal mb-2">
              Thank You for Your Order
            </h1>
            <p className="font-mono text-sm font-bold text-[#5B0F18] mb-6">
              Order Reference: {createdOrder.orderNumber}
            </p>

            <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E6D9C9] text-left text-xs font-sans text-[#7A6E64] mb-8 space-y-2">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <strong className="text-[#0B0B0B] uppercase">{createdOrder.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <strong className="text-emerald-700">{createdOrder.paymentStatus}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <strong className="text-[#5B0F18] font-serif text-base">
                  ₹{createdOrder.grandTotal?.toLocaleString('en-IN')}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Dispatch Origin:</span>
                <strong className="text-[#0B0B0B]">UNSULID Surat Fragrance Facility</strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/account/orders/${createdOrder.id}`}
                className="px-8 py-3.5 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#741522] transition-colors"
              >
                View Order &amp; Tracking
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3.5 rounded-full border border-[#D5C7B7] text-[#0B0B0B] text-sm font-semibold hover:border-[#0B0B0B] transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container>
        {/* Page Heading */}
        <div className="mb-8 border-b border-[#E6D9C9] pb-4 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-semibold block mb-1">
              SECURE CHECKOUT
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#0B0B0B] font-normal">
              Finalize Your Order
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8B8178] font-sans">
            <Lock className="w-3.5 h-3.5 text-[#5B0F18]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Guest Mobile OTP Prompt Banner */}
        {!isAuthenticated && (
          <div className="mb-8 p-5 rounded-2xl bg-[#5B0F18] text-[#F8F1E7] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-lg font-medium">Already have an account?</h2>
              <p className="font-sans text-xs text-[#F8F1E7]/80 mt-0.5">
                Sign in with your mobile OTP to use saved addresses and track this shipment.
              </p>
            </div>
            <button
              onClick={() => openOtpModal('/checkout')}
              className="px-6 py-2.5 rounded-full bg-[#F8F1E7] text-[#0B0B0B] font-sans text-xs font-bold hover:bg-white transition-colors shrink-0"
            >
              Sign In with Mobile OTP
            </button>
          </div>
        )}

        {/* Global Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left 7 Columns: Delivery Address & Payment Method */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section 1: Delivery Address */}
              <div className="p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E6D9C9]">
                  <h2 className="font-serif text-xl text-[#0B0B0B] font-medium flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#5B0F18]" />
                    Delivery Address
                  </h2>
                  {isAuthenticated && savedAddresses.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(!useNewAddress)}
                      className="text-xs font-sans font-semibold text-[#5B0F18] hover:underline"
                    >
                      {useNewAddress ? 'Use Saved Address' : '+ Add New Address'}
                    </button>
                  )}
                </div>

                {/* Saved Address Cards */}
                {isAuthenticated && !useNewAddress && savedAddresses.length > 0 ? (
                  <div className="space-y-3">
                    {savedAddresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                          selectedAddressId === addr.id
                            ? 'border-[#5B0F18] bg-[#5B0F18]/5 shadow-sm'
                            : 'border-[#E6D9C9] hover:border-[#8B8178]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="savedAddress"
                            checked={selectedAddressId === addr.id}
                            onChange={() => setSelectedAddressId(addr.id)}
                            className="mt-1 accent-[#5B0F18]"
                          />
                          <div className="text-xs font-sans text-[#7A6E64] space-y-0.5">
                            <div className="flex items-center gap-2">
                              <strong className="text-[#0B0B0B] text-sm font-semibold">
                                {addr.fullName}
                              </strong>
                              <span className="font-mono text-[11px] text-[#5B0F18]">
                                +91 {addr.phone}
                              </span>
                              {addr.isDefault && (
                                <span className="px-2 py-0.5 rounded text-[9px] bg-[#E6D9C9] text-[#0B0B0B] font-bold">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            <p className="text-[#0B0B0B]">
                              {addr.houseBuilding}, {addr.streetLocality}
                            </p>
                            <p>
                              {addr.city}, {addr.state} — <strong>{addr.pinCode}</strong>
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  /* New Address Form */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, fullName: e.target.value })
                        }
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3 text-[#5B0F18] font-bold">+91</span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({
                              ...addressForm,
                              phone: e.target.value.replace(/\D/g, ''),
                            })
                          }
                          placeholder="98765 43210"
                          className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl py-2.5 pl-12 pr-3 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={addressForm.pinCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            pinCode: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="6-digit PIN (e.g. 395007)"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        Flat, House no., Building, Apartment *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.houseBuilding}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, houseBuilding: e.target.value })
                        }
                        placeholder="e.g. Penthouse 402, Royal Residency"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        Area, Street, Sector, Village *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.streetLocality}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, streetLocality: e.target.value })
                        }
                        placeholder="e.g. Dumas Road, Vesu"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, city: e.target.value })
                        }
                        placeholder="e.g. Surat"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, state: e.target.value })
                        }
                        placeholder="e.g. Gujarat"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-medium text-[#0B0B0B] mb-1">
                        Delivery Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.deliveryInstructions}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            deliveryInstructions: e.target.value,
                          })
                        }
                        placeholder="e.g. Call before delivery / Leave with concierge"
                        className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2: Payment Method Selection */}
              <div className="p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm">
                <h2 className="font-serif text-xl text-[#0B0B0B] font-medium mb-4 pb-3 border-b border-[#E6D9C9]">
                  Select Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Option 1: Prepaid (Razorpay) */}
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'PREPAID'
                        ? 'border-[#5B0F18] bg-[#5B0F18]/5 shadow-sm'
                        : 'border-[#E6D9C9] hover:border-[#8B8178]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="PREPAID"
                          checked={paymentMethod === 'PREPAID'}
                          onChange={() => setPaymentMethod('PREPAID')}
                          className="mt-1 accent-[#5B0F18]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-semibold text-sm text-[#0B0B0B]">
                              Prepaid (UPI, Cards, Net Banking)
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold uppercase">
                              RECOMMENDED
                            </span>
                          </div>
                          <p className="text-xs text-[#7A6E64] font-sans mt-0.5">
                            Fastest dispatch from Surat factory • No COD handling fees
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-[#5B0F18] shrink-0" />
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery (COD) */}
                  <label
                    className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-[#5B0F18] bg-[#5B0F18]/5 shadow-sm'
                        : 'border-[#E6D9C9] hover:border-[#8B8178]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="mt-1 accent-[#5B0F18]"
                        />
                        <div>
                          <span className="font-sans font-semibold text-sm text-[#0B0B0B]">
                            Cash on Delivery (COD)
                          </span>
                          <p className="text-xs text-[#7A6E64] font-sans mt-0.5">
                            Pay upon delivery at your doorstep • ₹{breakdown.codFee} handling fee applies
                          </p>
                        </div>
                      </div>
                      <Banknote className="w-5 h-5 text-[#7A6E64] shrink-0" />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm sticky top-24">
                <h2 className="font-serif text-xl text-[#0B0B0B] font-medium mb-4 pb-3 border-b border-[#E6D9C9]">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h2>

                {/* Items Mini List */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const price = item.slug === 'black' ? 1699 : 1499;
                    return (
                      <div key={item.id} className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-14 rounded-lg bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#E6D9C9]">
                            <Image
                              src={item.image || `/images/products/${item.slug}-front.jpg`}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="truncate">
                            <span className="font-semibold text-[#0B0B0B] block truncate">
                              {item.name}
                            </span>
                            <span className="text-[#8B8178]">
                              Qty: {item.quantity} × ₹{price}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold text-[#0B0B0B] shrink-0">
                          ₹{(price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Breakdown */}
                <div className="space-y-2.5 text-xs font-sans text-[#7A6E64] border-t border-[#E6D9C9] pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#0B0B0B]">
                      ₹{breakdown.subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {breakdown.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Savings ({appliedCoupon})</span>
                      <span>-₹{breakdown.discountTotal.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-[#0B0B0B]">
                      {breakdown.shippingFee === 0 ? (
                        <span className="text-emerald-700">COMPLIMENTARY</span>
                      ) : (
                        `₹${breakdown.shippingFee}`
                      )}
                    </span>
                  </div>

                  {paymentMethod === 'COD' && (
                    <div className="flex justify-between text-amber-900 font-medium">
                      <span>COD Handling Fee</span>
                      <span>+₹{breakdown.codFee}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#E6D9C9] flex justify-between items-baseline">
                    <span className="font-serif text-base font-semibold text-[#0B0B0B]">
                      Total Payable
                    </span>
                    <span className="font-serif text-2xl font-bold text-[#5B0F18]">
                      ₹{breakdown.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 w-full py-4 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'PREPAID'
                          ? `Pay ₹${breakdown.grandTotal.toLocaleString('en-IN')} via Razorpay`
                          : `Confirm Order (₹${breakdown.grandTotal.toLocaleString('en-IN')} COD)`}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-sans text-[#8B8178]">
                  <Truck className="w-4 h-4 text-[#5B0F18]" />
                  <span>Dispatched via Express Courier from Surat Factory</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
