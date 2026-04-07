import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE = 'mic_admin';

export function isAdmin(): boolean {
  return cookies().get(ADMIN_COOKIE)?.value === '1';
}

export function requireAdmin() {
  if (!isAdmin()) redirect('/admin/login');
}

export function loginAdmin(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error('ADMIN_PASSWORD 未設定');
  if (password !== expected) return false;
  cookies().set(ADMIN_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return true;
}

export function logoutAdmin() {
  cookies().delete(ADMIN_COOKIE);
}
