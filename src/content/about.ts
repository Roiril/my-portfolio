import { AboutData } from '@/types/content';

export const aboutData: AboutData = {
  bio: [
    '明治大学総合数理学部FMSでHCIを研究し，Web・3D・XRを中心に体験設計と実装を行っています．',
    'Unity，Antigravity，Blenderなどを用いて，プロトタイプから映像制作まで幅広く取り組んでいます．',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI / Human-Computer Interaction' },
    { title: '制作領域', description: 'Web, 3D, XR' },
    { title: '主なツール', description: 'Unity, Antigravity, Blender' },
    { title: '拠点', description: '明治大学（東京）' },
  ],
  toolSections: [
    {
      title: 'AI Nature Creation',
      categories: [
        {
          title: '',
          items: [
            { name: 'Gemini, Antigravity, Nanobanana' },
            { name: 'Claude, Claude Code' },
            { name: 'ChatGPT, Codex' },
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
            { name: 'Unity, Blender, Bambu Lab, Toio, M5Stack' },
          ],
        },
      ],
    },
  ],
};
