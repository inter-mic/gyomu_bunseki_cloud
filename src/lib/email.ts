import { Resend } from 'resend';

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const FROM = process.env.MAIL_FROM || 'onboarding@resend.dev';
const ADMIN = process.env.ADMIN_EMAIL || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

type SignupMailInput = {
  company: string;
  contactName: string;
  contactEmail: string;
  theme: string;
  token: string;
};

export async function sendSignupEmails(input: SignupMailInput) {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set, skipping send');
    return;
  }

  const customerUrl = `${APP_URL}/c/${input.token}`;

  const customerHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#0b2545">
      <h2 style="color:#0b2545">業務分析クラウド お申込みありがとうございます</h2>
      <p>${escape(input.contactName)} 様</p>
      <p>${escape(input.company)} のお申込みを受け付けました。<br>以下の専用URLから入力を続けてください。後日ヒアリングのご連絡を差し上げます。</p>
      <p style="background:#f1f5f9;padding:14px;border-radius:8px;word-break:break-all">
        <a href="${customerUrl}" style="color:#0b2545;font-weight:600">${customerUrl}</a>
      </p>
      <p style="font-size:13px;color:#475569">※ このURLは本人専用です。第三者への共有はお控えください。</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
      <p style="font-size:12px;color:#64748b">業務分析クラウド / 株式会社MIC</p>
    </div>
  `;

  const adminHtml = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;color:#0b2545">
      <h2>新規お申込み</h2>
      <table style="font-size:14px;border-collapse:collapse">
        <tr><td style="padding:6px 12px 6px 0;color:#64748b">会社名</td><td>${escape(input.company)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#64748b">担当者</td><td>${escape(input.contactName)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#64748b">メール</td><td>${escape(input.contactEmail)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top">テーマ</td><td>${escape(input.theme)}</td></tr>
      </table>
      <p style="margin-top:20px"><a href="${customerUrl}">${customerUrl}</a></p>
    </div>
  `;

  const tasks: Promise<unknown>[] = [];

  if (input.contactEmail) {
    tasks.push(
      resend.emails.send({
        from: FROM,
        to: input.contactEmail,
        subject: '【業務分析クラウド】お申込みを受け付けました',
        html: customerHtml,
      })
    );
  }

  if (ADMIN) {
    tasks.push(
      resend.emails.send({
        from: FROM,
        to: ADMIN,
        subject: `[新規申込] ${input.company}`,
        html: adminHtml,
      })
    );
  }

  const results = await Promise.allSettled(tasks);
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`[email] send failed (${i}):`, r.reason);
  });
}

function escape(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
