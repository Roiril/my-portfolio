import { AboutData } from '@/features/about/types';

export const aboutData: AboutData = {
  profileImage: {
    src: '/images/MyFace.png',
    alt: 'プロフィール写真',
  },
  bio: [
    '明治大学大学院でHCI（人とコンピュータの関わりの設計）を研究しています．複合現実やロボットとの協働を題材に，企画から実装，ユーザ評価までを一人で回します．',
    '長期インターンでは，実運用されるAI業務ツール（RAG）を開発．技術（実装）と人間理解（リサーチ）の両方を強みに，研究と開発を往復しています．',
  ],
  keyFacts: [
    { title: '研究領域', description: 'HCI / Human-Agent Interaction' },
    { title: '制作領域', description: 'XR / AI / Web' },
    { title: '主なツール', description: 'TypeScript・React・Unity・Claude Code' },
    { title: '拠点', description: '明治大学（東京）' },
  ],
  axes: [
    {
      tag: 'A',
      title: '何を扱うか — 見えない状態を翻訳する',
      body: '単なる状態ではなく「どう関わってほしいか＝意図」そのものを扱い，相手が読み取れる形に変換する．例：「忙しい」ではなく「今は話しかけないでほしい」．',
    },
    {
      tag: 'B',
      title: 'どう見せるか — 伝えすぎない設計',
      body: '常に通知せず，相手が必要なときだけ確認できる形に．押し付けを避け，最終判断は本人に残す．',
    },
    {
      tag: 'C',
      title: 'どう作るか — 体験から設計要件を抽出する',
      body: '動くプロトタイプを人に使ってもらい，インタビューや感想から設計要件を抽出して作り直す（Research through Design）．',
    },
  ],
  toolSections: [
    {
      title: '主力',
      categories: [
        {
          title: '',
          items: [{ name: 'TypeScript, JavaScript, React, Supabase, Git, Claude Code' }],
        },
      ],
    },
    {
      title: '実務経験あり',
      categories: [
        {
          title: '',
          items: [{ name: 'Next.js, Vite, Unity, Meta Quest, Python, RAG / LLM, ユーザリサーチ, RtD, Marp' }],
        },
      ],
    },
    {
      title: '使用経験',
      categories: [
        {
          title: '',
          items: [{ name: 'React Three Fiber, 画像合成, BLE / ハード制御, Blender' }],
        },
      ],
    },
  ],
};
