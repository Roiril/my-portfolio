# 公開デモの生成

ポートフォリオから開ける2つのデモを現行ソースから作る。
個人情報と外部接続だけを公開デモ用に置き換える。

- couple-sync：隣の `couple-sync` と `couple-app-v2` のソースを使用する。新デザインを入口にする。現行の旧デザインへ切り替えられる。
- cogni-storage：隣の `cogni-storage` のソースを使用する。
- 元のプロジェクトは編集しない。`.env` と本番データは取り込まない。
- 名前を架空名にする。写真と誕生日素材は生成した見本にする。時間割と研究資料と記録は架空の見本にする。
- Supabaseの操作は `local-backend.mjs` がブラウザのIndexedDBへ保存する。新旧デザインは同じ記録を使う。別端末とは共有しない。
- AIの返事と天気はローカルの見本を返す。表示する機能とゲームは現行ソースを保つ。
- 初回の部屋には見本の15コインと2つの家具がある。ガチャと模様替えをすぐ試せる。消費後は再読み込みしても補充しない。
- CSPで外部通信を禁止する。新しいService Workerは登録しない。Cogniの旧デモを保存済みのブラウザには退役用Workerを配る。

## 再生成

3つの元プロジェクトに既存のnpm依存が導入済みであることが必要。
画像変換と検証にはCodexの同梱ランタイムにあるSharpとPlaywrightを使用する。
coupleの生成は元リポジトリのHEADを記録する。
Cogniの生成は `build-cogni-demo.mjs` の対象HEADと一致することを確認する。
元ソースが変わったときは匿名化の対象も確認して更新する。

```text
npm run build:demos
npm run check:local-demo-backend
npm run dev -- --hostname 127.0.0.1 --port 3100
```

開発サーバーを起動した状態で次を実行する。

```text
npm run check:couple-demo
npm run check:cogni-demo
node scripts/check-demo-privacy.mjs
node scripts/check-demo-migration.mjs
npm run render:couple-thumbnail
npm run lint
npm run build
```

検証は実際の操作と描画を待つ。部屋から開く各画面を確認する。
ガチャと餌やりと模様替えを操作する。旧デザインの17ゲームを表示する。
記録が新旧デザインで共有されることと再読み込み後も残ることを確認する。
Cogniでは研究の庭と各カードを開く。Ideaを作成して保存を確認する。
PCと小さいスマートフォンで横にはみ出さないことを測る。
ネットワーク監視と静的検査を両方行う。
証拠画像とJSONは `.codex/couple-demo-check/` に保存する。

coupleのサムネイルは `scripts/artwork/couple-sync.html` から生成する。
部屋の写真はデモ検証時に撮る。ガチャ台を含む現行画面をそのまま使用する。
