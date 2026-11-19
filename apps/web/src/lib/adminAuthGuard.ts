import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function requireAdminAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get('unsulid_admin_token')?.value;

  if (!token) {
    redirect('/admin/login');
  }

  return token;
}

