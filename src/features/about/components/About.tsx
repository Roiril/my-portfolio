import Image from 'next/image';
import { aboutData } from '@/content/about';

export default function About() {
    return (
        <section id="about" className="about-section">
            <div className="site-container">
                <p className="section-kicker">02 / ABOUT ME</p>
                <h2 className="about-section__title">About</h2>
                <p className="section-subtitle">わたしについて</p>

                <div className="about-section__grid">
                    <figure className="about-section__profile">
                        <Image
                            src="/images/MyFace.png"
                            alt="白石大晴のプロフィール写真"
                            width={240}
                            height={290}
                            sizes="(max-width: 760px) 112px, 160px"
                        />
                        <figcaption>
                            <span>白石 大晴 / Shiroishi Taisei</span>
                            <span>明治大学大学院 先端数理科学研究科</span>
                        </figcaption>
                    </figure>

                    <div className="about-section__body">
                        <div className="about-section__bio">
                            {aboutData.bio.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                        </div>

                        <dl className="about-section__facts">
                            {aboutData.keyFacts?.map((fact) => (
                                <div className="about-section__fact" key={fact.title}>
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
                    </div>
                </div>
            </div>
        </section>
    );
}
