import { loadProjectByToken } from '@/lib/customer';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function OrgPage({ params }: { params: { token: string } }) {
  const { project } = await loadProjectByToken(params.token);
  const supabase = db();
  const [{ data: depts }, { data: offices }] = await Promise.all([
    supabase.from('departments').select('*').eq('project_id', project.id).order('created_at'),
    supabase.from('offices').select('*').eq('project_id', project.id).order('created_at'),
  ]);

  async function addDept(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('departments').insert({
      project_id: project.id,
      name: String(formData.get('name')),
      headcount: Number(formData.get('headcount')) || null,
      description: String(formData.get('description') || '') || null,
    });
    revalidatePath(`/c/${params.token}/org`);
  }

  async function deleteDept(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('departments').delete().eq('id', String(formData.get('id')));
    revalidatePath(`/c/${params.token}/org`);
  }

  async function addOffice(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('offices').insert({
      project_id: project.id,
      name: String(formData.get('name')),
      address: String(formData.get('address') || '') || null,
      employee_count: Number(formData.get('employee_count')) || null,
    });
    revalidatePath(`/c/${params.token}/org`);
  }

  async function deleteOffice(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('offices').delete().eq('id', String(formData.get('id')));
    revalidatePath(`/c/${params.token}/org`);
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-bold text-lg mb-3">部署一覧</h2>
        <div className="space-y-2 mb-4">
          {(depts ?? []).map((d) => (
            <div key={d.id} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
              <div>
                <span className="font-medium">{d.name}</span>
                <span className="text-gray-500 ml-2">{d.headcount ?? '-'}名</span>
                {d.description && <span className="text-gray-500 ml-2">— {d.description}</span>}
              </div>
              <form action={deleteDept}>
                <input type="hidden" name="id" value={d.id} />
                <button className="text-xs text-red-600 hover:underline">削除</button>
              </form>
            </div>
          ))}
          {!depts?.length && <p className="text-sm text-gray-500">まだ登録されていません</p>}
        </div>
        <form action={addDept} className="grid md:grid-cols-4 gap-2">
          <input name="name" required placeholder="部署名" className="input" />
          <input name="headcount" type="number" placeholder="人数" className="input" />
          <input name="description" placeholder="役割など" className="input md:col-span-1" />
          <button className="btn-primary">追加</button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-bold text-lg mb-3">拠点一覧</h2>
        <div className="space-y-2 mb-4">
          {(offices ?? []).map((o) => (
            <div key={o.id} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
              <div>
                <span className="font-medium">{o.name}</span>
                <span className="text-gray-500 ml-2">{o.address ?? ''}</span>
                <span className="text-gray-500 ml-2">{o.employee_count ?? '-'}名</span>
              </div>
              <form action={deleteOffice}>
                <input type="hidden" name="id" value={o.id} />
                <button className="text-xs text-red-600 hover:underline">削除</button>
              </form>
            </div>
          ))}
          {!offices?.length && <p className="text-sm text-gray-500">まだ登録されていません</p>}
        </div>
        <form action={addOffice} className="grid md:grid-cols-4 gap-2">
          <input name="name" required placeholder="拠点名" className="input" />
          <input name="address" placeholder="住所" className="input" />
          <input name="employee_count" type="number" placeholder="人数" className="input" />
          <button className="btn-primary">追加</button>
        </form>
      </div>
    </div>
  );
}
