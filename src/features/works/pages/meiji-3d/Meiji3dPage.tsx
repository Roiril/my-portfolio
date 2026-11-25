import { Zen_Antique_Soft } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, List, Photo, Ph, Shell, Stack, Text, WorkFigure, Yt } from '../../parts';
import './style.css';

// 歩幅を定規にする。靴跡が紙面の端を下まで続く
const font = Zen_Antique_Soft({ weight: '400', subsets: ['latin'], variable: '--font-mj', display: 'swap', preload: false });
const t = workTech['meiji-3d'];
const f = '/images/works/meiji-3d/';

export default function Meiji3dPage() {
    return (
        <Shell id="meiji-3d" className={`p-meiji ${font.variable}`}>
            <Hero src={`${f}poster.webp`} alt="校舎の長い廊下を、革靴が踏み出す。床に白い靴跡が続く">
                <h1>Meiji<br />Univ 3F</h1>
                <p className="say"><Ph text="歩幅で測った校舎の 3 階を、3D にする。" /></p>
            </Hero>

            <section className="walk">
                <Art real src={`${f}meiji-3d-03.png`} alt="写真テクスチャを貼り込んだ内観" />
                <div className="walk__copy">
                    <h2><Ph text="自分の足で歩いて、寸法を測る。" /></h2>
                    <Text items={[
                        'いつも通っている明治大学中野キャンパス 3 階を、できるだけ実際の空間に忠実にデジタル化しました。歩幅を基準に各所の寸法を測り、空間全体の広さをおおよそ再現しています。',
                        'テクスチャには現地で撮った写真を貼り、柱や什器など写真だけでは表せない部分はモデリングで補いました。遠くから見たときだけ成り立つ「張りぼて」ではなく、近くで見ても本物らしく感じられることを目指しています。',
                    ]} />
                </div>
            </section>

            <section className="rooms">
                <Photo pic={{ src: `${f}meiji-3d-01.png`, alt: '明治大学中野キャンパス 3 階の 3D モデル', w: 1680, h: 900 }} />
                <Photo pic={{ src: `${f}meiji-3d-02.png`, alt: '3D モデル化した 3 階の空間', w: 1680, h: 900 }} />
                <Photo pic={{ src: `${f}meiji-3d-04.png`, alt: 'モデリングで再現した什器まわり', w: 1680, h: 900 }} />
                <Photo pic={{ src: `${f}meiji-3d-05.png`, alt: '3 階フロアのデジタルツイン', w: 1680, h: 900 }} />
            </section>

            <section className="film">
                <Yt id="NfEQQwtwIPQ" title="Meiji Univ 3F の動画" />
                <List items={t.flow} />
            </section>

            <section className="plan">
                <Art src={`${f}plan.webp`} alt="真上から見た校舎の階を人が歩き、後ろに靴跡が続く" />
                <div className="plan__copy"><h2>作りの要点</h2><List items={t.points} /></div>
            </section>

            <section className="route wk-recolor"><WorkFigure name="meiji-3d-route" caption="作ったモデルは眺めるだけでなく、ほかの用途にも使っています。" /></section>

            <section className="vr">
                <div className="vr__copy">
                    <h2>未来の姿を VR で議論する</h2>
                    <p>デジタル化した空間を VR に持ち込み、この場所が将来どうあるべきかを議論する場にしました。歩測をもとに再現した空間の中で、配置や見え方を確認しながら将来の姿を検討できます。</p>
                </div>
                <Photo pic={{ src: `${f}use-vr-01.png`, alt: 'VR 空間で 3 階のモデルを使った議論', w: 1377, h: 690 }} />
                <Photo pic={{ src: `${f}use-vr-02.png`, alt: 'VR で未来の空間を検討する様子', w: 1366, h: 748 }} />
                <Photo pic={{ src: `${f}use-vr-03.png`, alt: 'VR 空間内から見たフロア', w: 1369, h: 741 }} />
                <Photo pic={{ src: `${f}use-vr-04.png`, alt: 'VR での空間体験', w: 1375, h: 748 }} />
            </section>

            <section className="shader">
                <div>
                    <h2>シェーダーグラフで遊ぶ</h2>
                    <p>シェーダーグラフを使い、空間の見え方そのものを変える表現も試しています。</p>
                    <Stack items={t.stack} />
                </div>
                <Yt id="fjkS9zoACuA" title="シェーダーグラフで見え方を変えた動画" />
                <Photo pic={{ src: `${f}use-shader-01.png`, alt: 'シェーダーグラフで表現を変えた 3 階', w: 1380, h: 820 }} />
            </section>
        </Shell>
    );
}
