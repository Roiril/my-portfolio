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
      '90年代サバイバルホラーの固定カメラ視点を，HMDと実空間の複数カメラで再構成したホラー体験．固定カメラ越しに映る自分を見ながら日本人形との鬼ごっこを進め，終盤には立場が入れ替わって「録画された過去の自分」を人形の側から追う．固定視点ゆえ映像の一部を差し替えられる性質を使い，操作と身体感覚のズレから不気味さを生む．学生VRコンテスト IVRC 2026 の書類審査・ビデオ審査を通過し，第31回日本VR学会大会（2026年9月・富山県立大学）で体験展示を行う．',
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
    period: '2025.11 –（長期インターン）',
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

  // ===== 制作 / Creative（魅力的な順） =====
  {
    id: 'blender-works',
    title: 'Blender Works',
    description:
      'Blenderで制作したモデリング・3Dの小作品集．',
    image: '/images/works/blender-works/robot-game-01.png',
    tags: ['3D', 'Blender'],
    links: [],
    detail: {
      lead: 'Blenderで手を動かしながら作ってきた，モデリングからジオメトリノード，VFXまでの小さな実験たち．',
      sections: [
        {
          title: 'ロボット製造ゲームのキービジュアル',
          body: ['ロボットを製造するゲームのために制作したキービジュアル．'],
          gallery: [
            { src: '/images/works/blender-works/robot-game-01.png', alt: 'ロボット製造ゲームのキービジュアル', wide: true },
          ],
        },
        {
          title: '地下鉄の通路',
          body: ['「8番出口」のような，どこか不穏で見覚えのある地下鉄通路の空間．'],
          gallery: [
            { src: '/images/works/blender-works/subway-01.png', alt: '地下鉄の通路の3Dモデル' },
            { src: '/images/works/blender-works/subway-02.png', alt: '地下鉄の通路の別アングル' },
          ],
        },
        {
          title: '好きなキャラクターのモデリング',
          body: ['好きなキャラクターを，表情差分をつけながらモデリング．'],
          columns: 4,
          gallery: [
            { src: '/images/works/blender-works/character-01.jpg', alt: 'キャラクターモデル（通常）' },
            { src: '/images/works/blender-works/character-02.jpg', alt: 'キャラクターモデル（アイコン）' },
            { src: '/images/works/blender-works/character-03.jpg', alt: 'キャラクターモデル（あっかんべー）' },
            { src: '/images/works/blender-works/character-04.jpg', alt: 'キャラクターモデル（じと目）' },
            { src: '/images/works/blender-works/character-05.jpg', alt: 'キャラクターモデル（目とじ）' },
          ],
        },
        {
          title: 'ジオメトリノード工作',
          body: [
            '恐竜と文字が切り替わるアニメーションや，動く壁にメモ帳を張り付ける表現など，ジオメトリノードを使った実験．',
          ],
          gallery: [
            { src: '/images/works/blender-works/geo-dino-01.png', alt: '恐竜と文字が切り替わるジオメトリノード' },
            { src: '/images/works/blender-works/geo-memo-01.png', alt: 'うごくメモ帳を貼り付けた壁' },
            { src: '/images/works/blender-works/geo-memo-02.png', alt: 'うごくメモ帳を貼り付けた壁（別アングル）' },
          ],
        },
        {
          title: 'VFX工作',
          body: ['Blender上でのエフェクト表現の実験．'],
          gallery: [
            { src: '/images/works/blender-works/vfx-01.png', alt: 'VFXの実験' },
            { src: '/images/works/blender-works/vfx-02.png', alt: 'VFXの実験（別カット）' },
          ],
        },
      ],
    },
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
    detail: {
      lead: 'いつも通っている明治大学中野キャンパス3Fを，できるだけ実空間に忠実にデジタル化したプロジェクト．',
      body: [
        '実際に自分の足で歩き，歩幅を基準に各所の寸法を測りながら測量することで，空間全体のスケール感を現実に合わせて再現しました．',
        'テクスチャは現地で撮影した写真をそのまま貼り込み，柱や什器など写真だけでは表現しきれない部分はモデリングで補うことで，遠目には成立しても近づくと粗が出る“張りぼて”ではなく，近くで見てもリアルに感じられる質感を目指しました．',
      ],
      gallery: [
        { src: '/images/works/meiji-3d/meiji-3d-01.png', alt: '明治大学中野キャンパス3Fの3Dモデル', wide: true },
        { src: '/images/works/meiji-3d/meiji-3d-02.png', alt: '3Dモデル化した3Fの空間' },
        { src: '/images/works/meiji-3d/meiji-3d-03.png', alt: '写真テクスチャを貼り込んだ内観' },
        { src: '/images/works/meiji-3d/meiji-3d-04.png', alt: 'モデリングで再現した什器まわり' },
        { src: '/images/works/meiji-3d/meiji-3d-05.png', alt: '3Fフロアのデジタルツイン' },
      ],
      sections: [
        {
          title: 'モデルの活用',
          body: [
            '作ったモデルは，ただ眺めるためのものではなく，いろいろな形で活用しています．',
          ],
        },
        {
          title: '未来の姿をVRで議論する',
          body: [
            'デジタル化した空間をVRに持ち込み，この世界が将来どうあるべきかを議論するための場として活用しました．実寸で再現された空間に入り込むことで，図面や言葉だけでは伝わりにくい未来の姿を，みんなで体感しながら検討できます．',
          ],
          columns: 2,
          gallery: [
            { src: '/images/works/meiji-3d/use-vr-01.png', alt: 'VR空間で3Fモデルを使った議論' },
            { src: '/images/works/meiji-3d/use-vr-02.png', alt: 'VRで未来の空間を検討する様子' },
            { src: '/images/works/meiji-3d/use-vr-03.png', alt: 'VR空間内から見たフロア' },
            { src: '/images/works/meiji-3d/use-vr-04.png', alt: 'VRでの空間体験' },
          ],
        },
        {
          title: 'シェーダーグラフで遊ぶ',
          body: [
            'シェーダーグラフを使って，空間の見え方そのものを変えて遊んだりもしています．',
          ],
          columns: 2,
          gallery: [
            { src: '/images/works/meiji-3d/use-shader-01.png', alt: 'シェーダーグラフで表現を変えた3F', wide: true },
          ],
          links: [
            { type: 'video', url: 'https://youtu.be/fjkS9zoACuA?si=Uvo_cloQzPg-bHW5' },
          ],
        },
      ],
    },
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
    detail: {
      lead: 'プログラムされた環境，プログラムされた魚，プログラムされた動き．Processingで一から組み上げたデジタル水槽．',
      body: [
        '水槽そのものも，泳ぎ回る魚も，群れとして揺らぐその動きも，すべてコードで記述しています．',
        '個々の魚に「近くの仲間に寄る・ぶつからない・向きを揃える」といった単純なルールを与えるだけで，群れ全体としては生き物のように自然なまとまりが生まれます．かわいさと，アルゴリズムが生む有機的な動きの両立を目指しました．',
      ],
      gallery: [
        { src: '/images/works/aquarium/aquarium-01.png', alt: 'Processingで描いたデジタル水槽' },
        { src: '/images/works/aquarium/aquarium-02.png', alt: '群れて泳ぐデジ魚たち' },
        { src: '/images/works/aquarium/aquarium-03.png', alt: 'プログラムされた魚の動き' },
        { src: '/images/works/aquarium/aquarium-04.png', alt: 'デジタル水槽の様子' },
      ],
    },
  },
  {
    id: 'ai-anime',
    title: 'AI Generated Anime',
    description:
      'AIを組み合わせて制作したアニメーション作品集．',
    image: '/images/placeholder.png',
    tags: ['AI', 'Animation'],
    links: [],
    hidden: true,
  },
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
    id: 'metaquest-devs',
    title: 'MetaQuest Devs',
    description: '卒論のためにQuestで試行錯誤した様々なプロトタイプ',
    image: '/images/Mr-Devs.png',
    tags: ['MetaQuest', 'Unity'],
    links: [],
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
