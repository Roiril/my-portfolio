import { aboutData } from '@/content/about';

export default function About() {
    return (
        <section id="about" className="about-section">
            <div className="site-container">
                <h2 className="about-section__title">About</h2>

                <div className="about-section__grid">
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
        </section>
    );
}
