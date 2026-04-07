import Link from 'next/link';

/* ============================================================
 * Helper components
 * ============================================================ */

/**
 * 写真スロット。public/photos/ にファイルがあれば写真を表示し、
 * 無ければグラデーションで成立する。
 */
function PhotoFrame({
  src,
  alt,
  className = '',
  fallback = 'from-[#13315c] via-[#0b2545] to-[#13315c]',
  children,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative overflow-hidden bg-gradient-to-br ${fallback} ${className}`}
      style={{
        backgroundImage: `url(${src}), linear-gradient(135deg, var(--color-brand-2), var(--color-brand))`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* グラデの上に乗せる装飾 */}
      <div className="absolute inset-0 dot-grid opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent"></div>
      {children}
    </div>
  );
}

/**
 * 経営3資源「ヒト・モノ・カネ」フレームワーク図
 * 画像ファイル不要でインラインに描画する。
 */
function FrameworkDiagram() {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 md:p-7">
      <div className="text-center font-bold text-slate-800 mb-5 text-sm md:text-base">
        経営3資源「ヒト・モノ・カネ」の管理システム
      </div>

      {/* ====== ヒトの管理 ====== */}
      <div className="rounded-xl bg-violet-100/70 ring-2 ring-violet-300 p-4">
        <div className="text-violet-800 font-bold text-sm mb-3">「ヒト」の管理</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { tag: '社外', name: '仕入先', sub: '' },
            { tag: '社内', name: '従業員', sub: '人事評価/労務' },
            { tag: '社外', name: '得意先', sub: '顧客管理' },
          ].map((c) => (
            <div key={c.name} className="rounded-lg bg-violet-300/70 ring-1 ring-violet-400 p-2.5 text-center">
              <div className="text-[10px] text-violet-900/70 font-semibold">{c.tag}</div>
              <div className="text-violet-950 font-bold text-sm md:text-base mt-0.5">{c.name}</div>
              {c.sub && <div className="text-[10px] text-violet-900/80 mt-0.5">{c.sub}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ====== モノの管理 ====== */}
      <div className="mt-3 rounded-xl bg-amber-100/70 ring-2 ring-amber-300 p-4">
        <div className="text-amber-800 font-bold text-sm mb-3">
          「モノ」の管理 <span className="text-[10px] font-normal text-amber-700">材料・商品・資産 etc... の管理</span>
        </div>
        <div className="relative grid grid-cols-3 gap-2">
          {/* 上段: 仕入 → 在庫 → 販売 */}
          {[
            { name: '仕入', flag: '発注' },
            { name: '在庫', flag: '工程管理 / 物流管理' },
            { name: '販売', flag: '受注' },
          ].map((c) => (
            <div key={c.name} className="rounded-lg bg-amber-400/60 ring-1 ring-amber-500 p-3 text-center relative">
              <div className="text-amber-950 font-bold text-base md:text-lg">{c.name}</div>
              <div className="text-[10px] text-amber-900 mt-1">{c.flag}</div>
            </div>
          ))}
          {/* 矢印行 */}
          <div className="col-span-3 flex items-center justify-between text-amber-700 text-xs font-bold mt-1 px-2">
            <span>← モノ</span>
            <span>→</span>
            <span>→</span>
            <span>モノ →</span>
          </div>
          {/* 外注 */}
          <div className="col-span-3 mt-1 rounded-lg bg-amber-400/40 ring-1 ring-amber-500 p-2.5 text-center">
            <span className="text-amber-950 font-bold text-sm">外注</span>
            <span className="text-[10px] text-amber-900 ml-2">← 依頼</span>
          </div>
        </div>
      </div>

      {/* ====== カネの管理 ====== */}
      <div className="mt-3 rounded-xl bg-rose-100/70 ring-2 ring-rose-300 p-4">
        <div className="text-rose-800 font-bold text-sm mb-3">「カネ」の管理</div>
        <div className="grid grid-cols-3 gap-2">
          {['売掛金', '経費', '買掛金'].map((c) => (
            <div key={c} className="rounded-lg bg-rose-300/70 ring-1 ring-rose-400 p-2.5 text-center">
              <span className="text-rose-950 font-bold text-sm">{c}</span>
            </div>
          ))}
          {['出金 / 支払', '損益', '入金'].map((c) => (
            <div key={c} className="rounded-lg bg-rose-300/70 ring-1 ring-rose-400 p-2.5 text-center">
              <span className="text-rose-950 font-bold text-sm">{c}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-rose-700 text-xs font-bold mt-2 px-2">
          <span>← カネ</span>
          <span>請求 ↓ ↑ 支払</span>
          <span>カネ →</span>
        </div>
      </div>

      {/* ====== その他 ====== */}
      <div className="mt-3 rounded-xl bg-slate-200/60 ring-2 ring-slate-300 p-4">
        <div className="text-slate-700 font-bold text-sm mb-2">その他</div>
        <div className="rounded-lg bg-slate-300/70 ring-1 ring-slate-400 p-2.5 text-center">
          <span className="text-slate-800 font-bold text-sm">経営分析</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Page
 * ============================================================ */

export default function TopPage() {
  return (
    <main className="min-h-screen">
      {/* ===================== Header ===================== */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-30 border-b border-slate-200">
        <div className="container-wide py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="業務分析クラウド" className="h-12 md:h-14 w-auto object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#whatisrfp" className="nav-link">RFPとは</a>
            <a href="#failure" className="nav-link">失敗例</a>
            <a href="#service" className="nav-link">サービス</a>
            <a href="#framework" className="nav-link">分析手法</a>
            <a href="#case" className="nav-link">事例</a>
            <a href="#flow" className="nav-link">流れ</a>
            <Link href="/admin/login" className="nav-link">管理者ログイン</Link>
          </nav>
          <Link href="/signup" className="btn-primary text-xs px-4 py-2">無料で申し込む</Link>
        </div>
      </header>

      {/* ===================== Hero ===================== */}
      <section className="hero-bg border-b border-slate-200">
        <div className="container-wide py-20 md:py-28 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <span className="eyebrow">Business Analysis & RFP Support</span>
            <h1 className="h-display text-4xl md:text-5xl mt-4 text-[#0b2545]">
              業務を構造化し、<br />
              <span className="relative inline-block">
                RFPの叩き台
                <span className="absolute left-0 right-0 -bottom-1 h-2 bg-amber-300/60 -z-10"></span>
              </span>
              までAIが下書きする。
            </h1>
            <p className="mt-6 text-slate-600 leading-relaxed md:text-lg max-w-xl">
              MIC が長年積み上げてきた業務分析・RFP作成のノウハウを、AIと組み合わせてお客様にお届けします。
              <strong className="text-slate-900">「作る／作らない／既存ツールで済ませる」</strong>
              まで含めて、中立的に意思決定を支援します。
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup" className="btn-primary text-base px-6 py-3">無料で申し込む →</Link>
              <a href="#whatisrfp" className="btn-secondary">そもそもRFPって？</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>● 標準納期 約2ヶ月 / 訪問5回</span>
              <span>● 900,000円〜（税抜）</span>
              <span>● 省力化投資補助金の前提資料に活用可</span>
              <span>● 開発受注に縛られない中立支援</span>
            </div>
          </div>

          {/* Hero visual: photo slot + floating project card */}
          <div className="relative">
            <PhotoFrame
              src="/photos/hero.jpg"
              alt="業務分析の打ち合わせ"
              className="aspect-[4/3] rounded-2xl shadow-2xl"
            >
              {/* PhotoFrame fallback の上に重ねる装飾 */}
              <div className="absolute bottom-4 left-4 right-4 text-white/80 text-[11px] tracking-widest font-semibold">
                MIC × AI — Business Analysis Platform
              </div>
            </PhotoFrame>
            {/* Floating project card */}
            <div className="absolute -bottom-8 -left-4 md:-left-10 w-[88%] md:w-[78%] card-flat p-5 shadow-xl border-slate-200/80 bg-white">
              <div className="flex items-center gap-2">
                <span className="badge-navy">分析中</span>
                <span className="text-xs text-slate-500">PROJECT-2026-04</span>
              </div>
              <div className="mt-2 font-bold text-sm">受発注業務 / 工数削減プロジェクト</div>
              <div className="mt-3 space-y-1.5">
                {[
                  { n: 1, t: '業務情報を入力', s: '完了', c: 'text-emerald-600' },
                  { n: 2, t: 'AIが課題を抽出', s: '完了', c: 'text-emerald-600' },
                  { n: 3, t: 'RFP叩き台を生成', s: '処理中', c: 'text-amber-600' },
                ].map((r) => (
                  <div key={r.n} className="flex items-center gap-2 text-xs">
                    <span className="step-num text-[10px] w-5 h-5">{r.n}</span>
                    <span className="flex-1 text-slate-700">{r.t}</span>
                    <span className={`${r.c} font-semibold`}>{r.s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-lg bg-slate-50 p-2.5 text-[11px] text-slate-600 leading-relaxed">
                <strong className="text-slate-800">AI:</strong>「受注処理は属人化が顕著。既存SaaS活用で解決可能と推定。」
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-amber-300/30 blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* ===================== What is RFP ===================== */}
      <section id="whatisrfp" className="py-24">
        <div className="container-wide">
          <PhotoFrame
            src="/photos/meeting.jpg"
            alt="商談・打合せの様子"
            className="rounded-2xl h-48 md:h-64 mb-12 shadow-lg"
          />
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">What is RFP?</span>
            <h2 className="h-section text-3xl mt-3">そもそもRFPって何？</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              「RFPって聞いたことはあるけど、よく分からない」という方こそ、ぜひ読んでください。
              業務改善やシステム導入で<strong>失敗するか成功するかは、ここで9割決まります</strong>。
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-[1.1fr_1fr] gap-10 items-center">
            {/* Left: definition card */}
            <div className="card relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-200/50 blur-3xl"></div>
              <div className="relative">
                <div className="text-[11px] tracking-widest font-bold text-amber-600">DEFINITION</div>
                <div className="mt-2 text-3xl font-black text-[#0b2545]">RFP</div>
                <div className="text-sm text-slate-500 -mt-1">Request for Proposal</div>
                <div className="mt-3 text-2xl font-bold">＝ 提案依頼書</div>
                <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                  「こういう業務を、こういう目的で改善したい。だから、こんなシステムや仕組みを提案してください」
                  と、<strong>発注側がベンダーに渡す依頼書</strong>のことです。
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-[10px] tracking-widest font-bold text-slate-500">WHO</div>
                    <div className="text-sm font-bold mt-0.5">発注する側が作る</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-[10px] tracking-widest font-bold text-slate-500">WHEN</div>
                    <div className="text-sm font-bold mt-0.5">発注先を決める前</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-[10px] tracking-widest font-bold text-slate-500">WHY</div>
                    <div className="text-sm font-bold mt-0.5">複数社を比較するため</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="text-[10px] tracking-widest font-bold text-slate-500">WHAT</div>
                    <div className="text-sm font-bold mt-0.5">背景・目的・要件</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: 3 reasons why RFP matters */}
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-700">なぜRFPが必要なのか？</div>
              {[
                {
                  n: '01',
                  t: '複数のベンダーを公正に比較できる',
                  d: '同じ依頼書を渡せば、各社の提案を並べて比較できます。RFPがないと、各社バラバラな前提で見積もりが返ってきて比較になりません。',
                },
                {
                  n: '02',
                  t: '「こんなはずじゃなかった」を防げる',
                  d: '欲しいものを言葉にして書き出す過程で、社内の認識ズレが浮き彫りになります。発注前に齟齬を解消できる、最後のチャンスです。',
                },
                {
                  n: '03',
                  t: '本当に作るべきか冷静に判断できる',
                  d: '書き出してみて初めて「これは運用で解決できる」「既存SaaSで足りる」と気付くことがあります。RFP作成は意思決定そのものです。',
                },
              ].map((r) => (
                <div key={r.n} className="card-flat hover:shadow-md transition flex gap-4">
                  <div className="text-3xl font-black text-[#0b2545]/20 leading-none">{r.n}</div>
                  <div>
                    <div className="font-bold text-sm">{r.t}</div>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">{r.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Failure Cases ===================== */}
      <section id="failure" className="py-24 bg-gradient-to-b from-rose-50/60 to-white border-y border-rose-100">
        <div className="container-wide">
          <PhotoFrame
            src="/photos/failure.jpg"
            alt="失敗して頭を抱える場面"
            className="rounded-2xl h-48 md:h-64 mb-12 shadow-lg"
            fallback="from-rose-900 via-slate-900 to-slate-800"
          />
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Failure cases</span>
            <h2 className="h-section text-3xl mt-3">
              RFPなしで進めると、<br className="md:hidden" />
              <span className="text-rose-600">こんな失敗</span>が起きます
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              実際の現場で何度も繰り返されてきた失敗パターンです。
              「自社は大丈夫」と思っていても、起きるときはあっという間に起きます。
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-6">
            {[
              {
                n: '01',
                t: 'ベンダー言いなりで予算3倍',
                quote: '「これも追加で必要です」が止まらない',
                d: '見積もり比較せずに発注。要件が固まっていないまま走り出した結果、後から「これも追加で…」が連鎖し、当初予算の3倍に膨れ上がった。途中で止めたくても、サンクコストが許してくれない。',
                tag: '予算超過',
              },
              {
                n: '02',
                t: '「思っていたのと違う」リリース',
                quote: 'デモを見て初めて気付いた',
                d: '口頭ベースで開発スタート。ベンダーが解釈で埋めた仕様で完成し、デモを見て初めて「これじゃ業務に使えない」と発覚。リリース直前で大規模な作り直しが発生し、半年遅延。',
                tag: '手戻り',
              },
              {
                n: '03',
                t: '現場が使わずExcelに逆戻り',
                quote: '結局誰も触らないシステム',
                d: '管理職だけで仕様を決めてしまい、現場の業務実態とズレたシステムが完成。リリース後、現場は元のExcel運用に戻り、高額なシステムだけが残った。',
                tag: '形骸化',
              },
              {
                n: '04',
                t: '作らなくてよかった',
                quote: '月数千円のSaaSで済む話だった',
                d: '最初から「全部を新規開発」と決めつけて発注。完成後に「これ、月数千円のSaaSと同じ機能じゃん」と気付く。数百万円が消える前に、選択肢を比較する時間が必要だった。',
                tag: 'オーバースペック',
              },
            ].map((c) => (
              <div key={c.n} className="card relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/40 rounded-full blur-2xl group-hover:bg-rose-200/60 transition"></div>
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[10px] tracking-widest font-bold text-rose-500">CASE {c.n}</div>
                      <h3 className="font-bold text-lg mt-1">{c.t}</h3>
                    </div>
                    <span className="badge bg-rose-100 text-rose-700 ring-1 ring-rose-200 shrink-0">{c.tag}</span>
                  </div>
                  <div className="mt-4 border-l-4 border-rose-300 pl-4 italic text-sm text-slate-700">
                    “{c.quote}”
                  </div>
                  <p className="mt-4 text-sm text-slate-600 leading-relaxed">{c.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl bg-[#0b2545] text-white p-8 md:p-10 text-center relative overflow-hidden">
              <div className="absolute inset-0 dot-grid opacity-10"></div>
              <div className="relative">
                <div className="text-amber-300 text-xs font-bold tracking-widest">COMMON ROOT CAUSE</div>
                <p className="mt-3 text-lg md:text-xl font-bold leading-relaxed">
                  これらの失敗には、共通の原因があります。<br />
                  「<span className="text-amber-300">業務を構造化しないまま発注</span>してしまった」ことです。
                </p>
                <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  業務分析クラウドは、AIとMICのコンサルが伴走して、この&quot;構造化&quot;を約2ヶ月で完了させます。
                  発注前にこの工程を踏むことが、失敗を避ける唯一の方法です。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Service Overview ===================== */}
      <section id="service" className="py-24">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">What we do</span>
            <h2 className="h-section text-3xl mt-3">サービスの概要</h2>
            <p className="mt-4 text-slate-600">
              業務分析クラウドは、お客様の業務を構造化し、課題と改善方針、そして RFP の叩き台までを
              <strong>「AIが下書き → MICのコンサルが補正」</strong> の流れで作成するサービスです。
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {[
              {
                t: '中立的な意思決定支援',
                d: 'システム化前提ではなく、運用改善・既存SaaS活用・あえて作らない選択肢も含めて提示します。MICが開発受注しないケースも前提です。',
                k: '01',
              },
              {
                t: 'AIによる下書き自動化',
                d: '入力内容から業務構造化・課題抽出・改善方針・RFP叩き台まで、AIが下書きを生成します。コンサルタントが補正することで品質を担保します。',
                k: '02',
              },
              {
                t: '業務データの構造化',
                d: '自由記述だけでなく、カテゴリ・頻度・属人化フラグなどを構造化して保存。将来の業界横断分析やテンプレート化にも活用できます。',
                k: '03',
              },
            ].map((f) => (
              <div key={f.k} className="card group hover:-translate-y-0.5 transition">
                <div className="flex items-start justify-between">
                  <div className="text-3xl font-black text-[#0b2545]/10 group-hover:text-[#0b2545]/30 transition">{f.k}</div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                </div>
                <h3 className="mt-3 font-bold text-lg">{f.t}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== Framework ===================== */}
      <section id="framework" className="py-24 bg-white border-y border-slate-200">
        <div className="container-wide">
          <PhotoFrame
            src="/photos/workshop.jpg"
            alt="付箋を使ったワークショップ"
            className="rounded-2xl h-48 md:h-64 mb-12 shadow-lg"
            fallback="from-amber-700 via-amber-600 to-amber-800"
          />
          <div className="text-center max-w-3xl mx-auto">
            <span className="eyebrow">Framework</span>
            <h2 className="h-section text-3xl mt-3">
              すべての業務を<br className="md:hidden" />
              <span className="text-[#0b2545]">「ヒト・モノ・カネ＋その他」</span>
              の4観点で構造化
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              MIC では、どんな業種・どんな規模の業務でも、まず経営3資源
              <strong className="text-slate-900">「ヒト・モノ・カネ」</strong>
              に <strong className="text-slate-900">「その他（経営分析）」</strong>
              を加えた4観点に分解して全体像を捉えます。
              これにより、業務の抜け漏れなく、かつ業界を問わず一貫した粒度で分析できます。
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-[1.1fr_1fr] gap-10 items-start">
            {/* Inline framework diagram (no image file needed) */}
            <FrameworkDiagram />

            <div className="space-y-4">
              {[
                {
                  k: 'ヒト',
                  color: 'bg-violet-50 ring-violet-200 text-violet-900',
                  dot: 'bg-violet-500',
                  d: '社内（従業員・採用・労務・人事評価）／社外（仕入先・得意先・顧客管理）。組織と関係者を整理します。',
                },
                {
                  k: 'モノ',
                  color: 'bg-amber-50 ring-amber-200 text-amber-900',
                  dot: 'bg-amber-500',
                  d: '仕入 → 在庫 → 販売 のメインフローと、外注・工程管理・物流管理を構造化。商品やサービスの流れを可視化します。',
                },
                {
                  k: 'カネ',
                  color: 'bg-rose-50 ring-rose-200 text-rose-900',
                  dot: 'bg-rose-500',
                  d: '売掛金 / 買掛金 / 経費 / 入出金 / 損益。お金の流れと会計接点を整理します。',
                },
                {
                  k: 'その他',
                  color: 'bg-slate-100 ring-slate-300 text-slate-800',
                  dot: 'bg-slate-500',
                  d: '上記3資源を横断する経営分析（KPI、利益分析、ダッシュボード）。BIツール活用も検討します。',
                },
              ].map((b) => (
                <div key={b.k} className={`rounded-xl ring-1 p-4 ${b.color}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${b.dot}`}></span>
                    <span className="font-bold text-base">{b.k}</span>
                    <span className="ml-auto text-[10px] tracking-widest font-semibold opacity-60">RESOURCE</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 max-w-3xl mx-auto text-sm text-slate-600 leading-relaxed text-center">
            この4観点で全体像を描いたうえで、業務の中から
            <strong className="text-slate-900">「事務的工数が高い領域」</strong>
            と
            <strong className="text-slate-900">「専門性が高い領域」</strong>
            を特定し、改善余地（運用改善 / 既存SaaS活用 / システム化 / AI活用 / あえて何もしない）を整理します。
          </div>
        </div>
      </section>

      {/* ===================== Case Study ===================== */}
      <section id="case" className="py-24">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Case Study</span>
            <h2 className="h-section text-3xl mt-3">事例: 中古車買取販売店の業務分析</h2>
            <p className="mt-4 text-slate-600">
              実際にこのフレームワークで分析した事例の一部をご紹介します。
              ヒト・モノ・カネに沿って、現場の業務・関係者・システム・書類の流れをすべて可視化しました。
            </p>
          </div>

          {/* Two deliverable samples: framework + heatmap */}
          <div className="mt-14 grid md:grid-cols-2 gap-6">
            <div className="card p-4 md:p-5 bg-slate-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-slate-200 text-slate-700">STEP 1</span>
                <span className="text-xs font-bold text-slate-700">業務フロー図 (チートシート)</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/case-autoshop.png"
                alt="中古車買取販売店 業務分析図"
                className="w-full h-auto rounded-lg shadow-sm bg-white"
              />
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                ヒト・モノ・カネに沿って、現場の業務・関係者・システム・書類の流れを<strong>1枚で俯瞰</strong>。
                誰が見ても「業務の全体像」が共通認識として持てます。
              </p>
            </div>

            <div className="card p-4 md:p-5 bg-gradient-to-br from-rose-50 to-violet-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="badge bg-rose-200 text-rose-800">STEP 2</span>
                <span className="text-xs font-bold text-slate-700">業務負荷ヒートマップ</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/case-autoshop-heatmap.png"
                alt="中古車買取販売店 業務負荷ヒートマップ"
                className="w-full h-auto rounded-lg shadow-sm bg-white"
              />
              <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                同じ図に <span className="inline-block w-2 h-2 rounded-full bg-rose-400 align-middle"></span>
                <strong className="text-rose-700">事務的工数が高い領域</strong> と
                <span className="inline-block w-2 h-2 rounded-full bg-violet-500 align-middle ml-1"></span>
                <strong className="text-violet-700">高度な専門性が必要な領域</strong> を重ねて、
                <strong>改善優先順位が一目で分かる</strong>状態にします。
              </p>
            </div>
          </div>

          <div className="mt-10 grid md:grid-cols-[1fr_1.1fr] gap-10 items-start">
            <div className="space-y-4">
              <div className="card-flat p-5">
                <div className="text-xs font-bold text-rose-700 mb-2">● 事務的工数のかかる領域</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>・自社名変</li>
                  <li>・WEB仮計算書 / 計算書からの情報入力</li>
                  <li>・陸送請求書、加修費用請求書のデータ登録</li>
                </ul>
                <div className="mt-3 text-[11px] text-slate-500">→ OCR / Chrome拡張 / 既存SaaS連携 で対応可能</div>
              </div>
              <div className="card-flat p-5">
                <div className="text-xs font-bold text-violet-700 mb-2">● 高度な専門性が必要な領域</div>
                <ul className="text-xs text-slate-700 space-y-1">
                  <li>・指値の決定</li>
                  <li>・売却の調整</li>
                </ul>
                <div className="mt-3 text-[11px] text-slate-500">→ AI提案 / ベテラン判断の暗黙知の構造化で支援</div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { n: '4', l: '業務領域', s: 'ヒト/モノ/カネ/他' },
                  { n: '50+', l: '業務プロセス', s: '小〜大粒度' },
                  { n: '10+', l: '関連システム', s: '車販/査定/経理 ほか' },
                ].map((m) => (
                  <div key={m.l} className="card-flat p-4 text-center">
                    <div className="text-2xl font-black text-[#0b2545]">{m.n}</div>
                    <div className="text-xs font-semibold mt-1">{m.l}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{m.s}</div>
                  </div>
                ))}
              </div>

              <div className="card mt-4">
                <div className="font-bold text-sm mb-3">この事例で可視化した内容</div>
                <ul className="text-sm text-slate-700 space-y-2">
                  <li className="flex gap-2"><span className="text-violet-500">●</span><span><strong>ヒト:</strong> 採用・労務・人事評価、仕入先/委託先/得意先（顧客）管理</span></li>
                  <li className="flex gap-2"><span className="text-amber-500">●</span><span><strong>モノ (仕入):</strong> 下取・買取・AA落札・共有在庫・ディーラー仕入の各フロー</span></li>
                  <li className="flex gap-2"><span className="text-amber-500">●</span><span><strong>モノ (在庫):</strong> 入庫チェック・加修・クリーニング・付属品管理</span></li>
                  <li className="flex gap-2"><span className="text-amber-500">●</span><span><strong>モノ (販売):</strong> 小売・業販・AA出品・自社EC・プライスボード</span></li>
                  <li className="flex gap-2"><span className="text-amber-500">●</span><span><strong>書類・整備:</strong> 車検証・名義変更・抹消・行政書士・車検システム</span></li>
                  <li className="flex gap-2"><span className="text-rose-500">●</span><span><strong>カネ:</strong> 売掛/買掛・計算書処理・経費申請・店舗-本部資金移動・売上計上タイミング(受注/納車)</span></li>
                </ul>
              </div>

              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed">
                <strong>分析結果から導いた示唆の例:</strong>
                「事務的工数が高い領域」(自社名変・計算書登録) と「高度な専門性が必要な領域」(指値の決定・売却の調整)
                を特定し、それぞれに対して OCR・Chrome拡張・AI提案 など <strong>必ずしも全部を新規開発しない</strong>
                改善方針を整理しました。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Flow ===================== */}
      <section id="flow" className="py-24 bg-white border-y border-slate-200">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Process</span>
            <h2 className="h-section text-3xl mt-3">ご利用の流れ</h2>
            <p className="mt-4 text-slate-600">
              標準で<strong>約2ヶ月・訪問5回</strong>。お客様の現場ヒアリング → 構造化 → AI下書き → MICレビュー → 納品。
              現場担当・業務管理者・部門責任者・経理・経営層など<strong>複数階層をヒアリング対象</strong>とし、現場理解の精度を担保します。
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-4 gap-6 relative">
            {[
              { n: 1, t: 'お申込み・基本情報入力', d: 'Webフォームから申込み後、専用URLを発行。会社情報・組織図・業務カテゴリの初期入力をお願いします。' },
              { n: 2, t: '現場ヒアリング (約5回)', d: '現場担当・業務管理者・経理・経営層など複数階層へ訪問ヒアリング。AIが事前に追加質問を提案し、聞き逃しを防ぎます。' },
              { n: 3, t: 'AI分析 + コンサル補正', d: '業務フロー図 / 課題一覧 / 改善優先順位 / システム化検討領域 / 簡易画面案 を AI 下書き → コンサルが補正。' },
              { n: 4, t: '報告会・納品', d: '成果物一式を納品し、報告会を実施。フェーズ1 (優先着手) / フェーズ2 (拡張) の進め方も合わせてご提案します。' },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div className="card h-full">
                  <span className="step-num">{s.n}</span>
                  <h3 className="mt-3 font-bold">{s.t}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-slate-300"></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-xs text-slate-500">
            ※ いきなり全部作る前提ではありません。<strong>フェーズ1で優先度の高い課題から着手</strong>し、必要に応じてシステム化を検討します。
          </div>
        </div>
      </section>

      {/* ===================== Deliverables / Period ===================== */}
      <section id="deliverables" className="py-24">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <span className="eyebrow">Deliverables</span>
            <h2 className="h-section text-3xl mt-3">納品物と、それがもたらす判断材料</h2>
            <p className="mt-4 text-slate-600">
              「報告書を作って終わり」ではありません。納品物のすべてが、<strong>その先の経営判断・投資判断の土台</strong>になるよう設計されています。
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: '業務フロー図', d: '現状の正確な業務構造、見落とされていた工程を可視化。関係者間で「どこが課題か」の共通認識を作ります。', tag: 'WHAT' },
              { t: '課題一覧', d: '属人化・手戻り・情報欠漏を具体化。ヒートマップで工数集中・属人化が深刻な工程を一目で把握できます。', tag: 'WHERE' },
              { t: '改善優先順位', d: '負荷と効果のバランスから、フェーズ1で何に着手すべきかを明確化。段階的な実装計画が組めます。', tag: 'WHEN' },
              { t: 'システム化検討領域', d: 'どの工程がシステム化に適しているか / 既存SaaSで足りるか / 運用改善で済むかを中立に整理します。', tag: 'HOW' },
              { t: '簡易画面案', d: '導入時のイメージ形成のためのワイヤーフレーム。社内合意形成とベンダー比較の精度が上がります。', tag: 'IMAGE' },
              { t: 'RFP（提案依頼書）叩き台', d: '上記5点を踏まえた発注用ドキュメント。複数ベンダーへの公平な相見積もりが可能になります。', tag: 'RESULT' },
            ].map((d) => (
              <div key={d.t} className="card hover:-translate-y-0.5 transition">
                <div className="flex items-start justify-between">
                  <div className="text-[10px] tracking-widest font-bold text-slate-400">{d.tag}</div>
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                </div>
                <h3 className="mt-2 font-bold text-base">{d.t}</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">{d.d}</p>
              </div>
            ))}
          </div>

          {/* Pricing & Conditions */}
          <div className="mt-14 grid md:grid-cols-[1.4fr_1fr] gap-6">
            <div className="card">
              <span className="eyebrow">Conditions</span>
              <h3 className="h-section text-2xl mt-3">実施条件</h3>
              <div className="mt-5 grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 p-4 text-center">
                  <div className="text-[10px] text-slate-500 tracking-widest font-bold">PRICE</div>
                  <div className="text-2xl font-black mt-1 text-[#0b2545]">¥900,000<span className="text-xs font-normal text-slate-500 ml-1">〜</span></div>
                  <div className="text-[10px] text-slate-500 mt-0.5">税抜・スコープ別</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4 text-center">
                  <div className="text-[10px] text-slate-500 tracking-widest font-bold">PERIOD</div>
                  <div className="text-2xl font-black mt-1 text-[#0b2545]">約2ヶ月</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">標準</div>
                </div>
                <div className="rounded-xl border border-slate-200 p-4 text-center">
                  <div className="text-[10px] text-slate-500 tracking-widest font-bold">VISIT</div>
                  <div className="text-2xl font-black mt-1 text-[#0b2545]">約5回</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">訪問ヒアリング</div>
                </div>
              </div>
              <div className="mt-5">
                <div className="text-xs font-bold text-slate-700 mb-2">ヒアリング対象（例: 5階層）</div>
                <div className="flex flex-wrap gap-1.5">
                  {['現場担当者', '業務管理者', '部門責任者', '経理 / 管理部門', '経営層'].map((p) => (
                    <span key={p} className="badge bg-slate-100 text-slate-700">{p}</span>
                  ))}
                </div>
                <div className="mt-2 text-[11px] text-slate-500">※ 業種・組織体制に合わせて対象を調整します。</div>
              </div>
              <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed">
                <strong>ご注意:</strong> 本サービスはシステム開発の受注を前提としません。
                「作らない方がよい」「既存SaaSで足りる」という結論も含めて、お客様の意思決定を中立に支援します。
              </div>
            </div>

            {/* 補助金活用 callout */}
            <div className="card bg-[#0b2545] text-white relative overflow-hidden">
              <div className="absolute inset-0 dot-grid opacity-10"></div>
              <div className="relative">
                <div className="text-amber-300 text-[10px] tracking-widest font-bold">SUBSIDY</div>
                <h3 className="h-section text-xl mt-2 leading-snug">
                  <span className="text-amber-300">省力化投資補助金</span>の<br />前提資料として活用可
                </h3>
                <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                  納品物は、補助金申請時に必須の <strong className="text-white">「現状課題」「改善計画」</strong>
                  の整理にそのまま活用できます。
                </p>
                <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                  ※ 補助金ありきではなく、<strong className="text-white">投資判断後に活用する</strong>位置づけです。
                  本当に投資すべきかを先に決めるための分析である点は変わりません。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section id="faq" className="py-24 bg-white border-y border-slate-200">
        <div className="container-narrow">
          <div className="text-center">
            <span className="eyebrow">FAQ</span>
            <h2 className="h-section text-3xl mt-3">よくあるご質問</h2>
          </div>
          <div className="mt-12 space-y-4">
            {[
              {
                q: 'システム開発の発注前提が必要ですか？',
                a: 'いいえ。むしろ「作らない」「既存SaaSで十分」という結論も含めて中立に整理することを目的としています。MIC が開発に関わらないケースも想定しています。',
              },
              {
                q: 'AIが出した内容をそのまま納品されるのですか？',
                a: 'いいえ。AIはあくまで下書きです。MIC のコンサルタントがすべてのアウトプットをレビューし、補正・補完したうえで納品します。',
              },
              {
                q: '社外秘の業務情報を入力しても大丈夫ですか？',
                a: 'お客様ごとに分離された専用URLでデータを管理します。ご要望に応じて NDA 締結のうえ作業します。',
              },
              {
                q: 'RFP納品後の開発フェーズも依頼できますか？',
                a: '別途お見積りで対応可能です。「ベンダー選定（コンペ）」「開発」「リリース後の保守」までを一気通貫でご支援することもできます。',
              },
            ].map((f, i) => (
              <details key={i} className="card group">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-semibold pr-4">Q. {f.q}</span>
                  <span className="text-2xl text-slate-400 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-24">
        <div className="container-narrow">
          <div className="rounded-3xl bg-[#0b2545] text-white p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-10"></div>
            <div className="relative">
              <h2 className="h-display text-3xl md:text-4xl">
                まずは現状業務の<br className="md:hidden" />可視化から始めましょう
              </h2>
              <p className="mt-5 text-slate-300 max-w-xl mx-auto leading-relaxed">
                Webからのお申込みで、すぐに業務情報の入力を開始いただけます。
                納品まで約2ヶ月、専任のコンサルタントが現場に入って伴走します。
              </p>
              <div className="mt-8 flex justify-center gap-3">
                <Link href="/signup" className="btn bg-amber-400 text-[#0b2545] hover:brightness-105 px-6 py-3 text-base">
                  無料で申し込む →
                </Link>
                <a href="mailto:contact@mic.example.jp" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20">
                  メールで相談する
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== Footer ===================== */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container-wide py-10 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="業務分析クラウド" className="h-10 w-auto" />
            </div>
            <p className="mt-3 text-xs text-slate-500 leading-relaxed">
              株式会社 MICRO INTELLIGENCE COMMUNICATIONS<br />
              業務分析・RFP作成支援サービス
            </p>
          </div>
          <div>
            <div className="font-semibold mb-2">サービス</div>
            <ul className="space-y-1 text-slate-600">
              <li><a href="#whatisrfp" className="hover:underline">RFPとは</a></li>
              <li><a href="#failure" className="hover:underline">失敗例</a></li>
              <li><a href="#service" className="hover:underline">サービス概要</a></li>
              <li><a href="#framework" className="hover:underline">分析手法</a></li>
              <li><a href="#case" className="hover:underline">事例</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">アカウント</div>
            <ul className="space-y-1 text-slate-600">
              <li><Link href="/signup" className="hover:underline">申込み</Link></li>
              <li><Link href="/admin/login" className="hover:underline">管理者ログイン</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          © MICRO INTELLIGENCE COMMUNICATIONS, Inc.
        </div>
      </footer>
    </main>
  );
}
