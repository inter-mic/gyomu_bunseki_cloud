import { loadProjectByToken } from '@/lib/customer';
import { buildProjectContext } from '@/lib/projectContext';
import { FREQUENCIES } from '@/lib/types';

export default async function ReviewPage({ params }: { params: { token: string } }) {
  const { project } = await loadProjectByToken(params.token);
  const ctx = await buildProjectContext(project.id);
  const freqLabel = (v: string | null) => FREQUENCIES.find((f) => f.value === v)?.label ?? v ?? '-';

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-xl font-bold mb-4">入力内容の確認</h1>
        <p className="text-sm text-gray-600">
          以下の内容で MIC 側に共有されます。修正がある場合は左メニューから戻って編集してください。
        </p>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">会社</h2>
        <ul className="text-sm space-y-1">
          <li>会社名: {ctx.organization?.name}</li>
          <li>業種: {ctx.organization?.industry ?? '-'}</li>
          <li>従業員数: {ctx.organization?.employee_count ?? '-'}</li>
          <li>テーマ: {ctx.project?.theme ?? '-'}</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">部署 ({ctx.departments?.length ?? 0})</h2>
        <ul className="text-sm space-y-1">
          {ctx.departments?.map((d) => (
            <li key={d.id}>・{d.name} ({d.headcount ?? '-'}名) — {d.description ?? ''}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">拠点 ({ctx.offices?.length ?? 0})</h2>
        <ul className="text-sm space-y-1">
          {ctx.offices?.map((o) => (
            <li key={o.id}>・{o.name} — {o.address ?? ''} ({o.employee_count ?? '-'}名)</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="font-bold mb-3">業務 ({ctx.processes?.length ?? 0})</h2>
        <div className="space-y-3">
          {ctx.processes?.map((bp) => (
            <div key={bp.id} className="border rounded p-3 text-sm">
              <div className="font-semibold">{bp.name} <span className="badge-gray">{bp.category ?? '未分類'}</span></div>
              <div className="text-gray-600 mt-1">
                担当: {bp.department_name_cache ?? '-'} / {bp.headcount ?? '-'}名 / {freqLabel(bp.frequency)} / {bp.hours_per_run ?? '-'}h
              </div>
              <div className="text-gray-600 mt-1">ツール: {bp.tools ?? '-'}</div>
              <div className="text-gray-700 mt-1">困りごと: {bp.pains ?? '-'}</div>
              <div className="text-xs mt-1">
                {bp.is_attribute_dependent && <span className="badge-yellow mr-1">属人化</span>}
                {bp.has_mistakes && <span className="badge-yellow">ミス多発</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
