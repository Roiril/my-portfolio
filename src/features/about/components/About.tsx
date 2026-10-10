import Image from 'next/image';
import Link from 'next/link';
import { aboutData } from '@/content/about';
import GeometryMark from '@/components/ui/GeometryMark';

export default function About() {
    return (
        <section id="about" className="about-section about-editorial" aria-labelledby="about-title" data-scroll-section>
            <div className="site-container">
                <p className="section-kicker">02 / ABOUT</p>
                <div className="about-editorial__heading">
                    <h2 id="about-title" className="about-section__title" data-reveal data-scroll-rule>わたしについて</h2>
                    <GeometryMark />
                </div>

                <div className="about-section__grid">
                    <figure className="about-section__profile" data-reveal="media">
                        <Image
                            src="/images/MyFace.png"
                            alt="白石大晴のプロフィール写真"
                            width={240}
                            height={290}
                            sizes="(max-width: 760px) 140px, 300px"
                        />
                        <figcaption>
                            <span>白石 大晴 / Shiroishi Taisei</span>
                            <span>明治大学大学院 先端数理科学研究科</span>
                        </figcaption>
                    </figure>

                    <div className="about-section__body" data-reveal>
                        <h3 className="about-editorial__statement">人とコンピュータの<br />関わりを研究しています。</h3>
                        <div className="about-section__bio">
                            {aboutData.bio.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>

                        <dl className="about-section__facts">
                            {aboutData.keyFacts?.map((fact) => (
                                <div className="about-section__fact" key={fact.title} data-scroll-rule>
                                    <dt>{fact.title}</dt>
                                    <dd>
                                        {fact.title === '主なツール' ? (
                                            <span className="about-section__tools">
                                                {fact.description.split('・').map((tool) => (
                                                    <span key={tool}>{tool}</span>
                                                ))}
                                            </span>
                                        ) : fact.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        <Link className="round-link about-editorial__resume" href="/resume"><span>経歴と実績を見る</span><span className="round-link__arrow" aria-hidden="true">↗</span></Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
