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

// 自己紹介データ
export type AboutData = {
  bio: string[];
  skills: string[];
};
