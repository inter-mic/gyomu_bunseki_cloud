import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { PROJECT_STATUS_LABEL, ProjectStatus } from '@/lib/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  requireAdmin();
  const supabase = db();
  const { data: project } = await supabase
    .from('projects')
    .select('*, organizations(name)')
    .eq('id', params.id)
    .maybeSingle();
  if (!project) notFound();

  async function changeStatus(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('projects').update({ status: String(formData.get('status')) }).eq('id', params.id);
    revalidatePath(`/admin/projects/${params.id}`);
  }

  const base = `/admin/projects/${params.id}`;
  const tabs = [
    { href: base, label: '基本情報' },
    { href: `${base}/hearing`, label: 'ヒアリング' },
    { href: `${base}/analysis`, label: 'AI分析' },
    { href: `${base}/rfp`, label: 'RFP' },
    { href: `${base}/export`, label: 'Markdown出力' },
  ];

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-xs text-gray-500 hover:underline">← 案件一覧</Link>
          <h1 className="text-xl font-bold">{(project as any).organizations?.name}</h1>
          <p className="text-sm text-gray-600">{project.theme}</p>
          <p className="text-xs text-gray-500 mt-1">顧客URL: <code>/c/{project.customer_token}</code></p>
        </div>
        <form action={changeStatus} className="flex items-center gap-2">
          <span className="text-xs text-gray-500">ステータス</span>
          <select name="status" defaultValue={project.status} className="input">
            {Object.entries(PROJECT_STATUS_LABEL).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button className="btn-secondary">更新</button>
        </form>
      </div>

      <nav className="flex gap-1 text-sm border-b">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className="px-4 py-2 hover:bg-gray-100 rounded-t">
            {t.label}
          </Link>
        ))}
      </nav>

      <div>{children}</div>
    </div>
  );
}
