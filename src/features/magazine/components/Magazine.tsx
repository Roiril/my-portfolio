import Image from 'next/image';
import NextLink from 'next/link';
import type { CSSProperties } from 'react';
import { works } from '@/content/works';
import { aboutData } from '@/content/about';
import { features, interview, issue, type FeatureSpread } from '@/content/magazine';
import type { Work, WorkCategory, WorkLink } from '@/features/works/types';
import BackCover from './BackCover';
import '../magazine.css';

const CATEGORY_LABEL: Record<WorkCategory, string> = {
    research: '研究',
    personal: '個人開発',
    internship: '実務',
    creative: '制作',
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

// 作品の行き先。詳細ページがあればそちら、無ければ最初のリンク
function workHref(work: Work): string | undefined {
    return work.detail ? '/works/' + work.id : work.links[0]?.url;
}

function linkLabel(link: WorkLink): string {
    if (link.label) return link.label;
    return link.type === 'launch' ? 'サイトを開く' : link.type === 'paper' ? '論文を読む' : '動画を見る';
}

function SmartLink({ href, className, children, ariaLabel }: { href: string; className?: string; children: React.ReactNode; ariaLabel?: string }) {
    if (isExternal(href) || href.endsWith('.pdf') || href.startsWith('/demos/')) {
        return <a href={href} className={className} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">{children}</a>;
    }
    return <NextLink href={href} className={className} aria-label={ariaLabel}>{children}</NextLink>;
}

// 「廻リ視 — Mawarimi」のような題を、日本語の題と英語の副題に分ける
function splitTitle(title: string): { main: string; sub?: string } {
    const [main, sub] = title.split(' — ');
    return { main, sub };
}

// 英字だけの題は詰まった英字書体で、日本語を含む題は日本語の極太で組む
const isLatin = (text: string) => !/[\u3040-\u30ff\u3400-\u9fff]/.test(text);

function titleClass(main: string): string {
    return [isLatin(main) ? 'is-latin' : 'is-ja', main.length > 9 ? 'is-long' : ''].filter(Boolean).join(' ');
}

function MagazineNav() {
    return (
        <nav className="mag-nav" aria-label="誌面の目次">
            <NextLink href="/#top" className="mag-nav__brand">{issue.masthead}</NextLink>
            <div className="mag-nav__links">
                <a href="#contents">目次</a>
                <a href="#features">特集</a>
                <a href="#gallery">作品</a>
                <a href="#interview">インタビュー</a>
                <a href="#contact">連絡</a>
                <NextLink href="/resume">経歴 ↗</NextLink>
            </div>
        </nav>
    );
}

function Cover() {
    return (
        <header id="top" className="mag-cover">
            <p className="mag-cover__issue">
                <span>{issue.issueLine}</span>
                <span>{issue.theme}</span>
            </p>
            <h1 className="mag-cover__masthead" aria-label={issue.masthead + '　白石大晴のポートフォリオ'}>
                {issue.masthead}
            </h1>
            <figure className="mag-cover__photo">
                <Image src={issue.coverImage.src} alt={issue.coverImage.alt} width={480} height={579} priority sizes="(max-width: 760px) 70vw, 420px" />
            </figure>
            <ul className="mag-cover__lines">
                {issue.coverLines.map((line) => (
                    <li key={line.text}>
                        <span className="mag-cover__line-label">{line.label}</span>
                        {line.text}
                    </li>
                ))}
            </ul>
            <p className="mag-cover__name">
                <span lang="ja">白石 大晴</span>
                <span lang="en">Taisei Shiroishi</span>
                <span className="mag-cover__role">明治大学大学院　HCI 研究</span>
            </p>
            <span className="mag-sticker mag-cover__sticker">{issue.coverSticker}</span>
        </header>
    );
}

function Contents({ gallery }: { gallery: Work[] }) {
    const featured = features.map((f) => works.find((w) => w.id === f.workId)).filter((w): w is Work => Boolean(w));
    return (
        <section id="contents" className="mag-contents" aria-labelledby="contents-title">
            <h2 id="contents-title" className="mag-contents__title">目次</h2>
            <ol className="mag-contents__list">
                {featured.map((work) => (
                    <li key={work.id}>
                        <a href={'#feature-' + work.id}>
                            <span className="mag-contents__thumb"><Image src={work.image} alt="" width={160} height={100} sizes="160px" /></span>
                            <span className="mag-contents__text">
                                <span className="mag-contents__name">{splitTitle(work.title).main}</span>
                                <span className="mag-contents__cat">{CATEGORY_LABEL[work.category ?? 'creative']}</span>
                            </span>
                        </a>
                    </li>
                ))}
                <li><a href="#gallery"><span className="mag-contents__text"><span className="mag-contents__name">作品のページ</span><span className="mag-contents__cat">{gallery.length} 点</span></span></a></li>
                <li><a href="#interview"><span className="mag-contents__text"><span className="mag-contents__name">{interview.title}</span><span className="mag-contents__cat">インタビュー</span></span></a></li>
                <li><a href="#contact"><span className="mag-contents__text"><span className="mag-contents__name">連絡先</span><span className="mag-contents__cat">裏表紙</span></span></a></li>
            </ol>
        </section>
    );
}

function Spread({ spread, work }: { spread: FeatureSpread; work: Work }) {
    const { main, sub } = splitTitle(work.title);
    const href = workHref(work);
    const style = {
        '--spread-paper': spread.theme.paper,
        '--spread-ink': spread.theme.ink,
        '--spread-accent': spread.theme.accent,
    } as CSSProperties;

    const photo = (
        <Image
            src={work.image}
            alt={work.title}
            width={1600}
            height={1000}
            sizes={spread.layout === 'bleed' ? '100vw' : '(max-width: 760px) 100vw, 62vw'}
            className={work.imageFit === 'contain' ? 'is-contain' : undefined}
        />
    );

    return (
        <article id={'feature-' + work.id} className={'mag-spread mag-spread--' + spread.layout} style={style} aria-labelledby={'title-' + work.id}>
            <figure className="mag-spread__photo">
                {href ? <SmartLink href={href} ariaLabel={work.title + ' を見る'}>{photo}</SmartLink> : photo}
                {spread.sticker && <span className="mag-sticker mag-spread__sticker">{spread.sticker}</span>}
                {spread.inset && (
                    <span className="mag-spread__inset">
                        <Image src={spread.inset.src} alt={spread.inset.alt} width={402} height={880} sizes="200px" />
                    </span>
                )}
            </figure>
            <div className="mag-spread__text">
                <p className="mag-spread__kicker">{spread.kicker}</p>
                <h3 id={'title-' + work.id} className={'mag-spread__title ' + titleClass(main)}>
                    {main}
                    {sub && <span className="mag-spread__sub">{sub}</span>}
                </h3>
                <p className="mag-spread__quote">{spread.pullQuote}</p>
                <p className="mag-spread__body">{work.description}</p>
                <p className="mag-spread__meta">{[work.period, work.role].filter(Boolean).join('　')}</p>
                <div className="mag-spread__links">
                    {work.detail && <NextLink href={'/works/' + work.id}>詳しく読む →</NextLink>}
                    {work.links.map((link) => (
                        <SmartLink key={link.url} href={link.url}>{linkLabel(link)} ↗</SmartLink>
                    ))}
                </div>
                {work.credits && (
                    <ul className="mag-spread__credits" aria-label="クレジット">
                        {work.credits.map((credit) => <li key={credit}>{credit}</li>)}
                    </ul>
                )}
            </div>
        </article>
    );
}

function Gallery({ items }: { items: Work[] }) {
    return (
        <section id="gallery" className="mag-gallery" aria-labelledby="gallery-title">
            <header className="mag-gallery__head">
                <h2 id="gallery-title">作品のページ</h2>
                <p>映像、3D、サウンド、コードで描いたもの。実務の仕事もここに置きました。</p>
            </header>
            <ul className="mag-gallery__grid">
                {items.map((work, index) => {
                    const href = workHref(work);
                    const body = (
                        <>
                            <span className="mag-tile__photo">
                                <Image src={work.image} alt="" width={900} height={600} sizes="(max-width: 760px) 100vw, 40vw" className={work.imageFit === 'contain' ? 'is-contain' : undefined} />
                            </span>
                            <span className="mag-tile__caption">
                                <span className="mag-tile__title">{work.title}</span>
                                <span className="mag-tile__note">{CATEGORY_LABEL[work.category ?? 'creative']}　{work.description}</span>
                            </span>
                        </>
                    );
                    return (
                        <li key={work.id} className={'mag-tile mag-tile--' + (index % 7)}>
                            {href ? <SmartLink href={href} className="mag-tile__link">{body}</SmartLink> : <div className="mag-tile__link">{body}</div>}
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

function Interview() {
    return (
        <section id="interview" className="mag-interview" aria-labelledby="interview-title">
            <figure className="mag-interview__art">
                <Image src={interview.image.src} alt={interview.image.alt} width={1200} height={900} sizes="(max-width: 760px) 100vw, 45vw" />
            </figure>
            <div className="mag-interview__text">
                <p className="mag-interview__kicker">インタビュー</p>
                <h2 id="interview-title">{interview.title}</h2>
                <dl className="mag-interview__qa">
                    {aboutData.bio.map((answer, i) => (
                        <div key={answer}>
                            <dt>{interview.questions[i] ?? '最近は'}</dt>
                            <dd>{answer}</dd>
                        </div>
                    ))}
                </dl>
                <dl className="mag-interview__facts">
                    {aboutData.keyFacts?.map((fact) => (
                        <div key={fact.title}>
                            <dt>{fact.title}</dt>
                            <dd>{fact.description}</dd>
                        </div>
                    ))}
                </dl>
                <NextLink href="/resume" className="mag-interview__resume">経歴と実績を見る ↗</NextLink>
            </div>
        </section>
    );
}

export default function Magazine() {
    const featureIds = new Set(features.map((f) => f.workId));
    const gallery = works.filter((w) => !w.hidden && !featureIds.has(w.id) && w.id !== 'portfolio');

    return (
        <div className="mag">
            <MagazineNav />
            <main id="main-content" tabIndex={-1}>
                <Cover />
                <Contents gallery={gallery} />
                <div id="features">
                    {features.map((spread) => {
                        const work = works.find((w) => w.id === spread.workId);
                        return work ? <Spread key={spread.workId} spread={spread} work={work} /> : null;
                    })}
                </div>
                <Gallery items={gallery} />
                <Interview />
                <BackCover />
            </main>
        </div>
    );
}
