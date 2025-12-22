import { AboutData } from '@/app/types';

export const aboutData: AboutData = {
  bio: [
    'はじめまして。明治大学の先端メディアサイエンス学科に所属しています。大学ではヒューマンコンピューターインタラクション(HCI)の研究をしつつ、個人開発でUnityやWebアプリケーションを作っています。',
    'このサイトはNext.jsとSupabaseで作ってVercelで公開しています。「面白いと思ったもの」をこれからはいっぱい作っていこうと思います。',
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
