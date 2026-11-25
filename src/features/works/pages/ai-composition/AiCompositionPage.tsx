import { Kaisei_Opti, Poiret_One } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Hero, Ph, Shell, Stack, WorkFigure, Yt } from '../../parts';
import './style.css';

// 1 本の道が 2 本に分かれる。左が元の曲、右が AI 版
const latin = Poiret_One({ weight: '400', subsets: ['latin'], variable: '--font-ac', display: 'swap', preload: false });
const jp = Kaisei_Opti({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-ac-j', display: 'swap', preload: false });
const t = workTech['ai-composition'];

export default function AiCompositionPage() {
    return (
        <Shell id="ai-composition" className={`p-compo ${latin.variable} ${jp.variable}`}>
            <Hero src="/images/works/ai-composition/poster.webp" alt="鍵盤の道が 2 本に分かれる。左は小さな家へ、右は橋と花とラッパの塔へ続く">
                <h1><span>AI-Augmented</span> <span>Composition</span></h1>
                <p className="say"><Ph text="自分の曲を素材にして、AI で広げる。" /></p>
                <p>個人制作</p>
            </Hero>
            <section className="sides">
                <div className="side a"><h2>Original</h2><Yt tall id="EPZ6CyN0CKQ" title="AI-Augmented Composition の元の曲" caption="Studio One で作った元の曲" /></div>
                <div className="side b"><h2>AI Ver.</h2><Yt tall id="61PpnNePhsk" title="AI-Augmented Composition の AI 版" caption="Suno AI で広げた版" /></div>
            </section>
            <section className="zero">
                <h2><Ph text="ゼロから作らせない。" /></h2>
                <p>Studio One で以前作った自分の曲を、Suno AI で広げた作品です。元の曲と AI 版を聞き比べられます。</p>
            </section>
            <section className="route wk-recolor">
                <WorkFigure name="ai-composition-route" caption="元の曲が 2 本に分かれ、聞き比べられます。" />
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
