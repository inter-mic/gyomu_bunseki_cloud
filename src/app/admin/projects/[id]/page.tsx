import { db } from '@/lib/db';
import { buildProjectContext } from '@/lib/projectContext';
import { FREQUENCIES } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export default async function ProjectBasicTab({ params }: { params: { id: string } }) {
  const ctx = await buildProjectContext(params.id);
  const freqLabel = (v: string | null) =>
    FREQUENCIES.find((f) => f.value === v)?.label ?? v ?? '-';

  async function saveMemo(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase
      .from('projects')
      .update({ internal_memo: String(formData.get('internal_memo') || '') })
      .eq('id', params.id);
    revalidatePath(`/admin/projects/${params.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-bold mb-2">会社</h2>
        <ul className="text-sm space-y-1">
          <li>会社名: {ctx.organization?.name}</li>
          <li>業種: {ctx.organization?.industry ?? '-'}</li>
          <li>従業員数: {ctx.organization?.employee_count ?? '-'}</li>
          <li>担当: {ctx.project?.contact_name} ({ctx.project?.contact_email})</li>
        </ul>
      </div>

      <div className="card">
        <h2 className="font-bold mb-2">部署 / 拠点</h2>
        <div className="text-sm">
          <div className="font-medium">部署</div>
          <ul className="ml-4 list-disc">
            {ctx.departments?.map((d) => (
              <li key={d.id}>{d.name} ({d.headcount ?? '-'}名) — {d.description ?? ''}</li>
            ))}
          </ul>
          <div className="font-medium mt-3">拠点</div>
          <ul className="ml-4 list-disc">
            {ctx.offices?.map((o) => (
              <li key={o.id}>{o.name} — {o.address ?? ''}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2 className="font-bold mb-3">業務一覧 ({ctx.processes?.length ?? 0})</h2>
        <div className="space-y-3">
          {ctx.processes?.map((bp) => (
            <div key={bp.id} className="border rounded p-3 text-sm">
              <div className="font-semibold">
                {bp.name} <span className="badge-gray">{bp.category ?? '未分類'}</span>
              </div>
              <div className="text-gray-600">担当: {bp.department_name_cache ?? '-'} / {bp.headcount ?? '-'}名 / {freqLabel(bp.frequency)} / {bp.hours_per_run ?? '-'}h</div>
              <div className="text-gray-600">ツール: {bp.tools ?? '-'}</div>
              <div>困りごと: {bp.pains ?? '-'}</div>
              <div className="text-xs">
                {bp.is_attribute_dependent && <span className="badge-yellow mr-1">属人化</span>}
                {bp.has_mistakes && <span className="badge-yellow">ミス多発</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form action={saveMemo} className="card space-y-2">
        <h2 className="font-bold">内部メモ (顧客には見えません)</h2>
        <textarea
          name="internal_memo"
          rows={4}
          defaultValue={ctx.project?.internal_memo ?? ''}
          className="input"
        />
        <button className="btn-primary">メモを保存</button>
      </form>
    </div>
  );
}
