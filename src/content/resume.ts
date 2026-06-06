import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';

export type ResumeEducation = { period: string; title: string; detail?: string };
export type ResumeSkillTier = { label: string; note: string; items: string[] };
export type ResumeAward = { period: string; text: string };

export const resumeProfile = {
  name: '白石 大晴',
  kana: 'Shiroishi Taisei',
  title: 'HCI研究者・インタラクションデザイナー',
  tagline:
    '人・ロボット・AIが「次に何をしようとしているか」を，相手の負担を増やさず伝える設計．',
  email: SITE_EMAIL,
  location: '東京 / 明治大学大学院',
  links: SOCIAL_LINKS,
  summary:
    '明治大学大学院でHCI（人とコンピュータの関わりの設計）を研究．複合現実やロボットとの協働を題材に，企画から実装，ユーザ評価までを一人で回します．長期インターンでは実運用されるAI業務ツール（RAG）を開発．技術（実装）と人間理解（リサーチ）の両方を強みに，研究と開発を往復しています．',
};

export const resumeEducation: ResumeEducation[] = [
  {
    period: '2026.4 – 2028.3（見込み）',
    title: '明治大学大学院 先端数理科学研究科 先端メディアサイエンス専攻 博士前期課程',
    detail: '修士（工学）取得見込み',
  },
  {
    period: '2022.4 – 2026.3',
    title: '明治大学 総合数理学部 先端メディアサイエンス学科 卒業',
  },
];

export const resumeSkills: ResumeSkillTier[] = [
  {
    label: '主力',
    note: '迷わず設計・実装できる',
    items: ['TypeScript / JavaScript', 'React', 'Supabase', 'Git / GitHub', 'AI協働開発（Claude Code）'],
  },
  {
    label: '実務経験あり',
    note: 'プロジェクトで実際に使い，形にした',
    items: [
      'Next.js',
      'Vite',
      'Unity / Meta Quest（XR）',
      'Python',
      'RAG・LLMアプリ実装',
      '半構造化インタビュー / 質的分析',
      'Research through Design',
    ],
  },
  {
    label: '使用経験',
    note: '必要に応じて使える',
    items: ['React Three Fiber', '画像合成', 'BLE・ハード制御', 'Blender', 'Marp'],
  },
];

export const resumeAwards: ResumeAward[] = [
  { period: '2026', text: '学生VRコンテスト「IVRC 2026」書類審査通過（チーム制作・進行中）' },
];
