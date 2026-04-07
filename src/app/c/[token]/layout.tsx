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
      <header className="bg-brand text-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs opacity-80">業務分析クラウド</div>
            <div className="font-bold">{organization?.name}</div>
          </div>
          <div className="text-xs opacity-80">専用URL方式 / 共有時はご注意ください</div>
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
