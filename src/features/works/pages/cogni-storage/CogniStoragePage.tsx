import { Limelight, Zen_Antique } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, Links, List, Nums, Photo, Ph, Shell, Stack, Text, WorkFigure } from '../../parts';
import './style.css';

// 引き出しのカードから木が育つ。画面は目録のカードとして二重罫で囲む
const latin = Limelight({ weight: '400', subsets: ['latin'], variable: '--font-cg', display: 'swap', preload: false });
const jp = Zen_Antique({ weight: '400', subsets: ['latin'], variable: '--font-cg-j', display: 'swap', preload: false });
const t = workTech['cogni-storage'];
const f = '/images/works/cogni-storage/';
const screens = [
    ['01-home', 'cogni-storage のホーム画面', ''],
    ['02-ideas', 'Ideas の画面', 'Ideas　思いつきをカードで育てる'],
    ['03-themes', 'Themes の画面', 'Themes　研究テーマの管理'],
    ['04-papers', 'Papers の画面', 'Papers　執筆中の論文'],
    ['05-readings', 'Readings の画面', 'Readings　文献の記録'],
];

export default function CogniStoragePage() {
    return (
        <Shell id="cogni-storage" className={`p-cogni ${latin.variable} ${jp.variable}`}>
            <Hero src={`${f}poster.webp`} alt="天井まで続く目録の引き出しから、カードの葉をつけた木が伸びる版画">
                <h1>cogni<br />storage</h1>
                <p className="say"><Ph text="読む・考える・書くを、ひとつのアプリで行う。" /></p>
                <p className="meta">2026.03 –　個人制作。企画・設計・検証を担当。実装には AI エージェントを活用。</p>
                <Links items={[{ label: 'アプリのデモを見る', url: '/demos/cogni-storage/index.html' }]} />
            </Hero>

            <section className="ideas">
                <div className="frame">
                    <h2><Ph text="思いつきをカードで貯めて、育てる。" /></h2>
                    <Text items={[
                        '研究では、思いつき・読んだ文献・書きかけの論文が別々の場所に散らばりがちです。そこで思いつきをカード（Ideas）として貯め、確からしさを書き添えて育てる画面を中心に置きました。',
                        '研究テーマ・執筆中の論文・読んだ文献もここから行き来でき、発表スライドの生成まで同じアプリで扱えます。',
                        'Claude Code と連携し、文献の取り込み・翻訳・整理を半自動で進められます。見た目は黒とクリームを基調にしたレトロな配色でそろえました。',
                    ]} />
                </div>
            </section>

            <section className="drawer">
                {screens.map(([src, alt, caption]) => <Photo key={src} sizes="(max-width: 900px) 46vw, 20vw" pic={{ src: `${f}${src}.png`, alt, w: 780, h: 1688, caption }} />)}
            </section>

            <section className="desk">
                <Art src={`${f}desk.webp`} alt="机に散らばったカードを根がつないでいる版画" />
                <div className="desk__copy">
                    <h2><Ph text="通信が切れても、書き続けられる。" /></h2>
                    <Text items={[
                        '画面は常に端末内のデータから表示し、サーバー（Supabase）とは変わった分だけをやり取りします。つながると別の端末に追いつきます。',
                        '公開デモは実際の画面を使っています。研究資料と記録は架空の見本に置き換え、変更はこの端末内にだけ保存します。',
                    ]} />
                    <Nums items={t.numbers} />
                </div>
            </section>

            <section className="route wk-recolor">
                <WorkFigure name="cogni-storage-route" caption="依頼は Supabase を通して Claude Code に届きます。研究メモは git に残り、ビルドのときにアプリへ入ります。" />
            </section>

            <section className="cards">
                <List items={t.points} />
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
