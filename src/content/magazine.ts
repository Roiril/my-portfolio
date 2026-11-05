// トップページを雑誌の誌面として組むための編集データ。
// 作品そのものの情報は works.ts が正本で、ここには「誌面でどう見せるか」だけを置く。

export type SpreadLayout = 'bleed' | 'left' | 'right';

export type FeatureFact = string | { figure: string; label: string };

export type FeatureSpread = {
    // works.ts の id
    workId: string;
    // 誌面の小見出し（作品の種類をひとことで）
    kicker: string;
    // 大きく引用する一文（works.ts の説明文から取る）
    pullQuote: string;
    layout: SpreadLayout;
    // 写真から取った誌面の色。地・文字・差し色。
    // accentText は差し色で小さな文字を書くときの色（差し色のままだと地の上で読めない作品だけ置く。WCAG の 4.5:1 を目安）
    theme: { paper: string; ink: string; accent: string; accentText?: string };
    // 図版の縦横比（画像の実寸に合わせて切らないようにする。省略すると 16 / 10）
    photoRatio?: string;
    // 白地の線画。写真として置かず、誌面の地に直接刷る（乗算）
    printed?: boolean;
    // 本文の手前に並べる実績（受賞・評価・数字）。数字は figure と label に分けると大きく組む
    facts?: FeatureFact[];
};

export const issue = {
    masthead: 'ROIL',
    issueLine: '2026 年 秋号',
    theme: 'HCI と ものづくり',
    // 表紙の名前の下に出す。採用の方が最初に知りたい「いつ卒業か」
    graduation: '2028 年 3 月 修了予定',
    // 顔写真は使わない方針。表紙の絵は magazine-art.ts の cover
    coverLines: [
        { label: '特集', text: '廻リ視 ― 監視カメラの自分を見ながら歩くホラー' },
        { label: '研究', text: 'Play with a Hand ― 手だけのエージェントと遊ぶ' },
        { label: '遊び', text: 'WhiteOut ― 白いインクで塗りつぶすローグライト' },
        { label: '制作', text: '映像・3D・サウンド・コードの小作品' },
    ],
    // ステッカーは丸の中で 2 行に収める。改行の位置は \n で決める（語の途中で切らないため）
    coverSticker: 'IVRC2026\n総合優勝',
    coverStickerBack: 'DCEXPO賞\n受賞',
};

export const features: FeatureSpread[] = [
    {
        workId: 'mawarimi',
        kicker: '特集　実世界 × 固定視点ホラー',
        pullQuote: '監視カメラに映る自分を見ながら、現実空間を歩く。',
        layout: 'bleed',
        theme: { paper: '#0c0a09', ink: '#efe9e1', accent: '#d3271c', accentText: '#ef4a3a' },
        facts: ['IVRC2026 総合優勝', 'DCEXPO賞', '日本VR学会大会 体験展示'],
    },
    {
        workId: 'robot-collab',
        kicker: '研究　修士研究・進行中',
        pullQuote: '話さない手と、ボードゲームを遊ぶ。',
        layout: 'left',
        photoRatio: '16 / 9',
        theme: { paper: '#ffffff', ink: '#121212', accent: '#2433ff' },
    },
    {
        workId: 'ai-business-tools',
        kicker: '実務　長期インターン',
        pullQuote: '下書きは AI に、確かめるのは人が。',
        layout: 'right',
        photoRatio: '3 / 2',
        printed: true,
        theme: { paper: '#f4f5fb', ink: '#14163a', accent: '#2433ff' },
    },
    {
        workId: 'whiteout',
        kicker: 'ゲーム　unity1week「しろ」',
        pullQuote: '白いインクで、9 つの面を塗りつぶす。',
        layout: 'left',
        photoRatio: '16 / 9',
        theme: { paper: '#111111', ink: '#ffffff', accent: '#ff5a1f' },
        facts: [
            { figure: '4.434/5', label: '楽しさの評価' },
            { figure: '6万回+', label: 'X での表示' },
            { figure: '1.5万回', label: 'unityroom の閲覧' },
        ],
    },
    {
        workId: 'couple-sync',
        kicker: 'アプリ　ふたりのための共有アプリ',
        pullQuote: 'ふたりの毎日を、ひとつの部屋に。',
        layout: 'right',
        // 地は画像の地色に合わせ、写真の四角が見えないようにする
        theme: { paper: '#f4c2bd', ink: '#3d2420', accent: '#fff5dc', accentText: '#3d2420' },
    },
    {
        workId: 'cogni-storage',
        kicker: 'アプリ　研究ログ PWA',
        pullQuote: '読む・考える・書くを、一本の流れに。',
        layout: 'left',
        photoRatio: '5 / 3',
        theme: { paper: '#120e0b', ink: '#f0e6d6', accent: '#d8a35c' },
    },
    {
        workId: 'intentlayer',
        kicker: '研究　卒業研究',
        pullQuote: '「いま話しかけてよいか」を、空間に置く。',
        layout: 'right',
        photoRatio: '654 / 400',
        printed: true,
        theme: { paper: '#ffffff', ink: '#121212', accent: '#2433ff' },
    },
];

export const profile = {
    title: 'プロフィール',
};
