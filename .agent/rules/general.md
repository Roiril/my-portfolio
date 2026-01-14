---
trigger: always_on
description: 事故防止と品質維持のための基本ルール
---

# rules/general.md
# Portfolio Site - General Rules (Directory & Organization)

## 目的
- ファイルの置き場を固定し、探す時間と手戻りを減らす
- app/ をルーティングの薄い層として保ち、機能追加しても崩れない構造にする
- AI が改修対象を外しにくい、境界がはっきりした構成にする

## 適用範囲
- Next.js（App Router）で作るポートフォリオサイト全体
- 原則としてアプリコードは src/ 配下に置く（src を使わない場合は同じ構造をルート直下に読み替える）

## ルール

### A. app/ は「ルーティングとページの組み立て」だけにする
- MUST: app/ には Next.js のルーティングに関わるファイル（page, layout, route, loading, error など）を中心に置く
- MUST: app/ の page.tsx / layout.tsx は薄く保ち、実装の本体は features/ や components/ から呼ぶ
- SHOULD: URL には出したくない整理用の階層は Route Group を使う（例: app/(site)/, app/(admin)/）
- MUST NOT: app/ の中に共通ロジックや巨大な UI 実装を溜め込まない

### B. 機能（ページの意味単位）は features/ に束ねる
- MUST: 「Projects」「Works」「Blog」「About」「Contact」など、ポートフォリオの意味単位を features/ 配下に作る
- SHOULD: features/<feature>/ の中は次のように分ける
  - components/（その機能専用 UI）
  - hooks/（その機能専用 hooks）
  - server/（Server Components での合成や取得処理があるなら）
  - types/（その機能の型）
  - index.ts（外に出すものだけを再export）
- MUST: app/ からは features 側の「公開 API（index.ts）」を基本に import する
- MUST NOT: 別 feature の内部ファイルを直接 import しない（境界が壊れる）

### C. 共通 UI は components/、共通ロジックは lib/ に寄せる
- MUST: 複数ページで使う UI は src/components/ に置く
- SHOULD: components/ は用途で分ける
  - components/ui/（ボタン、カードなど小粒な部品）
  - components/layout/（Header, Footer, Section, Container など骨格）
- MUST: fetch・整形・ユーティリティ・クライアント生成などの共通ロジックは src/lib/ に置く
- SHOULD: 定数は src/constants/、設定は src/config/、型は src/types/ に寄せる

### D. content と assets の置き場を固定する
- MUST: 画像やfaviconなど静的配信したいものは public/（URL で参照される想定のもの）
- SHOULD: コードから import して扱う画像・アイコンは src/assets/（最適化やバンドル対象にしたい場合）
- MUST: プロジェクト一覧・経歴など「更新されるデータ」は src/content/ に寄せる
  - 形式は mdx / json / ts のどれでもよいが、1種類に寄せる
  - 例: content/projects/*.mdx, content/posts/*.mdx
- SHOULD: 記事や作品のメタ情報は frontmatter か 1ファイル1オブジェクトで統一する

### E. 命名と分割のルール（迷いを減らす）
- MUST: フォルダ名は小文字ケバブ（例: work-history, visual-system）
- MUST: React コンポーネントは PascalCase（例: ProjectCard.tsx）
- SHOULD: “何の箱か分かる名前” を優先し、general, common, misc の乱用を避ける
- MUST: 300行を超えるコンポーネントは分割を検討する（見通しと差分レビューを守るため）

### F. import の流れを一定にする
- MUST: パスエイリアス @/ を使い、深い相対パス ../../.. を常態化させない
- SHOULD: barrel export（index.ts）を使うのは「外部に公開したい面」だけに限定する
- MUST NOT: 循環参照を作らない（features 同士の相互 import に注意）

### G. 追加・変更のときの最短ルート
- 新しいページを増やすとき
  1) features/<new-feature>/ を作る（components, hooks, types, index.ts）
  2) app/ 側にルートを作り、page.tsx では features の公開 API を使って組み立てる
  3) 必要な data は content/ に置き、取得は lib/ に寄せる

## 推奨ディレクトリ（例）
.
├─ public/
├─ src/
│  ├─ app/
│  │  ├─ (site)/
│  │  │  ├─ page.tsx
│  │  │  ├─ projects/page.tsx
│  │  │  └─ blog/page.tsx
│  │  └─ api/route.ts
│  ├─ features/
│  │  ├─ projects/
│  │  │  ├─ components/
│  │  │  ├─ types/
│  │  │  └─ index.ts
│  │  ├─ blog/
│  │  └─ about/
│  ├─ components/
│  │  ├─ layout/
│  │  └─ ui/
│  ├─ content/
│  ├─ lib/
│  ├─ config/
│  ├─ constants/
│  └─ types/
├─ scripts/
└─ docs/

## 例外
- 実験的な UI・一時的な検証は experiments/ に隔離してよい
- 単一ページ完結で、将来的に分割しないと決めた小規模ページのみ app/ 内の colocate を許可する
