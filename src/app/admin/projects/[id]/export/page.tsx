import { exportProjectMarkdown } from '@/lib/markdown';

export default async function ExportTab({ params }: { params: { id: string } }) {
  const md = await exportProjectMarkdown(params.id);
  const dataUrl = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(md);

  return (
    <div className="space-y-4">
      <div className="card flex items-center justify-between">
        <div>
          <h2 className="font-bold">Markdown 出力</h2>
          <p className="text-sm text-gray-600">案件の現在の状態をすべて1ファイルのMarkdownに集約します。</p>
        </div>
        <a href={dataUrl} download={`gyomu-bunseki-${params.id}.md`} className="btn-primary">
          ダウンロード
        </a>
      </div>
      <pre className="card whitespace-pre-wrap text-xs font-mono leading-relaxed">{md}</pre>
    </div>
  );
}
