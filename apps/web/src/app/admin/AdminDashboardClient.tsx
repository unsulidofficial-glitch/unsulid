'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Banknote,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminDashboardClient() {
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    setLoading(true);
    api.admin
      .getStats()
      .then((res) => {
        if (res?.stats) setStats(res.stats);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading && !stats) {
    return (
      <div className="py-20 text-center text-white/50 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C6A15B]" />
        Loading Live Business Intelligence...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C6A15B] font-bold block mb-1">
            EXECUTIVE DASHBOARD
          </span>
          <h1 className="font-serif text-3xl font-medium text-white">Live Business Overview</h1>
        </div>

        <button
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-white border border-white/10 transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span>Total Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            ₹{stats?.totalSales?.toLocaleString('en-IN') || 0}
          </div>
          <p className="text-[11px] text-emerald-400/90 font-mono mt-1">
            Across {stats?.totalOrders || 0} recorded orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span>Total Orders Placed</span>
            <ShoppingBag className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <div className="font-serif text-3xl font-bold text-white">{stats?.totalOrders || 0}</div>
          <p className="text-[11px] text-white/50 font-mono mt-1">
            {stats?.pendingOrders || 0} requiring fulfillment
          </p>
        </div>

        {/* Fulfillment Pipeline */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span>Delivered vs Cancelled</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-400">
              {stats?.deliveredOrders || 0}
            </span>
            <span className="text-white/40 font-mono text-sm">/ {stats?.cancelledOrders || 0} canc.</span>
          </div>
          <p className="text-[11px] text-white/50 font-mono mt-1">Surat warehouse dispatches</p>
        </div>

        {/* Payment Methods Split */}
        <div className="p-5 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-xs text-white/50 mb-2">
            <span>Prepaid vs COD</span>
            <CreditCard className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold text-white">
              {stats?.prepaidOrders || 0} <span className="text-xs text-white/50 font-sans">Prepaid</span>
            </span>
            <span className="text-white/40">•</span>
            <span className="font-serif text-2xl font-bold text-[#C6A15B]">
              {stats?.codOrders || 0} <span className="text-xs text-white/50 font-sans">COD</span>
            </span>
          </div>
          <p className="text-[11px] text-white/50 font-mono mt-1">Direct from checkout settings</p>
        </div>
      </div>

      {/* Bestseller Perfumes & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bestseller Fragrances */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
          <h2 className="font-serif text-xl font-medium text-white mb-4 pb-3 border-b border-white/10">
            Launch Performance by Fragrance
          </h2>

          <div className="space-y-4">
            {stats?.bestSellers?.map((bs: any, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="font-serif text-base text-white">{bs.name}</strong>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#5B0F18] text-[#C6A15B]">
                      50ml Flacon
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white/50 mt-1 block">
                    {bs.unitsSold} units ordered • ₹{bs.revenue.toLocaleString('en-IN')} revenue
                  </span>
                </div>
                <Link
                  href="/admin/products"
                  className="text-xs font-sans text-[#C6A15B] hover:underline"
                >
                  Edit Pricing →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
          <h2 className="font-serif text-xl font-medium text-white mb-4 pb-3 border-b border-white/10 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Inventory Reserve Status
          </h2>

          <div className="space-y-3">
            {stats?.lowStockProducts?.length === 0 ? (
              <p className="text-xs text-white/60 font-sans py-4 text-center">
                All launch batches have healthy reserve stock in Surat climate vault.
              </p>
            ) : (
              stats?.lowStockProducts?.map((p: any) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 flex items-center justify-between text-xs"
                >
                  <strong className="text-white">{p.name}</strong>
                  <span className="font-mono text-amber-400 font-bold">{p.stock} units left</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h2 className="font-serif text-xl font-medium text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-sans text-[#C6A15B] hover:underline">
            View All Orders →
          </Link>
        </div>

        {stats?.recentOrders?.length === 0 ? (
          <p className="text-xs text-white/50 font-sans py-8 text-center">
            No customer orders placed yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="text-white/40 uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="pb-3">Order Number</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 text-right">Total</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.recentOrders?.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                    <td className="py-3">
                      <span className="text-white block">{ord.customerName}</span>
                      <span className="text-white/50 text-[11px] font-mono">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#5B0F18] text-white">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3 text-[11px] font-mono text-white/70">
                      {ord.paymentMethod} • {ord.paymentStatus}
                    </td>
                    <td className="py-3 text-right font-serif font-bold text-[#C6A15B] text-sm">
                      ₹{ord.grandTotal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/admin/orders`}
                        className="text-[#C6A15B] hover:underline text-xs"
                      >
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

