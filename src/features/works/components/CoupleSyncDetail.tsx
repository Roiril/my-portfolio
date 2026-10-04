import Image from 'next/image';
import Link from 'next/link';
import ArtIcon from '@/components/ui/ArtIcon';
import { coupleSync as content } from '@/content/couple-sync';
import './couple-sync.css';

const demoUrl = '/demos/couple-sync/index.html';

function DemoLink({ label = 'アプリのデモを見る' }: { label?: string }) {
  return (
    <a className="couple-demo-link" href={demoUrl} target="_blank" rel="noopener noreferrer">
      {label}<ArtIcon name="arrow" size={18} /><span className="couple-sr-only">（新しいタブで開きます）</span>
    </a>
  );
}

function Phone({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return (
    <div className="couple-phone">
      <Image src={src} alt={alt} width={780} height={1688} sizes="(max-width: 600px) 230px, 290px" priority={priority} />
    </div>
  );
}

export default function CoupleSyncDetail() {
  return (
    <main id="couple-content" className="couple-case" tabIndex={-1}>
      <article>
        <header className="couple-hero couple-wrap">
          <Link href="/#works" className="couple-back"><ArtIcon name="arrow" size={16} className="art-icon--back" /> 作品一覧に戻る</Link>
          <div className="couple-hero-grid">
            <div className="couple-hero-copy">
              <p className="couple-eyebrow">個人開発 <span aria-hidden="true">/</span> Web application</p>
              <h1 translate="no">couple-sync</h1>
              <p className="couple-hero-lead">離れて暮らすふたりのために<br />開発した共有アプリです。</p>
              <p className="couple-intro">{content.introduction}</p>
              <DemoLink />
              <p className="couple-demo-note">架空の記録で試せます。<br />変更はこのブラウザ内に保存されます。</p>
            </div>
            <figure className="couple-hero-stage">
              <span className="couple-stage-label">ふたりの部屋</span>
              <Phone src="/images/works/couple-sync/00-room.png" alt="猫と暮らす部屋からカレンダーやノートやガチャを開けるホーム画面" priority />
              <figcaption>部屋の中のものをタップすると<br />それぞれの機能が開きます。</figcaption>
            </figure>
          </div>
          <nav className="couple-chapters" aria-label="このページの内容">
            <a href="#couple-daily"><span>01</span> 日々の共有</a>
            <a href="#couple-play"><span>02</span> 遊びと模様替え</a>
            <a href="#couple-development"><span>03</span> 開発について</a>
          </nav>
        </header>

        <section id="couple-daily" className="couple-daily couple-wrap" aria-labelledby="couple-daily-title">
          <div className="couple-section-heading">
            <p className="couple-eyebrow">01 <span aria-hidden="true">/</span> Everyday</p>
            <h2 id="couple-daily-title">日々の共有</h2>
            <p>予定を合わせることも思い出を残すことも<br className="couple-desktop-break" />ひとつのアプリでできます。</p>
          </div>
          <div className="couple-scenes">
            {content.scenes.map(scene => (
              <section className="couple-scene" key={scene.title}>
                <div className="couple-scene-copy">
                  <p className="couple-small-label">{scene.title}</p>
                  <h3>{scene.heading}</h3>
                  <p>{scene.body}</p>
                </div>
                <figure className="couple-scene-visual">
                  <Phone src={scene.image} alt={scene.alt} />
                  <figcaption>{scene.caption}</figcaption>
                </figure>
              </section>
            ))}
          </div>
          <details className="couple-more-screens">
            <summary>ほかの画面を見る <ArtIcon name="arrow" size={18} className="art-icon--down" /></summary>
            <div className="couple-screen-grid">
              {content.additionalScreens.map(screen => (
                <figure key={screen.title}>
                  <figcaption><h3>{screen.title}</h3><p>{screen.body}</p></figcaption>
                  <Phone src={screen.image} alt={screen.alt} />
                </figure>
              ))}
            </div>
          </details>
        </section>

        <section id="couple-play" className="couple-play" aria-labelledby="couple-play-title">
          <div className="couple-wrap couple-play-grid">
            <div className="couple-play-copy">
              <p className="couple-eyebrow">02 <span aria-hidden="true">/</span> Play together</p>
              <h2 id="couple-play-title">{content.play.heading}</h2>
              {content.play.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              <div className="couple-kitten-note">
                <Image src="/images/works/couple-sync/kitten.png" alt="" width={420} height={466} sizes="68px" />
                <p>予定の共有だけでなく<br />ふたりで楽しめる機能も作りました。</p>
              </div>
            </div>
            <figure className="couple-gacha-visual">
              <Phone src={content.play.image} alt={content.play.alt} />
              <figcaption>{content.play.caption}</figcaption>
            </figure>
          </div>
        </section>

        <section id="couple-development" className="couple-development couple-wrap" aria-labelledby="couple-development-title">
          <div className="couple-section-heading">
            <p className="couple-eyebrow">03 <span aria-hidden="true">/</span> Development</p>
            <h2 id="couple-development-title">開発について</h2>
            <p>通信が不安定なときも使えるようにしました。<br className="couple-desktop-break" />記録の保存と端末間の同期を分けて設計しています。</p>
          </div>
          <div className="couple-engineering">
            {content.engineering.map(item => (
              <section key={item.technology}>
                <p className="couple-technology" translate="no">{item.technology}</p>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </section>
            ))}
          </div>
          <aside className="couple-legacy" aria-labelledby="couple-legacy-title">
            <div>
              <p className="couple-small-label">デザインの更新</p>
              <h3 id="couple-legacy-title">部屋と一覧を切り替えられます。</h3>
              <p>{content.legacy}</p>
            </div>
            <figure>
              <Image src="/images/works/couple-sync/07-legacy.png" alt="切り替えて使える従来の一覧型デザイン" width={780} height={1688} sizes="160px" />
              <figcaption>従来のデザイン</figcaption>
            </figure>
          </aside>
        </section>

        <section className="couple-try couple-wrap" aria-labelledby="couple-try-title">
          <div>
            <p className="couple-eyebrow">Interactive demo</p>
            <h2 id="couple-try-title">実際の画面を操作できます。</h2>
            <p>{content.demo}</p>
          </div>
          <DemoLink label="部屋に入ってみる" />
        </section>
      </article>
    </main>
  );
}
