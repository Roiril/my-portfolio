import Image from 'next/image';
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Links, List, Nums, Photo, Ph, Shell, Stack, Text, WorkFigure, XVoice, Yt } from '../../parts';
import './style.css';

// 朱の帯が衝立のまわりを回る。絵の輪を、次の面の線につなぐ
const head = Shippori_Mincho({ weight: ['500', '800'], subsets: ['latin'], variable: '--font-mw', display: 'swap', preload: false });
const body = Zen_Kaku_Gothic_New({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-mw-b', display: 'swap', preload: false });
const t = workTech.mawarimi;

const awards = [
    { title: 'IVRC2026', body: '総合優勝。DCEXPO賞。' },
    { title: '第31回日本VR学会大会', body: '体験展示。' },
    { title: 'DCEXPO2026', body: '2026年11月18〜20日に招待展示。' },
    { title: 'Inter BEE', body: '2026年11月19日に登壇。' },
];
const roles = ['企画/監督　白石', '企画書/動画制作　白石', 'シナリオ/演出　白石', 'サウンドデザイン　白石', 'タイトル/ロゴデザイン　白石', 'ソフトウェア開発　白石', 'ラジコン日本人形制作　五島', '壁床制作　チーム', 'テスト/フィードバック　チーム', '設営/展示　チーム'];

export default function MawarimiPage() {
    return (
        <Shell id="mawarimi" className={`p-mawarimi ${head.variable} ${body.variable}`}>
            <Hero src="/images/works/mawarimi/poster.webp" tall="/images/works/mawarimi/poster-tall.webp" alt="高い所から見た部屋。VR ゴーグルの人から伸びた朱の影が衝立のまわりを回り、日本人形の足もとにつながる">
                <h1><Image src="/images/front/mawarimi-title.webp" alt="廻リ視" width={1210} height={531} sizes="(max-width: 900px) 90vw, 46vw" priority /></h1>
                <p className="say"><Ph text="監視カメラに映る自分を見ながら、現実空間を歩く。" /></p>
                <p className="award">IVRC2026 総合優勝／DCEXPO賞</p>
                <p className="meta">2026　チーム制作。<span className="wk-ph">企画・監督・ソフトウェア開発を担当。</span></p>
                <Links items={[{ label: '公式サイト', url: 'https://mawarimi.vercel.app/' }, { label: '日本VR学会の論文', url: 'https://www.conference.vrsj.org/ac2026/program/doc/IVRC-15.pdf' }]} />
            </Hero>

            <section className="voice">
                <XVoice
                    url="https://x.com/kure_kure_zo/status/2122963059086086273"
                    title={['Inter BEE 2026', '出展時の感想']}
                    award={{ src: '/images/front/mawarimi-award.webp', alt: 'DCEXPO Prize at IVRC と映したスクリーンの前で、賞状が読み上げられている', w: 660, h: 495, caption: 'DCEXPO賞の授賞式' }}
                    photos={['廻リ視のポスター', '展示台に置いた日本人形とタブレット', 'カーテンの周りを三周するよう伝えるタブレットの画面', 'コントローラーの操作を説明するタブレットの画面']}
                />
            </section>

            <section className="laps">
                <Art src="/images/works/mawarimi/monitor.webp" alt="赤い部屋に座った人形たちが、人の後ろ姿を映すブラウン管のモニターを見上げている" />
                <div className="laps__copy">
                    <h2><Ph text="同じ壁のまわりを、3 周する。" /></h2>
                    <Text items={[
                        'HMDと複数のカメラで現実空間を固定視点に再構成したホラー体験です。体験者は怪異調査員として呪われた壁を調査します。',
                        '要件定義、体験設計、動作検証も担当しています。実装にはAIエージェントを活用し、設計の把握とテストを通して品質を確かめています。',
                    ]} />
                    <Nums items={t.numbers} />
                </div>
            </section>

            <section className="cams">
                <svg className="cams__loop" viewBox="0 0 1440 760" preserveAspectRatio="none" aria-hidden="true"><path d="M1150 0 C1150 190 1400 250 1370 430 C1330 700 500 720 180 640 C-60 570 20 330 190 300" fill="none" stroke="currentColor" strokeWidth="44" /></svg>
                <Photo className="cam a" pic={{ src: '/images/front/cam1.webp', alt: '棚のアームのカメラから見た部屋', w: 960, h: 720, caption: '棚のアームのカメラ' }} />
                <Photo className="cam b" pic={{ src: '/images/front/cam2.webp', alt: '床に置いたカメラから見た部屋', w: 960, h: 720, caption: '床に置いたカメラ' }} />
                <Photo className="cam c" pic={{ src: '/images/front/room.webp', alt: '黒い幕に囲まれた部屋', w: 1672, h: 941, caption: '黒い幕に囲まれた部屋' }} />
            </section>

            <section className="films">
                <Yt id="uWf51qRwbhA" title="廻リ視(MAWARIMI) トレイラー" caption="最新のトレイラー" />
                <Yt id="ipoU4gU9G4k" title="廻り視トレイラー (IVRC2026 ver)" caption="IVRC2026 のときのトレイラー" />
            </section>

            <section className="path">
                <div className="path__fig"><WorkFigure name="mawarimi-room" caption="床の濃さは、どのカメラの映像に切り替わるかを示します。寸法とカメラの位置は作品の設定の値です。" /></div>
                <div className="path__text">
                    <h2>映像が届くまで</h2>
                    <Text items={[t.summary]} />
                    <List items={t.flow} />
                </div>
            </section>

            <section className="tate">
                <h2>作りの要点</h2>
                <List items={t.points} />
            </section>

            <section className="record">
                <div>
                    <h2>受賞と展示</h2>
                    <List items={awards} />
                    <p className="wk-note">2026 年 11 月 25 日時点。</p>
                </div>
                <div>
                    <h3>チーム</h3>
                    <ul>{['白石大晴', 'Kim Hyunmin', '堀越康平', '五島慶人'].map((n) => <li key={n}>{n}</li>)}</ul>
                    <h3>担当</h3>
                    <ul>{roles.map((r) => <li key={r}>{r}</li>)}</ul>
                </div>
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
