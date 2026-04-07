import Link from 'next/link';
import { signupAction } from './actions';

export default function SignupPage() {
  return (
    <main className="min-h-screen">
      <header className="bg-white border-b border-slate-200">
        <div className="container-wide py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="業務分析クラウド" className="h-9 w-auto" />
          </Link>
          <Link href="/" className="nav-link">← トップに戻る</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <span className="eyebrow">Sign up</span>
        <h1 className="h-display text-3xl mt-3 mb-2">サービス申込み</h1>
        <p className="text-sm text-slate-600 mb-10">
          送信後、入力用の専用URLが発行されます。約3ヶ月でRFPの叩き台までを納品します。
        </p>

        <form action={signupAction} className="card space-y-4">
          <div>
            <label className="label">会社名 *</label>
            <input name="company" required className="input" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">業種</label>
              <input name="industry" className="input" placeholder="例: 製造業" />
            </div>
            <div>
              <label className="label">従業員数</label>
              <input name="employee_count" type="number" min={0} className="input" />
            </div>
            <div>
              <label className="label">拠点数</label>
              <input name="office_count" type="number" min={0} className="input" />
            </div>
            <div>
              <label className="label">電話番号</label>
              <input name="phone" className="input" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">担当者名 *</label>
              <input name="contact_name" required className="input" />
            </div>
            <div>
              <label className="label">メールアドレス *</label>
              <input name="contact_email" type="email" required className="input" />
            </div>
          </div>
          <div>
            <label className="label">相談したいテーマ *</label>
            <textarea name="theme" required rows={3} className="input" placeholder="例: 受発注業務がExcel中心で属人化している。整理したい。" />
          </div>
          <div>
            <label className="label">備考</label>
            <textarea name="notes" rows={2} className="input" />
          </div>
          <div className="pt-4">
            <button type="submit" className="btn-primary">申込みを送信する</button>
          </div>
        </form>
      </div>
    </main>
  );
}
