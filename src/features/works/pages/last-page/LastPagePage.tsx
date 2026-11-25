import Image from 'next/image';
import { Klee_One } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Clip, Hero, List, Ph, Shell, Stack, Text } from '../../parts';
import './style.css';

// 紙面を日記帳の頁として読む。本文は罫線に乗り、言葉は縦に並ぶ
const font = Klee_One({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-lp', display: 'swap', preload: false });
const t = workTech['last-page'];
const f = '/images/works/last-page/';

export default function LastPagePage() {
    return (
        <Shell id="last-page" className={`p-last-page ${font.variable}`}>
            <Hero real src={`${f}closed.webp`} alt="夕方の机に置かれた、布張りの古い日記帳と鉛筆">
                <h1><Image src={`${f}logo.webp`} alt="最後のページ" width={1100} height={662} sizes="(max-width: 900px) 90vw, 46vw" priority /></h1>
                <p className="say"><Ph text="古い日記帳の頁を跳んで渡り、ひとりの一生を読む。" /></p>
                <p>Unity で作った約 7 分のゲーム</p>
                <p>2026.11 –（制作中）　個人制作。実装には AI エージェントを活用。</p>
            </Hero>

            <section className="crayon">
                <Art src={`${f}crayon.webp`} alt="日記の行が坂道や電線になった町を、おさげの女の子と子犬が歩くクレヨンの絵" />
                <div className="crayon__copy">
                    <h2><Ph text="日記の行が、足場になる。" /></h2>
                    <Text items={['机の上の古い日記帳が舞台です。1960 年から 2045 年まで、ひなみという女性の一生の日記を読みます。', '動かすのは、五歳のひなみがクレヨンで描いた自画像です。横書きの行に乗り、縦書きの列を登って、頁の上を渡ります。']} />
                </div>
            </section>

            <section className="trailer">
                <figure className="wk-video">
                    <video src={`${f}trailer.mp4`} poster={`${f}key-visual.webp`} title="最後のページ 予告動画" aria-label="最後のページ 予告動画" controls playsInline preload="none" />
                    <figcaption>予告動画（1 分 41 秒）。音が出ます。</figcaption>
                </figure>
            </section>

            <section className="diary">
                <h2>遊び方</h2>
                <List items={t.flow} />
            </section>

            <section className="scenes">
                <Clip className="s1" src={`${f}lp_open`} label="日記帳の表紙が開き、最初の頁の絵が小さくなって動き出す場面" />
                <Clip className="s2" src={`${f}lp_walk`} label="クレヨンの女の子が頁を歩き、日記の行へ跳び乗る場面" />
                <Clip className="s3" src={`${f}lp_mugi`} label="頁の絵の中で、女の子のそばに子犬のむぎが描かれる場面" />
                <Clip className="s4" src={`${f}lp_dream`} label="鉛筆で描いた夢の頁で、ひなみがむぎと遊ぶ場面" />
                <Art real className="s5" sizes="60vw" src={`${f}lines.webp`} alt="「一九六五年 五月七日」の行の上に、クレヨンで描いた女の子が立っている頁" />
                <Art real className="s6" sizes="60vw" src={`${f}photo.webp`} alt="縁側の写真に撮った人の影が写る頁。横に「私がとった。」と書いてある" />
            </section>

            <section className="ending">
                <Art real src={`${f}ending.webp`} alt="開いた日記帳の見開きいっぱいに、家族が食卓を囲む絵が描かれている" />
                <div className="ending__copy">
                    <h2><Ph text="最後に、名前を呼ばれる。" /></h2>
                    <p>結末では、母に名前を呼ばれます。遊ぶ人が返事をします。</p>
                </div>
            </section>

            <section className="diary diary--end">
                <h2>作りの要点</h2>
                <List items={[...t.points, { title: '作り方', body: `${t.summary}実装には AI エージェントを活用しています。` }]} />
                <div className="colophon">
                    <Stack items={t.stack} />
                    <p className="wk-note">このページのゲームの画面は、すべて制作中の版から撮ったものです。</p>
                </div>
            </section>
        </Shell>
    );
}
