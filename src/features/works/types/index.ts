// 作品のリンク
export type WorkLink = {
    type: 'demo' | 'video' | 'launch' | 'paper';
    url: string;
    label?: string;
};

// 作品カテゴリ（研究 / インターン / 個人開発 / 制作）
export type WorkCategory = 'research' | 'internship' | 'personal' | 'creative';

// 詳細ページのギャラリー画像
export type WorkGalleryImage = {
    src: string;
    alt?: string;
    // 横長の写真などを1枚で大きく見せたいときに true
    wide?: boolean;
};

// 詳細ページ内のセクション（小作品集などを見出し付きで並べるとき用）
export type WorkSection = {
    title?: string;
    body?: string[];
    gallery?: WorkGalleryImage[];
    // sm以上でのグリッド列数（既定: 2）
    columns?: 2 | 3 | 4;
    // セクション固有の外部リンク（動画など）
    links?: WorkLink[];
};

// 作品詳細ページの中身（設定された作品だけ専用ページを持つ）
export type WorkDetail = {
    // 見出し下のリード文（無ければ description を使う）
    lead?: string;
    // 本文（段落ごとに配列で渡す）
    body?: string[];
    // ギャラリー画像（単一ギャラリーの作品用）
    gallery?: WorkGalleryImage[];
    // gallery を縦長スマホ画面として表示する（アプリのスクショ用。切り取らず全体を見せる）
    phone?: boolean;
    // 見出し付きセクション（小作品集など）
    sections?: WorkSection[];
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
    featured?: boolean;
    isCurrent?: boolean;
    // true の作品は一覧に表示しない（一時的に隠す用）
    hidden?: boolean;
    // 専用の詳細ページを持つ作品だけ設定する
    detail?: WorkDetail;
};
