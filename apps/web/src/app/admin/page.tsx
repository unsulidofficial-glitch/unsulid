import { requireAdminAuth } from '@/lib/adminAuthGuard';
import AdminDashboardClient from './AdminDashboardClient';

export default function AdminDashboardPage() {
  // Server-side authentication guard: immediately redirects to /admin/login if no valid admin session cookie
  requireAdminAuth();

  return <AdminDashboardClient />;
}
