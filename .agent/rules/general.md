---
trigger: always_on
description: 事故防止と品質維持のための基本ルール
---

# .agent/rules/general.md
# Portfolio Site - General Rules

## Project layout (assumption)
- ルートが `src/` 構成なら、`src/app/`・`src/features/`・`src/components/`・`src/lib/`・`src/types/` を基準にする
- ルート直下構成なら、`app/`・`features/`・`components/`・`lib/`・`types/` を基準にする
- 以降のルールは「実際に存在する方」を採用し、混在させない

## Always-on guardrails
- app はルーティングとページ合成だけ。UI/ロジック本体は features・components・lib に置く
- feature 境界を守る
  - 別 feature の内部ファイルを直 import しない
  - cross-feature import は各 feature の公開口（例：`features/<name>/index.ts`）経由に限定する
- 共有の置き場
  - UI の共有：components
  - ロジックの共有：lib
  - 型の共有：types
- 空ディレクトリは作らない。最初のファイルを置く瞬間に作る
- import は `@/` を優先し、深い相対パスを常用しない
- チェック未実行を「実行した」と書かない。未実行なら未実行と明記し、推奨コマンドを添える
- 依頼に関係ない整形・リファクタはしない（動作や型が変わらない変更でも原則しない）

## What belongs where
- public/ : URLで参照する静的ファイル（画像・favicon など）
- content/ : 作品・記事など更新されるデータ（形式は既存に合わせる）
- features/ : 画面や機能単位の実装（UI + ロジック + その feature の型）
- components/ : feature をまたいで使う UI
- lib/ : feature をまたいで使うロジック、ユーティリティ、API クライアント
- types/ : アプリ全体で共有する型

## Asset rules
- 画像の参照方式は既存規約に合わせる
  - `public/` 前提のパス参照か
  - `import` での静的取り込みか
- 方式が混在しそうなら、まず既存実装がどちらかを確認して揃える
