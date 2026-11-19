import { requireAdminAuth } from '@/lib/adminAuthGuard';
import AdminSettingsClient from './AdminSettingsClient';

export default function AdminSettingsPage() {
  requireAdminAuth();
  return <AdminSettingsClient />;
}
