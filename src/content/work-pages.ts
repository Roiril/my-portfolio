import { coupleSync } from './couple-sync';
import { workTech } from './works-tech';

// 「詳しく見る」の先のページの中身。ページごとに手で組む。
// 事実は works.ts / works-tech.ts / couple-sync.ts にある文を使う。
// 担当の書き方と 1 行目は 2026-11-07 に確定したもの。実施前の予定を実施済みの形にしない。

export type Tone = 'paper' | 'night' | 'white';

export type Pic = {
  src: string;
  alt: string;
  w: number;
  h: number;
  // 切り抜くときに残す位置（object-position）
  pos?: string;
  // 生成した画像なら画面に書く
  generated?: boolean;
  caption?: string;
};

export type TextItem = { title: string; body: string };
export type NumberItem = { value: string; unit?: string; label: string };
export type LinkItem = { label: string; url: string };

export type Slot =
  | { k: 'h'; text: string; small?: boolean }
  | { k: 'p'; text: string[] }
  | { k: 'note'; text: string }
  | { k: 'pic'; pic: Pic }
  | { k: 'pics'; pics: Pic[]; cols: 2 | 3 | 4 | 5 }
  | { k: 'yt'; id: string; title: string; caption?: string; portrait?: boolean }
  | { k: 'clips'; items: { src: string; poster: string; label: string }[] }
  | { k: 'phones'; pics: Pic[] }
  | { k: 'list'; items: TextItem[] }
  | { k: 'numbers'; items: NumberItem[] }
  | { k: 'stack'; items: { label: string; items: string[] }[] }
  | { k: 'credits'; title: string; items: string[] }
  | { k: 'links'; items: LinkItem[] }
  | { k: 'post'; url: string; title: string; caption: string; stats: { label: string; value: string }[] };

export type Page = { tone: Tone; slots: Slot[]; center?: boolean } | { tone: Tone; bleed: Pic[] };

export type Section =
  | { type: 'spread'; left: Page; right: Page }
  | { type: 'full'; tone: Tone; slots: Slot[] }
  // 図を大きく置き、横に文を添える。図は線をまたぐ
  | { type: 'figure'; tone: Tone; name: string; caption: string; side?: Slot[] }
  // 路線図のように横に長い図
  | { type: 'wideFigure'; tone: Tone; name: string; caption: string; head?: Slot[] };

export type Mark =
  | { type: 'logo'; src: string; w: number; h: number; alt: string }
  // size は幅 1440 での文字の大きさ、sizeM はスマートフォンでの大きさ（どちらも 1440 分割の単位）
  | { type: 'text'; text: string; font: 'tall' | 'serif'; size: number; sizeM: number };

export type Hero =
  | { type: 'pic'; pic: Pic; fit?: 'cover' | 'contain' }
  | { type: 'clip'; src: string; poster: string; label: string }
  | { type: 'phones'; bg: Pic; phones: Pic[] };

export type WorkPageDef = {
  id: string;
  mark: Mark;
  // 題字の上端（幅 1440 での px）
  markTop?: number;
  // 線の右側の題字の色。既定は明るい色
  markRight?: 'light' | 'ink';
  // 画像が明るいか細かく、題字が重ねられないページ。線の右も題字の下までは地にする
  band?: boolean;
  say: string;
  sub?: string;
  award?: string;
  meta?: string;
  links?: LinkItem[];
  heroTone: [Tone, Tone];
  hero: Hero;
  thumb: string;
  sections: Section[];
};

const p = (...text: string[]): Slot => ({ k: 'p', text });
const h = (text: string): Slot => ({ k: 'h', text });
const h3 = (text: string): Slot => ({ k: 'h', text, small: true });
const flow = (id: string): TextItem[] => workTech[id].flow ?? [];
const points = (id: string): TextItem[] => workTech[id].points ?? [];
const numbers = (id: string): Slot => ({ k: 'numbers', items: workTech[id].numbers ?? [] });
const stack = (id: string): Slot => ({ k: 'stack', items: workTech[id].stack });
const halves = <T,>(items: T[]): [T[], T[]] => {
  const n = Math.ceil(items.length / 2);
  return [items.slice(0, n), items.slice(n)];
};
const pointSpread = (id: string, tone: Tone = 'paper'): Section => {
  const [a, b] = halves(points(id));
  return { type: 'spread', left: { tone, slots: [h3('作りの要点'), { k: 'list', items: a }] }, right: { tone, slots: [{ k: 'list', items: b }] } };
};

const phone = (src: string, alt: string, w = 780, h = 1688): Pic => ({ src, alt, w, h });
const photo = (id: string, alt: string, w = 1536, h = 1024, pos?: string): Pic => ({ src: `/images/works/${id}/photo.webp`, alt, w, h, pos, generated: true });

