import { AboutData } from '@/types/content';

export const aboutData: AboutData = {
  bio: [
    '明治大学総合数理学部FMSでHCIを研究し、Web・3D・XRを中心に体験設計と実装を行っています。',
    'Unity、Next.js、Blenderなどを用いて、プロトタイプから映像制作まで幅広く取り組んでいます。',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI / Human-Computer Interaction' },
    { title: '制作領域', description: 'Web, 3D, XR' },
    { title: '主なツール', description: 'Next.js, Unity, Blender' },
    { title: '拠点', description: '明治大学（東京）' },
  ],
  toolSections: [
    {
      title: 'AI Nature Creation',
      categories: [
        {
          items: [
            { name: 'ChatGPT / Codex', description: '実装、アイデア出し、リサーチ' },
            { name: 'Claude / Claude Code', description: '実装' },
            { name: 'Gemini', description: '画像編集、加工' },
          ],
          title: '',
        },
      ],
    },
    {
      title: 'Create With',
      categories: [
        {
          title: 'Languages',
          items: [
            { name: 'C#' },
            { name: 'JavaScript / TypeScript' },
            { name: 'Python' },
          ],
        },
        {
          title: 'Frameworks & Libraries',
          items: [
            { name: 'Next.js' },
            { name: 'React' },
            { name: 'three.js' },
          ],
        },
        {
          title: 'Tools',
          items: [
            { name: 'VS Code' },
            { name: 'Cursor' },
            { name: 'Unity' },
            { name: 'Blender' },
            { name: 'Processing' },
          ],
        },
        {
          title: 'Hardware / Fabrication',
          items: [
            { name: 'toio' },
            { name: '3D Printing (Bambu Lab)' },
          ],
        },
      ],
    },
  ],
};
