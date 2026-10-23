# 白石大晴 ポートフォリオ

研究と制作の作品をまとめたWebサイトです。雑誌の誌面のような組みで作品を並べ、作品ごとに技術を説明する詳細ページを置いています。

- 公開URL：https://my-portfolio-ruby-delta-87.vercel.app/
- 作者：白石大晴（GitHub: Roiril）

## 見てほしいところ

| ページ | 内容 |
|---|---|
| [トップ](https://my-portfolio-ruby-delta-87.vercel.app/) | 18件の作品を、研究・個人開発などの種類で絞り込めます |
| [廻リ視の詳細](https://my-portfolio-ruby-delta-87.vercel.app/works/mawarimi) | IVRC 2026で総合優勝したVR作品です。構成図・処理の流れ・工夫した点・トレイラーを載せています |
| [couple-syncのデモ](https://my-portfolio-ruby-delta-87.vercel.app/demos/couple-sync/index.html) | 離れて暮らすふたりのための共有アプリです。ブラウザでそのまま触れます |
| [cogni-storageのデモ](https://my-portfolio-ruby-delta-87.vercel.app/demos/cogni-storage/index.html) | 読書とリサーチを管理する研究ログアプリです。画面を操作できます |
| [履歴書](https://my-portfolio-ruby-delta-87.vercel.app/resume) | 学歴と受賞歴です |

## 使用技術

- Next.js 16（App Router）、React 19、TypeScript
- Tailwind CSS 4
- Vercel（公開）

## 工夫したところ

- **作品の情報を1か所にまとめる。** 作品の説明・技術の説明・構成図は [`src/content/`](src/content/) にデータとして置いています。一覧と詳細ページは同じデータから作るので、作品を足しても表示がずれません
- **詳細ページを静的に生成する。** 作品ごとのページはビルド時に生成します（[`src/app/works/[id]/page.tsx`](src/app/works/%5Bid%5D/page.tsx)）
- **デモから個人情報を除く。** 公開しているデモは、実際のアプリから匿名化したデータで作り直しています。公開前に [`scripts/check-demo-privacy.mjs`](scripts/check-demo-privacy.mjs) が、鍵や個人名が残っていないかを検査します
- **動きを減らす設定に合わせる。** OSで動きを減らす設定にしている人には、スクロールに合わせた動きを止めて表示します。狭い画面や横向きでも表示が崩れないことを確認しています（[`docs/motion-verification.md`](docs/motion-verification.md)）

## コードの場所

| 場所 | 内容 |
|---|---|
| [`src/app/`](src/app/) | ページ（トップ・作品の詳細・履歴書） |
| [`src/content/`](src/content/) | 作品のデータ |
| [`src/features/`](src/features/) | 誌面の組み、作品一覧、自己紹介などの部品 |
| [`src/components/`](src/components/) | ヘッダー、フッター、スクロールの動き |
| [`scripts/`](scripts/) | デモの書き出しと検査 |
| [`public/demos/`](public/demos/) | 公開しているデモ |

## 手元で動かす

```bash
npm install
npm run dev
```

http://localhost:3000 で開きます。
