'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, ShieldAlert, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminCustomersClient() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const loadCustomers = () => {
    setLoading(true);
    api.admin
      .getCustomers(search.trim() || undefined)
      .then((res) => {
        if (res?.customers) setCustomers(res.customers);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadCustomers();
  };

  const handleToggleBlock = async (id: string, phone: string, currentlyBlocked: boolean) => {
    const action = currentlyBlocked ? 'unblock' : 'restrict';
    if (!confirm(`Are you sure you want to ${action} customer account for ${phone}?`)) return;

    try {
      const res = await api.admin.toggleBlockCustomer(id);
      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        loadCustomers();
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
            CLIENT RELATIONS
          </span>
          <h1 className="font-serif text-3xl font-medium text-white">Customer Accounts</h1>
          <p className="text-xs text-white/50 font-sans mt-1">
            Registered customer mobile profiles, lifetime order values, and account status controls.
          </p>
        </div>

        <button
          onClick={loadCustomers}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
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
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by phone (+91...) or name..."
          className="w-full bg-[#141414] border border-white/15 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#C6A15B]"
        />
      </form>

      {/* Customers Table */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-white/10 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="text-white/40 uppercase tracking-wider text-[10px] border-b border-white/10">
            <tr>
              <th className="pb-3">Mobile Identifier</th>
              <th className="pb-3">Customer Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Orders</th>
              <th className="pb-3">Lifetime Spend</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right">Access Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-white/40">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 font-mono font-bold text-white text-sm">{c.phone}</td>
                  <td className="py-4 text-white font-medium">{c.name || 'Anonymous User'}</td>
                  <td className="py-4 text-white/60 font-mono">{c.email || '—'}</td>
                  <td className="py-4 font-mono text-white/80">{c.totalOrders}</td>
                  <td className="py-4 font-serif font-bold text-sm text-[#C6A15B]">
                    ₹{c.totalSpent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        c.isBlocked ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'
                      }`}
                    >
                      {c.isBlocked ? 'RESTRICTED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleToggleBlock(c.id, c.phone, c.isBlocked)}
                      className={`text-xs underline font-semibold transition-colors ${
                        c.isBlocked
                          ? 'text-emerald-400 hover:text-emerald-300'
                          : 'text-red-400 hover:text-red-300'
                      }`}
                    >
                      {c.isBlocked ? 'Unrestrict Access' : 'Restrict Account'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

