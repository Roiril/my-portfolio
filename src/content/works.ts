import { Work } from '@/types/content';

export const works: Work[] = [
  {
    id: 'retroTV-portfolio',
    title: 'Portfolio: Retro TV version',
    description:
      'レトロなテレビにポートフォリオを映し出す．',
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
    title: 'CubeDiary',
    description:
      '真っ暗な世界に記憶をキューブで保存するアプリ．',
    image: '/images/CubeDiary.png',
    tags: ['Next.js', 'Three.js', 'Supabase'],
    links: [
      { type: 'launch', url: 'https://cube-diary.vercel.app/' },
      { type: 'video', url: 'https://youtube.com/shorts/UY0FlFT1WY8?si=Hm70ycGAHvYiZp20' },
    ],
  },
  {
    id: 'uniqlo-future',
    title: 'UNIQLO: Imaginary Service',
    description:
      'UNIQLOの架空のサービス「服自販機」を紹介する動画．',
    image: '/images/UniqloCap.png',
    tags: ['Blender', 'VFX', 'Video'],
    links: [
      { type: 'video', url: 'https://youtu.be/-q5xsLlaN8M?si=NFpSSjy8pEHkGonn' },
    ],
  },
  {
    id: 'aquarium',
    title: 'Aquarium in Processing',
    description:
      'かわいいデジ水槽の中を群れて泳ぐデジ魚たち．',
    image: '/images/AcuariumPrograming.png',
    tags: ['Processing', 'Generative Art'],
    links: [
      { type: 'video', url: 'https://youtu.be/J4vsNST7PLU?si=BqNEA6MSnnqmbqEN' },
    ],
  },
  {
    id: 'meiji-3d',
    title: 'Meiji Univ 3F',
    description:
      'いつも通っている明治大学中野キャンパス3Fのデジタル化．',
    image: '/images/Meiji3fVideoCapture.png',
    tags: ['Blender', '3D Modeling'],
    links: [
      { type: 'video', url: 'https://youtu.be/NfEQQwtwIPQ?si=VnYnw4MvY2MxgkEi' },
    ],
  },
  {
    id: 'ai-composition',
    title: 'AI-Augmented Composition',
    description:
      'Studio Oneで昔作った曲を，Suno AIで拡張．',
    image: '/images/StudioOneCap.png',
    tags: ['StudioOne', 'Suno AI'],
    links: [
      {
        type: 'video',
        url: 'https://youtube.com/shorts/EPZ6CyN0CKQ?si=bLckXFs04Tpznf-P',
        label: 'Original',
      },
      {
        type: 'video',
        url: 'https://youtube.com/shorts/61PpnNePhsk?si=EbQLesmbgxvFs2jA',
        label: 'AI Ver.',
      },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'このポートフォリオサイト．',
    image: '/images/MyPortfolio.png',
    tags: ['Next.js', 'React'],
    links: [],
    isCurrent: true,
  },
];
