# public/ — 静的アセット

このフォルダ直下に画像ファイルを配置すると、`/ファイル名` でWebからアクセスできます。

## 必要なファイル

### 図版 (必須)
| ファイル名 | 用途 | 元データ |
|---|---|---|
| `framework.png` | 経営3資源「ヒト・モノ・カネ」の管理システム フレームワーク図 | チャットで共有された image.png |
| `case-autoshop.png` | 中古車買取販売店 業務分析図 (事例) | 中古車買取販売店 業務分析図.pdf の1ページ目をPNG化 |

### 写真 (推奨 / なくても表示は壊れません)
すべて `public/photos/` 配下に配置してください。横長 (16:9 〜 4:3) の高解像度写真がベストです。

| ファイル名 | 用途 | おすすめのモチーフ |
|---|---|---|
| `photos/hero.jpg` | ヒーローセクションのビジュアル | 会議室での議論 / ホワイトボード前のディスカッション |
| `photos/meeting.jpg` | 「RFPとは？」セクション | 商談・打合せの様子 |
| `photos/failure.jpg` | 「失敗例」セクション | 困っている／頭を抱える場面 |
| `photos/workshop.jpg` | 「分析手法」セクション | 付箋を使ったワークショップ |

[Unsplash](https://unsplash.com) や [Pexels](https://www.pexels.com) などのフリー素材サイトで取得し、上記ファイル名で配置すると自動で表示されます。

PDFをPNG化するには macOS Preview で書き出すか、`sips -s format png input.pdf --out output.png` を使ってください。
