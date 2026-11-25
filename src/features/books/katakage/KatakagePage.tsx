import Image from 'next/image';
import Link from 'next/link';
import { katakage } from '@/content/books';
import { katakageFonts } from './fonts';
import Sukashi from './Sukashi';
import { ZoomPage, ZoomProvider } from './Zoom';
import './katakage.css';

const X_POST = 'https://x.com/Roil_HCI/status/2125212536199139411';
const srcOf = (n: number) => `/images/books/katakage/p${String(n).padStart(2, '0')}.webp`;
const SPREADS = [[2, 3], [4, 5], [6, 7], [8, 9], [10, 11]];

function Sheet({ n, first }: { n: number; first?: boolean }) {
  return (
    <div id={`p${n}`}>
      <ZoomPage n={n}>
        <Image src={srcOf(n)} alt={katakage.pages[n - 1].alt} width={1600} height={2264} sizes="(max-width: 760px) 100vw, 50vw" priority={first} />
      </ZoomPage>
    </div>
  );
}

function XLink() {
  return <a href={X_POST} target="_blank" rel="noopener noreferrer">X の投稿を見る<span aria-hidden="true"> ↗</span><span className="kt-sr">（新しいタブで開きます）</span></a>;
}

// 片影の攻略本。見開きを画面いっぱいに並べ、最後に 11 ページと 12 ページを灯に透かす
export default function KatakagePage() {
  return (
    <ZoomProvider pages={katakage.pages.map((p) => ({ ...p, src: srcOf(p.n) }))}>
      <div className={`kt ${katakageFonts}`}>
        <main>
          <section className="kt-row kt-first">
            <Sheet n={1} first />
            <div className="kt-inside">
              <p className="kt-back"><Link href="/#guides">トップへ戻る</Link></p>
              <div className="kt-title">
                <p className="kt-kind">架空のゲームの攻略本</p>
                <h1><b><ruby>片影<rp>（</rp><rt>かたかげ</rt><rp>）</rp></ruby></b><span>完全攻略本</span></h1>
                <p className="kt-say">{katakage.say}町の地図、影の規則、六つの場所の解き方を12ページに組みました。</p>
              </div>
              <ol className="kt-toc" aria-label="目次">
                {katakage.pages.slice(1).map((p) => (
                  <li key={p.n}><a href={`#p${p.n}`}><b>{p.n}</b><span>{p.title}</span></a></li>
                ))}
              </ol>
              <div className="kt-note">
                <p>{katakage.made}影の図は、灯の位置から計算して描いています。</p>
                <p>ページを押すと、大きく開きます。</p>
                <p><XLink /></p>
              </div>
            </div>
          </section>

          {SPREADS.map(([l, r]) => (
            <section key={l} className="kt-row" aria-label={`${l}ページと${r}ページ`}>
              <Sheet n={l} />
              <Sheet n={r} />
            </section>
          ))}

          <section className="kt-row kt-last" aria-label="12ページと、紙を灯に透かした画">
            <Sheet n={12} />
            <div className="kt-hold">
              <div className="kt-hold__text">
                <h2>紙を灯に透かす</h2>
                <p>11ページの裏が12ページです。ふたつの下の段を重ねると、一枚の画になります。</p>
              </div>
              <Sukashi />
            </div>
          </section>
        </main>
        <footer className="kt-foot"><Link href="/#guides">トップへ戻る</Link><XLink /></footer>
      </div>
    </ZoomProvider>
  );
}
