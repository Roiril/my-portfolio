import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { splitTitle, titleClass } from '@/lib/work-title';
import type { Work, WorkGalleryImage, WorkLink } from '../types';
import WorkTechSection from './WorkTechSection';

export type CaseTheme = { paper: string; ink: string; accent: string };

const CATEGORY_LABEL = { research: '研究', personal: '個人開発', internship: '実務', creative: '制作' } as const;

const isNewTab = (href: string) => /^https?:\/\//.test(href) || href.endsWith('.pdf') || href.startsWith('/demos/');

function linkLabel(link: WorkLink): string {
    if (link.label) return link.label;
    return link.type === 'launch' ? 'サイトを開く' : link.type === 'paper' ? '論文を読む' : '動画を見る';
}

function OutLink({ link }: { link: WorkLink }) {
    return (
        <a href={link.url} target={isNewTab(link.url) ? '_blank' : undefined} rel={isNewTab(link.url) ? 'noopener noreferrer' : undefined}>
            {linkLabel(link)} <span aria-hidden="true">↗</span>
            {isNewTab(link.url) && <span className="case-sr-only">（新しいタブで開きます）</span>}
        </a>
    );
}

function Gallery({ images, fallbackAlt, columns = 2, phone = false }: { images: WorkGalleryImage[]; fallbackAlt: string; columns?: 2 | 3 | 4; phone?: boolean }) {
    return (
        <ul className={'case-gallery' + (phone ? ' case-gallery--phone' : '')} style={{ '--cols': phone ? 3 : columns } as CSSProperties}>
            {images.map((img) => (
                <li key={img.src} className={img.wide ? 'is-wide' : undefined}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.src} alt={img.alt ?? fallbackAlt} loading="lazy" />
                </li>
            ))}
        </ul>
    );
}

export default function WorkCaseStudy({ work, theme, prev, next }: { work: Work; theme: CaseTheme; prev?: Work; next?: Work }) {
    const { main, sub } = splitTitle(work.title);
    const { detail, tech } = work;
    const hasStory = Boolean(detail && (detail.body?.length || detail.gallery?.length || detail.sections?.length));
    // 大きく組むのはリード文。リードが無い作品は説明の 1 文目だけを大きくし、残りを本文の大きさにする
    const firstEnd = work.description.indexOf('。') + 1;
    const lead = detail?.lead ?? (firstEnd > 0 ? work.description.slice(0, firstEnd) : work.description);
    const rest = detail?.lead ? work.description : firstEnd > 0 ? work.description.slice(firstEnd) : '';
    const style = { '--case-paper': theme.paper, '--case-ink': theme.ink, '--case-accent': theme.accent } as CSSProperties;

    return (
        <main id="main-content" tabIndex={-1} className="case" style={style}>
            <article>
                <header className="case-hero">
                    <Link href={'/#gallery'} className="case-back"><span aria-hidden="true">←</span> 作品のページへ</Link>
                    <p className="case-hero__kicker">
                        {[CATEGORY_LABEL[work.category ?? 'creative'], work.period, work.role].filter(Boolean).join('　／　')}
                    </p>
                    <h1 className={'case-hero__title ' + titleClass(main)}>
                        {main}
                        {sub && <span className="case-hero__sub">{sub}</span>}
                    </h1>
                    <div className="case-hero__grid">
                        <figure className="case-hero__photo">
                            <Image src={work.image} alt={work.title} width={1600} height={1000} sizes="(max-width: 960px) 100vw, 58vw" priority className={work.imageFit === 'contain' ? 'is-contain' : undefined} />
                        </figure>
                        <div className="case-hero__text">
                            <p className="case-hero__lead">{lead}</p>
                            {rest && <p className="case-hero__desc">{rest}</p>}
                            <ul className="case-hero__tags" aria-label="タグ">
                                {work.tags.map((tag) => <li key={tag} translate="no">{tag}</li>)}
                            </ul>
                            {work.links.length > 0 && (
                                <div className="case-hero__links">
                                    {work.links.map((link) => <OutLink key={link.url} link={link} />)}
                                </div>
                            )}
                        </div>
                    </div>
                    {hasStory && tech && (
                        <nav className="case-chapters" aria-label="このページの内容">
                            <a href="#story"><span aria-hidden="true">01</span> 作品について</a>
                            <a href="#tech"><span aria-hidden="true">02</span> 技術</a>
                        </nav>
                    )}
                </header>

                {hasStory && detail && (
                    <section id="story" className="case-story" aria-labelledby="story-title">
                        <p className="case-chapter-no" aria-hidden="true">01</p>
                        <h2 id="story-title" className="case-chapter-title">作品について</h2>
                        {detail.body && detail.body.length > 0 && (
                            <div className="case-prose">
                                {detail.body.map((p) => <p key={p}>{p}</p>)}
                            </div>
                        )}
                        {detail.gallery && detail.gallery.length > 0 && <Gallery images={detail.gallery} fallbackAlt={work.title} phone={detail.phone} />}
                        {detail.sections?.map((section, i) => (
                            <section key={section.title ?? i} className="case-subsection">
                                {section.title && <h3>{section.title}</h3>}
                                {section.body && section.body.length > 0 && (
                                    <div className="case-prose">
                                        {section.body.map((p) => <p key={p}>{p}</p>)}
                                    </div>
                                )}
                                {section.gallery && section.gallery.length > 0 && <Gallery images={section.gallery} fallbackAlt={section.title ?? work.title} columns={section.columns} />}
                                {section.links && section.links.length > 0 && (
                                    <div className="case-hero__links">
                                        {section.links.map((link) => <OutLink key={link.url} link={link} />)}
                                    </div>
                                )}
                            </section>
                        ))}
                    </section>
                )}

                {tech && <WorkTechSection tech={tech} index={hasStory ? '02' : '01'} />}

                {work.credits && (
                    <section className="case-credits" aria-labelledby="credits-title">
                        <h2 id="credits-title">クレジット</h2>
                        <ul>{work.credits.map((c) => <li key={c}>{c}</li>)}</ul>
                    </section>
                )}

                <nav className="case-pager" aria-label="ほかの作品">
                    {prev ? <Link href={'/works/' + prev.id} className="case-pager__prev"><span>前の作品</span>{prev.title}</Link> : <span />}
                    {next ? <Link href={'/works/' + next.id} className="case-pager__next"><span>次の作品</span>{next.title}</Link> : <span />}
                </nav>
            </article>
        </main>
    );
}
