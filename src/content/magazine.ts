// トップページを雑誌の誌面として組むための編集データ。
// 作品そのものの情報は works.ts が正本で、ここには「誌面でどう見せるか」だけを置く。

export type SpreadLayout = 'bleed' | 'left' | 'right';

export type FeatureSpread = {
    // works.ts の id
    workId: string;
    // 誌面の小見出し（作品の種類をひとことで）
    kicker: string;
    // 大きく引用する一文（works.ts の説明文から取る）
    pullQuote: string;
    layout: SpreadLayout;
    // 写真から取った誌面の色。地・文字・差し色
    theme: { paper: string; ink: string; accent: string };
    // 写真の上に貼るステッカー（事実だけを書く）
    sticker?: string;
    // 斜めに貼る 2 枚目の写真
    inset?: { src: string; alt: string };
};

export const issue = {
    masthead: 'ROIL',
    issueLine: '2026 年 秋号',
    theme: 'HCI と ものづくり',
    // 顔写真は使わない方針。表紙の絵は magazine-art.ts の cover
    coverLines: [
        { label: '特集', text: '廻リ視 ― 監視カメラの自分を見ながら歩くホラー' },
        { label: '研究', text: '人と機械が同じ場所で働くとき' },
        { label: '遊び', text: 'WhiteOut ― 白いインクで塗りつぶすローグライト' },
        { label: '制作', text: '映像・3D・サウンド・コードの小作品' },
    ],
    coverSticker: 'IVRC2026 優勝',
};

export const features: FeatureSpread[] = [
    {
        workId: 'mawarimi',
        kicker: '特集　実世界 × 固定視点ホラー',
        pullQuote: '監視カメラに映る自分を見ながら、現実空間を歩く。',
        layout: 'bleed',
        theme: { paper: '#0c0a09', ink: '#efe9e1', accent: '#d3271c' },
        sticker: 'IVRC2026 優勝',
    },
    {
        workId: 'robot-collab',
        kicker: '研究　修士研究・進行中',
        pullQuote: '自然な協力が生まれる条件を探る。',
        layout: 'left',
        theme: { paper: '#ffffff', ink: '#121212', accent: '#2433ff' },
        sticker: '進行中',
    },
    {
        workId: 'whiteout',
        kicker: 'ゲーム　unity1week「しろ」',
        pullQuote: '白いインクで、9 つの面を塗りつぶす。',
        layout: 'right',
        theme: { paper: '#111111', ink: '#ffffff', accent: '#ff5a1f' },
        sticker: '楽しさ 4.434/5',
    },
    {
        workId: 'couple-sync',
        kicker: 'アプリ　ふたりのための共有アプリ',
        pullQuote: 'ふたりの毎日を、ひとつの部屋に。',
        layout: 'left',
        theme: { paper: '#f3c6c1', ink: '#3d2420', accent: '#ffffff' },
        inset: { src: '/images/works/couple-sync/00-room.png', alt: '猫のいる部屋から各機能を開く画面' },
    },
    {
        workId: 'cogni-storage',
        kicker: 'アプリ　研究ログ PWA',
        pullQuote: '読む・考える・書くを、一本の流れに。',
        layout: 'right',
        theme: { paper: '#1a1512', ink: '#f0e6d6', accent: '#d8a35c' },
        inset: { src: '/images/works/cogni-storage/02-ideas.png', alt: '思いつきをカードで育てる Ideas の画面' },
    },
    {
        workId: 'intentlayer',
        kicker: '研究　卒業研究',
        pullQuote: '「いま話しかけてよいか」を、空間に置く。',
        layout: 'left',
        theme: { paper: '#ffffff', ink: '#121212', accent: '#2433ff' },
    },
];

export const profile = {
    title: 'プロフィール',
};
