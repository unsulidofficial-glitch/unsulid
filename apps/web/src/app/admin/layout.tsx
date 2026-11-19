'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  Users,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Skip layout shell on /admin/login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Client-side quick check: if no admin token exists in localStorage or cookies, immediately redirect
    const hasLocalToken =
      typeof window !== 'undefined' &&
      (Boolean(localStorage.getItem('unsulid_admin_token')) ||
        document.cookie.includes('unsulid_admin_token='));

    if (!hasLocalToken) {
      window.location.replace('/admin/login');
      return;
    }

    api.admin
      .me()
      .then((res) => {
        if (res?.admin) {
          setAdmin(res.admin);
          setLoading(false);
        } else {
          throw new Error('Unauthorized');
        }
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('unsulid_admin_token');
          document.cookie = 'unsulid_admin_token=; path=/; max-age=0; SameSite=Lax';
          window.location.replace('/admin/login');
        }
      });
  }, [pathname, isLoginPage]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Strict Protection Gate: If loading or not authenticated, NEVER render children or admin dashboard shell
  if (loading || !admin) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-[#5B0F18] text-[#C6A15B] flex items-center justify-center mb-4 border border-[#C6A15B]/30 shadow-2xl animate-pulse">
          <ShieldCheck className="w-7 h-7 stroke-[1.5]" />
        </div>
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#C6A15B] font-bold mb-1">
          SECURITY GATEWAY
        </span>
        <h2 className="font-serif text-2xl text-white font-medium mb-1">Authenticating Admin Portal...</h2>
        <p className="text-xs text-white/50 font-sans">Authorized personnel only</p>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await api.admin.logout();
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('unsulid_admin_token');
        document.cookie = 'unsulid_admin_token=; path=/; max-age=0; SameSite=Lax';
        window.location.replace('/admin/login');
      }
    }
  };

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Prices', href: '/admin/products', icon: Package },
    { label: 'Offers & Coupons', href: '/admin/coupons', icon: Tag },
    { label: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Trail', href: '/admin/audit-logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] text-[#F8F1E7] flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="lg:hidden h-16 bg-[#141414] border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 text-white/80 hover:text-white"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-serif text-lg font-bold text-white tracking-wider">UNSULID® ADMIN</span>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#5B0F18] text-[#C6A15B]">
          {admin?.role || 'SUPER_ADMIN'}
        </span>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:sticky top-0 left-0 bottom-0 z-40 w-64 bg-[#141414] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin" className="block">
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-[#C6A15B] font-bold block mb-1">
                EXECUTIVE CONTROL
              </span>
              <h2 className="font-serif text-2xl font-bold tracking-wider text-white">
                UNSULID<span className="text-xs text-[#C6A15B]">®</span>
              </h2>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium transition-all ${
                    isActive
                      ? 'bg-[#5B0F18] text-white shadow-md font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] font-mono text-white/50 block">Logged in as</span>
            <strong className="text-xs text-white block truncate">{admin?.email}</strong>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#C6A15B]/20 text-[#C6A15B] uppercase">
              {admin?.role}
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}

