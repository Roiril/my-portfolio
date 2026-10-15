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
