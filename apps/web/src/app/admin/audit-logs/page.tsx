import { requireAdminAuth } from '@/lib/adminAuthGuard';
import AdminAuditLogsClient from './AdminAuditLogsClient';

export default function AdminAuditLogsPage() {
  requireAdminAuth();
  return <AdminAuditLogsClient />;
}
