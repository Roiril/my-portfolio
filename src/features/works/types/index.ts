// 作品のリンク
export type WorkLink = {
    type: 'demo' | 'video' | 'launch' | 'paper';
    url: string;
    label?: string;
};

// 作品カテゴリ（研究 / インターン / 個人開発 / 制作）
export type WorkCategory = 'research' | 'internship' | 'personal' | 'creative';

// 技術説明。資料やリポジトリで確かめた事実だけを書く。詳細ページはここの文を使う
export type WorkTech = {
    // 章の冒頭に置く要約（1〜2 文）
    summary: string;
    // 使った技術。label は「エンジン」「言語」のような分類
    stack: { label: string; items: string[] }[];
    // しくみ。入力から出力までを順に並べる（3〜6 段）
    flow?: { title: string; body: string }[];
    // 工夫した点
    points: { title: string; body: string }[];
    // 大きく見せる数値（資料にある値だけ）
    numbers?: { value: string; unit?: string; label: string }[];
};

// 詳細ページに埋め込む動画・投稿。large は大きく、small は脇に小さく置く
export type WorkMedia = {
    type: 'youtube' | 'x';
    // YouTube は動画 ID、X は投稿の URL
    src: string;
    title: string;
    caption?: string;
    size?: 'large' | 'small';
    // 投稿の数字（表示回数・いいね など）。いつ数えたかは Work.reception.asOf に書く
    stats?: { label: string; value: string }[];
};

// 反響（公開後に外で数えた数字）。詳細ページの頭に帯で出す。数えた日を必ず添える
export type WorkReception = {
    // 帯の見出し（既定は「反響」）
    title?: string;
    asOf: string;
    items: { value: string; unit?: string; label: string }[];
};

// 作品データ
export type Work = {
    id: string;
    title: string;
    description: string;
    image: string;
    // 画像の表示方法（既定: cover＝領域を埋めてはみ出しを切り取る / contain＝全体を領域内に収める）
    imageFit?: 'cover' | 'contain';
    tags: string[];
    links: WorkLink[];
    category?: WorkCategory;
    period?: string;
    role?: string;
    credits?: string[];
    featured?: boolean;
    isCurrent?: boolean;
    // true の作品は一覧に表示しない（一時的に隠す用）
    hidden?: boolean;
    // 技術説明。これがある作品は詳細ページを持つ
    tech?: WorkTech;
    // 詳細ページの動画・投稿
    media?: WorkMedia[];
    reception?: WorkReception;
};
