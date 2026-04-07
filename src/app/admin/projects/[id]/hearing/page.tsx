import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateMarkdown } from '@/lib/openai';
import { buildProjectContext, contextToPromptJson } from '@/lib/projectContext';

export default async function HearingTab({ params }: { params: { id: string } }) {
  const supabase = db();
  const { data: notes } = await supabase
    .from('hearing_notes')
    .select('*')
    .eq('project_id', params.id)
    .order('created_at');

  async function addNote(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('hearing_notes').insert({
      project_id: params.id,
      question: String(formData.get('question')),
      answer: String(formData.get('answer') || '') || null,
      source: 'manual',
    });
    revalidatePath(`/admin/projects/${params.id}/hearing`);
  }

  async function delNote(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase.from('hearing_notes').delete().eq('id', String(formData.get('id')));
    revalidatePath(`/admin/projects/${params.id}/hearing`);
  }

  async function updateAnswer(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase
      .from('hearing_notes')
      .update({ answer: String(formData.get('answer') || '') })
      .eq('id', String(formData.get('id')));
    revalidatePath(`/admin/projects/${params.id}/hearing`);
  }

  async function generateAiQuestions() {
    'use server';
    const ctx = await buildProjectContext(params.id);
    const json = contextToPromptJson(ctx);
    const md = await generateMarkdown(
      `あなたは業務分析コンサルタントです。顧客入力をもとに、追加で確認すべき質問を10個出してください。観点: 業務の前後関係、頻度、例外処理、ツール、属人化、ミスの発生源、意思決定者。出力は箇条書きの質問のみ (Markdown)。`,
      `顧客入力データ:\n${json}\n\n上記から、ヒアリングで追加で確認したい質問だけを箇条書きで出してください。`
    );
    const supabase = db();
    // 単純化のため Markdown を行ごとに分割し、- や 数字. で始まる行を質問として登録
    const lines = md.split('\n').map((l) => l.replace(/^[-*\d.\s]+/, '').trim()).filter(Boolean);
    if (lines.length) {
      await supabase.from('hearing_notes').insert(
        lines.slice(0, 15).map((q) => ({
          project_id: params.id,
          question: q,
          source: 'ai',
        }))
      );
    }
    revalidatePath(`/admin/projects/${params.id}/hearing`);
  }

  return (
    <div className="space-y-6">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="font-bold">ヒアリング質問の自動生成</h2>
          <p className="text-sm text-gray-600">AI が顧客入力から不足を推測し、追加で聞くべき質問を提案します。</p>
        </div>
        <form action={generateAiQuestions}>
          <button className="btn-primary">AIに生成させる</button>
        </form>
      </div>

      <div className="card">
        <h2 className="font-bold mb-3">ヒアリングメモ</h2>
        <div className="space-y-3 mb-6">
          {notes?.map((n) => (
            <div key={n.id} className="border rounded p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium">
                  {n.source === 'ai' && <span className="badge-blue mr-2">AI</span>}
                  Q. {n.question}
                </div>
                <form action={delNote}>
                  <input type="hidden" name="id" value={n.id} />
                  <button className="text-xs text-red-600 hover:underline">削除</button>
                </form>
              </div>
              <form action={updateAnswer} className="mt-2 flex gap-2">
                <input type="hidden" name="id" value={n.id} />
                <textarea
                  name="answer"
                  rows={2}
                  defaultValue={n.answer ?? ''}
                  className="input flex-1"
                  placeholder="回答メモ"
                />
                <button className="btn-secondary self-start">保存</button>
              </form>
            </div>
          ))}
          {!notes?.length && <p className="text-sm text-gray-500">まだメモはありません</p>}
        </div>

        <form action={addNote} className="space-y-2 border-t pt-4">
          <h3 className="font-medium">質問を手動で追加</h3>
          <input name="question" required placeholder="質問" className="input" />
          <textarea name="answer" rows={2} placeholder="回答 (任意)" className="input" />
          <button className="btn-primary">追加</button>
        </form>
      </div>
    </div>
  );
}
