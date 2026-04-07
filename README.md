# 業務分析クラウド (MVP)

株式会社MIC が提供する **業務分析・RFP作成支援サービス** をスケールさせるためのプラットフォームです。
顧客が業務情報を Web で入力し、AI が課題抽出・改善方針・RFPの叩き台までを下書きし、MIC 担当者が補正・出力します。

> **思想**: 「作るかどうか」「何をどう作るか」「誰に発注するか」を決めるのは顧客。MIC は中立的に意思決定を支援する。AIが下書きを作り、人が補正する。

---

## 主な機能

### 顧客向け
- サービス概要 / 申込みフォーム
- 専用URL方式の入力ダッシュボード（パスワード不要、トークン式）
- 会社基本情報・組織・拠点・業務情報の入力
- 入力内容確認画面

### MIC管理者向け
- 案件一覧 / 詳細
- ヒアリング支援（AIが追加質問を生成）
- AI分析（業務構造化・課題抽出・改善方針）
- RFP叩き台のAI生成と編集
- Markdownエクスポート

---

## 技術スタック

| 領域 | 採用 |
|---|---|
| フロントエンド | Next.js 14 (App Router) + TypeScript |
| UI | Tailwind CSS |
| DB | Supabase (PostgreSQL, service role 直接利用) |
| 認証 | 顧客=トークンURL / 管理者=パスワード Cookie (MVP簡素化) |
| AI | OpenAI Chat Completions (`gpt-4o-mini` 既定) |
| 出力 | Markdown ファイルダウンロード |

> 認証は MVP のため意図的にシンプルにしています。本番運用前に Supabase Auth または同等の方式に置き換えてください。

---

## セットアップ

### 1. リポジトリ取得 & 依存インストール

```bash
git clone https://github.com/inter-mic/gyomu_bunseki_cloud.git
cd gyomu_bunseki_cloud
npm install
```

### 2. Supabase プロジェクト準備

1. https://supabase.com で新規プロジェクトを作成
2. SQL Editor で `supabase/migrations/0001_init.sql` を実行
3. （任意）`supabase/seed.sql` を実行してサンプル案件を投入
4. Project Settings → API から **URL** と **service_role key** を取得

### 3. 環境変数

`.env.example` をコピーして `.env.local` を作成し、以下を埋めます。

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
ADMIN_PASSWORD=好きな文字列
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 起動

```bash
npm run dev
```

http://localhost:3000 を開きます。

---

## 動作確認の流れ

### 顧客フロー
1. トップ → 「無料で申し込む」
2. 会社情報を入力 → 申込み
3. 自動的に専用URL `/c/<token>` にリダイレクト
4. 左メニューから 会社情報 / 組織・拠点 / 業務一覧 を入力
5. 「入力内容確認」 でレビュー

> シードデータを投入した場合、`/c/sample-token-demo` にアクセスすると確認できます。

### 管理者フロー
1. `/admin/login` で `ADMIN_PASSWORD` を入力
2. 案件一覧から該当案件を開く
3. 各タブを操作:
   - **基本情報**: 顧客入力一覧 + 内部メモ
   - **ヒアリング**: 「AIに生成させる」ボタンで追加質問を作成、回答を記録
   - **AI分析**: 業務構造化・課題抽出・改善方針 を AI で下書き → 編集
   - **RFP**: AI で叩き台を作って編集
   - **Markdown出力**: 全内容を1ファイルにまとめてダウンロード

---

## ディレクトリ構成

```
.
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                         # トップ
│  │  ├─ signup/                          # 申込み
│  │  ├─ c/[token]/                       # 顧客側 (トークン認証)
│  │  │  ├─ page.tsx                      # ダッシュボード
│  │  │  ├─ basic/                        # 会社基本情報
│  │  │  ├─ org/                          # 組織・拠点
│  │  │  ├─ processes/                    # 業務一覧 / 詳細
│  │  │  └─ review/                       # 入力内容確認
│  │  └─ admin/                           # MIC管理者
│  │     ├─ login/                        # ログイン
│  │     ├─ page.tsx                      # 案件一覧
│  │     └─ projects/[id]/                # 案件詳細 (タブ式)
│  │        ├─ page.tsx                   # 基本情報タブ
│  │        ├─ hearing/                   # ヒアリング支援
│  │        ├─ analysis/                  # AI分析
│  │        ├─ rfp/                       # RFP
│  │        └─ export/                    # Markdown出力
│  └─ lib/
│     ├─ db.ts                            # Supabase service-role クライアント
│     ├─ auth.ts                          # 管理者Cookie認証
│     ├─ openai.ts                        # OpenAI ラッパ
│     ├─ projectContext.ts                # AIに渡す案件コンテキスト構築
│     ├─ markdown.ts                      # Markdownエクスポート
│     ├─ customer.ts                      # 顧客トークンローダ
│     └─ types.ts                         # 共通型 / 選択肢
├─ supabase/
│  ├─ migrations/0001_init.sql            # スキーマ
│  └─ seed.sql                            # サンプルデータ
├─ tailwind.config.ts
├─ next.config.mjs
├─ tsconfig.json
└─ package.json
```

---

## データモデル

| テーブル | 説明 |
|---|---|
| `organizations` | 顧客企業 |
| `projects` | 案件 (1案件=1分析) |
| `offices` | 拠点 |
| `departments` | 部署 |
| `business_processes` | 業務 (本MVPの中心エンティティ) |
| `hearing_notes` | ヒアリング質問とメモ (AI生成 / 手動) |
| `analysis_results` | AI分析結果 (`structuring` / `issues` / `improvements`) |
| `rfp_drafts` | RFP叩き台Markdown |

---

## 今後の拡張方向 (MVPでは未実装)

- Supabase Auth に置き換えて、顧客もアカウント管理
- 業務分析テンプレート機能（業界別ヒアリングテンプレート）
- 添付ファイル（業務フロー画像、Excelなど）
- 版管理 / 承認フロー
- メール通知 / Slack通知
- 出力フォーマット拡張（PDF / Word / PPTX）
- 複数案件の横断分析（業界統計など）

---

## 設計上の重要原則 (リファクタ時に忘れないこと)

1. **AIは人を補助する** — 出力は必ずMICが編集できる形にする
2. **「作らない」も提案候補** — システム化前提の文体にしない
3. **構造化** — 自由入力＋選択式の組合せで蓄積データを将来分析可能に保つ
4. **MVPは迷ったらシンプル** — RBACやワークフローは後回し
