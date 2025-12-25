import { AboutData } from '@/app/types';

export const aboutData: AboutData = {
  bio: [
    '明治大学先端メディアサイエンス学科に在籍。研究はHCI、個人開発はUnityとWebアプリケーション。',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI（Human-Computer Interaction）' },
    { title: '得意技術', description: 'Web, Blender, Unity' },
    { title: '制作スタイル', description: 'Claude-Code、Gemini、ChatGPTを活用' },
    { title: 'いま注力', description: '情緒的でデジネな体験' },
  ],
  toolSections: [
    {
      title: 'Making in AI Nature',
      categories: [
        {
          title: 'AI-assisted Making',
          items: [
            { name: 'Claude / Claude Code', description: '実装、文章推敲' },
            { name: 'Gemini', description: '画像生成、ビジュアル試作' },
            { name: 'ChatGPT', description: 'リサーチ、思考整理' },
          ],
        },
      ],
    },
    {
      title: 'Core Making Stack',
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
            { name: '3D Printing', description: 'Bambu Lab' },
          ],
        },
      ],
    }
  ],
};
