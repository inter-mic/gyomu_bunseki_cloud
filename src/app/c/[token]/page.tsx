import { loadProjectByToken } from '@/lib/customer';
import { db } from '@/lib/db';
import Link from 'next/link';

export default async function CustomerDashboard({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { welcome?: string };
}) {
  const { project, organization } = await loadProjectByToken(params.token);
  const supabase = db();
  const [{ count: deptCount }, { count: procCount }, { count: officeCount }] = await Promise.all([
    supabase.from('departments').select('*', { count: 'exact', head: true }).eq('project_id', project.id),
    supabase.from('business_processes').select('*', { count: 'exact', head: true }).eq('project_id', project.id),
    supabase.from('offices').select('*', { count: 'exact', head: true }).eq('project_id', project.id),
  ]);

  const base = `/c/${params.token}`;

  return (
    <div className="space-y-6">
      {searchParams.welcome && (
        <div className="card border-brand bg-blue-50">
          <p className="text-sm">
            お申込みありがとうございます。以下の専用URLは、後で続きを入力する際に必要です。<br />
            <strong className="break-all">{process.env.NEXT_PUBLIC_APP_URL || ''}/c/{params.token}</strong>
          </p>
        </div>
      )}
      <div className="card">
        <h1 className="text-xl font-bold mb-2">こんにちは、{organization?.name} 様</h1>
        <p className="text-sm text-gray-600">
          相談テーマ: <span className="font-medium text-gray-800">{project.theme}</span>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Link href={`${base}/basic`} className="card hover:shadow-md">
          <div className="text-sm text-gray-500">会社基本情報</div>
          <div className="text-2xl font-bold mt-1">編集</div>
        </Link>
        <Link href={`${base}/org`} className="card hover:shadow-md">
          <div className="text-sm text-gray-500">組織・拠点</div>
          <div className="text-2xl font-bold mt-1">{(deptCount ?? 0)}部署 / {(officeCount ?? 0)}拠点</div>
        </Link>
        <Link href={`${base}/processes`} className="card hover:shadow-md">
          <div className="text-sm text-gray-500">登録済み業務</div>
          <div className="text-2xl font-bold mt-1">{procCount ?? 0} 件</div>
        </Link>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">ご利用の流れ</h2>
        <ol className="text-sm text-gray-700 list-decimal pl-5 space-y-1">
          <li>会社基本情報・組織情報を入力</li>
          <li>業務情報を1つずつ追加</li>
          <li>「入力内容確認」で内容をチェック</li>
          <li>MIC側でAI分析・ヒアリングを進めます</li>
        </ol>
      </div>
    </div>
  );
}
