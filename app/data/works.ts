import { Work } from '@/app/types';

export const works: Work[] = [
  {
    id: 'retroTV-portfolio',
    title: 'Portfolio: Retro TV version',
    description: 'ブラウン管テレビをThree.jsで3Dモデリング。Next.jsで動く。チャンネルを変えるとノイズが走る。',
    image: '/images/retroTV-portfolio.png',
    tags: ['Next.js', 'Three.js'],
    links: [
      { type: 'launch', url: 'https://my-retro-portfolio-rust.vercel.app/' },
      { type: 'video', url: 'https://youtube.com/shorts/ZiNqQiZSbv4?si=H-t46FPwIpIVX0wS' },
    ],
    featured: true,
  },
  {
    id: 'cube-diary',
    title: 'Web App: CubeDiary',
    description: '記憶をキューブにして3D空間に配置する日記アプリ。Next.js + Three.js。書いた日記が立方体になって、美しく整列される。',
    image: '/images/CubeDiary.png',
    tags: ['Next.js', 'Three.js', 'Database'],
    links: [
      { type: 'launch', url: 'https://cube-diary.vercel.app/' },
      { type: 'video', url: 'https://youtube.com/shorts/UY0FlFT1WY8?si=Hm70ycGAHvYiZp20' },
    ],
  },
  {
    id: 'uniqlo-future',
    title: 'UNIQLO "Future Service"',
    description: '2023年に作った映像作品。架空のUNIQLOサービスを近未来的に。Blenderでモデリング、VFX合成、AIで作曲。',
    image: '/images/UniqloCap.png',
    tags: ['Blender', 'VFX', 'Video'],
    links: [{ type: 'video', url: 'https://youtu.be/-q5xsLlaN8M?si=NFpSSjy8pEHkGonn' }],
  },
  {
    id: 'aquarium',
    title: 'Aquarium inProcessing',
    description: 'Processingで魚の群れをコーディング。自律的に泳ぎ回る。群衆アルゴリズムの視覚化。',
    image: '/images/AcuariumPrograming.png',
    tags: ['Processing', 'Generative Art'],
    links: [{ type: 'video', url: 'https://youtu.be/J4vsNST7PLU?si=BqNEA6MSnnqmbqEN' }],
  },
  {
    id: 'meiji-3d',
    title: 'Digital Twin: Meiji Univ.',
    description: '明治大学中野キャンパス3階をBlenderで再現。歩幅で測ってモデリング、写真を撮って張り付け、机や黒板は細かく作り込んだ。Unityで動いたときは本当に感動した。',
    image: '/images/Meiji3fVideoCapture.png',
    tags: ['Blender', '3D Modeling'],
    links: [{ type: 'video', url: 'https://youtu.be/NfEQQwtwIPQ?si=VnYnw4MvY2MxgkEi' }],
  },
  {
    id: 'ai-composition',
    title: 'AI-Augmented Composition',
    description: 'AI作曲が主流になる前に作成した曲を、Suno AIで再構成。技術の進歩を感じた。',
    image: '/images/StudioOneCap.png',
    tags: ['StudioOne', 'Suno AI'],
    links: [
      { type: 'video', url: 'https://youtube.com/shorts/EPZ6CyN0CKQ?si=bLckXFs04Tpznf-P', label: 'Original' },
      { type: 'video', url: 'https://youtube.com/shorts/61PpnNePhsk?si=EbQLesmbgxvFs2jA', label: 'AI Ver.' },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: '普通のサイト',
    image: '/images/MyPortfolio.png',
    tags: ['Next.js', 'React'],
    links: [],
    isCurrent: true,
  },
];
