import Image from 'next/image';
import { Dela_Gothic_One, Zen_Kaku_Gothic_New } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Clip, Links, Nums, Ph, Shell, Stack, Text, WorkFigure, XPost } from '../../parts';
import './style.css';

// ゲームの紙は 3 × 3 の 9 面。最初の面も作りの面も同じ 9 面で組む
const head = Dela_Gothic_One({ weight: '400', subsets: ['latin'], variable: '--font-wo', display: 'swap', preload: false });
const body = Zen_Kaku_Gothic_New({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-wo-b', display: 'swap', preload: false });
const t = workTech.whiteout;
const f = '/images/front/';

export default function WhiteoutPage() {
    const cells = [...(t.flow ?? []), ...t.points];
    return (
        <Shell id="whiteout" className={`p-whiteout ${head.variable} ${body.variable}`}>
            <header className="nine">
                <Clip className="c1" src={`${f}wo_net`} label="線の先に玉が付いた放射が重なり、網になる場面" />
                <Clip className="c2" src={`${f}wo_tentacle`} label="白い線が曲がりながら枝分かれして広がる場面" />
                <div className="c3 copy">
                    <p className="sub">塗りローグ</p>
                    <p className="say"><Ph text="白いインクで、9 つの面を塗りつぶす。" /></p>
                </div>
                <div className="title">
                    <h1>WHITEOUT</h1>
                    <Image className="splash" src={`${f}splash.webp`} alt="" width={1100} height={1165} sizes="70vw" priority />
                    <Image className="splash drop" src={`${f}splash-drop.webp`} alt="" width={1100} height={1165} sizes="70vw" priority />
                </div>
                <div className="c7 copy">
                    <p className="award">unity1week 楽しさの評価 4.434 / 5</p>
                    <p>2026.08　個人制作。<span className="wk-ph">実装には AI エージェントを活用。</span></p>
                    <Links items={[{ label: 'unityroomで遊ぶ', url: 'https://unityroom.com/games/whiteout-rogue' }]} />
                </div>
                <Clip className="c8" src={`${f}wo_star`} label="波打つ線の先に星の形が開く場面" />
                <Clip className="c9" src={`${f}wo_geo`} label="放射の線が組み合わさり、幾何学模様になる場面" />
            </header>

            <section className="fast">
                <Clip src={`${f}wo_radial`} label="放射状の太い線で黒い地が白くなる場面" />
                <div className="fast__copy">
                    <h2><Ph text="能力を組み合わせて、速いクリアを目指す。" /></h2>
                    <Text items={['unity1week のお題「しろ」に向けて制作したローグライトゲームです。評価の高い作品に選出されました。', '公開時の PV は X で 6 万回以上表示され、unityroom のページは 1.5 万回閲覧されています。']} />
                </div>
            </section>

            <section className="count">
                <Nums items={[
                    { value: '61,774', unit: '回', label: 'X で PV が表示された回数' },
                    { value: '868', label: 'PV へのいいね' },
                    { value: '15,047', unit: '回', label: 'unityroom での閲覧' },
                    { value: '189', unit: '件', label: 'unityroom での評価' },
                    { value: '4.434', unit: '/ 5', label: 'unity1week の楽しさの評価' },
                ]} />
                <p className="wk-note">2026 年 10 月 24 日時点。X は公開時の PV の投稿、unityroom はゲームのページの数字です。</p>
            </section>

            <section className="posts">
                <XPost url="https://x.com/Roil_HCI/status/2084600134781096411" title="公開時の PV" caption="2026 年 8 月 4 日　unityroom での公開に合わせた PV" stats={[{ label: '表示', value: '61,774' }, { label: 'いいね', value: '868' }, { label: 'リポスト', value: '108' }, { label: 'ブックマーク', value: '341' }]} />
                <XPost url="https://x.com/Roil_HCI/status/2086271168156467599" title="アップデートの紹介" caption="2026 年 8 月 9 日　無限撃ち・実績・スマホ対応を加えた版" stats={[{ label: '表示', value: '41,966' }, { label: 'いいね', value: '309' }, { label: 'リポスト', value: '33' }, { label: 'ブックマーク', value: '145' }]} />
            </section>

            <section className="layers">
                <div className="layers__fig"><WorkFigure name="whiteout-layers" caption="赤い面は、新しく塗られてテクスチャを送り直す面です。" /></div>
                <div className="layers__copy">
                    <h2><Ph text="塗った場所は、整数の配列が知っている。" /></h2>
                    <Text items={[t.summary]} />
                    <Nums items={t.numbers} />
                </div>
            </section>

            <dl className="board">
                {cells.map((c) => <div key={c.title}><dt>{c.title}</dt><dd>{c.body}</dd></div>)}
            </dl>

            <section className="last">
                <Clip src={`${f}wo_donut`} label="花のようなふちの白い輪を赤いしずくが塗る場面" />
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
