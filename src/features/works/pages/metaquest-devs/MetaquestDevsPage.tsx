import Link from 'next/link';
import { Rampart_One, M_PLUS_Rounded_1c } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Photo, Ph, Shell, Stack, Text } from '../../parts';
import './style.css';

// 通路ですれ違う場面をコマ割りにする。白い帯がコマの枠を越えて続く
const head = Rampart_One({ weight: '400', subsets: ['latin'], variable: '--font-mq', display: 'swap', preload: false });
const body = M_PLUS_Rounded_1c({ weight: ['500', '900'], subsets: ['latin'], variable: '--font-mq-b', display: 'swap', preload: false });
const t = workTech['metaquest-devs'];

export default function MetaquestDevsPage() {
    return (
        <Shell id="metaquest-devs" className={`p-devs ${head.variable} ${body.variable}`}>
            <Hero src="/images/works/metaquest-devs/poster.webp" tall="/images/works/metaquest-devs/poster-tall.webp" alt="ゴーグルの人の肩越しに見た通路。向こうから来る人の道筋が白い帯で床に伸びる">
                <h1>MetaQuest<br />Devs</h1>
                <p className="say"><Ph text="現実の空間に情報を重ねる表現を試す。" /></p>
                <p>卒業研究のために作った試作集</p>
            </Hero>
            <section className="panels">
                <Photo className="all" sizes="100vw" pic={{ src: '/images/Mr-Devs.png', alt: '通路で人とすれ違う場面など、Meta Quest で試作した場面の一覧', w: 1200, h: 800 }} />
            </section>
            <section className="corner">
                <Art src="/images/works/metaquest-devs/corner.webp" alt="角の両側から歩く 2 人の道筋が、ぶつからないように曲がる" />
                <div className="corner__copy">
                    <h2><Ph text="試作を重ねて、研究の土台を作る。" /></h2>
                    <Text items={[t.summary, ...t.points.map((x) => x.body)]} />
                </div>
            </section>
            <section className="tools">
                <Stack items={t.stack} />
                <p>IntentLayer は、話しかけてよいかの判断材料を相手のそばに表示する研究です。<br /><Link href="/works/intentlayer">IntentLayer のページを見る</Link></p>
            </section>
        </Shell>
    );
}
