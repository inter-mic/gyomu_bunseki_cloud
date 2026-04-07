import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateMarkdown } from '@/lib/openai';
import { buildProjectContext, contextToPromptJson } from '@/lib/projectContext';

const RFP_SYSTEM = `あなたは中立的な業務分析コンサルタントです。顧客入力と既存のAI分析結果をもとに、RFPの叩き台をMarkdownで作成してください。
含めるべきセクション:
1. 背景
2. 現状課題
3. 目的
4. 対象範囲
5. 必要機能（案）
6. 非機能要件（簡易）
7. 進め方（案）
8. ベンダーに確認したい事項

注意: 顧客の意思決定支援が目的です。「作らない」「既存ツール活用」も視野に入れた中立的な記述にしてください。確実でない情報は推測ではなく「(要確認)」と書いてください。`;

export default async function RfpTab({ params }: { params: { id: string } }) {
  const supabase = db();
  const { data: rfp } = await supabase
    .from('rfp_drafts')
    .select('*')
    .eq('project_id', params.id)
    .maybeSingle();

  async function generate() {
    'use server';
    const ctx = await buildProjectContext(params.id);
    const supabase = db();
    const { data: analyses } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('project_id', params.id);
    const json = contextToPromptJson(ctx);
    const analysesText = (analyses ?? [])
      .map((a) => `## ${a.kind}\n${a.content_md ?? ''}`)
      .join('\n\n');
    const md = await generateMarkdown(
      RFP_SYSTEM,
      `顧客入力データ:\n${json}\n\nこれまでのAI分析結果:\n${analysesText}\n\nこの内容をもとにRFPの叩き台を出力してください。`
    );
    await supabase
      .from('rfp_drafts')
      .upsert({ project_id: params.id, content_md: md }, { onConflict: 'project_id' });
    revalidatePath(`/admin/projects/${params.id}/rfp`);
  }

  async function save(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase
      .from('rfp_drafts')
      .upsert(
        { project_id: params.id, content_md: String(formData.get('content_md') || '') },
        { onConflict: 'project_id' }
      );
    revalidatePath(`/admin/projects/${params.id}/rfp`);
  }

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="font-bold">RFP 叩き台</h2>
          <p className="text-sm text-gray-600">AI が顧客入力＋分析結果からRFPを下書きします。生成後は自由に編集してください。</p>
        </div>
        <form action={generate}>
          <button className="btn-primary">AIで{rfp ? '再生成' : '生成'}</button>
        </form>
      </div>
      <form action={save} className="card space-y-2">
        <textarea
          name="content_md"
          rows={28}
          defaultValue={rfp?.content_md ?? ''}
          className="input font-mono text-xs"
          placeholder="ここにRFPのMarkdownが入ります"
        />
        <button className="btn-secondary">保存</button>
      </form>
    </div>
  );
}
