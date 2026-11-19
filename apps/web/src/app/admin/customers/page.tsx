import { requireAdminAuth } from '@/lib/adminAuthGuard';
import AdminCustomersClient from './AdminCustomersClient';

export default function AdminCustomersPage() {
  requireAdminAuth();
  return <AdminCustomersClient />;
}
