---
trigger: always_on
description: 事故防止と品質維持のための基本ルール
---

# .agent/rules/general.md
# Portfolio Site - General Rules（日本語出力固定）

## 出力言語（最重要）
- 返答本文は日本語に固定する（見出し・箇条書き・説明文すべて）
- 英語を使ってよいのは次だけ
  - コード、コマンド、ファイルパス、識別子（関数名/変数名/型名/コンポーネント名）
  - 和訳すると誤解が出る技術用語（最初の1回だけ「英語 / 日本語の短い説明」で併記し、以降は日本語で呼ぶ）
- 英語の長文説明、英語だけの箇条書きは禁止
- workflows 配下（/scan, /apply）の出力も本文は日本語に固定する
  - Output format の見出しはテンプレに従う（見出し自体が英語でも本文は日本語）

## プロジェクト構成の前提（どちらかに統一）
- `src/` 構成なら `src/app/`・`src/features/`・`src/components/`・`src/lib/`・`src/types/` を基準にする
- ルート直下構成なら `app/`・`features/`・`components/`・`lib/`・`types/` を基準にする
- 実在する方を採用し、以降の説明で混在させない

## 常時ガードレール
- app はルーティングとページ合成だけ。UI/ロジック本体は features・components・lib に置く
- feature 境界を守る
  - 別 feature の内部ファイルを直 import しない
  - feature をまたぐ import は各 feature の公開口（例：`features/<name>/index.ts`）経由に限定する
- 共有の置き場
  - UI の共有：components
  - ロジックの共有：lib
  - 型の共有：types
- 空ディレクトリは作らない（最初のファイルを置く瞬間に作る）
- import は `@/` を優先し、深い相対パスを常用しない
- 依頼に関係ない整形・リファクタはしない（動作や型が変わらない変更でも原則しない）
- チェック未実行を「実行した」と書かない。未実行なら未実行と明記し、推奨コマンドを添える

## どこに何を置くか
- public/：URLで参照する静的ファイル（画像、favicon など）
- content/：作品・記事など更新されるデータ（形式は既存に合わせる）
- features/：画面や機能単位の実装（UI + ロジック + その feature 内の型）
- components/：feature をまたいで使う UI
- lib/：feature をまたいで使うロジック、ユーティリティ、API クライアント
- types/：アプリ全体で共有する型

## アセット規約
- 画像の参照方式は既存規約に合わせる
  - `public/` 前提のパス参照か
  - `import` による静的取り込みか
- 混在しそうな場合は、まず既存実装がどちらかを確認し、同じ方式に揃える
