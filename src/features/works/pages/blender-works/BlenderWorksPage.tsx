import Image from 'next/image';
import { Rubik_Mono_One, Zen_Kaku_Gothic_New } from 'next/font/google';
import { workTech } from '@/content/works-tech';
import { Art, Photo, Ph, Shell, Stack } from '../../parts';
import './style.css';

// 実物の色で面を塗り分けた見本帖。1 作品が 1 つの面
const latin = Rubik_Mono_One({ weight: '400', subsets: ['latin'], variable: '--font-bw', display: 'swap', preload: false });
const jp = Zen_Kaku_Gothic_New({ weight: ['500', '900'], subsets: ['latin'], variable: '--font-bw-j', display: 'swap', preload: false });
const t = workTech['blender-works'];
const f = '/images/works/blender-works/';
const faces: [string, string][] = [['01', '通常'], ['03', 'あっかんべー'], ['04', 'じと目'], ['05', '目とじ'], ['02', 'アイコン']];

export default function BlenderWorksPage() {
    return (
        <Shell id="blender-works" className={`p-blender ${latin.variable} ${jp.variable}`}>
            <header className="cover">
                {faces.map(([n, face], i) => <div key={n} className={`face f${i}`}><Image src={`${f}character-${n}.jpg`} alt={`キャラクターモデル（${face}）`} width={1080} height={1080} sizes="(max-width: 900px) 60vw, 40vw" priority={i < 3} /></div>)}
                <h1>Blender<br />Works</h1>
                <p className="say"><Ph text="モデリング、ジオメトリノード、VFX を試した小作品集。" /></p>
            </header>
            <section className="chara">
                <h2>好きなキャラクターの<span className="wk-ph">モデリング</span></h2>
                <p>好きなキャラクターをモデリングし、表情を何種類か作り分けました。</p>
            </section>
            <section className="robot">
                <Art real src={`${f}robot-game-01.png`} alt="ロボット製造ゲームのキービジュアル" />
                <div><h2>ロボット製造ゲームの<span className="wk-ph">キービジュアル</span></h2><p>ロボットを製造するゲームのために制作したキービジュアルです。</p></div>
            </section>
            <section className="subway">
                <Art real src={`${f}subway-corridor.png`} sizes="60vw" alt="地下鉄の通路の 3D モデル。壁に 7 番出口の案内がある" />
                <div className="subway__copy"><h2>地下鉄の通路</h2><p>「8番出口」のような、どこか不穏で見覚えのある地下鉄の通路を作りました。</p></div>
                <Art real src={`${f}subway-end.png`} sizes="40vw" alt="地下鉄の通路の行き止まりの 3D モデル" />
            </section>
            <section className="dino">
                <Art real src={`${f}geo-dino-01.png`} alt="恐竜と文字が切り替わるジオメトリノード" />
                <div><h2>ジオメトリノード工作</h2><p>ジオメトリノードを使った実験です。恐竜と文字が切り替わるアニメーションや、動く壁にメモ帳が張り付く表現を作りました。</p></div>
            </section>
            <section className="memo">
                <Photo pic={{ src: `${f}geo-memo-02.png`, alt: 'うごくメモ帳を貼り付けた壁（別アングル）', w: 795, h: 802 }} />
                <Photo pic={{ src: `${f}geo-memo-01.png`, alt: 'うごくメモ帳を貼り付けた壁', w: 798, h: 441 }} />
            </section>
            <section className="vfx">
                <Art real src={`${f}vfx-02.png`} sizes="60vw" alt="VFX の実験（別カット）" />
                <div className="vfx__copy">
                    <h2>VFX工作</h2>
                    <p>Blenderでエフェクトの表現を試しました。</p>
                    <Stack items={t.stack} />
                </div>
                <Art real src={`${f}vfx-01.png`} sizes="50vw" alt="VFX の実験" />
            </section>
        </Shell>
    );
}
