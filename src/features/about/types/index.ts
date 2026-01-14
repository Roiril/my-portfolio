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

// 自己紹介データ
export type AboutData = {
    bio: string[];
    keyFacts?: KeyFact[];
    toolSections: ToolSection[];
};
