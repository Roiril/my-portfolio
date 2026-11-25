// 架空のゲームの攻略本。1 冊足すときは、ここへ 1 件足し、src/app/books/<id>/page.tsx に本文のページを作る
export type BookPage = {
  n: number;
  title: string;
  // 画の説明
  alt: string;
};

export type GuideBook = {
  id: string;
  title: string;
  // トップの札に出す説明と、制作の分担
  say: string;
  made: string;
  date: string;
  // 札の地と文字の色。表紙の色から取る
  ground: string;
  tint: string;
  // 札に並べる中のページ（public/images/books/<id>/tNN.webp）
  peek: number[];
  pages: BookPage[];
};

export const katakage: GuideBook = {
  id: 'katakage',
  title: '片影 完全攻略本',
  say: '実体と影の両方から攻略する、3Dアクションゲームの攻略本です。ゲームは実在しません。',
  made: '題材の発案は白石。紙面の制作に Claude Code、絵に画像生成 AI を使いました。',
  date: '2026.11',
  ground: '#15192b',
  tint: '#fbb71b',
  peek: [4, 5, 7],
  pages: [
    { n: 1, title: '表紙', alt: '黄色い壁に少女の影。傘の影を足場に上へ手を伸ばし、下では少年が提灯を持って見上げている' },
    { n: 2, title: '灯の消えた町', alt: '夜の港町の地図。船着き場から岬の灯台まで、六つの場所に札が付いている' },
    { n: 3, title: 'ふたりで、ひとり', alt: '提灯を持つ少年ヨリと、その後ろの壁に大きく映る影ネム' },
    { n: 4, title: '影の規則', alt: '明るい所は空、薄い影は水、濃い影は地面という三つの規則と、影の五つの性質の図' },
    { n: 5, title: '倒さない。影を返す。', alt: '町の人と、持ち主から離れて壁で動く影。影を返す三つの手順と灯の道具' },
    { n: 6, title: '船着き場・銭湯・時計塔', alt: '三つの場所の絵と、それぞれの解き方' },
    { n: 7, title: '傘屋の坂', alt: '傘の影を段にして高窓へ上がる道の図。傘ごとの影の高さの表' },
    { n: 8, title: '芝居小屋 ヒトリ', alt: '舞台の幕いっぱいに広がる蛾の影と、提灯を持つヨリ、縄を引くネム' },
    { n: 9, title: '灯を離すと、蛾は縮む', alt: '灯と蛾の距離で影の大きさが変わる図と、三幕の攻略' },
    { n: 10, title: '遊ぶ人が見つけた道', alt: '遊ぶ人が見つけた八つの抜け道の図。実の面と影の面を並べている' },
    { n: 11, title: '岬の灯台', alt: '灯台の中のヨリとネム。下の段に、ところどころ欠けた文字と、手を伸ばすヨリ' },
    { n: 12, title: '裏表紙', alt: '橋を渡るヨリと、水面に逆さに映るネム。下の段に、裏返しの文字の欠けらと、手を伸ばすネム' },
  ],
};

export const guideBooks: GuideBook[] = [katakage];
