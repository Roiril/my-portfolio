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

// 構成図。座標は格子の升目（x は列、y は段。0.5 刻みも可）
export type DiagramIcon = 'hmd' | 'phone' | 'laptop' | 'pc' | 'cloud' | 'db' | 'browser' | 'camera' | 'person';
export type DiagramNode = {
    id: string;
    x: number;
    y: number;
    // icon を持つノードは「モノ」（絵＋太字の名前＋小さな仕様）。持たないノードは「ソフト」（点線の枠＋斜体の名前＋機能）
    icon?: DiagramIcon;
    label?: string;
    note?: string;
};
export type DiagramEdge = {
    from: string;
    to: string;
    label?: string;
    // 無線・通知など、物理的につながっていない流れは破線
    wireless?: boolean;
    // 双方向
    both?: boolean;
    // ラベルを線のどこに置くか（0＝始点、1＝終点。既定 0.5）。囲みの罫とぶつかるときにずらす
    labelAt?: number;
};
export type Diagram = {
    // 図の大きさ（升目の数）
    cols: number;
    rows: number;
    nodes: DiagramNode[];
    edges: DiagramEdge[];
    // 場所や系のまとまり（点線で囲み、左上に灰色の太字）
    groups?: { x: number; y: number; w: number; h: number; label: string }[];
    caption: string;
};

// 技術説明（詳細ページの「技術」の章）。資料やリポジトリで確かめた事実だけを書く
export type WorkTech = {
    // 構成図
    diagram?: Diagram;
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
    // 専用の詳細ページを持つ作品だけ設定する
    detail?: WorkDetail;
    // 技術説明。detail か tech のどちらかがあれば詳細ページを持つ
    tech?: WorkTech;
    // 詳細ページの動画・投稿
    media?: WorkMedia[];
};
