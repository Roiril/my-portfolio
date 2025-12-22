// 作品のリンク
export type WorkLink = {
  type: 'demo' | 'video' | 'launch';
  url: string;
  label?: string;
};

// 作品データ
export type Work = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  links: WorkLink[];
  featured?: boolean;
  isCurrent?: boolean;
};

// SNSリンク
export type SocialLink = {
  platform: string;
  url: string;
  icon: string;
};

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

// 自己紹介データ
export type AboutData = {
  bio: string[];
  toolSections: ToolSection[];
};
