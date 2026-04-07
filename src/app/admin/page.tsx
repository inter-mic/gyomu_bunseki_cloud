import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { PROJECT_STATUS_LABEL, ProjectStatus } from '@/lib/types';
import Link from 'next/link';

export default async function AdminProjectsList() {
  requireAdmin();
  const supabase = db();
  const { data: projects } = await supabase
    .from('projects')
    .select('*, organizations(name)')
    .order('updated_at', { ascending: false });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">案件一覧</h1>
        <span className="text-sm text-gray-500">{projects?.length ?? 0} 件</span>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-600">
            <tr>
              <th className="px-4 py-2">顧客</th>
              <th className="px-4 py-2">テーマ</th>
              <th className="px-4 py-2">ステータス</th>
              <th className="px-4 py-2">AI</th>
              <th className="px-4 py-2">作成</th>
              <th className="px-4 py-2">更新</th>
            </tr>
          </thead>
          <tbody>
            {projects?.map((p: any) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <Link href={`/admin/projects/${p.id}`} className="text-brand hover:underline">
                    {p.organizations?.name ?? '-'}
                  </Link>
                </td>
                <td className="px-4 py-2">{p.theme}</td>
                <td className="px-4 py-2"><span className="badge-blue">{PROJECT_STATUS_LABEL[p.status as ProjectStatus] ?? p.status}</span></td>
                <td className="px-4 py-2 text-xs">{p.ai_status ?? 'not_run'}</td>
                <td className="px-4 py-2 text-xs">{p.created_at?.slice(0, 10)}</td>
                <td className="px-4 py-2 text-xs">{p.updated_at?.slice(0, 10)}</td>
              </tr>
            ))}
            {!projects?.length && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-gray-500">案件はまだありません</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
