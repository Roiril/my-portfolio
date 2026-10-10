import { AboutData } from '@/features/about/types';

export const aboutData: AboutData = {
  profileImage: {
    src: '/images/MyFace.png',
    alt: 'プロフィール写真',
  },
  bio: [
    '明治大学大学院でHCI（人とコンピュータの関わり）を研究しています。複合現実やロボットとの協働を題材にしています。企画から実装とユーザ評価まで取り組んでいます。',
    '長期インターンではAIを使った業務ツールを開発しています。社内資料を検索して回答する仕組みなどを実装し、実際の業務での運用も担当しています。',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI / Human-Agent Interaction' },
    { title: '制作領域', description: 'XR / AI / Web' },
    { title: '主なツール', description: 'Claude Code Max (5x)・Codex Pro (5x)・Google AI Pro・Unity (CLI)・Python' },
    { title: '拠点', description: '明治大学（東京）' },
  ],
};
