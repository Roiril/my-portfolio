import { Abril_Fatface, Kaisei_Tokumin } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Ph, Shell, Stack, WorkFigure, Yt } from '../../parts';
import './style.css';

// 1 本の曲を、工程ごとに違う手で刷る。縦の帯を紙面の組みに使う
const latin = Abril_Fatface({ weight: '400', subsets: ['latin'], variable: '--font-mv', display: 'swap', preload: false });
const jp = Kaisei_Tokumin({ weight: ['500', '800'], subsets: ['latin'], variable: '--font-mv-j', display: 'swap', preload: false });
const t = workTech['ai-music-video'];

export default function AiMusicVideoPage() {
    return (
        <Shell id="ai-music-video" className={`p-mv ${latin.variable} ${jp.variable}`}>
            <Hero src="/images/works/ai-music-video/poster.webp" tall="/images/works/ai-music-video/poster-tall.webp" alt="歌う人の横顔が縦の帯に分かれ、線や縞や楽器やフィルムで描かれている">
                <h1>AI Generated<br />Music Video</h1>
                <p className="say"><Ph text="工程ごとに AI を使い分けたミュージックビデオ。" /></p>
                <p>個人制作</p>
            </Hero>
            <section className="main">
                <Yt id="Jgeij_JIZlQ" title="AI Generated Music Video" />
            </section>
            <section className="bands">
                <Art real sizes="50vw" src="/images/Ai-Generated-Mv.png" alt="ミュージックビデオの一場面。ヘッドホンを着けて歌う 2 人" />
                <Yt tall id="x7claprYtdw" title="AI Generated Music Video のショート" />
            </section>
            <section className="desk">
                <Art src="/images/works/ai-music-video/desk.webp" alt="フィルムが縞と鍵盤と音の波形に変わりながら 1 本につながる編集机" />
                <div className="desk__copy">
                    <h2>1 つの AI で<span className="wk-ph">すべてを作らない。</span></h2>
                    <p>曲は Suno AI で作り、編集は Filmora で仕上げました。曲・映像素材・編集の工程ごとに道具を試して組み合わせています。</p>
                    <Stack items={t.stack} />
                </div>
            </section>
            <section className="route"><WorkFigure name="ai-music-video-route" caption="案を出す工程から、曲と映像の素材に分かれ、編集で 1 本になります。" /></section>
        </Shell>
    );
}
