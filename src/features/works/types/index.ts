// 作品のリンク
export type WorkLink = {
    type: 'demo' | 'video' | 'launch' | 'paper';
    url: string;
    label?: string;
};

// 作品カテゴリ（研究 / インターン / 個人開発 / 制作）
export type WorkCategory = 'research' | 'internship' | 'personal' | 'creative';

// 作品データ
export type Work = {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    links: WorkLink[];
    category?: WorkCategory;
    period?: string;
    role?: string;
    featured?: boolean;
    isCurrent?: boolean;
};
