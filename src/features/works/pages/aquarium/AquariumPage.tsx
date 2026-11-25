import { Reggae_One, Zen_Kaku_Gothic_New } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, List, Photo, Ph, Shell, Stack, Text, WorkFigure, Yt } from '../../parts';
import './style.css';

// 1 匹ずつの三角が群れになる。実物の水槽の色（橙と水色）で面を塗る
const font = Reggae_One({ weight: '400', subsets: ['latin'], variable: '--font-aq', display: 'swap', preload: false });
const body = Zen_Kaku_Gothic_New({ weight: ['500', '900'], subsets: ['latin'], variable: '--font-aq-b', display: 'swap', preload: false });
const t = workTech.aquarium;
const f = '/images/works/aquarium/';

export default function AquariumPage() {
    return (
        <Shell id="aquarium" className={`p-aquarium ${font.variable} ${body.variable}`}>
            <Hero src={`${f}poster.webp`} alt="三角の魚の群れが渦を巻いて鳥居をくぐり、真ん中を金魚が泳ぐ">
                <h1>Aquarium<small>in Processing</small></h1>
                <p className="say"><Ph text="3 つの決まりだけで、魚が群れになる。" /></p>
            </Hero>
            <section className="real">
                <Art real src="/images/AcuariumPrograming.png" alt="鳥居と金魚のあるデジタル水槽を、魚の群れが泳ぐ場面" />
                <div>
                    <h2><Ph text="水槽も魚も、コードで描く。" /></h2>
                    <Text items={[
                        'Processingで一から組んだデジタル水槽です。水槽も魚も、群れの動きもすべてコードで描いています。',
                        '1匹ずつの魚には「近くの仲間に寄る」「ぶつからない」「向きを揃える」という単純な決まりだけを与えています。それでも群れ全体は、生き物のように自然にまとまって泳ぎます。',
                        '魚のかわいさと、アルゴリズムから生まれる生き物らしい動きの両立を目指しました。',
                    ]} />
                </div>
            </section>
            <section className="rules">
                <h2>3 つの決まり</h2>
                <WorkFigure name="aquarium-rules" caption="軌跡は、図のために 3 つの決まりを計算し直したものです。作品のデータではありません。" />
            </section>
            <section className="tanks">
                <Photo className="k1" pic={{ src: `${f}aquarium-02.png`, alt: '群れて泳ぐ魚たち', w: 737, h: 593 }} />
                <Photo className="k2" pic={{ src: `${f}aquarium-03.png`, alt: 'プログラムされた魚の動き', w: 646, h: 560 }} />
                <Photo className="k3" pic={{ src: `${f}aquarium-01.png`, alt: 'Processing で描いたデジタル水槽', w: 411, h: 386 }} />
                <Photo className="k4" pic={{ src: `${f}aquarium-04.png`, alt: 'デジタル水槽の様子', w: 629, h: 541 }} />
            </section>
            <section className="swim">
                <Yt id="J4vsNST7PLU" title="Aquarium in Processing の動画" />
                <div><h2>動く順番</h2><List items={t.flow} /><Stack items={t.stack} /></div>
            </section>
        </Shell>
    );
}
