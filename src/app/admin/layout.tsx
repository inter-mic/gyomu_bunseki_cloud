import Link from 'next/link';
import { isAdmin, logoutAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // login ページは認証不要 (このlayoutは全adminに適用される)
  // login ページは個別判定するため、ここで一律にrequireしない
  async function logout() {
    'use server';
    logoutAdmin();
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen">
      <header className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/admin" className="font-bold">業務分析クラウド / 管理</Link>
          {isAdmin() && (
            <form action={logout}>
              <button className="text-xs opacity-80 hover:opacity-100">ログアウト</button>
            </form>
          )}
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
}
