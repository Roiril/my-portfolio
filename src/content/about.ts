import { AboutData } from '@/features/about/types';

export const aboutData: AboutData = {
  bio: [
    '明治大学大学院でHCI（人とコンピュータの関わり）を研究しています。修士研究では、手だけを身体とするエージェントと人がVRでボードゲームを遊ぶときに、人が手の動きをどう読むかを調べています。企画から実装、ユーザー評価までを自分で行います。',
    'チームではVR作品「廻リ視」の企画・監督・ソフトウェア開発を担当し、IVRC2026で総合優勝しました。長期インターンでは、社内で使うAI業務ツールを要件定義から運用まで担当しています。',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI / Human-Agent Interaction / XR' },
    { title: '制作領域', description: 'VR・MR / Webアプリ / ゲーム / 3DCG' },
    { title: '主な技術', description: 'TypeScript・React・Unity（C#）・Python・Blender' },
    { title: 'AIとの開発', description: 'Claude Code と Codex を日常の開発に使っています' },
    { title: '所属', description: '明治大学大学院 先端数理科学研究科（修士1年）' },
    { title: '修了予定', description: '2028年3月' },
  ],
};
