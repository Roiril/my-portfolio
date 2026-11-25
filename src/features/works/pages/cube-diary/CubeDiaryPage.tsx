import { Jost, Zen_Kaku_Gothic_New } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Links, List, Nums, Ph, Shell, Stack, Text, WorkFigure, Yt } from '../../parts';
import './style.css';

// 本文を立方体の展開図に割り付ける。6 面がそれぞれ 1 つの章になる
const latin = Jost({ weight: ['700'], subsets: ['latin'], variable: '--font-cd', display: 'swap', preload: false });
const jp = Zen_Kaku_Gothic_New({ weight: ['500', '900'], subsets: ['latin'], variable: '--font-cd-j', display: 'swap', preload: false });
const t = workTech['cube-diary'];

export default function CubeDiaryPage() {
    const flow = t.flow ?? [];
    return (
        <Shell id="cube-diary" className={`p-cube ${latin.variable} ${jp.variable}`}>
            <Hero src="/images/works/cube-diary/poster.webp" alt="暮らしの場面を切り抜いた黒い立方体が、糸で吊られて球の形に並ぶ切り絵">
                <h1>Cube<br />Diary</h1>
                <p className="say"><Ph text="写真を貼ったキューブを、暗い空間に並べる日記。" /></p>
                <p>2025.11　個人制作</p>
                <Links items={[{ label: 'サイトを開く', url: 'https://cube-diary.vercel.app/' }]} />
            </Hero>

            <section className="dark">
                <Art real src="/images/CubeDiary.png" alt="暗い空間に球面状に並ぶ写真のキューブ" />
                <Yt tall id="UY0FlFT1WY8" title="CubeDiary の動画" />
            </section>

            <section className="net">
                <div className="n0"><h2><Ph text="1 つのキューブに、写真が 6 枚。" /></h2></div>
                <div className="n1"><h3>{flow[0].title}</h3><p>{flow[0].body}</p></div>
                <div className="n2"><h3>{flow[1].title}</h3><p>{flow[1].body}</p></div>
                <div className="n3"><h3>{flow[2].title}</h3><p>{flow[2].body}</p></div>
                <div className="n4"><h3>{flow[3].title}</h3><p>{flow[3].body}</p></div>
                <div className="n5"><Text items={['写真を 6 面に貼ったキューブを、暗い空間に並べていく日記アプリです。', '画像はブラウザ内で小さくしてから Supabase に保存し、React Three Fiber で描いています。']} /></div>
            </section>

            <section className="fold">
                <Art src="/images/works/cube-diary/fold.webp" alt="立方体の展開図を両手で折り上げる切り絵" />
                <div className="fold__copy"><Nums items={t.numbers} /></div>
            </section>

            <section className="geo"><WorkFigure name="cube-diary-geometry" caption="球面は黄金角で計算しました。螺旋と結び目は並べ方の形を示す図で、作品のデータではありません。" /></section>

            <section className="points">
                <h2>作りの要点</h2>
                <List items={t.points} />
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
