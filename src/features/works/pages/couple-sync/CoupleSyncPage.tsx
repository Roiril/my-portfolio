import { Zen_Maru_Gothic } from 'next/font/google';
import { coupleSync as c } from '@/content/couple-sync';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Links, List, Nums, Photo, Ph, Shell, Stack, Text, WorkFigure } from '../../parts';
import './style.css';

// 2 軒の家を猫がつなぐ。画面は家の部屋として左右に分けて置く
const font = Zen_Maru_Gothic({ weight: ['500', '900'], subsets: ['latin'], variable: '--font-cs', display: 'swap', preload: false });
const t = workTech['couple-sync'];
const f = '/images/works/couple-sync/';

const Phone = ({ src, alt, caption, h = 1688, w = 780 }: { src: string; alt: string; caption?: string; w?: number; h?: number }) => (
    <Photo className="phone" sizes="(max-width: 900px) 46vw, 24vw" pic={{ src, alt, w, h, caption }} />
);

export default function CoupleSyncPage() {
    return (
        <Shell id="couple-sync" className={`p-couple ${font.variable}`}>
            <Hero src={`${f}poster.webp`} tall={`${f}poster-tall.webp`} alt="離れて建つ 2 軒の家の屋根に、ぶちの猫が橋のように寝そべっている">
                <h1>couple-sync</h1>
                <p className="say"><Ph text="ふたりの毎日を、ひとつの部屋に。" /></p>
                <p className="meta">2026.03 –　個人制作。<span className="wk-ph">企画・設計・検証を担当。</span><span className="wk-ph">実装には AI エージェントを活用。</span></p>
                <Links items={[{ label: 'アプリのデモを見る', url: '/demos/couple-sync/index.html' }]} />
            </Hero>

            <section className="room">
                <Phone src={`${f}00-room.png`} alt="猫のいる部屋から各機能を開く画面" />
                <div>
                    <h2><Ph text="予定も記録も、猫のいる部屋から。" /></h2>
                    <Text items={[c.lead, c.introduction, c.legacy]} />
                </div>
                <Phone src={`${f}07-legacy.png`} alt="切り替えて使える一覧型の画面" />
            </section>

            <section className="houses">
                {c.scenes.map((s) => (
                    <div key={s.title}>
                        <Phone src={s.image} alt={s.alt} caption={s.caption} />
                        <div><h2>{s.heading}</h2><p>{s.body}</p></div>
                    </div>
                ))}
            </section>

            <section className="play">
                <Art src={`${f}window.webp`} alt="窓辺に座る猫が、川の向こうの家の明かりを見ている" />
                <div className="play__copy">
                    <h2>{c.play.heading}</h2>
                    <Text items={c.play.body} />
                </div>
            </section>

            <section className="shelf">
                <Phone src={c.play.image} alt={c.play.alt} caption={c.play.caption} w={390} h={844} />
                {c.additionalScreens.map((s) => <Phone key={s.title} src={s.image} alt={s.alt} caption={`${s.title}。${s.body}`} />)}
            </section>

            <section className="sync wk-recolor">
                <h2><Ph text="通信が切れても、使い続けられる。" /></h2>
                <p>{t.summary}</p>
                <WorkFigure name="couple-sync-route" caption="点線は、通信が切れている間に変更が待つ場所です。" />
            </section>

            <section className="points">
                <List items={t.points} />
                <div><Nums items={t.numbers} /><p className="wk-note">{c.demo}</p></div>
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
