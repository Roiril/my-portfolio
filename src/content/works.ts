import { Work } from '@/features/works/types';

import { coupleSync } from './couple-sync';
import { workTech } from './works-tech';

const baseWorks: Work[] = [
  // ===== 研究 / Research =====
  {
    id: 'mawarimi',
    title: '廻リ視 — Mawarimi',
    description:
      '監視カメラに映る自分を見ながら、現実空間を歩く固定視点のホラー体験です。HMDと複数のカメラで固定視点を現実空間に再構成しました。体験者は怪異調査員として呪われた壁を調査します。IVRC2026で総合優勝し、DCEXPO賞を受賞しました。2026年11月18〜20日のDCEXPO2026で招待展示予定です。私は企画・監督、体験設計、要件定義、動作検証を担当しています。実装にはAIエージェントを活用し、設計の把握とテストを通して品質を確かめています。',
    image: '/images/works/mawarimi/key-visual.webp',
    tags: ['Research', 'XR', 'Substitutional Reality'],
    links: [
      { type: 'launch', url: 'https://mawarimi.vercel.app/', label: '公式サイト' },
      { type: 'paper', url: 'https://www.conference.vrsj.org/ac2026/program/doc/IVRC-15.pdf', label: 'Publication（日本VR学会）' },
    ],
    media: [
      { type: 'youtube', src: 'uWf51qRwbhA', title: '廻リ視(MAWARIMI) トレイラー', caption: '最新のトレイラー', size: 'large' },
      { type: 'youtube', src: 'ipoU4gU9G4k', title: '廻り視トレイラー (IVRC2026 ver)', caption: 'IVRC2026 のときのトレイラー', size: 'small' },
    ],
    reception: {
      title: '受賞と展示',
      asOf: '2026 年 11 月 7 日時点。',
      items: [
        { value: '総合優勝', label: 'IVRC2026' },
        { value: 'DCEXPO賞', label: 'IVRC2026' },
        { value: '体験展示', label: '第31回日本VR学会大会' },
        { value: '2026.11.18–20', label: 'DCEXPO2026 で招待展示予定' },
        { value: '2026.11.19', label: 'Inter BEE で登壇予定' },
      ],
    },
    category: 'research',
    period: '2026（M1）',
    role: 'チーム制作（企画・監督・ソフトウェア開発を担当）',
    credits: [
      '企画/監督　白石',
      '企画書/動画制作　白石',
      'シナリオ/演出　白石',
      'サウンドデザイン　白石',
      'タイトル/ロゴデザイン　白石',
      'ソフトウェア開発　白石',
      'ラジコン日本人形制作　五島',
      '壁床制作　チーム',
      'テスト/フィードバック　チーム',
      '設営/展示　チーム',
    ],
    featured: true,
    isCurrent: true,
  },
  {
    id: 'robot-collab',
    title: 'Play with a Hand — 手だけのエージェントと遊ぶ',
    description:
      '手だけを身体とするエージェントと人が、VR空間で卓上のボードゲームを遊ぶ際のやり取りを研究しています。エージェントは発話せず、駒の操作と相手への合図を同じ手で行います。人がその動きをどう解釈し、遊び相手としてどう受け止めるかを調べ、その結果を踏まえてインタラクション設計の要件を定義することを目指しています。現在は4名での予備調査を終えた段階です。今後はロボットハンドを用いた実世界での実証も予定しています。',
    image: '/images/robot-collab.png',
    tags: ['Research', 'HCI', 'Human-Agent Interaction', 'VR'],
    links: [],
    category: 'research',
    period: '2026 –（修士研究）',
    role: '単独',
    featured: true,
    isCurrent: true,
    // 論文が未公開なので、詳細ページは作らない
  },
  {
    id: 'intentlayer',
    title: 'IntentLayer',
    description:
      '対面で「いま話しかけてよいか」を判断しやすくするMRシステムです。人の意図を複合現実空間に配置します。卒業研究としてHMD版とWeb版を実装しました。1週間運用し、半構造化インタビューで評価しました。',
    image: '/images/intentlayer.png',
    tags: ['Research', 'Mixed Reality', 'Unity', 'Next.js'],
    links: [
      { type: 'paper', url: '/soturon.pdf', label: '卒業論文' },
    ],
    category: 'research',
    period: '2025（卒業研究）',
    role: '単独（着想・実装・実験・分析・執筆）',
  },

  // ===== インターン / Internship =====
  {
    id: 'ai-business-tools',
    title: 'AI業務ツール — 見積書の下書きと社内検索チャット',
    description:
      '長期インターンでは、営業担当へのヒアリングをもとに必要な機能を要件定義し、AIを活用して業務ツールを実装しています。品質を確かめるために実装の設計を把握し、テストと動作検証を行っています。制作したのは、商談内容から見積書の下書きを作る機能と、社内マニュアルを検索して回答するRAGチャットです。回答には根拠の箇所を添え、人が確認してから使う運用にしています。',
    image: '/images/works/ai-business-tools/illust-bcd1d002.webp',
    tags: ['Internship', 'LLM', 'RAG'],
    links: [],
    category: 'internship',
    period: '2025.11 –（長期インターン）',
    role: '要件定義〜実装〜運用',
  },

  // ===== 個人開発 / Personal =====
  {
    id: 'whiteout',
    title: 'WhiteOut — 塗りローグ',
    description:
      '白いインクで9つの面を塗りつぶすローグライトゲームです。能力を組み合わせて速いクリアを目指します。unity1weekのお題「しろ」に向けて制作し、楽しさの評価4.434/5で評価の高い作品に選出されました。公開時のPVはXで6万回以上表示され、unityroomのページは1.5万回閲覧されています（2026年10月時点）。',
    image: '/images/works/whiteout/title.webp',
    imageFit: 'cover',
    tags: ['Game', 'Unity', 'unity1week', 'ローグライト'],
    links: [
      { type: 'launch', url: 'https://unityroom.com/games/whiteout-rogue', label: 'unityroomで遊ぶ' },
    ],
    media: [
      {
        type: 'x', src: 'https://x.com/Roil_HCI/status/2084600134781096411', title: '公開時の PV', caption: '2026 年 8 月 4 日　unityroom での公開に合わせた PV',
        stats: [{ label: '表示', value: '61,774' }, { label: 'いいね', value: '868' }, { label: 'リポスト', value: '108' }, { label: 'ブックマーク', value: '341' }],
      },
      {
        type: 'x', src: 'https://x.com/Roil_HCI/status/2086271168156467599', title: 'アップデートの紹介', caption: '2026 年 8 月 9 日　無限撃ち・実績・スマホ対応を加えた版',
        stats: [{ label: '表示', value: '41,966' }, { label: 'いいね', value: '309' }, { label: 'リポスト', value: '33' }, { label: 'ブックマーク', value: '145' }],
      },
    ],
    // 数字は 2026-10-24 に取得。X は投稿の公開データ、unityroom はゲームのページの表示
    reception: {
      asOf: '2026 年 10 月 24 日時点。X は公開時の PV の投稿、unityroom はゲームのページの数字です。',
      items: [
        { value: '61,774', unit: '回', label: 'X で PV が表示された回数' },
        { value: '868', label: 'PV へのいいね' },
        { value: '15,047', unit: '回', label: 'unityroom での閲覧' },
        { value: '189', unit: '件', label: 'unityroom での評価' },
        { value: '4.434', unit: '/ 5', label: 'unity1week の楽しさの評価' },
      ],
    },
    category: 'personal',
    period: '2026.08',
    role: '個人制作。実装には AI エージェントを活用。',
  },
  {
    id: 'couple-sync',
    title: 'couple-sync',
    description:
      coupleSync.description,
    image: '/images/couple-sync-v2.png',
    imageFit: 'cover',
    tags: ['Web App', 'React', 'TypeScript', 'Supabase', 'PWA'],
    links: [
      { type: 'launch', url: '/demos/couple-sync/index.html', label: 'アプリのデモを見る' },
    ],
    category: 'personal',
    period: '2026.03 –',
    role: '個人制作。企画・設計・検証を担当。実装には AI エージェントを活用。',
  },
  {
    id: 'cogni-storage',
    title: 'cogni-storage',
    description:
      '研究のアイデア・テーマ・論文・文献をひとつにまとめて管理する、自分用の研究ログアプリ（PWA）です。オフラインでも使え、Supabaseで端末間を同期します。Claude Codeと連携し、文献の取り込みや整理を半自動で進められます。',
    image: '/images/cogni-storage.png',
    imageFit: 'cover',
    tags: ['Web App', 'React', 'TypeScript', 'Supabase', 'PWA'],
    links: [
      { type: 'launch', url: '/demos/cogni-storage/index.html', label: 'アプリのデモを見る' },
    ],
    category: 'personal',
    period: '2026.03 –',
    role: '個人制作。企画・設計・検証を担当。実装には AI エージェントを活用。',
  },

  // ===== 制作 / Creative（魅力的な順） =====
  {
    id: 'blender-works',
    title: 'Blender Works',
    description:
      'Blenderで作った小作品集です。キャラクターのモデリング・ジオメトリノード・VFXを試しています。',
    image: '/images/works/blender-works/robot-game-01.png',
    tags: ['3D', 'Blender'],
    links: [],
  },
  {
    id: 'meiji-3d',
    title: 'Meiji Univ 3F',
    description:
      '明治大学中野キャンパス3Fを歩幅で測り、Blenderで3D空間に再現しました。現地で撮った写真をテクスチャに使い、VRに持ち込んで議論の場にもしました。',
    image: '/images/Meiji3fVideoCapture.png',
    tags: ['3D', 'Blender', 'Digital Twin'],
    links: [
      { type: 'video', url: 'https://youtu.be/NfEQQwtwIPQ?si=VnYnw4MvY2MxgkEi' },
    ],
  },
  {
    id: 'uniqlo-future',
    title: 'UNIQLO: Imaginary Service',
    description:
      'UNIQLOの架空サービス「服自販機」を紹介する動画です。BlenderとVFXで制作しました。',
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
      'Processingで作ったデジタル水槽です。コードで描いた魚が、3つの単純な決まりだけで群れになって泳ぎます。',
    image: '/images/AcuariumPrograming.png',
    tags: ['Creative Coding', 'Processing'],
    links: [
      { type: 'video', url: 'https://youtu.be/J4vsNST7PLU?si=BqNEA6MSnnqmbqEN' },
    ],
  },
  {
    id: 'ai-anime',
    title: 'AI Generated Anime',
    description:
      'AIを組み合わせて制作したアニメーション作品集です。',
    image: '/images/placeholder.png',
    tags: ['AI', 'Animation'],
    links: [],
    hidden: true,
  },
  {
    id: 'ai-music-video',
    title: 'AI Generated Music Video',
    description: '工程ごとにAIツールを使い分けて作ったミュージックビデオです。曲はSuno AIで作り、編集はFilmoraで仕上げました。',
    image: '/images/Ai-Generated-Mv.png',
    tags: ['SunoAI', 'ChatGPT', 'Gemini', 'Flow', 'Filmora'],
    role: '個人制作',
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
    id: 'retroTV-portfolio',
    title: 'Portfolio: Retro TV version',
    description:
      'ブラウン管テレビの画面にポートフォリオを映すWeb作品です。Canvasに描いた画面をthree.jsの湾曲した画面に貼り、つまみでチャンネルを変えられます。',
    image: '/images/retroTV-portfolio.png',
    tags: ['Web', 'Next.js', 'Three.js'],
    period: '2025.12',
    role: '個人制作',
    links: [
      { type: 'launch', url: 'https://my-retro-portfolio-rust.vercel.app/' },
      { type: 'video', url: 'https://youtube.com/shorts/ZiNqQiZSbv4?si=H-t46FPwIpIVX0wS' },
    ],
  },
  {
    id: 'cube-diary',
    title: 'CubeDiary',
    description:
      '写真を6面に貼ったキューブを、暗い空間に並べていく日記アプリです。Next.jsとReact Three Fiberで作り、写真はSupabaseに保存します。',
    image: '/images/CubeDiary.png',
    tags: ['Web App', 'Next.js', 'Supabase'],
    category: 'personal',
    role: '個人制作',
    period: '2025.11',
    links: [
      { type: 'launch', url: 'https://cube-diary.vercel.app/' },
      { type: 'video', url: 'https://youtube.com/shorts/UY0FlFT1WY8?si=Hm70ycGAHvYiZp20' },
    ],
  },
  {
    id: 'last-page',
    title: '最後のページ',
    description:
      '机の上の古い日記帳を舞台にした、約7分の短いゲームです。1960年から2045年まで、ひなみという女性の一生の日記を読みます。動かすのは、五歳のひなみがクレヨンで描いた自画像です。日記の横書きの行が足場に、縦書きの列が登れる柱になります。人がひなみに言ったひとことや頁の絵を拾って持っていき、右下の角から次の頁へめくります。',
    image: '/images/works/last-page/key-visual.webp',
    imageFit: 'cover',
    tags: ['Game', 'Unity'],
    links: [],
    period: '2026.11 –',
    role: '個人制作。実装には AI エージェントを活用。',
    isCurrent: true,
  },
  {
    id: 'metaquest-devs',
    title: 'MetaQuest Devs',
    description: '卒業研究のためにMeta QuestとUnityで作った試作集です。通路で人とすれ違う場面など、現実の空間に情報を重ねる表現を試しました。',
    image: '/images/Mr-Devs.png',
    tags: ['MetaQuest', 'Unity'],
    links: [],
  },
  {
    id: 'ai-composition',
    title: 'AI-Augmented Composition',
    description:
      'Studio Oneで以前作った自分の曲を、Suno AIで広げた作品です。元の曲とAI版を聞き比べられます。',
    image: '/images/works/ai-composition/illust-f9e5771d.webp',
    tags: ['Sound', 'Studio One', 'AI'],
    role: '個人制作',
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
    description: '現在のポートフォリオサイトです。Next.jsで制作しています。',
    image: '/images/MyPortfolio.png',
    tags: ['Web', 'Next.js', 'Antigravity'],
    links: [],
    isCurrent: true,
  },
];

// 技術説明（works-tech.ts）を作品に合わせる
export const works: Work[] = baseWorks.map((work) =>
  workTech[work.id] ? { ...work, tech: workTech[work.id] } : work,
);
