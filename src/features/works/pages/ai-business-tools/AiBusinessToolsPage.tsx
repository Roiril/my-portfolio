import { BIZ_UDPMincho, BIZ_UDPGothic } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Hero, List, Ph, Shell, Stack, Text, WorkFigure } from '../../parts';
import './style.css';

// 紙面は複写の伝票。最後に朱の丸がつく
const head = BIZ_UDPMincho({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-bt', display: 'swap', preload: false });
const body = BIZ_UDPGothic({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-bt-b', display: 'swap', preload: false });
const t = workTech['ai-business-tools'];
const f = '/images/works/ai-business-tools/';

export default function AiBusinessToolsPage() {
    return (
        <Shell id="ai-business-tools" className={`p-biz ${head.variable} ${body.variable}`}>
            <Hero src={`${f}poster.webp`} tall={`${f}poster-tall.webp`} alt="書類の山で小さな人たちが紙を運び、手前の人が朱の鉛筆で丸をつける">
                <h1>AI業務ツール</h1>
                <div className="lead">
                    <p className="say"><Ph text="商談から見積書の下書きを作り、社内マニュアルから根拠つきで答える。" /></p>
                    <p>見積書の下書きと社内検索チャット<br />2025.11 –（長期インターン）　要件定義〜実装〜運用</p>
                </div>
            </Hero>
            <section className="check">
                <Art src={`${f}check.webp`} alt="朱の鉛筆を持つ手が表の紙に丸をつける" />
                <div className="check__copy">
                    <h2><Ph text="下書きは AI に。最後は人が確かめる。" /></h2>
                    <Text items={[
                        '長期インターンでは、営業担当へのヒアリングをもとに必要な機能を要件定義し、AIを活用して業務ツールを実装しています。品質を確かめるために実装の設計を把握し、テストと動作検証を行っています。',
                        '制作したのは、商談内容から見積書の下書きを作る機能と、社内マニュアルを検索して回答するRAGチャットです。',
                    ]} />
                </div>
            </section>
            <section className="slip">
                <h2>使う流れ</h2>
                <List items={t.flow} />
            </section>
            <section className="route wk-recolor"><WorkFigure name="ai-business-tools-route" caption="2 本の線は「人が確かめる」で合流します。" /></section>
            <section className="slip slip--ink">
                <h2>作りの要点</h2>
                <List items={t.points} />
                <Stack items={t.stack} />
            </section>
        </Shell>
    );
}
