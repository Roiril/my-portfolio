/* eslint-disable @next/next/no-img-element -- 寸法と圧縮を済ませた絵を、そのまま切り抜いて重ねるため */
import Link from 'next/link';
import FrontMotion from './FrontMotion';
import { frontFonts } from './fonts';
import './front.css';

// 開いたあとに名前の書体が差し替わると、最後の画が跳ねる。名前の書体が来るまで線の画で待つ。
// 待つのは 1.2 秒まで。そこで来なければ開く
const HOLD_DOOR_FOR_FONTS = `try{var r=document.documentElement,go=function(){delete r.dataset.doorWait};r.dataset.doorWait='1';Promise.race([Promise.all([].map.call(document.querySelectorAll('.door-face .name'),function(e){var c=getComputedStyle(e);return document.fonts.load(c.fontWeight+' 1em '+c.fontFamily,e.textContent)})),new Promise(function(f){setTimeout(f,1200)})]).then(go,go)}catch(e){delete document.documentElement.dataset.doorWait}`;

// トップページ。面ごとに型を変え、中央の線と赤 1 色で揃える。
// 動きは FrontMotion が後から足す。JS が無くても全文が読める
export default function FrontPage() {
  return (
    <div className={`front ${frontFonts}`} id="top">
      <a className="front-skip" href="#front-main">本文へ移動</a>
    <header className="chrome" id="chrome">
      <a className="mini" href="#top" aria-label="ページの先頭へ"><span className="a">白石</span><span className="b">大晴</span></a>
      <nav aria-label="ページ内">
        <a href="#research">研究</a><a href="#mawarimi">作品</a><a href="#profile">プロフィール</a><Link className="wide-only" href="/resume">経歴</Link>
      </nav>
    </header>

    <main id="front-main">

    <section className="door-face" data-l="ink" data-r="light" data-face="door" aria-label="白石大晴">
      <div className="stage">
        <div className="side lab">
          <p className="aff">明治大学大学院 先端数理科学研究科 修士1年<br />2028年3月修了見込み</p>
          <div className="head l"><h1 style={{ display: 'contents' }} aria-label="白石大晴"><span className="name">白石</span></h1></div>
          <div className="block l">
            <p className="axis">HCI 研究</p>
            <p className="cap"><b>Play with a Hand</b> <span>修士研究<br />手だけのエージェントと遊ぶ</span></p>
            <a className="door" href="#research"><img className="shot" src="/images/front/robot.webp" alt="卓上の盤を挟み、人とロボットの手が向き合う" width="960" height="540" fetchPriority="high" /></a>
          </div>
        </div>
        <div className="side stu">
          <div className="head r"><span className="name">大晴</span></div>
          <div className="block r">
            <p className="axis">VR 制作</p>
            <p className="cap"><b>廻リ視</b> <em>IVRC2026 総合優勝／DCEXPO賞</em><span className="desc">監視カメラに映る自分を見ながら現実空間を歩く VR 体験。<br />チーム制作。企画・監督・ソフトウェア開発を担当。</span></p>
            <a className="door" href="#mawarimi"><img className="shot" src="/images/works/mawarimi/key-visual.webp" alt="廻リ視のキービジュアル" width="1672" height="941" fetchPriority="high" /></a>
            <p className="aff-m">明治大学大学院 先端数理科学研究科 修士1年<br />2028年3月修了見込み</p>
          </div>
        </div>
      </div>
      <i className="door-rule" aria-hidden="true" />
    </section>
    <script dangerouslySetInnerHTML={{ __html: HOLD_DOOR_FOR_FONTS }} />

    <section className="hand-face" id="research" data-l="ink" data-r="ink" data-face="lab" aria-labelledby="hand-title">
      <div className="hand-pic">
        <span className="kanji" aria-hidden="true">手</span>
        <img className="layer" src="/images/front/board.webp" alt="" aria-hidden="true" width="1672" height="941" loading="lazy" decoding="async" />
        <img className="layer" data-hand src="/images/front/hand.webp" alt="黒いロボットの手が白い駒をつまみ、盤の上へ運ぶ" width="1672" height="941" loading="lazy" decoding="async" />
      </div>
      <p className="hand-hint"><span className="on-mouse">盤のマスに触れると、手が駒を運びます。<br />押すと、うなずいて合図します。</span><span className="on-touch">盤のマスを押すと、手が駒を運んで合図します。</span></p>
      <div className="hand-copy">
        <p className="kick">修士研究　2026 –　単独</p>
        <h2 id="hand-title">Play with a Hand</h2>
        <p className="say">話さない手と、ボードゲームを遊ぶ。</p>
        <p className="txt">手だけを身体とするエージェントと人が、VR空間で卓上のボードゲームを遊ぶ際のやり取りを研究しています。エージェントは発話せず、駒の操作と相手への合図を同じ手で行います。人がその動きをどう解釈し、遊び相手としてどう受け止めるかを調べています。</p>
      </div>
      <div className="hand-now">
        <p><strong>現在は4名での予備調査を終えた段階です。</strong></p>
        <p>結果を踏まえてインタラクション設計の要件を定義することを目指しています。今後はロボットハンドを用いた実世界での実証も予定しています。</p>
        <p className="note">図は生成した画像によるイメージです。調査は VR 空間で行っています。</p>
      </div>
    </section>

    <section className="mawarimi" id="mawarimi" data-l="light" data-r="light" data-face="stu" aria-labelledby="mw-title">
      <img className="edge edge-ink" src="/images/front/edge-ink.webp" alt="" aria-hidden="true" width="2880" height="460" loading="lazy" decoding="async" />
      <div className="world">
        <img className="bg" src="/images/front/room.webp" alt="幕の下りた暗い部屋の隅に人形が並ぶ" width="1672" height="941" loading="lazy" decoding="async" />
        <div className="world-dim" aria-hidden="true"></div>
        <img className="world-title" src="/images/front/mawarimi-title.webp" alt="廻リ視" width="1210" height="531" loading="lazy" decoding="async" />
        <p className="world-tate">廻るたびに狂う世界、<br />あなたは生きて戻れるか。</p>
        <p className="world-genre">実世界 × 固定視点ホラー</p>
      </div>
      <div className="m-facts">
        <div className="m-l">
          <p className="award">IVRC2026<br />総合優勝<br />DCEXPO賞</p>
          <ul>
            <li>第31回日本VR学会大会で体験展示</li>
            <li>2026年11月18〜20日 DCEXPO2026 で招待展示予定</li>
            <li>2026年11月19日 Inter BEE で登壇予定</li>
          </ul>
        </div>
        <div className="m-r">
          <h2 id="mw-title">監視カメラに映る自分を見ながら、現実空間を歩く。</h2>
          <p className="txt">HMDと複数のカメラで固定視点を現実空間に再構成した固定視点のホラー体験です。体験者は怪異調査員として呪われた壁を調査します。</p>
          <p className="role">チーム制作。企画・監督・ソフトウェア開発を担当。</p>
          <p className="txt">要件定義、体験設計、動作検証も担当しています。実装にはAIエージェントを活用し、設計の把握とテストを通して品質を確かめています。</p>
          <p className="links"><Link className="link" href="/works/mawarimi">詳しく見る</Link><a className="link" href="https://mawarimi.vercel.app/">公式サイト</a><a className="link" href="https://www.conference.vrsj.org/ac2026/program/doc/IVRC-15.pdf">日本VR学会の論文</a><a className="link" href="https://youtu.be/uWf51qRwbhA">予告動画</a></p>
        </div>
      </div>
      <div className="cams">
        <figure className="cam c1"><img src="/images/front/cam1.webp" alt="カメラ 1 の映像。幕と手すり" width="960" height="720" loading="lazy" decoding="async" /><figcaption>カメラ 1</figcaption></figure>
        <figure className="cam c2"><img src="/images/front/cam2.webp" alt="カメラ 2 の映像。床の低い位置から見た壁" width="960" height="720" loading="lazy" decoding="async" /><figcaption>カメラ 2</figcaption></figure>
        <figure className="cam c3"><img src="/images/front/cam3.webp" alt="カメラ 3 の映像。幕と壁を別の位置から" width="960" height="720" loading="lazy" decoding="async" /><figcaption>カメラ 3</figcaption></figure>
        <p className="credits">
          <span>企画/監督<i>白石</i></span>
          <span>企画書/動画制作<i>白石</i></span>
          <span>シナリオ/演出<i>白石</i></span>
          <span>サウンドデザイン<i>白石</i></span>
          <span>タイトル/ロゴデザイン<i>白石</i></span>
          <span>ソフトウェア開発<i>白石</i></span>
          <span>ラジコン日本人形制作<i>五島</i></span>
          <span>壁床制作<i>チーム</i></span>
          <span>テスト/フィードバック<i>チーム</i></span>
          <span>設営/展示<i>チーム</i></span>
        </p>
        <p className="cams-note">会場の実写を、体験中の明るさに揃えて書き出した画です。</p>
      </div>
    </section>

    <section className="whiteout" id="whiteout" data-l="light" data-r="light" data-face="stu" aria-labelledby="wo-title">
      <div className="wo-top">
        <img className="wo-splash" src="/images/front/splash.webp" alt="白いインクの筆跡。先端に赤いしずく" width="2400" height="2542" loading="lazy" decoding="async" />
        <canvas className="wo-canvas" id="ink" aria-hidden="true"></canvas>
        <img className="wo-edge" src="/images/front/edge-white.webp" alt="" aria-hidden="true" width="2880" height="460" loading="lazy" decoding="async" />
        <div className="wo-copy">
          <h2 className="wo-title" id="wo-title">WHITEOUT</h2>
          <p className="say">白いインクで、9 つの面を塗りつぶす。</p>
          <p className="txt">能力を組み合わせて速いクリアを目指すローグライトゲームです。unity1week のお題「しろ」に向けて制作しました。2026.08</p>
          <p className="links"><Link className="link" href="/works/whiteout">詳しく見る</Link><a className="link" href="https://unityroom.com/games/whiteout-rogue">unityroom で遊ぶ</a></p>
          <p className="wo-hint"><span className="on-mouse">黒いところをなぞると、このページも塗れます。</span><span className="on-touch">黒いところを押すと、インクが飛びます。</span><span className="wo-meter">白くした面積 <b id="wo-pct">0.0</b>%</span></p>
        </div>
      </div>
      <div className="wo-low" data-l="ink">
        <figure className="wo-frames">
          <button className="wo-clip" type="button" data-clip="/images/front/wo_net.mp4" aria-label="線の先に玉が付いた放射が重なり、網になる場面を再生"><img src="/images/front/wo_net.webp" alt="線の先に玉が付いた放射が重なり、網になる場面" width="800" height="450" loading="lazy" decoding="async" /></button>
          <button className="wo-clip" type="button" data-clip="/images/front/wo_tentacle.mp4" aria-label="白い線が曲がりながら枝分かれして広がる場面を再生"><img src="/images/front/wo_tentacle.webp" alt="白い線が曲がりながら枝分かれして広がる場面" width="800" height="450" loading="lazy" decoding="async" /></button>
          <button className="wo-clip" type="button" data-clip="/images/front/wo_donut.mp4" aria-label="花のようなふちの白い輪を赤いしずくが塗る場面を再生"><img src="/images/front/wo_donut.webp" alt="花のようなふちの白い輪を赤いしずくが塗る場面" width="800" height="450" loading="lazy" decoding="async" /></button>
          <button className="wo-clip" type="button" data-clip="/images/front/wo_geo.mp4" aria-label="放射の線が組み合わさり、幾何学模様になる場面を再生"><img src="/images/front/wo_geo.webp" alt="放射の線が組み合わさり、幾何学模様になる場面" width="800" height="450" loading="lazy" decoding="async" /></button>
          <button className="wo-clip" type="button" data-clip="/images/front/wo_star.mp4" aria-label="波打つ線の先に星の形が開く場面を再生"><img src="/images/front/wo_star.webp" alt="波打つ線の先に星の形が開く場面" width="800" height="450" loading="lazy" decoding="async" /></button>
          <button className="wo-clip" type="button" data-clip="/images/front/wo_radial.mp4" aria-label="放射状の太い線で黒い地が白くなる場面を再生"><img src="/images/front/wo_radial.webp" alt="放射状の太い線で黒い地が白くなる場面" width="800" height="450" loading="lazy" decoding="async" /></button>
          <figcaption>X に投稿した PV から。<span className="on-mouse">触れると初めから描き直します。</span><span className="on-touch">押すと初めから描き直します。</span></figcaption>
        </figure>
        <div className="figs">
          <p className="fig f1"><b>61,774<small>回</small></b><span>X で PV が表示された回数</span></p>
          <p className="fig f2"><b>15,047<small>回</small></b><span>unityroom での閲覧</span></p>
          <p className="fig f3"><b>4.434<small>/ 5</small></b><span>unity1week の楽しさの評価。189 件。評価の高い作品に選出</span></p>
          <p className="kick">2026 年 10 月 24 日時点。</p>
        </div>
      </div>
    </section>

    <section className="sheets-face" id="sheets" data-l="ink" data-r="ink" data-face="lab" aria-labelledby="sheets-title">
      <div className="sheets">
        <div className="sheets-col">
          <h2 id="sheets-title">ほかの研究と業務</h2>
          <Link className="sheet" href="/works/intentlayer">
            <div className="pg pg-l"><span className="vert">IntentLayer</span><img src="/images/front/intent.webp" alt="MRデバイスで人の意図を読み取る様子の図" width="654" height="400" loading="lazy" decoding="async" /></div>
            <div className="pg pg-r">
              <p className="kick">2025　卒業研究</p>
              <p className="q">「いま話しかけてよいか」を、空間に置く。</p>
              <p className="b">対面で話しかけてよいかを判断しやすくするMRシステムです。HMD版とWeb版を実装し、1週間運用して半構造化インタビューで評価しました。</p>
              <p className="role">単独（着想・実装・実験・分析・執筆）<br /><u>詳しく見る</u></p>
            </div>
          </Link>
          <Link className="sheet" href="/works/metaquest-devs">
            <div className="pg pg-l"><span className="vert">MetaQuest Devs</span><img className="full" src="/images/front/devs.webp" alt="試作の画面を集めた図" width="900" height="600" loading="lazy" decoding="async" /></div>
            <div className="pg pg-r">
              <p className="kick">卒業研究のための試作集</p>
              <p className="q">現実の空間に情報を重ねる表現を試す。</p>
              <p className="b">Meta Quest と Unity で作りました。通路で人とすれ違う場面などを試しています。</p>
              <p className="role">Meta Quest　Unity<br /><u>詳しく見る</u></p>
            </div>
          </Link>
        </div>
        <div className="sheets-col r">
          <Link className="sheet" href="/works/ai-business-tools">
            <div className="pg pg-l"><span className="vert ja">AI業務ツール</span><img className="full" src="/images/front/tools.webp" alt="見積書の下書きと社内マニュアルが机に並ぶイメージ" width="1100" height="733" loading="lazy" decoding="async" /></div>
            <div className="pg pg-r">
              <p className="kick">2025.11 –　長期インターン</p>
              <p className="q">下書きは AI に、確かめるのは人が。</p>
              <p className="b">商談内容から見積書の下書きを作る機能と、社内マニュアルを検索して回答するRAGチャットです。回答には根拠の箇所を添え、人が確認してから使う運用にしています。AIを活用して実装し、設計の把握とテスト、動作検証で品質を確かめています。</p>
              <p className="role">要件定義〜実装〜運用<br />写真は生成した画像によるイメージです。<br /><u>詳しく見る</u></p>
            </div>
          </Link>
          <Link className="sheet book" href="/works/last-page">
            <div className="pg pg-l">
              <span className="vert ja">最後のページ</span>
              <span className="leaf">
                <img className="full" src="/images/works/last-page/lp_open.webp" alt="夕方の机の上で、布張りの古い日記帳が閉じている" width="960" height="540" loading="lazy" decoding="async" />
                <video className="leaf-clip" data-src="/images/works/last-page/lp_open.mp4" muted playsInline preload="none" aria-hidden="true" />
              </span>
            </div>
            <div className="pg pg-r">
              <p className="kick">2026.11 –　ゲーム（制作中）</p>
              <p className="q">日記の行を足場に、ひとりの一生を読む。</p>
              <p className="b">机の上の古い日記帳で、1960年から2045年までのひなみの日記を読む約7分のゲームです。動かすのは、五歳のひなみがクレヨンで描いた自画像です。頁で拾ったひとことを持って、次の頁へめくります。</p>
              <p className="role">Unity　個人制作<br />実装には AI エージェントを活用。<br />頁の絵と声は生成 AI で作っています。<br /><u>詳しく見る</u></p>
            </div>
          </Link>
        </div>
      </div>
    </section>

    <section className="apps" id="apps" data-l="ink" data-r="light" data-face="apps" aria-label="アプリ 2 本">
      <div className="app-part a">
        <div className="app-copy cs">
          <h2>couple-sync</h2>
          <p className="say">ふたりの毎日を、ひとつの部屋に。</p>
          <p className="txt">離れて暮らすふたりのために開発した共有アプリです。予定や日々の記録を猫のいる部屋から開けます。</p>
          <p className="kick">2026.03 –　個人制作。企画・設計・検証を担当。実装には AI エージェントを活用。</p>
          <p className="links"><Link className="link" href="/works/couple-sync">詳しく見る</Link><a className="link" href="/demos/couple-sync/index.html">アプリのデモを見る</a></p>
        </div>
        <div className="shelf">
          <img className="phone p1" src="/images/front/couple-room.webp" alt="猫のいる部屋の画面" width="560" height="1211" loading="lazy" decoding="async" />
          <img className="phone p2" src="/images/front/couple-gacha.webp" alt="家具を集めるガチャの画面" width="390" height="844" loading="lazy" decoding="async" />
          <span className="kitten" aria-hidden="true"><img src="/images/front/cat-still.webp" alt="" width="379" height="394" loading="lazy" decoding="async" /><span className="kitten-frames" /></span>
        </div>
      </div>
      <div className="app-part b">
        <div className="shelf">
          <img className="phone p3" src="/images/front/cogni-home.webp" alt="cogni-storage のホーム画面" width="560" height="1211" loading="lazy" decoding="async" />
          <img className="phone p4" src="/images/front/cogni-ideas.webp" alt="思いつきをカードで育てる画面" width="560" height="1211" loading="lazy" decoding="async" />
        </div>
        <div className="app-copy cg">
          <h2>cogni-storage</h2>
          <p className="say">読む・考える・書くを、一本の流れに。</p>
          <p className="txt">研究のアイデア、論文、文献をまとめて管理する自分用の研究ログアプリです。オフラインでも使え、端末間で同期します。</p>
          <p className="kick">2026.03 –　個人制作。企画・設計・検証を担当。実装には AI エージェントを活用。</p>
          <p className="links"><Link className="link" href="/works/cogni-storage">詳しく見る</Link><a className="link" href="/demos/cogni-storage/index.html">アプリのデモを見る</a></p>
        </div>
      </div>
    </section>

    <section className="small" id="small" data-l="ink" data-r="ink" data-face="door" aria-labelledby="small-title">
      <h2 id="small-title">小さな作品</h2>
      <div className="grid">
        <Link className="item" href="/works/blender-works"><img src="/images/front/s-blender.webp" alt="不穏な地下鉄の通路の3Dモデル" width="720" height="699" loading="lazy" decoding="async" /><h3>Blender Works</h3><p>キャラクターのモデリング、ジオメトリノード、VFXを試した小作品集です。</p></Link>
        <Link className="item" href="/works/meiji-3d"><img src="/images/front/s-meiji.webp" alt="写真テクスチャを貼り込んだ校舎の内観" width="720" height="385" loading="lazy" decoding="async" /><h3>Meiji Univ 3F</h3><p>明治大学中野キャンパス3Fを歩幅で測り、Blenderで再現しました。</p></Link>
        <Link className="item" href="/works/uniqlo-future"><img src="/images/front/s-uniqlo.webp" alt="架空の服自販機の動画の一場面" width="720" height="396" loading="lazy" decoding="async" /><h3>UNIQLO: Imaginary Service</h3><p>架空サービス「服自販機」を紹介する動画です。BlenderとVFXで制作しました。</p></Link>
        <Link className="item" href="/works/aquarium"><img src="/images/front/s-aqua.webp" alt="コードで描いた魚の群れ" width="411" height="386" loading="lazy" decoding="async" /><h3>Aquarium in Processing</h3><p>コードで描いた魚が、3つの単純な決まりだけで群れになって泳ぎます。</p></Link>
        <Link className="item" href="/works/retroTV-portfolio"><img src="/images/front/s-retro.webp" alt="ブラウン管にポートフォリオを映した画面" width="720" height="485" loading="lazy" decoding="async" /><h3>Portfolio: Retro TV version</h3><p>ブラウン管の画面にポートフォリオを映すWeb作品です。つまみでチャンネルを変えられます。</p></Link>
        <Link className="item" href="/works/cube-diary"><img src="/images/front/s-cube.webp" alt="暗い空間に並ぶ写真のキューブ" width="720" height="534" loading="lazy" decoding="async" /><h3>CubeDiary</h3><p>写真を6面に貼ったキューブを、暗い空間に並べていく日記アプリです。</p></Link>
        <Link className="item" href="/works/ai-music-video"><img src="/images/front/s-mv.webp" alt="ミュージックビデオの一場面" width="700" height="500" loading="lazy" decoding="async" /><h3>AI Generated Music Video</h3><p>工程ごとにAIツールを使い分けて作ったミュージックビデオです。</p></Link>
        <Link className="item" href="/works/ai-composition"><img src="/images/front/s-compo.webp" alt="波形と鍵盤の挿絵" width="720" height="480" loading="lazy" decoding="async" /><h3>AI-Augmented Composition</h3><p>Studio Oneで以前作った自分の曲を、Suno AIで広げた作品です。</p></Link>
      </div>
    </section>

    <section className="closing" id="profile" data-l="ink" data-r="light" data-face="door" aria-label="プロフィールと連絡先">
      <div className="cl">
        <h2>白石</h2>
        <p className="tag">人と人、人とロボット、人とAIのあいだに、<br />誤解のない心地よいやり取りを作ります。</p>
        <p className="bio">明治大学大学院でHCI（人とコンピュータの関わり）を研究しています。企画、制作、調査に取り組み、開発にはAIも活用しています。</p>
        <div className="rows">
          <div className="row"><b>所属</b><span>明治大学大学院 先端数理科学研究科 先端メディアサイエンス専攻 博士前期課程 修士1年。2028年3月修了見込み</span></div>
          <div className="row"><b>研究領域</b><span>HCI / Human-Agent Interaction / XR</span></div>
          <div className="row"><b>制作領域</b><span>VR・MR / Webアプリ / ゲーム / 3DCG</span></div>
          <div className="row"><b>主な技術</b><span>TypeScript・React・Unity（C#）・Python・Blender</span></div>
        </div>
          </div>
      <div className="cr">
        <h2>大晴</h2>
        <p className="tag">採用・インターンのご連絡や、研究・制作についての<br />ご相談はメールでお送りください。</p>
        <a className="mail" href="mailto:rinkyouaoi@gmail.com">rinkyouaoi@gmail.com</a>
        <p className="links sns"><Link className="link" href="/resume">経歴</Link><a className="link" href="https://github.com/Roiril">GitHub</a><a className="link" href="https://x.com/Roil_HCI">X</a><a className="link" href="https://note.com/roils">note</a><a className="link" href="https://www.youtube.com/@roil_hci">YouTube</a></p>
        <p className="ai">Claude Code と Codex を活用して実装し、要件の整理、設計の把握、テストと動作検証を行っています。</p>
      </div>
    </section>

    </main>
      <FrontMotion />
    </div>
  );
}
