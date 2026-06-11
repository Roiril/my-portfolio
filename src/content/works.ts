import { Work } from '@/features/works/types';

export const works: Work[] = [
  // ===== 研究 / Research（新しい順） =====
  {
    id: 'robot-collab',
    title: '人と機械の協働インタラクション設計',
    description:
      '人と機械が同じ場で一緒に作業するときの，見た目・動き・関わり方をどう設計するかを探る研究．プロトタイプを作って人に試してもらいながら，協力が自然に生まれる条件を探っている（進行中）．',
    image: '/images/robot-collab.png',
    tags: ['Research', 'HCI', 'Human-Agent Interaction'],
    links: [],
    category: 'research',
    period: '2026 –（修士研究）',
    role: '単独',
    featured: true,
    isCurrent: true,
  },
  {
    id: 'mawarimi',
    title: '廻リ視 — Mawarimi',
    description:
      '固定カメラ視点とHMDで「自分の身体だと感じる感覚」を揺さぶる実空間ホラー体験．学生VRコンテスト IVRC 2026 の書類審査を通過し，チームで制作を進行中．',
    image: '/images/mawarimi.png',
    tags: ['Research', 'XR', 'Substitutional Reality'],
    links: [
      { type: 'paper', url: '/mawarimi.pdf', label: '企画書' },
    ],
    category: 'research',
    period: '2026（M1）',
    role: '企画・システム設計（チーム）',
    featured: true,
    isCurrent: true,
  },
  {
    id: 'intentlayer',
    title: 'IntentLayer',
    description:
      '対面で「いま話しかけてよいか」の判断を，人の意図を複合現実空間に配置して支援するMRシステム．卒業研究．HMD版とWeb版を実装し，1週間の運用と半構造化インタビューで評価した．',
    image: '/images/intentlayer.png',
    tags: ['Research', 'Mixed Reality', 'Unity', 'Next.js'],
    links: [
      { type: 'paper', url: '/soturon.pdf', label: '卒業論文' },
    ],
    category: 'research',
    period: '2025（卒業研究）',
    role: '単独（着想・実装・実験・分析・執筆）',
    featured: true,
  },

  // ===== インターン / Internship =====
  {
    id: 'ai-business-tools',
    title: 'AI業務ツール開発',
    description:
      '社内で実際に運用されるAI業務ツールを，要件定義から運用まで担当．商談内容から見積書の下書きを生成する機能や，社内マニュアルに自然言語で答えるチャットをRAG構成で開発し，回答の根拠を人が確認できる運用も整えた．',
    image: '/images/ai-business-tools.svg',
    imageFit: 'contain',
    tags: ['Internship', 'LLM', 'RAG'],
    links: [],
    category: 'internship',
    period: '長期インターン',
    role: '要件定義〜実装〜運用',
    featured: true,
  },

  // ===== 個人開発 / Personal =====
  {
    id: 'couple-sync',
    title: 'couple-sync',
    description:
      'パートナーと予定・記念日・体調などを共有するアプリ．オフライン動作と端末間のリアルタイム同期を両立し，ローカルLLMも連携している．',
    image: '/images/couple-sync.png',
    imageFit: 'contain',
    tags: ['Web App', 'React', 'Supabase', 'PWA'],
    links: [
      { type: 'launch', url: '/demos/couple-sync/index.html', label: 'UIデモ' },
    ],
    category: 'personal',
    period: '個人開発',
  },
  {
    id: 'cogni-storage',
    title: 'cogni-storage',
    description:
      '研究の読書・調査・執筆・スライド生成を一つの流れで管理する自作ツール．AIエージェント向けの自動化基盤を組み込んでいる．',
    image: '/images/cogni-storage.png',
    imageFit: 'contain',
    tags: ['Web App', 'React', 'Supabase'],
    links: [
      { type: 'launch', url: '/demos/cogni-storage/index.html', label: 'UIデモ' },
    ],
    category: 'personal',
    period: '個人開発',
  },

  // ===== 制作 / Creative =====
  {
    id: 'ai-music-video',
    title: 'AI Generated MusicVideo',
    description: '試行錯誤しながらAIを組み合わせてミュージックビデオ制作中',
    image: '/images/Ai-Generated-Mv.png',
    tags: ['SunoAI', 'ChatGPT', 'Gemini', 'Flow', 'Filmora'],
    links: [
      {
        type: 'video',
        url: 'https://youtu.be/Jgeij_JIZlQ?si=dTJwyRpyCQlMxWNb',
        label: 'Video1',
      },
      {
        type: 'video',
        url: 'https://youtube.com/shorts/x7claprYtdw?si=dYpL2hF9nm6KEMj5',
        label: 'Video2',
      },
    ],
  },
  {
    id: 'metaquest-devs',
    title: 'MetaQuest Devs',
    description: '卒論のためにQuestで試行錯誤した様々なプロトタイプ',
    image: '/images/Mr-Devs.png',
    tags: ['MetaQuest', 'Unity'],
    links: [],
  },
  {
    id: 'retroTV-portfolio',
    title: 'Portfolio: Retro TV version',
    description:
      'レトロなテレビにポートフォリオを映し出す．',
    image: '/images/retroTV-portfolio.png',
    tags: ['Web', 'Next.js', 'Three.js'],
    links: [
      { type: 'launch', url: 'https://my-retro-portfolio-rust.vercel.app/' },
      { type: 'video', url: 'https://youtube.com/shorts/ZiNqQiZSbv4?si=H-t46FPwIpIVX0wS' },
    ],
  },
  {
    id: 'cube-diary',
    title: 'CubeDiary',
    description:
      '真っ暗な世界に記憶をキューブで保存するアプリ．',
    image: '/images/CubeDiary.png',
    tags: ['Web App', 'Next.js', 'Supabase'],
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
    tags: ['Video', 'Blender', 'VFX'],
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
    tags: ['Creative Coding', 'Processing'],
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
    tags: ['3D', 'Blender', 'Digital Twin'],
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
    tags: ['Sound', 'Studio One', 'AI'],
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
    tags: ['Web', 'Next.js', 'Antigravity'],
    links: [],
    isCurrent: true,
  },
];
