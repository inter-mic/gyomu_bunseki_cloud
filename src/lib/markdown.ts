import { buildProjectContext } from './projectContext';
import { db } from './db';

/**
 * 案件1件を Markdown 全体レポートにエクスポートする
 */
export async function exportProjectMarkdown(projectId: string): Promise<string> {
  const ctx = await buildProjectContext(projectId);
  const supabase = db();
  const [{ data: analyses }, { data: rfp }] = await Promise.all([
    supabase.from('analysis_results').select('*').eq('project_id', projectId),
    supabase.from('rfp_drafts').select('*').eq('project_id', projectId).maybeSingle(),
  ]);

  const lines: string[] = [];
  const p = ctx.project;
  const org = ctx.organization;

  lines.push(`# 業務分析レポート: ${org?.name ?? '(顧客名未入力)'}`);
  lines.push('');
  lines.push(`- 作成日: ${new Date().toISOString().slice(0, 10)}`);
  lines.push(`- 相談テーマ: ${p?.theme ?? '-'}`);
  lines.push(`- 担当者: ${p?.contact_name ?? '-'} (${p?.contact_email ?? '-'})`);
  lines.push('');

  lines.push('## 1. 会社基本情報');
  lines.push(`- 会社名: ${org?.name ?? '-'}`);
  lines.push(`- 業種: ${org?.industry ?? '-'}`);
  lines.push(`- 従業員数: ${org?.employee_count ?? '-'}`);
  lines.push(`- 拠点数: ${org?.office_count ?? '-'}`);
  lines.push('');

  lines.push('## 2. 拠点');
  if (ctx.offices && ctx.offices.length) {
    for (const o of ctx.offices) {
      lines.push(`- **${o.name}** / ${o.address ?? ''} / 従業員 ${o.employee_count ?? '-'}`);
    }
  } else lines.push('_未入力_');
  lines.push('');

  lines.push('## 3. 部署');
  if (ctx.departments && ctx.departments.length) {
    for (const d of ctx.departments) {
      lines.push(`- **${d.name}** / ${d.headcount ?? '-'}名 — ${d.description ?? ''}`);
    }
  } else lines.push('_未入力_');
  lines.push('');

  lines.push('## 4. 業務一覧');
  if (ctx.processes && ctx.processes.length) {
    for (const bp of ctx.processes) {
      lines.push(`### ${bp.name} (${bp.category ?? '未分類'})`);
      lines.push(`- 担当部署: ${bp.department_name_cache ?? '-'}`);
      lines.push(`- 担当人数: ${bp.headcount ?? '-'} / 頻度: ${bp.frequency ?? '-'} / 1回工数: ${bp.hours_per_run ?? '-'}h`);
      lines.push(`- 使用ツール: ${bp.tools ?? '-'}`);
      lines.push(`- 概要: ${bp.summary ?? '-'}`);
      lines.push(`- 困りごと: ${bp.pains ?? '-'}`);
      lines.push(`- 属人化: ${bp.is_attribute_dependent ? 'あり' : 'なし'} / 手戻り: ${bp.has_mistakes ? 'あり' : 'なし'}`);
      if (bp.notes) lines.push(`- 備考: ${bp.notes}`);
      lines.push('');
    }
  } else lines.push('_未入力_');
  lines.push('');

  lines.push('## 5. ヒアリングメモ');
  if (ctx.hearings && ctx.hearings.length) {
    for (const h of ctx.hearings) {
      lines.push(`- **Q.** ${h.question}`);
      if (h.answer) lines.push(`  - **A.** ${h.answer}`);
    }
  } else lines.push('_未入力_');
  lines.push('');

  const findKind = (k: string) => analyses?.find((a) => a.kind === k)?.content_md;
  lines.push('## 6. AI 業務構造化');
  lines.push(findKind('structuring') || '_未生成_');
  lines.push('');
  lines.push('## 7. 課題抽出');
  lines.push(findKind('issues') || '_未生成_');
  lines.push('');
  lines.push('## 8. 改善方針');
  lines.push(findKind('improvements') || '_未生成_');
  lines.push('');
  lines.push('## 9. RFP 叩き台');
  lines.push(rfp?.content_md || '_未生成_');
  lines.push('');

  return lines.join('\n');
}
