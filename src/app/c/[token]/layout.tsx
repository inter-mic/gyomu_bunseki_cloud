import Link from 'next/link';
import { loadProjectByToken } from '@/lib/customer';

export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { token: string };
}) {
  const { project, organization } = await loadProjectByToken(params.token);
  const base = `/c/${params.token}`;

  const navItems = [
    { href: `${base}`, label: 'ダッシュボード' },
    { href: `${base}/basic`, label: '会社基本情報' },
    { href: `${base}/org`, label: '組織・拠点' },
    { href: `${base}/processes`, label: '業務一覧' },
    { href: `${base}/review`, label: '入力内容確認' },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="業務分析クラウド" className="h-10 md:h-12 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-500">ご利用中</div>
              <div className="text-sm font-semibold text-slate-800">{organization?.name}</div>
            </div>
            <Link
              href="/"
              className="text-xs px-3 py-2 rounded border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              ログアウト
            </Link>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1 text-sm">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="block px-3 py-2 rounded hover:bg-gray-200">
              {n.label}
            </Link>
          ))}
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
