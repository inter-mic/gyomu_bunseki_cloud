import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '業務分析クラウド | MIC',
  description: '業務分析・RFP作成支援プラットフォーム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
