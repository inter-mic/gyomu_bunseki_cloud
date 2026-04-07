import { loadProjectByToken } from '@/lib/customer';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export default async function BasicPage({ params }: { params: { token: string } }) {
  const { project, organization } = await loadProjectByToken(params.token);

  async function save(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase
      .from('organizations')
      .update({
        name: String(formData.get('name')),
        industry: String(formData.get('industry') || '') || null,
        employee_count: Number(formData.get('employee_count')) || null,
        office_count: Number(formData.get('office_count')) || null,
      })
      .eq('id', organization!.id);
    await supabase
      .from('projects')
      .update({
        theme: String(formData.get('theme') || ''),
        contact_name: String(formData.get('contact_name') || ''),
        contact_email: String(formData.get('contact_email') || ''),
        contact_phone: String(formData.get('contact_phone') || ''),
        notes: String(formData.get('notes') || ''),
      })
      .eq('id', project.id);
    revalidatePath(`/c/${params.token}/basic`);
  }

  return (
    <form action={save} className="card space-y-4">
      <h1 className="text-xl font-bold">会社基本情報</h1>
      <div>
        <label className="label">会社名 *</label>
        <input name="name" defaultValue={organization?.name ?? ''} required className="input" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div><label className="label">業種</label>
          <input name="industry" defaultValue={organization?.industry ?? ''} className="input" />
        </div>
        <div><label className="label">従業員数</label>
          <input name="employee_count" type="number" defaultValue={organization?.employee_count ?? ''} className="input" />
        </div>
        <div><label className="label">拠点数</label>
          <input name="office_count" type="number" defaultValue={organization?.office_count ?? ''} className="input" />
        </div>
      </div>
      <hr className="my-2" />
      <div>
        <label className="label">相談テーマ</label>
        <textarea name="theme" rows={3} defaultValue={project.theme ?? ''} className="input" />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div><label className="label">担当者名</label>
          <input name="contact_name" defaultValue={project.contact_name ?? ''} className="input" />
        </div>
        <div><label className="label">メール</label>
          <input name="contact_email" defaultValue={project.contact_email ?? ''} className="input" />
        </div>
        <div><label className="label">電話番号</label>
          <input name="contact_phone" defaultValue={project.contact_phone ?? ''} className="input" />
        </div>
      </div>
      <div>
        <label className="label">備考</label>
        <textarea name="notes" rows={2} defaultValue={project.notes ?? ''} className="input" />
      </div>
      <div className="pt-2"><button className="btn-primary">保存する</button></div>
    </form>
  );
}
