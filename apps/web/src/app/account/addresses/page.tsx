'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  X,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

export default function AddressesPage() {
  const { isAuthenticated, isLoading, openOtpModal } = useAuth();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    houseBuilding: '',
    streetLocality: '',
    city: '',
    state: '',
    pinCode: '',
    deliveryInstructions: '',
    isDefault: false,
  });

  const loadAddresses = () => {
    setLoading(true);
    api.addresses
      .list()
      .then((res) => {
        if (res?.addresses) setAddresses(res.addresses);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openOtpModal('/account/addresses');
    }
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated, isLoading, openOtpModal]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.addresses.create(form);
      setIsModalOpen(false);
      setForm({
        fullName: '',
        phone: '',
        houseBuilding: '',
        streetLocality: '',
        city: '',
        state: '',
        pinCode: '',
        deliveryInstructions: '',
        isDefault: false,
      });
      loadAddresses();
    } catch (err: any) {
      setError(err.message || 'Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await api.addresses.delete(id);
      loadAddresses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.addresses.setDefault(id);
      loadAddresses();
    } catch (err: any) {
      setError(err.message);
    }
  };

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

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm mb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-bold block mb-0.5">
              SAVED LOCATIONS
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#0B0B0B] font-medium">
              Delivery Addresses
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B0F18] text-[#F8F1E7] text-xs font-semibold hover:bg-[#741522] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-[#8B8178] text-xs font-sans">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#5B0F18]" />
            Loading addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-[#E6D9C9] text-center">
            <MapPin className="w-10 h-10 text-[#8B8178]/50 mx-auto mb-3" />
            <h2 className="font-serif text-xl text-[#0B0B0B] mb-2">No Saved Addresses</h2>
            <p className="text-xs text-[#7A6E64] font-sans mb-6">
              Add your home or office address for fast, one-click checkout.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 rounded-full bg-[#5B0F18] text-white text-xs font-semibold hover:bg-[#741522]"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`p-5 rounded-2xl bg-white border transition-all relative flex flex-col justify-between ${
                  addr.isDefault ? 'border-[#5B0F18] shadow-sm' : 'border-[#E6D9C9]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <strong className="font-serif text-base text-[#0B0B0B]">
                      {addr.fullName}
                    </strong>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#5B0F18] text-white uppercase">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-[#5B0F18] mb-2 font-semibold">
                    +91 {addr.phone}
                  </p>
                  <p className="text-xs text-[#7A6E64] font-sans leading-relaxed">
                    {addr.houseBuilding}, {addr.streetLocality}
                    <br />
                    {addr.city}, {addr.state} — <strong>{addr.pinCode}</strong>
                  </p>
                  {addr.deliveryInstructions && (
                    <p className="mt-2 text-[11px] text-[#8B8178] italic">
                      Note: {addr.deliveryInstructions}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6D9C9]/60 flex items-center justify-between text-xs font-sans">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[#5B0F18] font-semibold hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                  {addr.isDefault && <span />}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-red-700 hover:text-red-900 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Address Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-[#E6D9C9] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#E6D9C9]">
                <h2 className="font-serif text-xl font-medium text-[#0B0B0B]">
                  Add Delivery Address
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-[#8B8178] hover:text-[#0B0B0B]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs font-sans">
                <div>
                  <label className="block font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="98765 43210"
                    className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={form.pinCode}
                    onChange={(e) =>
                      setForm({ ...form, pinCode: e.target.value.replace(/\D/g, '') })
                    }
                    placeholder="6-digit PIN"
                    className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">House, Building, Flat *</label>
                  <input
                    type="text"
                    required
                    value={form.houseBuilding}
                    onChange={(e) => setForm({ ...form, houseBuilding: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">Street, Locality, Area *</label>
                  <input
                    type="text"
                    required
                    value={form.streetLocality}
                    onChange={(e) => setForm({ ...form, streetLocality: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-1">Instructions (Optional)</label>
                  <input
                    type="text"
                    value={form.deliveryInstructions}
                    onChange={(e) =>
                      setForm({ ...form, deliveryInstructions: e.target.value })
                    }
                    placeholder="e.g. Call before arrival"
                    className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="accent-[#5B0F18]"
                  />
                  <label htmlFor="isDefault" className="cursor-pointer">
                    Make this my default shipping address
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#5B0F18] text-white font-sans font-semibold text-sm hover:bg-[#741522] mt-4"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

