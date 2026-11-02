import { AboutData } from '@/features/about/types';

export const aboutData: AboutData = {
  bio: [
    '明治大学大学院でHCI（人とコンピュータの関わり）を研究しています。修士研究では、手だけを身体とするエージェントとの遊びを通じて、人が動きをどう解釈し、遊び相手としてどう受け止めるかを調べ、インタラクション設計の要件を定義することを目指しています。企画、制作、調査に取り組み、開発にはAIも活用しています。',
    'チームではVR作品「廻リ視」の企画・監督・ソフトウェア開発を担当し、監視カメラに映る自分を見ながら現実世界を歩く体験を制作しました。作品はIVRC2026で総合優勝しました。長期インターンでは、営業担当へのヒアリングから要件定義、AIを活用した実装、テストと動作検証、運用までを担当しています。',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI / Human-Agent Interaction / XR' },
    { title: '制作領域', description: 'VR・MR / Webアプリ / ゲーム / 3DCG' },
    { title: '主な技術', description: 'TypeScript・React・Unity（C#）・Python・Blender' },
    { title: 'AIとの開発', description: 'Claude Code と Codex を活用して実装し、要件の整理、設計の把握、テストと動作検証を行っています' },
    { title: '所属', description: '明治大学大学院 先端数理科学研究科（修士1年）' },
    { title: '修了予定', description: '2028年3月' },
  ],
};
