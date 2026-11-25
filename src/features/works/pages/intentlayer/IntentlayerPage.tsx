import Link from 'next/link';
import { M_PLUS_1p } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Links, List, Nums, Photo, Ph, Shell, Stack, Text, WorkFigure } from '../../parts';
import Scan from './Scan';
import './style.css';

// 見たい人だけがスキャンして札を見る。紙面の札も、押したときだけ出る
const font = M_PLUS_1p({ weight: ['400', '700', '900'], subsets: ['latin'], variable: '--font-il', display: 'swap', preload: false });
const t = workTech.intentlayer;
const d = workTech['metaquest-devs'];

export default function IntentlayerPage() {
    return (
        <Shell id="intentlayer" className={`p-intentlayer ${font.variable}`}>
            <Hero
                src="/images/works/intentlayer/poster.webp"
                tall="/images/works/intentlayer/poster-tall.webp"
                alt="研究室を高い所から見た絵。手前に MR ゴーグルを着けた人が立ち、机で作業する人や休む人がいる"
                after={<Scan tags={['今は話しかけないで欲しい', '作業中だが雑談歓迎', '話しかけてほしい']} />}
            >
                <h1>IntentLayer</h1>
                <div className="lead">
                    <p className="say"><Ph text="「いま話しかけてよいか」の判断材料を、相手のそばに表示する。" /></p>
                    <div>
                        <p className="meta">2025（卒業研究）　単独（着想・実装・実験・分析・執筆）</p>
                        <Links items={[{ label: '卒業論文', url: '/soturon.pdf' }]} />
                    </div>
                </div>
            </Hero>

            <section className="self">
                <div className="self__copy">
                    <h2><Ph text="推定せず、本人が書く。" /></h2>
                    <Text items={['対面で「いま話しかけてよいか」を判断しやすくする MR システムです。人の意図を複合現実空間に配置します。', '卒業研究として HMD 版と Web 版を実装しました。1 週間運用し、半構造化インタビューで評価しました。', t.summary]} />
                    <Nums items={t.numbers} />
                </div>
                <Photo pic={{ src: '/images/front/intent.webp', alt: 'MR デバイスでスキャンすると、離れた 2 人のそばに「今は話しかけないで欲しい」「作業中だが雑談歓迎」と表示される図', w: 654, h: 400 }} />
            </section>

            <section className="route wk-recolor">
                <h2>使い方の流れ</h2>
                <List items={t.flow} />
                <WorkFigure name="intentlayer-route" caption="書いて、置いて、見るまでは共通です。その先が HMD 版と Web 版に分かれます。" />
            </section>

            <section className="notes">
                <Photo pic={{ src: '/images/works/intentlayer/photo.webp', alt: '机に向かう人の肩のそばに白い紙片が浮かび、奥に MR ヘッドセットを着けた人が立つ研究室', w: 1007, h: 1024, generated: true }} />
                <div>
                    <h2>作りの要点</h2>
                    <List items={t.points} />
                    <Stack items={t.stack} />
                </div>
            </section>

            <section className="devs" id="metaquest-devs">
                <Art real src="/images/Mr-Devs.png" alt="通路で人とすれ違う場面など、Meta Quest で試作した場面の一覧" />
                <div className="devs__copy">
                    <h2>MetaQuest Devs</h2>
                    <p className="devs__say"><Ph text="現実の空間に情報を重ねる表現を試す。" /></p>
                    <Text items={[d.summary, ...d.points.map((x) => x.body)]} />
                    <Stack items={d.stack} />
                    <p><Link href="/works/metaquest-devs">MetaQuest Devs のページを見る</Link></p>
                </div>
            </section>
        </Shell>
    );
}
