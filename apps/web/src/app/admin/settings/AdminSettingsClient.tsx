'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Truck,
  Banknote,
  CreditCard,
  Megaphone,
  Save,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminSettingsClient() {
  const [activeTab, setActiveTab] = useState<'SHIPPING' | 'COD' | 'PAYMENTS' | 'STOREFRONT'>('SHIPPING');
  const [settings, setSettings] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Forms state
  const [shippingForm, setShippingForm] = useState({
    freeShippingThreshold: 999,
    standardShippingFee: 99,
  });

  const [codForm, setCodForm] = useState({
    codEnabled: true,
    codHandlingFee: 50,
    minCodOrderValue: 500,
    maxCodOrderValue: 10000,
  });

  const [paymentForm, setPaymentForm] = useState({
    prepaidEnabled: true,
    codEnabled: true,
  });

  const [storefrontForm, setStorefrontForm] = useState({
    announcementBarMessage: 'Free Shipping on Orders Above ₹999 | 100% Authentic Fragrances',
    storePhone: '+91 98765 43210',
    storeEmail: 'concierge@unsulid.com',
  });

  const loadSettings = () => {
    setLoading(true);
    api.settings
      .getPublic()
      .then((res) => {
        if (res?.settings) {
          setSettings(res.settings);
          setShippingForm({
            freeShippingThreshold: res.settings.freeShippingThreshold,
            standardShippingFee: res.settings.standardShippingFee,
          });
          setCodForm({
            codEnabled: res.settings.codEnabled,
            codHandlingFee: res.settings.codHandlingFee,
            minCodOrderValue: res.settings.minCodOrderValue,
            maxCodOrderValue: res.settings.maxCodOrderValue,
          });
          setPaymentForm({
            prepaidEnabled: res.settings.prepaidEnabled,
            codEnabled: res.settings.codEnabled,
          });
          setStorefrontForm({
            announcementBarMessage: res.settings.announcementBarMessage,
            storePhone: res.settings.storePhone,
            storeEmail: res.settings.storeEmail,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.admin.updateShipping({
        freeShippingThreshold: Number(shippingForm.freeShippingThreshold),
        standardShippingFee: Number(shippingForm.standardShippingFee),
      });
      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        loadSettings();
      }
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.admin.updateCod({
        codEnabled: codForm.codEnabled,
        codHandlingFee: Number(codForm.codHandlingFee),
        minCodOrderValue: Number(codForm.minCodOrderValue),
        maxCodOrderValue: Number(codForm.maxCodOrderValue),
      });
      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        loadSettings();
      }
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayments = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.admin.updatePayments(paymentForm);
      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        loadSettings();
      }
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStorefront = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await api.admin.updateStorefront(storefrontForm);
      if (res?.success) {
        setMessage({ text: res.message, isError: false });
        loadSettings();
      }
    } catch (err: any) {
      setMessage({ text: err.message, isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-white/10">
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#C6A15B] font-bold block mb-1">
          CENTRAL CONFIGURATION
        </span>
        <h1 className="font-serif text-3xl font-medium text-white">Store &amp; Logistics Settings</h1>
        <p className="text-xs text-white/50 font-sans mt-1">
          Adjust free shipping thresholds, COD availability and fees, and storefront banners without source code redeployments.
        </p>
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

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab('SHIPPING')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-colors ${
            activeTab === 'SHIPPING'
              ? 'bg-[#5B0F18] text-white shadow-sm'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Shipping Charges &amp; Free Threshold</span>
        </button>

        <button
          onClick={() => setActiveTab('COD')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-colors ${
            activeTab === 'COD'
              ? 'bg-[#5B0F18] text-white shadow-sm'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Banknote className="w-4 h-4" />
          <span>Cash on Delivery (COD) Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('PAYMENTS')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-colors ${
            activeTab === 'PAYMENTS'
              ? 'bg-[#5B0F18] text-white shadow-sm'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Payment Gateways</span>
        </button>

        <button
          onClick={() => setActiveTab('STOREFRONT')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition-colors ${
            activeTab === 'STOREFRONT'
              ? 'bg-[#5B0F18] text-white shadow-sm'
              : 'bg-white/5 text-white/70 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Storefront &amp; Announcement Bar</span>
        </button>
      </div>

      {/* Tab 1: Shipping Settings */}
      {activeTab === 'SHIPPING' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 max-w-2xl">
          <h2 className="font-serif text-xl text-white font-medium mb-1">
            Shipping Charges &amp; Complimentary Threshold
          </h2>
          <p className="text-xs text-white/50 mb-6">
            Orders exceeding this threshold automatically receive complimentary Pan-India shipping.
          </p>

          <form onSubmit={handleSaveShipping} className="space-y-5 text-xs font-sans">
            <div>
              <label className="block text-white/70 font-medium mb-1.5">
                Free Shipping Threshold (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={shippingForm.freeShippingThreshold}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-base font-mono font-bold text-[#C6A15B]"
              />
              <p className="text-[11px] text-white/40 mt-1">
                Currently set to free delivery on orders above ₹{shippingForm.freeShippingThreshold}.
              </p>
            </div>

            <div>
              <label className="block text-white/70 font-medium mb-1.5">
                Standard Shipping Fee (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={shippingForm.standardShippingFee}
                onChange={(e) =>
                  setShippingForm({
                    ...shippingForm,
                    standardShippingFee: Number(e.target.value),
                  })
                }
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-sm font-mono text-white"
              />
              <p className="text-[11px] text-white/40 mt-1">
                Charged when cart subtotal is below the free shipping threshold.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#5B0F18] hover:bg-[#741522] text-white font-semibold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Shipping Settings'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: COD Settings */}
      {activeTab === 'COD' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 max-w-2xl">
          <h2 className="font-serif text-xl text-white font-medium mb-1">
            Cash on Delivery (COD) Configuration
          </h2>
          <p className="text-xs text-white/50 mb-6">
            Configure COD handling fees and toggle COD availability. Disabling COD immediately removes it from customer checkout.
          </p>

          <form onSubmit={handleSaveCod} className="space-y-5 text-xs font-sans">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <strong className="text-white text-sm block">Enable Cash on Delivery</strong>
                <p className="text-white/50 text-[11px]">
                  Allow customers to pay upon receiving fragrance at their doorstep
                </p>
              </div>
              <input
                type="checkbox"
                checked={codForm.codEnabled}
                onChange={(e) => setCodForm({ ...codForm, codEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#5B0F18] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-white/70 font-medium mb-1.5">
                COD Handling Fee (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={codForm.codHandlingFee}
                onChange={(e) =>
                  setCodForm({ ...codForm, codHandlingFee: Number(e.target.value) })
                }
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-base font-mono font-bold text-[#C6A15B]"
              />
              <p className="text-[11px] text-white/40 mt-1">
                Additional fee added to checkout total when COD is selected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 font-medium mb-1.5">
                  Min COD Order Value (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={codForm.minCodOrderValue}
                  onChange={(e) =>
                    setCodForm({ ...codForm, minCodOrderValue: Number(e.target.value) })
                  }
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-mono text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1.5">
                  Max COD Order Value (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={codForm.maxCodOrderValue}
                  onChange={(e) =>
                    setCodForm({ ...codForm, maxCodOrderValue: Number(e.target.value) })
                  }
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-mono text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#5B0F18] hover:bg-[#741522] text-white font-semibold flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save COD Settings'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Payments Toggle */}
      {activeTab === 'PAYMENTS' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 max-w-2xl">
          <h2 className="font-serif text-xl text-white font-medium mb-1">
            Payment Gateways &amp; Methods
          </h2>
          <p className="text-xs text-white/50 mb-6">
            Enable or disable customer-facing payment gateways.
          </p>

          <form onSubmit={handleSavePayments} className="space-y-4 text-xs font-sans">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <strong className="text-white text-sm block">Prepaid Razorpay Gateway</strong>
                <p className="text-white/50 text-[11px]">
                  Accept UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards, Net Banking
                </p>
              </div>
              <input
                type="checkbox"
                checked={paymentForm.prepaidEnabled}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, prepaidEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-[#5B0F18] cursor-pointer"
              />
            </div>

            <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
              <div>
                <strong className="text-white text-sm block">Cash on Delivery (COD)</strong>
                <p className="text-white/50 text-[11px]">
                  Doorstep cash collection managed through Shiprocket express couriers
                </p>
              </div>
              <input
                type="checkbox"
                checked={paymentForm.codEnabled}
                onChange={(e) => setPaymentForm({ ...paymentForm, codEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#5B0F18] cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#5B0F18] hover:bg-[#741522] text-white font-semibold flex items-center gap-2 shadow-md cursor-pointer mt-4"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Payment Toggles'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Storefront & Announcement Bar */}
      {activeTab === 'STOREFRONT' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] border border-white/10 max-w-2xl">
          <h2 className="font-serif text-xl text-white font-medium mb-1">
            Storefront Announcement &amp; Contact Info
          </h2>
          <p className="text-xs text-white/50 mb-6">
            Changes immediately update the announcement bar and footer of the public storefront.
          </p>

          <form onSubmit={handleSaveStorefront} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-white/70 font-medium mb-1.5">
                Top Announcement Bar Message *
              </label>
              <input
                type="text"
                required
                value={storefrontForm.announcementBarMessage}
                onChange={(e) =>
                  setStorefrontForm({
                    ...storefrontForm,
                    announcementBarMessage: e.target.value,
                  })
                }
                className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C6A15B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 font-medium mb-1.5">
                  Concierge Phone Number
                </label>
                <input
                  type="text"
                  value={storefrontForm.storePhone}
                  onChange={(e) =>
                    setStorefrontForm({ ...storefrontForm, storePhone: e.target.value })
                  }
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-white/70 font-medium mb-1.5">
                  Concierge Email
                </label>
                <input
                  type="email"
                  value={storefrontForm.storeEmail}
                  onChange={(e) =>
                    setStorefrontForm({ ...storefrontForm, storeEmail: e.target.value })
                  }
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#5B0F18] hover:bg-[#741522] text-white font-semibold flex items-center gap-2 shadow-md cursor-pointer mt-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Storefront Settings'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

