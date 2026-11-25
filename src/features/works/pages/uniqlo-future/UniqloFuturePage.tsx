import Image from 'next/image';
import { Dela_Gothic_One, Zen_Kaku_Gothic_New } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Ph, Shell, Stack, Text, Yt } from '../../parts';
import './style.css';

// 紙面が自販機になる。棚に実物の場面を並べ、取り出し口から動画が出る
const font = Dela_Gothic_One({ weight: '400', subsets: ['latin'], variable: '--font-uq', display: 'swap', preload: false });
const body = Zen_Kaku_Gothic_New({ weight: ['500', '900'], subsets: ['latin'], variable: '--font-uq-b', display: 'swap', preload: false });
const t = workTech['uniqlo-future'];

export default function UniqloFuturePage() {
    return (
        <Shell id="uniqlo-future" className={`p-uniqlo ${font.variable} ${body.variable}`}>
            <Hero src="/images/works/uniqlo-future/poster.webp" alt="服が並ぶ自動販売機。しゃがんだ人が取り出し口から服を取り出す">
                <h1><span>服自販機</span></h1>
                <p className="name">UNIQLO: Imaginary Service</p>
                <p className="say">UNIQLO の架空サービス<span className="wk-ph">「服自販機」を、</span><span className="wk-ph">映像で見せる。</span></p>
            </Hero>
            <section className="window">
                <Image src="/images/UniqloCap.png" alt="架空のサービスを紹介する動画の一場面" width={1280} height={704} sizes="100vw" />
            </section>
            <section className="mouth">
                <Art src="/images/works/uniqlo-future/mouth.webp" alt="自動販売機の取り出し口に折り重なった服を、手が引き出す" />
                <div className="mouth__copy">
                    <h2><Ph text="ないものを映像で見せる。" /></h2>
                    <Text items={[t.summary, ...t.points.map((x) => x.body)]} />
                </div>
            </section>
            <section className="slot">
                <Yt id="-q5xsLlaN8M" title="UNIQLO: Imaginary Service" />
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
