// ツール項目
export type ToolItem = {
    name: string;
    description?: string;
};

// ツールカテゴリ（サブカテゴリあり）
export type ToolCategory = {
    title: string;
    items: ToolItem[];
};

// メインカテゴリ
export type ToolSection = {
    title: string;
    categories: ToolCategory[];
};

// Key Fact項目
export type KeyFact = {
    title: string;
    description: string;
};

// 通底する軸
export type AboutAxis = {
    tag: string;
    title: string;
    body: string;
};

// 自己紹介データ
export type AboutData = {
    profileImage?: {
        src: string;
        alt: string;
    };
    bio: string[];
    keyFacts?: KeyFact[];
    axes?: AboutAxis[];
    toolSections: ToolSection[];
};
