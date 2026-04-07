import { redirect } from 'next/navigation';
import { loginAdmin } from '@/lib/auth';

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  async function login(formData: FormData) {
    'use server';
    const ok = loginAdmin(String(formData.get('password') || ''));
    if (!ok) redirect('/admin/login?error=1');
    redirect('/admin');
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form action={login} className="card w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">管理者ログイン</h1>
        <div>
          <label className="label">パスワード</label>
          <input type="password" name="password" className="input" required autoFocus />
        </div>
        {searchParams.error && (
          <p className="text-sm text-red-600">パスワードが違います</p>
        )}
        <button className="btn-primary w-full">ログイン</button>
      </form>
    </main>
  );
}
