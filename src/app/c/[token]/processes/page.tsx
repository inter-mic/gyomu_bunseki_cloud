import { loadProjectByToken } from '@/lib/customer';
import { db } from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function ProcessesPage({ params }: { params: { token: string } }) {
  const { project } = await loadProjectByToken(params.token);
  const supabase = db();
  const { data: list } = await supabase
    .from('business_processes')
    .select('*')
    .eq('project_id', project.id)
    .order('created_at');

  async function quickAdd(formData: FormData) {
    'use server';
    const supabase = db();
    const { data } = await supabase
      .from('business_processes')
      .insert({ project_id: project.id, name: String(formData.get('name')) })
      .select()
      .single();
    if (data) redirect(`/c/${params.token}/processes/${data.id}`);
  }

  async function del(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('business_processes').delete().eq('id', String(formData.get('id')));
    revalidatePath(`/c/${params.token}/processes`);
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="font-bold text-lg mb-3">業務一覧</h2>
        <p className="text-sm text-gray-600 mb-4">
          1業務ずつ追加してください。後からいつでも編集できます。
        </p>
        <div className="space-y-2 mb-4">
          {(list ?? []).map((bp) => (
            <div key={bp.id} className="flex items-center justify-between border rounded px-3 py-2">
              <div>
                <Link href={`/c/${params.token}/processes/${bp.id}`} className="font-medium hover:underline">
                  {bp.name}
                </Link>
                <span className="badge-gray ml-2">{bp.category ?? '未分類'}</span>
                <span className="text-xs text-gray-500 ml-2">{bp.frequency ?? ''}</span>
              </div>
              <form action={del}>
                <input type="hidden" name="id" value={bp.id} />
                <button className="text-xs text-red-600 hover:underline">削除</button>
              </form>
            </div>
          ))}
          {!list?.length && <p className="text-sm text-gray-500">まだ業務が登録されていません</p>}
        </div>

        <form action={quickAdd} className="flex gap-2">
          <input name="name" required placeholder="業務名 (例: 受注処理)" className="input flex-1" />
          <button className="btn-primary">追加して詳細を入力</button>
        </form>
      </div>
    </div>
  );
}
