'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Container from '@/components/ui/Container';
import { api } from '@/lib/api';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.admin.login({ email: email.trim(), password });
      if (res?.success) {
        let target = '/admin';
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const redirect = urlParams.get('redirect');
          if (redirect && redirect.startsWith('/admin')) {
            target = redirect;
          }
          window.location.href = target;
        } else {
          router.push(target);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid administrative credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-4">
      <Container className="max-w-md mx-auto">
        <div className="bg-[#141414] rounded-3xl border border-white/10 p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#5B0F18] text-[#C6A15B] flex items-center justify-center mx-auto mb-4 border border-[#C6A15B]/30 shadow-lg">
              <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
            </div>
            <span className="text-[10px] uppercase font-sans tracking-[0.3em] text-[#C6A15B] font-bold block mb-1">
              CONTROL CENTER
            </span>
            <h1 className="font-serif text-3xl font-medium tracking-tight">UNSULID® Admin</h1>
            <p className="text-xs text-white/50 font-sans mt-1">
              Authorized personnel and business operations
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs font-sans flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-white/80 font-medium mb-1.5">
                Administrator Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-white/40 absolute left-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@unsulid.com"
                  className="w-full bg-black/60 border border-white/15 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 font-medium mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-white/40 absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  autoComplete="current-password"
                  className="w-full bg-black/60 border border-white/15 rounded-xl py-3 pl-10 pr-11 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C6A15B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#5B0F18] text-[#F8F1E7] font-sans font-semibold text-sm hover:bg-[#741522] transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-[10px] text-white/40 font-mono tracking-wider uppercase">
            Encrypted Administrative Session • Multi-Factor Security
          </div>
        </div>
      </Container>
    </div>
  );
}

