import Image from 'next/image';
import { DotGothic16, Monoton, Kaisei_Decol } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Links, List, Nums, Ph, Photo, Shell, Stack, WorkFigure, Yt } from '../../parts';
import './style.css';

// 居間のテレビの画面に、実物を映す。本文はチャンネル順に並べる
const neon = Monoton({ weight: '400', subsets: ['latin'], variable: '--font-rt', display: 'swap', preload: false });
const head = Kaisei_Decol({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-rt-h', display: 'swap', preload: false });
const dot = DotGothic16({ weight: '400', subsets: ['latin'], variable: '--font-rt-d', display: 'swap', preload: false });
const t = workTech['retroTV-portfolio'];
const f = '/images/works/retroTV-portfolio/';

export default function RetroTVPortfolioPage() {
    return (
        <Shell id="retroTV-portfolio" className={`p-retro ${neon.variable} ${head.variable} ${dot.variable}`}>
            <header className="living">
                <Art src={`${f}poster.webp`} tall={`${f}poster-tall.webp`} alt="壁紙の居間に置かれた木の箱のテレビ" priority />
                <div className="screen"><Image src="/images/retroTV-portfolio.png" alt="暗い部屋のブラウン管にプロフィールが映る画面" width={1212} height={817} sizes="50vw" priority /></div>
            </header>
            <section className="title">
                <h1><span>Portfolio</span><span>Retro TV version</span></h1>
                <div>
                    <p className="say"><Ph text="ブラウン管の画面に、ポートフォリオを映す。" /></p>
                    <p>2025.12　個人制作</p>
                    <Links items={[{ label: 'サイトを開く', url: 'https://my-retro-portfolio-rust.vercel.app/' }]} />
                </div>
            </section>
            <section className="knob">
                <Art src={`${f}knob.webp`} alt="テレビの丸いつまみを回す手" />
                <div className="knob__copy">
                    <h2><Ph text="つまみを回すと、チャンネルが変わる。" /></h2>
                    <p>ブラウン管テレビの画面にポートフォリオを映す Web 作品です。Canvas に描いた画面を three.js の湾曲した画面に貼り、つまみでチャンネルを変えられます。</p>
                    <Nums items={t.numbers} />
                </div>
            </section>
            <section className="night">
                <Yt tall id="ZiNqQiZSbv4" title="Portfolio: Retro TV version の動画" />
                <div><h2>画面ができるまで</h2><List items={t.flow} /></div>
            </section>
            <section className="layer">
                <WorkFigure name="retrotv-layers" caption="上から順に重ねて、1 枚の画面にしています。" />
            </section>
            <section className="back">
                <Photo pic={{ src: `${f}photo.webp`, alt: '暗い部屋の床に置かれた古いブラウン管のテレビ。画面に淡い緑の光', w: 1536, h: 1024, generated: true }} />
                <div><h2>作りの要点</h2><List items={t.points} /><Stack items={t.stack} /></div>
            </section>
        </Shell>
    );
}
