import { Work } from '@/features/works/types';

import { coupleSync } from './couple-sync';
import { workDiagrams } from './works-diagrams';
import { workTech } from './works-tech';

const baseWorks: Work[] = [
  // ===== 研究 / Research =====
  {
    id: 'mawarimi',
    title: '廻リ視 — Mawarimi',
    description:
      '監視カメラに映る自分を見ながら、現実空間を歩く固定視点のホラー体験です。HMDと複数のカメラで固定視点を現実空間に再構成しました。体験者は怪異調査員として呪われた壁を調査します。IVRC2026で総合優勝し、DCEXPO賞を受賞しました。2026年11月にDCEXPO2026で展示予定です。',
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
      asOf: '2026 年 10 月 24 日時点。',
      items: [
        { value: '総合優勝', label: 'IVRC2026' },
        { value: 'DCEXPO賞', label: 'IVRC2026' },
        { value: '体験展示', label: '第31回日本VR学会大会' },
        { value: '2026.11', label: 'DCEXPO2026 で展示予定' },
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
      '手だけを身体とするエージェントと、VR空間で卓上のボードゲームを遊ぶ研究です。エージェントは話さず、駒の操作も相手への合図も同じ手で行います。人がその動きをどう読み、遊び相手としてどう受け止めるかを調べています。4名での予備調査を終えた、進行中の研究です。',
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
      '長期インターンで、社内で運用するAI業務ツールを要件定義から運用まで担当しています。商談の内容から見積書の下書きを作る機能と、社内マニュアルを検索して質問に答えるRAGチャットを実装しました。回答には根拠の箇所を添え、人が確かめてから使う運用にしています。',
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
    role: '単独（企画・設計・実装）',
    detail: {
      lead: coupleSync.lead,
      body: [coupleSync.introduction, ...coupleSync.play.body, ...coupleSync.engineering.map(item => item.body)],
      phone: true,
      gallery: [
        { src: '/images/works/couple-sync/00-room.png', alt: '新デザイン：猫のいる部屋から各機能を開く' },
        { src: '/images/works/couple-sync/01-calendar.png', alt: '新デザイン：ふたりのカレンダー' },
        { src: '/images/works/couple-sync/02-notes.png', alt: '新デザイン：ふたりのノート' },
        { src: '/images/works/couple-sync/03-gacha.png', alt: '新デザイン：ガチャで家具を集める' },
        { src: '/images/works/couple-sync/04-health.png', alt: '体調・食事の記録' },
        { src: '/images/works/couple-sync/05-memories.png', alt: '新デザイン：ふたりの記念日' },
        { src: '/images/works/couple-sync/06-games.png', alt: 'ふたり専用ミニゲーム' },
        { src: '/images/works/couple-sync/07-legacy.png', alt: '切り替えて使える旧デザイン' },
      ],
    },
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
    role: '単独（企画・設計・実装）',
    detail: {
      lead: '研究の「読む・考える・書く」を、一本の流れにまとめるアプリです。',
      body: [
        '研究では、思いつき・読んだ文献・書きかけの論文が別々の場所に散らばりがちです。そこで思いつきをカード（Ideas）として貯め、確からしさを書き添えて育てる画面を中心に置きました。研究テーマ・執筆中の論文・読んだ文献もここから行き来でき、発表スライドの生成まで同じアプリで扱えます。',
        '画面は常に端末内のデータから表示し、サーバー（Supabase）とは変わった分だけをやり取りします。通信が切れている間も書き続けられ、つながると別の端末に追いつきます。',
        'Claude Code と連携し、文献の取り込み・翻訳・整理を半自動で進められます。見た目は黒とクリームを基調にしたレトロな配色でそろえました。',
        '公開デモは実際の画面を使っています。研究資料と記録は架空の見本に置き換え、変更はこの端末内にだけ保存します。',
      ],
      phone: true,
      gallery: [
        { src: '/images/works/cogni-storage/02-ideas.png', alt: 'Ideas：思いつきをカードで育てる' },
        { src: '/images/works/cogni-storage/03-themes.png', alt: 'Themes：研究テーマの管理' },
        { src: '/images/works/cogni-storage/04-papers.png', alt: 'Papers：執筆中の論文' },
        { src: '/images/works/cogni-storage/05-readings.png', alt: 'Readings：文献の記録' },
        { src: '/images/works/cogni-storage/01-home.png', alt: 'ホーム画面' },
      ],
    },
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
    detail: {
      lead: 'Blenderで作ってきた小さな作品です。モデリング・ジオメトリノード・VFXをそれぞれ試しています。',
      sections: [
        {
          title: 'ロボット製造ゲームのキービジュアル',
          body: ['ロボットを製造するゲームのために制作したキービジュアルです。'],
          gallery: [
            { src: '/images/works/blender-works/robot-game-01.png', alt: 'ロボット製造ゲームのキービジュアル', wide: true },
          ],
        },
        {
          title: '地下鉄の通路',
          body: ['「8番出口」のような、どこか不穏で見覚えのある地下鉄の通路を作りました。'],
          gallery: [
            { src: '/images/works/blender-works/subway-01.png', alt: '地下鉄の通路の3Dモデル' },
            { src: '/images/works/blender-works/subway-02.png', alt: '地下鉄の通路の別アングル' },
          ],
        },
        {
          title: '好きなキャラクターのモデリング',
          body: ['好きなキャラクターをモデリングし、表情を何種類か作り分けました。'],
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
            'ジオメトリノードを使った実験です。恐竜と文字が切り替わるアニメーションや、動く壁にメモ帳が張り付く表現を作りました。',
          ],
          gallery: [
            { src: '/images/works/blender-works/geo-dino-01.png', alt: '恐竜と文字が切り替わるジオメトリノード' },
            { src: '/images/works/blender-works/geo-memo-01.png', alt: 'うごくメモ帳を貼り付けた壁' },
            { src: '/images/works/blender-works/geo-memo-02.png', alt: 'うごくメモ帳を貼り付けた壁（別アングル）' },
          ],
        },
        {
          title: 'VFX工作',
          body: ['Blenderでエフェクトの表現を試しました。'],
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
      '明治大学中野キャンパス3Fを歩幅で測り、Blenderで3D空間に再現しました。現地で撮った写真をテクスチャに使い、VRに持ち込んで議論の場にもしました。',
    image: '/images/Meiji3fVideoCapture.png',
    tags: ['3D', 'Blender', 'Digital Twin'],
    links: [
      { type: 'video', url: 'https://youtu.be/NfEQQwtwIPQ?si=VnYnw4MvY2MxgkEi' },
    ],
    detail: {
      lead: 'いつも通っている明治大学中野キャンパス3Fを、できるだけ実際の空間に忠実にデジタル化しました。',
      body: [
        '自分の足で歩き、歩幅を基準に各所の寸法を測りました。そのため空間全体の広さが現実とそろっています。',
        'テクスチャには現地で撮った写真を貼り、柱や什器など写真だけでは表せない部分はモデリングで補いました。遠くから見たときだけ成り立つ「張りぼて」ではなく、近くで見ても本物らしく感じられることを目指しています。',
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
            '作ったモデルは眺めるだけでなく、ほかの用途にも使っています。',
          ],
        },
        {
          title: '未来の姿をVRで議論する',
          body: [
            'デジタル化した空間をVRに持ち込み、この場所が将来どうあるべきかを議論する場にしました。実寸の空間に入り込めるので、図面や言葉だけでは伝わりにくい将来の姿を、その場にいる感覚で検討できます。',
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
            'シェーダーグラフを使い、空間の見え方そのものを変える表現も試しています。',
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
    detail: {
      lead: 'Processingで一から組んだデジタル水槽です。水槽も魚も、群れの動きもすべてコードで描いています。',
      body: [
        '1匹ずつの魚には「近くの仲間に寄る」「ぶつからない」「向きを揃える」という単純な決まりだけを与えています。それでも群れ全体は、生き物のように自然にまとまって泳ぎます。',
        '魚のかわいさと、アルゴリズムから生まれる生き物らしい動きの両立を目指しました。',
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
    role: '単独（企画・設計・実装）',
    period: '2025.11',
    links: [
      { type: 'launch', url: 'https://cube-diary.vercel.app/' },
      { type: 'video', url: 'https://youtube.com/shorts/UY0FlFT1WY8?si=Hm70ycGAHvYiZp20' },
    ],
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

// 技術説明（works-tech.ts）と構成図（works-diagrams.ts）を作品に合わせる
export const works: Work[] = baseWorks.map((work) =>
  workTech[work.id] ? { ...work, tech: { ...workTech[work.id], diagram: workDiagrams[work.id] } } : work,
);
