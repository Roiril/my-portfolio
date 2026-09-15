import Image from 'next/image';

export default function Hero() {
    return (
        <section id="top" className="hero">
            <div className="site-container hero__inner">
                <div className="hero__identity">
                    <p className="hero__eyebrow">
                        HCI Researcher &amp; Interaction Designer ｜ HCI / XR / AI
                    </p>
                    <h1 className="hero__name">
                        <span className="hero__name-ja">白石大晴</span>
                        <span className="hero__name-en">Shiroishi Taisei</span>
                    </h1>
                </div>

                <figure className="hero__profile">
                    <Image
                        src="/images/MyFace.png"
                        alt="白石大晴のプロフィール写真"
                        width={480}
                        height={579}
                        className="hero__portrait"
                        priority
                        sizes="(max-width: 767px) 150px, 240px"
                    />
                    <figcaption className="hero__affiliation">
                        明治大学大学院（HCI専攻・M1）
                        <span>Meiji Univ. / Tokyo</span>
                    </figcaption>
                </figure>

                <div className="hero__statements">
                    <div className="hero__statement">
                        <span className="hero__number" aria-hidden="true">01</span>
                        <p>人と人，人とロボット，人とAIのあいだに，誤解のない心地よいインタラクションを作る．</p>
                    </div>
                    <div className="hero__statement">
                        <span className="hero__number" aria-hidden="true">02</span>
                        <p>新しいエンタメ体験を創造する．</p>
                    </div>
                </div>

                <div className="hero__footer">
                    <p className="hero__method">企画から実装，ユーザ評価まで．</p>
                    <nav className="hero__actions" aria-label="主要ページ">
                    <a className="hero__action hero__action--primary" href="#works">View Works</a>
                    <a className="hero__action" href="/resume">Resume</a>
                    <a className="hero__action" href="#links">Links</a>
                    </nav>
                </div>
            </div>
        </section>
    );
}
