import Image from 'next/image';
import ArtIcon from '@/components/ui/ArtIcon';

export default function Hero() {
    return (
        <section id="top" className="hero">
            <div className="site-container hero__inner">
                <div className="hero__identity">
                    <p className="hero__eyebrow">HCI RESEARCH &amp; INTERACTION DESIGN</p>
                    <h1 className="hero__name">
                        <span className="hero__name-en" lang="en">Taisei<br />Shiroishi<span className="hero__period">.</span></span>
                        <span className="hero__name-ja">白石 大晴</span>
                    </h1>
                    <p className="hero__lead">人と人。人と機械。<br />そのあいだの体験をつくる。</p>
                    <p className="hero__description">HCIの研究と新しいエンタメ体験の制作。<br />企画から実装とユーザ評価まで。</p>
                    <nav className="hero__actions" aria-label="主要ページ">
                        <a className="hero__action hero__action--primary" href="#works">作品を見る<ArtIcon name="arrow" size={18} className="art-icon--down" /></a>
                        <a className="hero__action" href="/resume">Resume<ArtIcon name="arrow" size={16} /></a>
                    </nav>
                </div>
                <figure className="hero__illustration">
                    <Image src="/images/identity/hero.webp" alt="小さな恐竜がノートを開き。ロボットと複合現実の仕組みを研究している線画" width={1200} height={900} priority sizes="(max-width: 760px) 300px, (max-width: 1240px) 44vw, 520px" className="hero__artwork" />
                    <figcaption><span>Observe. Make. Explore.</span><span>Roil’s field notes</span></figcaption>
                </figure>
                <div className="hero__footer">
                    <a href="#about" className="hero__affiliation">
                        <Image src="/images/MyFace.png" alt="白石大晴" width={44} height={44} sizes="44px" className="hero__avatar" />
                        <span>明治大学大学院 · HCI専攻 · M1<span>Meiji University / Tokyo</span></span>
                    </a>
                    <p className="hero__fields">HCI <span>/</span> XR <span>/</span> AI <span>/</span> Web</p>
                </div>
            </div>
        </section>
    );
}
