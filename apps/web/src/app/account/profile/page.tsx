'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, CheckCircle2, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import Container from '@/components/ui/Container';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateProfile, openOtpModal } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openOtpModal('/account/profile');
    }
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user, isAuthenticated, isLoading, openOtpModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProfile({ name: name.trim(), email: email.trim() || undefined });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="py-10 lg:py-16 bg-[#FAF6F0] min-h-screen text-[#0B0B0B]">
      <Container className="max-w-xl mx-auto">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-sans text-[#8B8178] hover:text-[#5B0F18] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account Overview</span>
        </Link>

        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E6D9C9] shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#E6D9C9]">
            <div className="w-10 h-10 rounded-full bg-[#5B0F18]/10 text-[#5B0F18] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl text-[#0B0B0B] font-medium">Personal Profile</h1>
              <p className="text-xs text-[#8B8178] font-sans">Manage your identity and contact details</p>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Your profile information has been saved successfully.</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block font-medium text-[#0B0B0B] mb-1.5">
                Verified Mobile Number
              </label>
              <input
                type="text"
                disabled
                value={user?.phone || ''}
                className="w-full bg-[#FAF6F0] border border-[#E6D9C9] rounded-xl px-3.5 py-3 text-sm text-[#7A6E64] cursor-not-allowed font-mono"
              />
              <p className="text-[11px] text-[#8B8178] mt-1">
                Your mobile number is your primary authenticated identity and cannot be altered.
              </p>
            </div>

            <div>
              <label className="block font-medium text-[#0B0B0B] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rajesh Sharma"
                className="w-full bg-white border border-[#E6D9C9] rounded-xl px-3.5 py-3 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#0B0B0B] mb-1.5">
                Email Address (For Invoices &amp; Tracking)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@example.com"
                className="w-full bg-white border border-[#E6D9C9] rounded-xl px-3.5 py-3 text-sm text-[#0B0B0B] focus:outline-none focus:border-[#5B0F18]"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full py-3.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}

