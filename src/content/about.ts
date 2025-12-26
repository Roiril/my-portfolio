import { AboutData } from '@/types/content';

export const aboutData: AboutData = {
  bio: [
    '明治大学先端メディアサイエンス学科に在籍。研究はHCI、個人開発はUnityとWebアプリケーション。',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI' },
    { title: '得意技術', description: 'Web, Blender, Unity' },
    { title: '制作の友', description: 'Claude-Code、Gemini、ChatGPT' },
    { title: 'いま注目', description: '情緒的こだわりデジ' },
  ],
  toolSections: [
    {
      title: 'Making in AI Nature',
      categories: [
        {
          items: [
            { name: 'Claude / Claude Code', description: '実装、文章推敲' },
            { name: 'Gemini', description: '画像生成、ビジュアル試作' },
            { name: 'ChatGPT / Codex', description: 'リサーチ、思考整理、実装' },
          ],
        },
      ],
    },
    {
      title: 'Making With',
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
            { name: '3D Printing(Bambu Lab)' },
          ],
        },
      ],
    }
  ],
};
