import { requireAdminAuth } from '@/lib/adminAuthGuard';
import AdminProductsClient from './AdminProductsClient';

export default function AdminProductsPage() {
  requireAdminAuth();
  return <AdminProductsClient />;
}
