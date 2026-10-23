import { SITE_EMAIL, SITE_URL, SOCIAL_LINKS } from '@/constants/site';

export type ResumeEducation = { period: string; title: string; detail?: string };
export type ResumeSkillTier = { label: string; note: string; items: string[] };
export type ResumeAward = { period: string; text: string };

export const resumeProfile = {
  name: '白石 大晴',
  kana: 'Shiroishi Taisei',
  title: 'HCI研究・インタラクションデザイン',
  tagline:
    '人と人、人とロボット、人とAIのあいだに、誤解のない心地よいやり取りを作ります。',
  email: SITE_EMAIL,
  location: '東京 / 明治大学大学院',
  portfolio: SITE_URL,
  links: SOCIAL_LINKS,
  summary:
    '明治大学大学院でHCI（人とコンピュータの関わりの設計）を研究しています。VR・MRやエージェントとのやり取りを題材に、企画から実装、ユーザー評価までを自分で行います。チームではVR作品「廻リ視」の企画・監督・ソフトウェア開発を担当し、IVRC2026で総合優勝しました。長期インターンでは、社内で運用するAI業務ツール（RAG）を要件定義から運用まで担当しています。',
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
    items: ['TypeScript / JavaScript', 'React', 'Supabase', 'Git / GitHub', 'AI協働開発（Claude Code・Codex）'],
  },
  {
    label: '制作で使用',
    note: 'プロジェクトで使い、形にした',
    items: [
      'Next.js',
      'Vite',
      'Unity（C#）/ Meta Quest（XR）',
      'Python',
      'RAG・LLMアプリ実装',
      '半構造化インタビュー / 質的分析',
      'Research through Design',
    ],
  },
  {
    label: '使用経験',
    note: '必要に応じて使える',
    items: ['React Three Fiber / three.js', 'Kotlin（Android）', 'Blender', 'Processing', '画像合成', 'BLE・ハード制御', 'Marp'],
  },
];

export const resumeAwards: ResumeAward[] = [
  { period: '2026', text: '学生VRコンテスト IVRC2026 総合優勝・DCEXPO賞（「廻リ視」、チーム制作。企画・監督・ソフトウェア開発を担当）。第31回日本VR学会大会（富山県立大学）で体験展示し、2026年11月に DCEXPO2026 で展示予定' },
  { period: '2026.08', text: 'unity1week「しろ」に「WhiteOut」を出品。楽しさの評価 4.434/5、評価の高い作品に選出' },
];
