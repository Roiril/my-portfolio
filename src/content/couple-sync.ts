export const coupleSync = {
  description: '離れて暮らすふたりのために開発した共有アプリです。予定や日々の記録を猫のいる部屋から開けます。ガチャで家具を集める楽しみも用意しました。',
  lead: '離れて暮らすふたりのために開発した共有アプリです。',
  introduction: '予定の確認も日々の記録も猫のいる部屋から始められます。暮らしに必要な機能とふたりで楽しめる遊びをひとつにまとめました。',
  scenes: [
    {
      title: '予定の共有',
      heading: 'ふたりのカレンダー',
      body: 'それぞれの予定をひとつのカレンダーで確認できます。デートの計画や記念日も一緒に管理できます。',
      image: '/images/works/couple-sync/01-calendar.png',
      alt: 'ふたりの予定を同じ日付で確認できるカレンダー画面',
      caption: '壁のカレンダーから予定を開きます。',
    },
    {
      title: '日々の記録',
      heading: '共有ノート',
      body: '一緒にやってみたいことや忘れたくないことをノートに残せます。体調や食事の記録も別の画面にまとめています。',
      image: '/images/works/couple-sync/02-notes.png',
      alt: 'ふたりで書き込めるノート画面',
      caption: 'テーブルのノートから記録を開きます。',
    },
  ],
  play: {
    heading: 'ガチャと模様替え',
    body: [
      '集めたコインでガチャを回すと家具が手に入ります。好きな家具を飾って部屋の雰囲気を変えられます。',
      '部屋には猫が暮らしています。ごはんをあげることもできます。ミニゲームも用意しているので予定がない日にも楽しめます。',
    ],
    image: '/images/works/couple-sync/03-gacha.png',
    alt: 'コインを使って家具を集められるガチャの画面',
    caption: 'ガチャで集めた家具を部屋に飾れます。',
  },
  additionalScreens: [
    { title: '体調と食事', body: '睡眠や食事を記録できます。', image: '/images/works/couple-sync/04-health.png', alt: '睡眠時間と食事を記録する画面' },
    { title: '記念日と思い出', body: '写真と一緒に思い出を残せます。', image: '/images/works/couple-sync/05-memories.png', alt: '写真と出来事を並べた記念日の画面' },
    { title: 'ミニゲーム', body: '部屋のおもちゃ箱から遊べます。', image: '/images/works/couple-sync/06-games.png', alt: 'おもちゃ箱から選べるミニゲームの画面' },
  ],
  engineering: [
    {
      title: '端末内への保存',
      body: '記録は端末内のIndexedDBに保存します。通信が切れている間も表示や編集を続けられます。',
      technology: 'IndexedDB',
    },
    {
      title: '端末間の同期',
      body: '通常版ではSupabaseでふたりの端末をつないでいます。通信が戻るとオフライン中の編集内容を同期します。',
      technology: 'Supabase',
    },
    {
      title: 'ホーム画面からの起動',
      body: 'ブラウザからホーム画面に追加して使えるWebアプリ（PWA）です。ReactとTypeScriptで画面を実装しました。',
      technology: 'React / TypeScript / PWA',
    },
  ],
  legacy: '猫のいる部屋を入口にしたデザインへ更新しました。従来の一覧型の画面にも切り替えられます。デモでも両方のデザインを試せます。',
  demo: '公開デモには架空の記録を使っています。変更はこのブラウザ内に保存されます。外部サービスとの通信は行いません。AIの返答もデモ用の内容です。',
};
