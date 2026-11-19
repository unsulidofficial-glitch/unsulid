import { requireAdminAuth } from '@/lib/adminAuthGuard';
import AdminOrdersClient from './AdminOrdersClient';

export default function AdminOrdersPage() {
  requireAdminAuth();
  return <AdminOrdersClient />;
}
