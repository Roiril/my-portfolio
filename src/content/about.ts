import { AboutData } from '@/features/about/types';

export const aboutData: AboutData = {
  bio: [
    '明治大学総合数理学部先端メディアサイエンス学科でHCIを勉強しています．',
    'Unity，Antigravity，Filmora，Blenderなどを用いて，プロトタイプから映像制作まで幅広く取り組んでいます．',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI（Human-Computer Interaction）' },
    { title: '制作領域', description: 'XR / 映像' },
    { title: '主なツール', description: 'Unity，Antigravity，Filmora，Blender' },
    { title: '拠点', description: '明治大学（東京）' },
  ],
  toolSections: [
    {
      title: 'AI Nature Creation',
      categories: [
        {
          title: '',
          items: [
            { name: 'Gemini, Antigravity, Flow' },
            { name: 'Claude, Claude Code' },
            { name: 'ChatGPT, Codex' },
            { name: 'DomoAI, SunoAI' },
          ],
        },
      ],
    },
    {
      title: 'Crafting & Development',
      categories: [
        {
          title: '',
          items: [
            { name: 'Unity, Blender, BambuLab, Toio, M5Stack' },
          ],
        },
      ],
    },
  ],
};
