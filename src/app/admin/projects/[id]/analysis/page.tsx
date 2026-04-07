import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateMarkdown } from '@/lib/openai';
import { buildProjectContext, contextToPromptJson } from '@/lib/projectContext';

const KIND_LABEL: Record<string, string> = {
  structuring: '業務構造化',
  issues: '課題抽出',
  improvements: '改善方針',
};

const SYSTEM_PROMPTS: Record<string, string> = {
  structuring: `あなたは業務分析のプロです。顧客入力から、業務をカテゴリ別に整理し、重複や曖昧な業務、不足情報があれば指摘してください。Markdownで出力。`,
  issues: `あなたは業務分析のプロです。顧客入力から、以下の観点で課題を抽出してください: 属人化、二重入力、手作業、情報分断、承認滞留、ツール分散、工数過多、ミス発生源。Markdownで観点ごとに見出しを立てて整理。憶測ではなく、入力データに基づいて記述してください。`,
  improvements: `あなたは中立的な業務改善アドバイザーです。各課題に対し、(1)運用改善で解決、(2)既存SaaS活用、(3)システム化、(4)AI活用、(5)あえて何もしない、のいずれが妥当かを示してください。**何でもシステム開発に寄せないでください**。顧客の意思決定支援が目的です。Markdownで整理。`,
};

export default async function AnalysisTab({ params }: { params: { id: string } }) {
  const supabase = db();
  const { data: rows } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('project_id', params.id);
  const byKind: Record<string, any> = {};
  rows?.forEach((r) => (byKind[r.kind] = r));

  async function generate(kind: string) {
    'use server';
    const ctx = await buildProjectContext(params.id);
    const json = contextToPromptJson(ctx);
    const md = await generateMarkdown(SYSTEM_PROMPTS[kind], `顧客入力データ:\n${json}`);
    const supabase = db();
    await supabase
      .from('analysis_results')
      .upsert({ project_id: params.id, kind, content_md: md, generated_by: 'ai' }, { onConflict: 'project_id,kind' });
    await supabase.from('projects').update({ ai_status: 'generated' }).eq('id', params.id);
    revalidatePath(`/admin/projects/${params.id}/analysis`);
  }

  async function save(formData: FormData) {
    'use server';
    const supabase = db();
    await supabase
      .from('analysis_results')
      .upsert(
        {
          project_id: params.id,
          kind: String(formData.get('kind')),
          content_md: String(formData.get('content_md') || ''),
        },
        { onConflict: 'project_id,kind' }
      );
    revalidatePath(`/admin/projects/${params.id}/analysis`);
  }

  const kinds = ['structuring', 'issues', 'improvements'] as const;

  return (
    <div className="space-y-6">
      {kinds.map((kind) => (
        <div key={kind} className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">{KIND_LABEL[kind]}</h2>
            <form action={generate.bind(null, kind)}>
              <button className="btn-primary">AIで{byKind[kind] ? '再生成' : '生成'}</button>
            </form>
          </div>
          <form action={save} className="space-y-2">
            <input type="hidden" name="kind" value={kind} />
            <textarea
              name="content_md"
              rows={12}
              defaultValue={byKind[kind]?.content_md ?? ''}
              className="input font-mono text-xs"
              placeholder="AIで生成するか、手動で書いてください (Markdown)"
            />
            <button className="btn-secondary">保存</button>
          </form>
        </div>
      ))}
    </div>
  );
}
