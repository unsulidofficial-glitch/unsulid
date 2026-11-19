import { requireAdminAuth } from '@/lib/adminAuthGuard';
import AdminCouponsClient from './AdminCouponsClient';

export default function AdminCouponsPage() {
  requireAdminAuth();
  return <AdminCouponsClient />;
}
