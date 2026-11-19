'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ArrowLeft, ChevronRight, Clock, RefreshCw } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function OrdersPage() {
  const { isAuthenticated, isLoading, openOtpModal } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openOtpModal('/account/orders');
    }
    if (isAuthenticated) {
      api.orders
        .myOrders()
        .then((res) => {
          if (res?.orders) setOrders(res.orders);
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, openOtpModal]);

  if (!isAuthenticated) return null;

  return (
    <div className="py-10 lg:py-16 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container className="max-w-4xl mx-auto">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-[#8B8178] hover:text-[#5B0F18] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Overview</span>
        </Link>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm mb-6">
          <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-bold block mb-0.5">
            ORDER HISTORY
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-medium">
            My Fragrance Orders
          </h1>
          <p className="text-xs text-[#8B8178] font-sans mt-1">
            Track fulfillment, view invoices, and review order timelines.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-[#8B8178] text-xs font-sans">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5B0F18]" />
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#E6D9C9] text-center">
            <Package className="w-10 h-10 text-[#8B8178]/50 mx-auto mb-3" />
            <h2 className="font-serif text-xl text-[#0B0B0B] mb-2">No Orders Found</h2>
            <p className="text-xs text-[#7A6E64] font-sans mb-6">
              You have not placed any fragrance orders with UNSULID yet.
            </p>
            <Link
              href="/shop"
              className="px-6 py-2.5 rounded-full bg-[#5B0F18] text-white text-xs font-semibold hover:bg-[#741522]"
            >
              Explore HIGH CLASS &amp; BLACK
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm hover:border-[#5B0F18] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E6D9C9] text-xs font-sans">
                  <div>
                    <span className="text-base font-serif font-bold text-[#0B0B0B]">
                      {ord.orderNumber}
                    </span>
                    <p className="text-[#8B8178] text-[11px] mt-0.5">
                      Placed on{' '}
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase ${
                        ord.orderStatus === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-[#5B0F18] text-white'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium uppercase bg-[#FAF6F0] border border-[#E6D9C9] text-[#7A6E64]">
                      {ord.paymentMethod} • {ord.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="py-4 space-y-3">
                  {ord.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs font-sans">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-lg bg-[#FAF6F0] overflow-hidden shrink-0 border border-[#E6D9C9]">
                          <Image
                            src={item.image || `/images/products/high-class-front.jpg`}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <strong className="text-sm font-serif text-[#0B0B0B] block">
                            {item.productName}
                          </strong>
                          <span className="text-[#8B8178]">
                            Qty: {item.quantity} × ₹{item.unitPrice}
                          </span>
                        </div>
                      </div>
                      <span className="font-serif font-bold text-[#0B0B0B]">
                        ₹{item.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer with Grand Total & Tracking Link */}
                <div className="pt-3 border-t border-[#E6D9C9] flex items-center justify-between">
                  <div className="text-xs font-sans">
                    <span className="text-[#8B8178]">Total Amount: </span>
                    <strong className="font-serif text-lg font-bold text-[#5B0F18]">
                      ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <Link
                    href={`/account/orders/${ord.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#5B0F18] text-white text-xs font-semibold hover:bg-[#741522] transition-colors"
                  >
                    <span>View &amp; Track</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}