export const workPages: WorkPageDef[] = [
  {
    id: 'mawarimi',
    mark: { type: 'logo', src: '/images/front/mawarimi-title.webp', w: 1210, h: 531, alt: '廻リ視' },
    markTop: 130,
    say: '監視カメラに映る自分を見ながら、現実空間を歩く。',
    award: 'IVRC2026 総合優勝／DCEXPO賞',
    meta: '2026　チーム制作。企画・監督・ソフトウェア開発を担当。',
    links: [
      { label: '公式サイト', url: 'https://mawarimi.vercel.app/' },
      { label: '日本VR学会の論文', url: 'https://www.conference.vrsj.org/ac2026/program/doc/IVRC-15.pdf' },
    ],
    heroTone: ['night', 'night'],
    hero: { type: 'pic', pic: { src: '/images/front/room.webp', alt: '黒い幕に囲まれた部屋', w: 1672, h: 941, pos: '50% 50%' } },
    thumb: '/images/front/room.webp',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('同じ壁のまわりを、3 周する。'),
            p(
              'HMDと複数のカメラで現実空間を固定視点に再構成したホラー体験です。体験者は怪異調査員として呪われた壁を調査します。',
              '要件定義、体験設計、動作検証も担当しています。実装にはAIエージェントを活用し、設計の把握とテストを通して品質を確かめています。',
            ),
            numbers('mawarimi'),
          ],
        },
        right: {
          tone: 'night',
          bleed: [
            { src: '/images/front/cam1.webp', alt: '棚のアームのカメラから見た部屋', w: 960, h: 720 },
            { src: '/images/front/cam2.webp', alt: '床に置いたカメラから見た部屋', w: 960, h: 720 },
          ],
        },
      },
      {
        type: 'spread',
        left: { tone: 'night', slots: [{ k: 'yt', id: 'uWf51qRwbhA', title: '廻リ視(MAWARIMI) トレイラー', caption: '最新のトレイラー' }] },
        right: { tone: 'night', slots: [{ k: 'yt', id: 'ipoU4gU9G4k', title: '廻り視トレイラー (IVRC2026 ver)', caption: 'IVRC2026 のときのトレイラー' }] },
      },
      {
        type: 'figure',
        tone: 'night',
        name: 'mawarimi-room',
        caption: '床の濃さは、どのカメラの映像に切り替わるかを示します。寸法とカメラの位置は作品の設定の値です。',
        side: [h('映像が届くまで'), p(workTech.mawarimi.summary), { k: 'list', items: flow('mawarimi') }],
      },
      pointSpread('mawarimi'),
      {
        type: 'spread',
        left: {
          tone: 'night',
          slots: [
            h3('受賞と展示'),
            {
              k: 'list',
              items: [
                { title: 'IVRC2026', body: '総合優勝。DCEXPO賞。' },
                { title: '第31回日本VR学会大会', body: '体験展示。' },
                { title: 'DCEXPO2026', body: '2026年11月18〜20日に招待展示予定。' },
                { title: 'Inter BEE', body: '2026年11月19日に登壇予定。' },
              ],
            },
            { k: 'note', text: '2026 年 11 月 7 日時点。' },
          ],
        },
        right: {
          tone: 'night',
          slots: [
            { k: 'credits', title: 'チーム', items: ['白石大晴', 'Kim Hyunmin', '堀越康平', '五島慶人'] },
            {
              k: 'credits',
              title: '担当',
              items: ['企画/監督　白石', '企画書/動画制作　白石', 'シナリオ/演出　白石', 'サウンドデザイン　白石', 'タイトル/ロゴデザイン　白石', 'ソフトウェア開発　白石', 'ラジコン日本人形制作　五島', '壁床制作　チーム', 'テスト/フィードバック　チーム', '設営/展示　チーム'],
            },
            stack('mawarimi'),
          ],
        },
      },
    ],
  },

  {
    id: 'whiteout',
    mark: { type: 'text', text: 'WHITEOUT', font: 'tall', size: 340, sizeM: 340 },
    band: true,
    markTop: 120,
    say: '白いインクで、9 つの面を塗りつぶす。',
    sub: '塗りローグ',
    award: 'unity1week 楽しさの評価 4.434 / 5',
    meta: '2026.08　個人制作。実装には AI エージェントを活用。',
    links: [{ label: 'unityroomで遊ぶ', url: 'https://unityroom.com/games/whiteout-rogue' }],
    heroTone: ['paper', 'night'],
    hero: { type: 'clip', src: '/images/front/wo_net.mp4', poster: '/images/front/wo_net.webp', label: '線の先に玉が付いた放射が重なり、網になる場面' },
    thumb: '/images/front/wo_net.webp',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'night',
          slots: [
            h('能力を組み合わせて、速いクリアを目指す。'),
            p(
              'unity1week のお題「しろ」に向けて制作したローグライトゲームです。評価の高い作品に選出されました。',
              '公開時の PV は X で 6 万回以上表示され、unityroom のページは 1.5 万回閲覧されています。',
            ),
          ],
        },
        right: {
          tone: 'night',
          slots: [
            {
              k: 'numbers',
              items: [
                { value: '61,774', unit: '回', label: 'X で PV が表示された回数' },
                { value: '868', label: 'PV へのいいね' },
                { value: '15,047', unit: '回', label: 'unityroom での閲覧' },
                { value: '189', unit: '件', label: 'unityroom での評価' },
                { value: '4.434', unit: '/ 5', label: 'unity1week の楽しさの評価' },
              ],
            },
            { k: 'note', text: '2026 年 10 月 24 日時点。X は公開時の PV の投稿、unityroom はゲームのページの数字です。' },
          ],
        },
      },
      {
        type: 'full',
        tone: 'night',
        slots: [
          {
            k: 'clips',
            items: [
              { src: '/images/front/wo_net.mp4', poster: '/images/front/wo_net.webp', label: '線の先に玉が付いた放射が重なり、網になる場面' },
              { src: '/images/front/wo_tentacle.mp4', poster: '/images/front/wo_tentacle.webp', label: '白い線が曲がりながら枝分かれして広がる場面' },
              { src: '/images/front/wo_donut.mp4', poster: '/images/front/wo_donut.webp', label: '花のようなふちの白い輪を赤いしずくが塗る場面' },
              { src: '/images/front/wo_geo.mp4', poster: '/images/front/wo_geo.webp', label: '放射の線が組み合わさり、幾何学模様になる場面' },
              { src: '/images/front/wo_star.mp4', poster: '/images/front/wo_star.webp', label: '波打つ線の先に星の形が開く場面' },
              { src: '/images/front/wo_radial.mp4', poster: '/images/front/wo_radial.webp', label: '放射状の太い線で黒い地が白くなる場面' },
            ],
          },
        ],
      },
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            {
              k: 'post',
              url: 'https://x.com/Roil_HCI/status/2084600134781096411',
              title: '公開時の PV',
              caption: '2026 年 8 月 4 日　unityroom での公開に合わせた PV',
              stats: [{ label: '表示', value: '61,774' }, { label: 'いいね', value: '868' }, { label: 'リポスト', value: '108' }, { label: 'ブックマーク', value: '341' }],
            },
          ],
        },
        right: {
          tone: 'paper',
          slots: [
            {
              k: 'post',
              url: 'https://x.com/Roil_HCI/status/2086271168156467599',
              title: 'アップデートの紹介',
              caption: '2026 年 8 月 9 日　無限撃ち・実績・スマホ対応を加えた版',
              stats: [{ label: '表示', value: '41,966' }, { label: 'いいね', value: '309' }, { label: 'リポスト', value: '33' }, { label: 'ブックマーク', value: '145' }],
            },
          ],
        },
      },
      {
        type: 'figure',
        tone: 'night',
        name: 'whiteout-layers',
        caption: '赤い面は、新しく塗られてテクスチャを送り直す面です。',
        side: [h('塗った場所は、整数の配列が知っている。'), p(workTech.whiteout.summary), { k: 'list', items: flow('whiteout') }],
      },
      pointSpread('whiteout'),
      {
        type: 'spread',
        left: { tone: 'night', slots: [numbers('whiteout')] },
        right: { tone: 'night', slots: [stack('whiteout')] },
      },
    ],
  },

  {
    id: 'intentlayer',
    mark: { type: 'text', text: 'IntentLayer', font: 'tall', size: 236, sizeM: 280 },
    markRight: 'ink',
    markTop: 90,
    say: '「いま話しかけてよいか」の判断材料を、相手のそばに表示する。',
    meta: '2025（卒業研究）　単独（着想・実装・実験・分析・執筆）',
    links: [{ label: '卒業論文', url: '/soturon.pdf' }],
    heroTone: ['paper', 'white'],
    hero: { type: 'pic', fit: 'contain', pic: { src: '/images/front/intent.webp', alt: 'MR デバイスでスキャンすると、離れた 2 人のそばに「今は話しかけないで欲しい」「作業中だが雑談歓迎」と表示される図', w: 654, h: 400 } },
    thumb: '/images/front/intent.webp',
    sections: [
      {
        type: 'spread',
        left: { tone: 'night', bleed: [photo('intentlayer', '机に向かう人の肩のそばに白い紙片が浮かび、奥に MR ヘッドセットを着けた人が立つ研究室', 1007, 1024, '40% 50%')] },
        right: {
          tone: 'paper',
          slots: [
            h('推定せず、本人が書く。'),
            p(
              '対面で「いま話しかけてよいか」を判断しやすくする MR システムです。人の意図を複合現実空間に配置します。',
              '卒業研究として HMD 版と Web 版を実装しました。1 週間運用し、半構造化インタビューで評価しました。',
              workTech.intentlayer.summary,
            ),
            numbers('intentlayer'),
          ],
        },
      },
      {
        type: 'wideFigure',
        tone: 'paper',
        name: 'intentlayer-route',
        caption: '書いて、置いて、見るまでは共通です。その先が HMD 版と Web 版に分かれます。',
      },
      pointSpread('intentlayer', 'white'),
      {
        type: 'spread',
        left: { tone: 'night', slots: [h3('使い方の流れ'), { k: 'list', items: flow('intentlayer') }] },
        right: { tone: 'night', slots: [stack('intentlayer')] },
      },
    ],
  },

  {
    id: 'metaquest-devs',
    mark: { type: 'text', text: 'MetaQuest Devs', font: 'tall', size: 176, sizeM: 240 },
    band: true,
    markTop: 110,
    say: '現実の空間に情報を重ねる表現を試す。',
    meta: '卒業研究のために作った試作集',
    heroTone: ['night', 'night'],
    hero: { type: 'pic', pic: { src: '/images/Mr-Devs.png', alt: '通路で人とすれ違う場面など、Meta Quest で試作した場面の一覧', w: 1200, h: 800 } },
    thumb: '/images/front/devs.webp',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('試作を重ねて、研究の土台を作る。'),
            p(workTech['metaquest-devs'].summary, ...points('metaquest-devs').map((x) => x.body)),
            stack('metaquest-devs'),
          ],
        },
        right: { tone: 'night', bleed: [photo('metaquest-devs', '木の机に置かれた白いヘッドセットとコントローラ、束ねたケーブル、付箋を貼ったノート PC', 1536, 1024, '78% 50%')] },
      },
    ],
  },

  {
    id: 'ai-business-tools',
    mark: { type: 'text', text: 'AI業務ツール', font: 'serif', size: 148, sizeM: 180 },
    band: true,
    markTop: 110,
    say: '商談から見積書の下書きを作り、社内マニュアルから根拠つきで答える。',
    sub: '見積書の下書きと社内検索チャット',
    meta: '2025.11 –（長期インターン）　要件定義〜実装〜運用',
    heroTone: ['paper', 'night'],
    hero: { type: 'pic', pic: photo('ai-business-tools', '手書きのメモと表の用紙、分厚いマニュアルのファイル、赤いペンが置かれた机', 1536, 1024, '76% 50%') },
    thumb: '/images/works/ai-business-tools/photo.webp',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('下書きは AI に。最後は人が確かめる。'),
            p(
              '長期インターンでは、営業担当へのヒアリングをもとに必要な機能を要件定義し、AIを活用して業務ツールを実装しています。品質を確かめるために実装の設計を把握し、テストと動作検証を行っています。',
              '制作したのは、商談内容から見積書の下書きを作る機能と、社内マニュアルを検索して回答するRAGチャットです。',
            ),
          ],
        },
        right: { tone: 'paper', slots: [h3('使う流れ'), { k: 'list', items: flow('ai-business-tools') }] },
      },
      { type: 'wideFigure', tone: 'paper', name: 'ai-business-tools-route', caption: '2 本の線は「人が確かめる」で合流します。' },
      {
        type: 'spread',
        left: { tone: 'night', slots: [h3('作りの要点'), { k: 'list', items: points('ai-business-tools') }] },
        right: { tone: 'night', slots: [stack('ai-business-tools')] },
      },
    ],
  },

  {
    id: 'couple-sync',
    mark: { type: 'text', text: 'couple-sync', font: 'tall', size: 236, sizeM: 280 },
    markTop: 90,
    say: 'ふたりの毎日を、ひとつの部屋に。',
    meta: '2026.03 –　個人制作。企画・設計・検証を担当。実装には AI エージェントを活用。',
    links: [{ label: 'アプリのデモを見る', url: '/demos/couple-sync/index.html' }],
    heroTone: ['paper', 'night'],
    hero: {
      type: 'phones',
      bg: photo('couple-sync', '電球の光が落ちる木のテーブルに置かれた 2 台のスマートフォンと、奥で眠る猫', 1536, 1024, '85% 50%'),
      phones: [phone('/images/works/couple-sync/00-room.png', '猫のいる部屋の画面'), phone('/images/works/couple-sync/03-gacha.png', '家具を集めるガチャの画面', 390, 844)],
    },
    thumb: '/images/works/couple-sync/00-room.png',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [h('予定も記録も、猫のいる部屋から。'), p(coupleSync.lead, coupleSync.introduction, coupleSync.legacy)],
        },
        right: { tone: 'paper', slots: [{ k: 'phones', pics: [phone('/images/works/couple-sync/00-room.png', '猫のいる部屋から各機能を開く画面'), phone('/images/works/couple-sync/07-legacy.png', '切り替えて使える一覧型の画面')] }] },
      },
      {
        type: 'spread',
        left: {
          tone: 'night',
          slots: [
            h3(coupleSync.scenes[0].heading),
            p(coupleSync.scenes[0].body),
            { k: 'phones', pics: [{ ...phone(coupleSync.scenes[0].image, coupleSync.scenes[0].alt), caption: coupleSync.scenes[0].caption }] },
          ],
        },
        right: {
          tone: 'night',
          slots: [
            h3(coupleSync.scenes[1].heading),
            p(coupleSync.scenes[1].body),
            { k: 'phones', pics: [{ ...phone(coupleSync.scenes[1].image, coupleSync.scenes[1].alt), caption: coupleSync.scenes[1].caption }] },
          ],
        },
      },
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h(coupleSync.play.heading),
            p(...coupleSync.play.body),
            { k: 'phones', pics: [{ ...phone(coupleSync.play.image, coupleSync.play.alt, 390, 844), caption: coupleSync.play.caption }] },
          ],
        },
        right: {
          tone: 'paper',
          slots: [
            {
              k: 'phones',
              pics: coupleSync.additionalScreens.map((s) => ({ ...phone(s.image, s.alt), caption: `${s.title}。${s.body}` })),
            },
          ],
        },
      },
      {
        type: 'wideFigure',
        tone: 'paper',
        name: 'couple-sync-route',
        caption: '点線は、通信が切れている間に変更が待つ場所です。',
        head: [h('通信が切れても、使い続けられる。'), p(workTech['couple-sync'].summary)],
      },
      pointSpread('couple-sync', 'white'),
      {
        type: 'spread',
        left: { tone: 'night', slots: [numbers('couple-sync'), { k: 'note', text: coupleSync.demo }] },
        right: { tone: 'night', slots: [stack('couple-sync')] },
      },
    ],
  },

  {
    id: 'cogni-storage',
    mark: { type: 'text', text: 'cogni-storage', font: 'tall', size: 206, sizeM: 250 },
    band: true,
    markTop: 90,
    say: '読む・考える・書くを、ひとつのアプリで行う。',
    meta: '2026.03 –　個人制作。企画・設計・検証を担当。実装には AI エージェントを活用。',
    links: [{ label: 'アプリのデモを見る', url: '/demos/cogni-storage/index.html' }],
    heroTone: ['night', 'night'],
    hero: {
      type: 'phones',
      bg: photo('cogni-storage', '黒い机に置かれた付箋付きの論文の束、情報カード、万年筆、開いたノート', 1536, 1024, '70% 50%'),
      phones: [phone('/images/works/cogni-storage/01-home.png', 'cogni-storage のホーム画面'), phone('/images/works/cogni-storage/02-ideas.png', '思いつきをカードで育てる画面')],
    },
    thumb: '/images/works/cogni-storage/02-ideas.png',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('思いつきをカードで貯めて、育てる。'),
            p(
              '研究では、思いつき・読んだ文献・書きかけの論文が別々の場所に散らばりがちです。そこで思いつきをカード（Ideas）として貯め、確からしさを書き添えて育てる画面を中心に置きました。',
              '研究テーマ・執筆中の論文・読んだ文献もここから行き来でき、発表スライドの生成まで同じアプリで扱えます。',
              'Claude Code と連携し、文献の取り込み・翻訳・整理を半自動で進められます。見た目は黒とクリームを基調にしたレトロな配色でそろえました。',
            ),
          ],
        },
        right: {
          tone: 'night',
          slots: [
            {
              k: 'phones',
              pics: [
                { ...phone('/images/works/cogni-storage/02-ideas.png', 'Ideas の画面'), caption: 'Ideas　思いつきをカードで育てる' },
                { ...phone('/images/works/cogni-storage/03-themes.png', 'Themes の画面'), caption: 'Themes　研究テーマの管理' },
              ],
            },
          ],
        },
      },
      {
        type: 'spread',
        left: {
          tone: 'night',
          slots: [
            {
              k: 'phones',
              pics: [
                { ...phone('/images/works/cogni-storage/04-papers.png', 'Papers の画面'), caption: 'Papers　執筆中の論文' },
                { ...phone('/images/works/cogni-storage/05-readings.png', 'Readings の画面'), caption: 'Readings　文献の記録' },
              ],
            },
          ],
        },
        right: {
          tone: 'paper',
          slots: [
            h('通信が切れても、書き続けられる。'),
            p(
              '画面は常に端末内のデータから表示し、サーバー（Supabase）とは変わった分だけをやり取りします。つながると別の端末に追いつきます。',
              '公開デモは実際の画面を使っています。研究資料と記録は架空の見本に置き換え、変更はこの端末内にだけ保存します。',
            ),
          ],
        },
      },
      {
        type: 'wideFigure',
        tone: 'paper',
        name: 'cogni-storage-route',
        caption: '依頼は Supabase を通して Claude Code に届きます。研究メモは git に残り、ビルドのときにアプリへ入ります。',
      },
      pointSpread('cogni-storage', 'white'),
      {
        type: 'spread',
        left: { tone: 'night', slots: [numbers('cogni-storage')] },
        right: { tone: 'night', slots: [stack('cogni-storage')] },
      },
    ],
  },

  {
    id: 'blender-works',
    mark: { type: 'text', text: 'Blender Works', font: 'tall', size: 196, sizeM: 250 },
    band: true,
    markTop: 90,
    say: 'モデリング、ジオメトリノード、VFX を試した小作品集。',
    heroTone: ['night', 'night'],
    hero: { type: 'pic', pic: { src: '/images/works/blender-works/subway-corridor.png', alt: '地下鉄の通路の 3D モデル。壁に 7 番出口の案内がある', w: 1080, h: 860, pos: '35% 50%' } },
    thumb: '/images/works/blender-works/robot-game-01.png',
    sections: [
      {
        type: 'full',
        tone: 'night',
        slots: [
          h('ロボット製造ゲームのキービジュアル'),
          p('ロボットを製造するゲームのために制作したキービジュアルです。'),
          { k: 'pic', pic: { src: '/images/works/blender-works/robot-game-01.png', alt: 'ロボット製造ゲームのキービジュアル', w: 1920, h: 1080 } },
        ],
      },
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('地下鉄の通路'),
            p('「8番出口」のような、どこか不穏で見覚えのある地下鉄の通路を作りました。'),
          ],
        },
        right: {
          tone: 'night',
          bleed: [{ src: '/images/works/blender-works/subway-end.png', alt: '地下鉄の通路の行き止まりの 3D モデル', w: 1080, h: 860 }],
        },
      },
      {
        type: 'full',
        tone: 'paper',
        slots: [
          h('好きなキャラクターのモデリング'),
          p('好きなキャラクターをモデリングし、表情を何種類か作り分けました。'),
          {
            k: 'pics',
            cols: 5,
            pics: [
              { src: '/images/works/blender-works/character-01.jpg', alt: 'キャラクターモデル（通常）', w: 1080, h: 1080 },
              { src: '/images/works/blender-works/character-02.jpg', alt: 'キャラクターモデル（アイコン）', w: 1080, h: 1080 },
              { src: '/images/works/blender-works/character-03.jpg', alt: 'キャラクターモデル（あっかんべー）', w: 1080, h: 1080 },
              { src: '/images/works/blender-works/character-04.jpg', alt: 'キャラクターモデル（じと目）', w: 1080, h: 1080 },
              { src: '/images/works/blender-works/character-05.jpg', alt: 'キャラクターモデル（目とじ）', w: 1080, h: 1080 },
            ],
          },
        ],
      },
      {
        type: 'spread',
        left: {
          tone: 'night',
          bleed: [
            { src: '/images/works/blender-works/geo-dino-01.png', alt: '恐竜と文字が切り替わるジオメトリノード', w: 913, h: 508 },
            { src: '/images/works/blender-works/geo-memo-01.png', alt: 'うごくメモ帳を貼り付けた壁', w: 798, h: 441 },
          ],
        },
        right: {
          tone: 'night',
          slots: [
            h('ジオメトリノード工作'),
            p('ジオメトリノードを使った実験です。恐竜と文字が切り替わるアニメーションや、動く壁にメモ帳が張り付く表現を作りました。'),
            { k: 'pic', pic: { src: '/images/works/blender-works/geo-memo-02.png', alt: 'うごくメモ帳を貼り付けた壁（別アングル）', w: 795, h: 802 } },
          ],
        },
      },
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [h('VFX工作'), p('Blenderでエフェクトの表現を試しました。'), stack('blender-works')],
        },
        right: {
          tone: 'night',
          bleed: [
            { src: '/images/works/blender-works/vfx-01.png', alt: 'VFX の実験', w: 796, h: 444 },
            { src: '/images/works/blender-works/vfx-02.png', alt: 'VFX の実験（別カット）', w: 733, h: 435 },
          ],
        },
      },
    ],
  },

  {
    id: 'meiji-3d',
    mark: { type: 'text', text: 'Meiji Univ 3F', font: 'tall', size: 204, sizeM: 260 },
    band: true,
    markTop: 90,
    say: '歩幅で測った校舎の 3 階を、3D にする。',
    heroTone: ['paper', 'night'],
    hero: { type: 'pic', pic: { src: '/images/Meiji3fVideoCapture.png', alt: '3D で再現した明治大学中野キャンパス 3 階の廊下', w: 1084, h: 547, pos: '50% 50%' } },
    thumb: '/images/Meiji3fVideoCapture.png',
    sections: [
      {
        type: 'spread',
        left: { tone: 'night', bleed: [photo('meiji-3d', '大学の廊下を歩く人の足元。床に赤い紙テープの印が等間隔に貼られている', 1536, 1024, '72% 50%')] },
        right: {
          tone: 'paper',
          slots: [
            h('自分の足で歩いて、寸法を測る。'),
            p(
              'いつも通っている明治大学中野キャンパス 3 階を、できるだけ実際の空間に忠実にデジタル化しました。歩幅を基準に各所の寸法を測り、空間全体の広さをおおよそ再現しています。',
              'テクスチャには現地で撮った写真を貼り、柱や什器など写真だけでは表せない部分はモデリングで補いました。遠くから見たときだけ成り立つ「張りぼて」ではなく、近くで見ても本物らしく感じられることを目指しています。',
            ),
          ],
        },
      },
      {
        type: 'full',
        tone: 'night',
        slots: [
          { k: 'pic', pic: { src: '/images/works/meiji-3d/meiji-3d-01.png', alt: '明治大学中野キャンパス 3 階の 3D モデル', w: 1680, h: 900 } },
          {
            k: 'pics',
            cols: 2,
            pics: [
              { src: '/images/works/meiji-3d/meiji-3d-02.png', alt: '3D モデル化した 3 階の空間', w: 1680, h: 900 },
              { src: '/images/works/meiji-3d/meiji-3d-03.png', alt: '写真テクスチャを貼り込んだ内観', w: 1680, h: 900 },
              { src: '/images/works/meiji-3d/meiji-3d-04.png', alt: 'モデリングで再現した什器まわり', w: 1680, h: 900 },
              { src: '/images/works/meiji-3d/meiji-3d-05.png', alt: '3 階フロアのデジタルツイン', w: 1680, h: 900 },
            ],
          },
          { k: 'yt', id: 'NfEQQwtwIPQ', title: 'Meiji Univ 3F の動画' },
        ],
      },
      { type: 'wideFigure', tone: 'paper', name: 'meiji-3d-route', caption: '作ったモデルは眺めるだけでなく、ほかの用途にも使っています。' },
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('未来の姿を VR で議論する'),
            p('デジタル化した空間を VR に持ち込み、この場所が将来どうあるべきかを議論する場にしました。歩測をもとに再現した空間の中で、配置や見え方を確認しながら将来の姿を検討できます。'),
            {
              k: 'pics',
              cols: 2,
              pics: [
                { src: '/images/works/meiji-3d/use-vr-03.png', alt: 'VR 空間内から見たフロア', w: 1369, h: 741 },
                { src: '/images/works/meiji-3d/use-vr-04.png', alt: 'VR での空間体験', w: 1375, h: 748 },
              ],
            },
          ],
        },
        right: {
          tone: 'night',
          bleed: [
            { src: '/images/works/meiji-3d/use-vr-01.png', alt: 'VR 空間で 3 階のモデルを使った議論', w: 1377, h: 690 },
            { src: '/images/works/meiji-3d/use-vr-02.png', alt: 'VR で未来の空間を検討する様子', w: 1366, h: 748 },
          ],
        },
      },
      {
        type: 'spread',
        left: { tone: 'night', slots: [{ k: 'yt', id: 'fjkS9zoACuA', title: 'シェーダーグラフで見え方を変えた動画' }, { k: 'pic', pic: { src: '/images/works/meiji-3d/use-shader-01.png', alt: 'シェーダーグラフで表現を変えた 3 階', w: 1380, h: 820 } }] },
        right: {
          tone: 'night',
          slots: [h('シェーダーグラフで遊ぶ'), p('シェーダーグラフを使い、空間の見え方そのものを変える表現も試しています。'), stack('meiji-3d')],
        },
      },
    ],
  },

  {
    id: 'uniqlo-future',
    mark: { type: 'text', text: 'UNIQLO: Imaginary Service', font: 'tall', size: 128, sizeM: 230 },
    band: true,
    markTop: 110,
    say: 'UNIQLO の架空サービス「服自販機」を、映像で見せる。',
    heroTone: ['white', 'night'],
    hero: { type: 'pic', pic: { src: '/images/UniqloCap.png', alt: '架空のサービスを紹介する動画の一場面', w: 1280, h: 704, pos: '50% 50%' } },
    thumb: '/images/UniqloCap.png',
    sections: [
      { type: 'full', tone: 'white', slots: [{ k: 'yt', id: '-q5xsLlaN8M', title: 'UNIQLO: Imaginary Service' }] },
      {
        type: 'spread',
        left: { tone: 'white', slots: [h('ないものを映像で見せる。'), p(workTech['uniqlo-future'].summary, ...points('uniqlo-future').map((x) => x.body))] },
        right: { tone: 'white', slots: [stack('uniqlo-future')] },
      },
    ],
  },

  {
    id: 'aquarium',
    mark: { type: 'text', text: 'Aquarium in Processing', font: 'tall', size: 138, sizeM: 230 },
    band: true,
    markTop: 110,
    say: '3 つの決まりだけで、魚が群れになる。',
    heroTone: ['paper', 'night'],
    hero: { type: 'pic', pic: { src: '/images/AcuariumPrograming.png', alt: '鳥居と金魚のあるデジタル水槽を、魚の群れが泳ぐ場面', w: 1037, h: 701, pos: '40% 50%' } },
    thumb: '/images/AcuariumPrograming.png',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('水槽も魚も、コードで描く。'),
            p(
              'Processingで一から組んだデジタル水槽です。水槽も魚も、群れの動きもすべてコードで描いています。',
              '1匹ずつの魚には「近くの仲間に寄る」「ぶつからない」「向きを揃える」という単純な決まりだけを与えています。それでも群れ全体は、生き物のように自然にまとまって泳ぎます。',
              '魚のかわいさと、アルゴリズムから生まれる生き物らしい動きの両立を目指しました。',
            ),
          ],
        },
        right: { tone: 'paper', slots: [{ k: 'yt', id: 'J4vsNST7PLU', title: 'Aquarium in Processing の動画' }, stack('aquarium')] },
      },
      {
        type: 'wideFigure',
        tone: 'paper',
        name: 'aquarium-rules',
        caption: '軌跡は、図のために 3 つの決まりを計算し直したものです。作品のデータではありません。',
      },
      {
        type: 'full',
        tone: 'night',
        slots: [
          {
            k: 'pics',
            cols: 4,
            pics: [
              { src: '/images/works/aquarium/aquarium-01.png', alt: 'Processing で描いたデジタル水槽', w: 411, h: 386 },
              { src: '/images/works/aquarium/aquarium-02.png', alt: '群れて泳ぐ魚たち', w: 737, h: 593 },
              { src: '/images/works/aquarium/aquarium-03.png', alt: 'プログラムされた魚の動き', w: 646, h: 560 },
              { src: '/images/works/aquarium/aquarium-04.png', alt: 'デジタル水槽の様子', w: 629, h: 541 },
            ],
          },
        ],
      },
      {
        type: 'spread',
        left: { tone: 'night', bleed: [photo('aquarium', '生成りの紙に黒いペンで描かれた魚の群れの素描。1 匹だけ赤い', 1091, 1024, '50% 50%')] },
        right: { tone: 'paper', slots: [h3('動く順番'), { k: 'list', items: flow('aquarium') }] },
      },
    ],
  },

  {
    id: 'retroTV-portfolio',
    mark: { type: 'text', text: 'Portfolio: Retro TV version', font: 'tall', size: 120, sizeM: 230 },
    markTop: 110,
    say: 'ブラウン管の画面に、ポートフォリオを映す。',
    meta: '2025.12　個人制作',
    links: [{ label: 'サイトを開く', url: 'https://my-retro-portfolio-rust.vercel.app/' }],
    heroTone: ['paper', 'night'],
    hero: { type: 'pic', pic: { src: '/images/retroTV-portfolio.png', alt: '暗い部屋のブラウン管にプロフィールが映る画面', w: 1212, h: 817, pos: '50% 50%' } },
    thumb: '/images/retroTV-portfolio.png',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('つまみを回すと、チャンネルが変わる。'),
            p(
              'ブラウン管テレビの画面にポートフォリオを映す Web 作品です。Canvas に描いた画面を three.js の湾曲した画面に貼り、つまみでチャンネルを変えられます。',
            ),
            numbers('retroTV-portfolio'),
          ],
        },
        right: { tone: 'night', slots: [{ k: 'yt', id: 'ZiNqQiZSbv4', title: 'Portfolio: Retro TV version の動画', portrait: true }] },
      },
      {
        type: 'figure',
        tone: 'paper',
        name: 'retrotv-layers',
        caption: '上から順に重ねて、1 枚の画面にしています。',
        side: [h('画面ができるまで'), { k: 'list', items: flow('retroTV-portfolio') }],
      },
      {
        type: 'spread',
        left: { tone: 'night', bleed: [photo('retroTV-portfolio', '暗い部屋の床に置かれた古いブラウン管のテレビ。画面に淡い緑の光', 1536, 1024, '78% 50%')] },
        right: { tone: 'paper', slots: [h3('作りの要点'), { k: 'list', items: points('retroTV-portfolio') }, stack('retroTV-portfolio')] },
      },
    ],
  },

  {
    id: 'cube-diary',
    mark: { type: 'text', text: 'CubeDiary', font: 'tall', size: 290, sizeM: 330 },
    markTop: 100,
    say: '写真を貼ったキューブを、暗い空間に並べる日記。',
    meta: '2025.11　個人制作',
    links: [{ label: 'サイトを開く', url: 'https://cube-diary.vercel.app/' }],
    heroTone: ['night', 'night'],
    hero: { type: 'pic', pic: { src: '/images/CubeDiary.png', alt: '暗い空間に球面状に並ぶ写真のキューブ', w: 909, h: 675, pos: '50% 50%' } },
    thumb: '/images/CubeDiary.png',
    sections: [
      {
        type: 'spread',
        left: {
          tone: 'paper',
          slots: [
            h('1 つのキューブに、写真が 6 枚。'),
            p('写真を 6 面に貼ったキューブを、暗い空間に並べていく日記アプリです。', '画像はブラウザ内で小さくしてから Supabase に保存し、React Three Fiber で描いています。'),
            numbers('cube-diary'),
          ],
        },
        right: { tone: 'night', slots: [{ k: 'yt', id: 'UY0FlFT1WY8', title: 'CubeDiary の動画', portrait: true }] },
      },
      {
        type: 'wideFigure',
        tone: 'night',
        name: 'cube-diary-geometry',
        caption: '球面は黄金角で計算しました。螺旋と結び目は並べ方の形を示す図で、作品のデータではありません。',
      },
      {
        type: 'spread',
        left: { tone: 'night', bleed: [photo('cube-diary', '真っ暗な部屋に、写真を貼った紙の立方体が糸で吊られている', 1536, 1024, '68% 50%')] },
        right: { tone: 'paper', slots: [h3('記録するまで'), { k: 'list', items: flow('cube-diary') }] },
      },
      {
        type: 'spread',
        left: { tone: 'paper', slots: [h3('作りの要点'), { k: 'list', items: points('cube-diary') }] },
        right: { tone: 'paper', slots: [stack('cube-diary')] },
      },
    ],
  },

  {
    id: 'ai-music-video',
    mark: { type: 'text', text: 'AI Generated Music Video', font: 'tall', size: 134, sizeM: 230 },
    band: true,
    markTop: 110,
    say: '工程ごとに AI を使い分けたミュージックビデオ。',
    meta: '個人制作',
    heroTone: ['night', 'night'],
    hero: { type: 'pic', pic: { src: '/images/Ai-Generated-Mv.png', alt: 'ミュージックビデオの一場面。ヘッドホンを着けて歌う 2 人', w: 700, h: 500, pos: '50% 50%' } },
    thumb: '/images/Ai-Generated-Mv.png',
    sections: [
      {
        type: 'spread',
        left: { tone: 'night', slots: [{ k: 'yt', id: 'Jgeij_JIZlQ', title: 'AI Generated Music Video' }, h('1 つの AI ですべてを作らない。'), p('曲は Suno AI で作り、編集は Filmora で仕上げました。曲・映像素材・編集の工程ごとに道具を試して組み合わせています。')] },
        right: { tone: 'night', slots: [{ k: 'yt', id: 'x7claprYtdw', title: 'AI Generated Music Video のショート', portrait: true }] },
      },
      { type: 'wideFigure', tone: 'night', name: 'ai-music-video-route', caption: '案を出す工程から、曲と映像の素材に分かれ、編集で 1 本になります。' },
      { type: 'full', tone: 'night', slots: [stack('ai-music-video')] },
    ],
  },

  {
    id: 'ai-composition',
    mark: { type: 'text', text: 'AI-Augmented Composition', font: 'tall', size: 130, sizeM: 230 },
    markTop: 110,
    say: '自分の曲を素材にして、AI で広げる。',
    meta: '個人制作',
    heroTone: ['paper', 'night'],
    hero: { type: 'pic', pic: photo('ai-composition', '夜の作業机に置かれた MIDI キーボード、ヘッドホン、オーディオインターフェース', 1536, 1024, '78% 50%') },
    thumb: '/images/works/ai-composition/photo.webp',
    sections: [
      {
        type: 'spread',
        left: { tone: 'paper', slots: [h3('Original'), { k: 'yt', id: 'EPZ6CyN0CKQ', title: 'AI-Augmented Composition の元の曲', caption: 'Studio One で作った元の曲', portrait: true }] },
        right: { tone: 'night', slots: [h3('AI Ver.'), { k: 'yt', id: '61PpnNePhsk', title: 'AI-Augmented Composition の AI 版', caption: 'Suno AI で広げた版', portrait: true }] },
      },
      { type: 'wideFigure', tone: 'paper', name: 'ai-composition-route', caption: '元の曲が 2 本に分かれ、聞き比べられます。' },
      {
        type: 'spread',
        left: { tone: 'paper', slots: [h('ゼロから作らせない。'), p('Studio One で以前作った自分の曲を、Suno AI で広げた作品です。元の曲と AI 版を聞き比べられます。')] },
        right: { tone: 'paper', slots: [stack('ai-composition')] },
      },
    ],
  },
];
