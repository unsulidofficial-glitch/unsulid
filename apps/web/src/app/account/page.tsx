'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  MapPin,
  LogOut,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Clock,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout, openOtpModal } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openOtpModal('/account');
    }
  }, [isLoading, isAuthenticated, openOtpModal]);

  useEffect(() => {
    if (isAuthenticated) {
      api.orders
        .myOrders()
        .then((res) => {
          if (res?.orders) setOrders(res.orders);
        })
        .catch(() => {});

      api.addresses
        .list()
        .then((res) => {
          if (res?.addresses) setAddresses(res.addresses);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="py-20 bg-[#FAF6F0] min-h-[60vh] flex items-center justify-center">
        <p className="font-sans text-xs uppercase tracking-widest text-[#8B8178]">
          Loading Your Account...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-20 bg-[#FAF6F0] min-h-[60vh] flex items-center justify-center">
        <Container className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#5B0F18]/10 text-[#5B0F18] flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl text-[#0B0B0B] mb-2">Member Concierge</h1>
          <p className="text-xs text-[#8B8178] font-sans mb-6">
            Please verify your mobile number to view your orders, saved addresses, and profile.
          </p>
          <button
            onClick={() => openOtpModal('/account')}
            className="px-8 py-3.5 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-sm font-semibold hover:bg-[#741522] transition-colors"
          >
            Sign In with Mobile OTP
          </button>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 lg:py-16 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container>
        {/* Welcome Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#5B0F18] text-[#C6A15B] flex items-center justify-center font-serif text-2xl font-bold shadow-md shrink-0">
              {(user?.name ? user.name[0] : 'U').toUpperCase()}
            </div>
            <div>
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-bold block mb-0.5">
                PRIVILEGED CLIENT
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#0B0B0B]">
                {user?.name || 'Fragrance Enthusiast'}
              </h1>
              <p className="text-xs font-mono text-[#8B8178] mt-0.5">
                {user?.phone} {user?.email ? `• ${user.email}` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#D5C7B7] text-xs font-sans font-semibold text-[#8B8178] hover:text-red-700 hover:border-red-300 transition-colors self-start sm:self-center"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Dashboard 3 Core Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <Link
            href="/account/orders"
            className="p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm hover:shadow-md hover:border-[#5B0F18] transition-all group block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5B0F18]/10 text-[#5B0F18] flex items-center justify-center mb-4 group-hover:bg-[#5B0F18] group-hover:text-white transition-colors">
              <Package className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-xl font-medium text-[#0B0B0B] group-hover:text-[#5B0F18] transition-colors">
              Orders &amp; Shipments
            </h2>
            <p className="text-xs text-[#8B8178] font-sans mt-1">
              {orders.length} {orders.length === 1 ? 'order placed' : 'orders placed'} • Track Surat dispatches
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-sans font-semibold text-[#5B0F18]">
              <span>View History</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/account/addresses"
            className="p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm hover:shadow-md hover:border-[#5B0F18] transition-all group block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5B0F18]/10 text-[#5B0F18] flex items-center justify-center mb-4 group-hover:bg-[#5B0F18] group-hover:text-white transition-colors">
              <MapPin className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-xl font-medium text-[#0B0B0B] group-hover:text-[#5B0F18] transition-colors">
              Delivery Addresses
            </h2>
            <p className="text-xs text-[#8B8178] font-sans mt-1">
              {addresses.length} saved {addresses.length === 1 ? 'location' : 'locations'} for fast checkout
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-sans font-semibold text-[#5B0F18]">
              <span>Manage Addresses</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          <Link
            href="/account/profile"
            className="p-6 rounded-2xl bg-white border border-[#E6D9C9] shadow-sm hover:shadow-md hover:border-[#5B0F18] transition-all group block"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5B0F18]/10 text-[#5B0F18] flex items-center justify-center mb-4 group-hover:bg-[#5B0F18] group-hover:text-white transition-colors">
              <UserIcon className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-xl font-medium text-[#0B0B0B] group-hover:text-[#5B0F18] transition-colors">
              Personal Profile
            </h2>
            <p className="text-xs text-[#8B8178] font-sans mt-1">
              Update name, email preferences, and security details
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-sans font-semibold text-[#5B0F18]">
              <span>Edit Details</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6D9C9]">
            <h2 className="font-serif text-2xl text-[#0B0B0B] font-medium">Recent Orders</h2>
            {orders.length > 0 && (
              <Link
                href="/account/orders"
                className="text-xs font-sans font-semibold text-[#5B0F18] hover:underline"
              >
                View All ({orders.length}) →
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="w-10 h-10 text-[#8B8178]/50 mx-auto mb-3" />
              <p className="text-sm font-sans text-[#7A6E64] mb-4">You have not placed any orders yet.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-xs font-semibold hover:bg-[#741522] transition-colors"
              >
                <span>Browse Fragrances</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl border border-[#E6D9C9] bg-[#FAF6F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-sm font-serif text-[#0B0B0B]">
                        {ord.orderNumber}
                      </strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#5B0F18] text-white">
                        {ord.orderStatus}
                      </span>
                    </div>
                    <p className="text-[#8B8178]">
                      Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {ord.items.length} items
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-serif text-base font-bold text-[#5B0F18]">
                      ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </span>
                    <Link
                      href={`/account/orders/${ord.id}`}
                      className="px-4 py-2 rounded-full bg-[#5B0F18] text-white text-xs font-semibold hover:bg-[#741522] transition-colors"
                    >
                      Track Order →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

