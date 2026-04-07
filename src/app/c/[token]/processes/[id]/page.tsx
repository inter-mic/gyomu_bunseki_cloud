import { loadProjectByToken } from '@/lib/customer';
import { db } from '@/lib/db';
import { BUSINESS_CATEGORIES, FREQUENCIES } from '@/lib/types';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProcessDetailPage({
  params,
}: {
  params: { token: string; id: string };
}) {
  const { project } = await loadProjectByToken(params.token);
  const supabase = db();
  const { data: bp } = await supabase
    .from('business_processes')
    .select('*')
    .eq('id', params.id)
    .eq('project_id', project.id)
    .maybeSingle();
  if (!bp) notFound();
  const { data: depts } = await supabase
    .from('departments')
    .select('id,name')
    .eq('project_id', project.id);

  async function save(formData: FormData) {
    'use server';
    const supabase = db();
    const deptId = String(formData.get('department_id') || '') || null;
    const deptName = depts?.find((d) => d.id === deptId)?.name ?? null;
    await supabase
      .from('business_processes')
      .update({
        name: String(formData.get('name')),
        category: String(formData.get('category') || '') || null,
        summary: String(formData.get('summary') || '') || null,
        department_id: deptId,
        department_name_cache: deptName,
        headcount: Number(formData.get('headcount')) || null,
        frequency: String(formData.get('frequency') || '') || null,
        hours_per_run: Number(formData.get('hours_per_run')) || null,
        tools: String(formData.get('tools') || '') || null,
        pains: String(formData.get('pains') || '') || null,
        is_attribute_dependent: formData.get('is_attribute_dependent') === 'on',
        has_mistakes: formData.get('has_mistakes') === 'on',
        notes: String(formData.get('notes') || '') || null,
      })
      .eq('id', params.id);
    redirect(`/c/${params.token}/processes`);
  }

  return (
    <form action={save} className="card space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">業務の詳細</h1>
        <Link href={`/c/${params.token}/processes`} className="text-sm text-gray-600 hover:underline">← 一覧に戻る</Link>
      </div>

      <div>
        <label className="label">業務名 *</label>
        <input name="name" required defaultValue={bp.name} className="input" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">業務カテゴリ</label>
          <select name="category" defaultValue={bp.category ?? ''} className="input">
            <option value="">— 選択 —</option>
            {BUSINESS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label">担当部署</label>
          <select name="department_id" defaultValue={bp.department_id ?? ''} className="input">
            <option value="">— 選択 —</option>
            {depts?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="label">業務概要</label>
        <textarea name="summary" rows={2} defaultValue={bp.summary ?? ''} className="input" placeholder="どのような業務か、何を扱うか" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="label">担当人数</label>
          <input name="headcount" type="number" defaultValue={bp.headcount ?? ''} className="input" />
        </div>
        <div><label className="label">実施頻度</label>
          <select name="frequency" defaultValue={bp.frequency ?? ''} className="input">
            <option value="">— 選択 —</option>
            {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div><label className="label">1回あたり工数 (h)</label>
          <input name="hours_per_run" type="number" step="0.1" defaultValue={bp.hours_per_run ?? ''} className="input" />
        </div>
      </div>

      <div>
        <label className="label">使用ツール / システム</label>
        <input name="tools" defaultValue={bp.tools ?? ''} className="input" placeholder="例: Excel, kintone, 紙" />
      </div>

      <div>
        <label className="label">困っていること</label>
        <textarea name="pains" rows={3} defaultValue={bp.pains ?? ''} className="input" placeholder="例: 転記ミスが多い、属人化している" />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_attribute_dependent" defaultChecked={bp.is_attribute_dependent} /> 属人化している
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="has_mistakes" defaultChecked={bp.has_mistakes} /> ミス・手戻りが起こりやすい
        </label>
      </div>

      <div>
        <label className="label">備考</label>
        <textarea name="notes" rows={2} defaultValue={bp.notes ?? ''} className="input" />
      </div>

      <div className="pt-2 flex gap-2">
        <button className="btn-primary">保存する</button>
        <Link href={`/c/${params.token}/processes`} className="btn-secondary">キャンセル</Link>
      </div>
    </form>
  );
}
