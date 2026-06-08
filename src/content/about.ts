import { AboutData } from '@/features/about/types';

export const aboutData: AboutData = {
  profileImage: {
    src: '/images/MyFace.png',
    alt: 'プロフィール写真',
  },
  bio: [
    '明治大学大学院でHCI（人とコンピュータの関わりの設計）を研究しています．複合現実やロボットとの協働を題材に，企画から実装，ユーザ評価までを一人で回します．',
    '長期インターンでは，実運用されるRAGを用いたAI業務ツールを開発．対話を重ねながら，より良いプロダクトを追求しています．',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI / Human-Agent Interaction' },
    { title: '制作領域', description: 'XR / AI / Web' },
    { title: '主なツール', description: 'TypeScript・React・Unity・Claude Code' },
    { title: '拠点', description: '明治大学（東京）' },
  ],
  toolSections: [
    {
      title: '主力',
      categories: [
        {
          title: '',
          items: [{ name: 'TypeScript, JavaScript, React, Supabase, Git, Claude Code' }],
        },
      ],
    },
    {
      title: '実務経験あり',
      categories: [
        {
          title: '',
          items: [{ name: 'Next.js, Vite, Unity, Meta Quest, Python, RAG / LLM, ユーザリサーチ, RtD, Marp' }],
        },
      ],
    },
    {
      title: '使用経験',
      categories: [
        {
          title: '',
          items: [{ name: 'React Three Fiber, 画像合成, BLE / ハード制御, Blender' }],
        },
      ],
    },
  ],
};
