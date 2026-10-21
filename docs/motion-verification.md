# モーション検証（2026-10-15）

- `npm run build`：成功。13ページ生成。
- TypeScript `--noEmit` と変更した TSX の ESLint：成功。
- 本番ビルドのブラウザ確認：1440×1000、1280×900、390×844、320×700、844×390。
- 図形から作品画像への移動、逆スクロール、作品フィルター、キーボードフォーカスを確認。
- `prefers-reduced-motion: reduce` で画像移動・見出しマスク解除を確認。狭幅・横向きとも横あふれなし。
- 本番ビルドのコンソールエラーなし。入力と描画の累計は `.interaction-scene` の `data-inputs` / `data-frames` で観測できる。
- 待機中の60フレーム目と120フレーム目で、入力586／描画816のまま変化なし。描画が停止することを確認。
- 検証画像：`G:\マイドライブ\shubie\screenshots\2026-10-15_portfolio-motion-desktop.png`

ビルドには既存の baseline-browser-mapping データ更新案内と middleware 名称の非推奨警告がある。
Windows の制限環境では Next.js の SWC が `jsc.baseUrl` を解決できず OS error 5 になるため、この検証では昇格してビルドした。

## 画像の再登場と重なり順の修正

- `npm run build` と変更した TSX の ESLint：成功。
- 1280×720 と390×844で、廻リ視の飛行画像が Works 見出しより手前に描画されることを目視と `elementFromPoint` で確認。
- 廻リ視と次の作品が着地した後に上へ戻っても、飛行属性なし・transform指定なし・不透明度1を維持。
- 個人開発→すべてのフィルター切り替え後も、表示済み画像の着地状態を維持。
- スマホの reduced motion では飛行属性0件。WhiteOutの画像読込済み・クリップなし・横あふれなし。
- 検証画像：`G:\マイドライブ\shubie\screenshots\2026-10-15_portfolio-image-flight-front.png` と `2026-10-15_portfolio-image-flight-mobile.png`。

## 案内役の手（2026-10-21）

- 表紙の手の層を「手」と「駒」に分けた（`scripts/magazine/split_hand.py`）。駒は盤に残り、手だけが持ち上がる。
- スクロール 460px で表紙の手を隠し、同じ位置から固定配置の案内役（`GuideHand.tsx`）が飛び立つ。455px と 462px の画面を並べて継ぎ目が見えないことを確認。
- 1440×900：目次は中央の行（マウスを載せた行）を指さし、特集は「詳しく読む」を「どうぞ」で示し、作品は絞り込みを指さし、押すとグッジョブ、プロフィールはボタン横でグッジョブ、連絡先はメールを指さし、最下部で手を振る。
- 375×812：右下の隅に座り、節ごとにしぐさだけ変わる。
- 押すとハイタッチ（手を開く）を返す。上へ戻すと表紙の手が戻り、案内役は消える。
- 動き OFF：案内役は `display: none`、表紙の手と駒は元の絵の位置。コンソールエラーなし。`npm run build` 成功。
- ポーズの元絵とプロンプト：`G:\マイドライブ\shubie\design-study\2026-10-19\codex\guide-*.png` と `prompts\guide-hand\`。
