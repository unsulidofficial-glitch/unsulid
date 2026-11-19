'use client';

import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminCouponsClient() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [form, setForm] = useState({
    code: '',
    name: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    usageLimit: 500,
    perUserLimit: 1,
    endDate: '2026-12-31',
    isActive: true,
  });

  const loadCoupons = () => {
    setLoading(true);
    api.admin
      .getCoupons()
      .then((res) => {
        if (res?.coupons) setCoupons(res.coupons);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await api.admin.createCoupon({
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        perUserLimit: Number(form.perUserLimit),
      });

      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        setIsModalOpen(false);
        setForm({
          code: '',
          name: '',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minOrderValue: 999,
          maxDiscount: 500,
          usageLimit: 500,
          perUserLimit: 1,
          endDate: '2026-12-31',
          isActive: true,
        });
        loadCoupons();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to create coupon', isError: true });
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await api.admin.toggleCoupon(id);
      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        loadCoupons();
      }
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this coupon?')) return;
    try {
      const res = await api.admin.deleteCoupon(id);
      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        loadCoupons();
      }
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C6A15B] font-bold block mb-1">
            MARKETING &amp; PRIVILEGES
          </span>
          <h1 className="font-serif text-3xl font-medium text-white">
            Offers &amp; Coupon Codes
          </h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Create percentage or flat discounts, set usage limits, and manage promotions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B0F18] hover:bg-[#741522] text-white text-xs font-sans font-semibold transition-colors self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Promo Code</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-sans flex items-center gap-2 ${
            message.isError
              ? 'bg-red-950/80 border border-red-800 text-red-200'
              : 'bg-emerald-950/80 border border-emerald-800 text-emerald-200'
          }`}
        >
          {message.isError ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Coupons Table */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="text-white/40 uppercase tracking-wider text-[10px] border-b border-white/10">
            <tr>
              <th className="pb-3">Promo Code</th>
              <th className="pb-3">Campaign Name</th>
              <th className="pb-3">Discount Type &amp; Value</th>
              <th className="pb-3">Min Order</th>
              <th className="pb-3">Usage</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-mono font-bold text-sm text-[#C6A15B]">{c.code}</td>
                <td className="py-4 text-white font-medium">{c.name}</td>
                <td className="py-4 font-mono text-white">
                  {c.discountType === 'PERCENTAGE'
                    ? `${c.discountValue}% OFF (Max ₹${c.maxDiscount || 'None'})`
                    : `Flat ₹${c.discountValue} OFF`}
                </td>
                <td className="py-4 font-mono text-white/70">₹{c.minOrderValue}</td>
                <td className="py-4 font-mono text-white/70">
                  {c.usedCount} / {c.usageLimit || '∞'}
                </td>
                <td className="py-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      c.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                    }`}
                  >
                    {c.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="py-4 text-right space-x-3">
                  <button
                    onClick={() => handleToggle(c.id)}
                    className="text-xs text-white/70 hover:text-white underline"
                  >
                    {c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#141414] rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h2 className="font-serif text-2xl font-medium">Create New Privilege Coupon</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-medium mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VIP20"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm font-mono uppercase text-[#C6A15B] focus:outline-none focus:border-[#C6A15B]"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">Discount Type *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discountType: e.target.value as 'PERCENTAGE' | 'FIXED',
                      })
                    }
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Inaugural VIP Privilege 20% Off"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-white/70 font-medium mb-1">
                    {form.discountType === 'PERCENTAGE' ? 'Value (%) *' : 'Value (₹) *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-sm font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">Min Order (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-sm font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    placeholder="Optional"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-sm font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 font-medium mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    value={form.usageLimit}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2 text-sm font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-medium mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3.5 py-2 text-sm font-mono text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/15 text-xs font-semibold hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-semibold text-xs hover:bg-[#741522]"
                >
                  Create Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

