import Image from 'next/image';
import NextLink from 'next/link';
import type { CSSProperties } from 'react';
import SiteHeader from '@/components/layout/SiteHeader';
import { works } from '@/content/works';
import { aboutData } from '@/content/about';
import { features, issue, profile, type FeatureSpread } from '@/content/magazine';
import { art } from '@/content/magazine-art';
import { detailHref, hasDetailPage } from '@/features/works';
import type { Work } from '@/features/works/types';
import BackCover from './BackCover';
import CoverArt from './CoverArt';
import GalleryGrid from './GalleryGrid';
import GuideHand from './GuideHand';
import Sticker from './Sticker';
import { CategoryMark, SmartLink, linkLabel, splitTitle, titleClass, workHref } from './parts';
import '../magazine.css';

function Cover() {
    return (
        <header id="top" className="mag-cover">
            <p className="mag-cover__issue">
                <span>{issue.issueLine}</span>
                <span>{issue.theme}</span>
            </p>
            <h1 className="mag-cover__masthead" aria-label={issue.masthead + '　白石大晴のポートフォリオ'} data-plate={issue.masthead}>
                {issue.masthead}
            </h1>
            <div className="mag-cover__photo">
                <CoverArt />
            </div>
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
            <Sticker front={issue.coverSticker} back={issue.coverStickerBack} className="mag-cover__sticker" />
            <a href="#contents" className="mag-cover__next">
                <Image src={art.arrow.src} alt="" width={art.arrow.width} height={art.arrow.height} sizes="48px" />
                <span>目次へ</span>
            </a>
        </header>
    );
}

function Contents({ gallery }: { gallery: Work[] }) {
    const featured = features.map((f) => works.find((w) => w.id === f.workId)).filter((w): w is Work => Boolean(w));
    return (
        <section id="contents" className="mag-contents" aria-labelledby="contents-title" data-rule>
            <div className="mag-contents__side">
                <h2 id="contents-title" className="mag-contents__title" data-plate="目次">目次</h2>
                <Image src={art.spotContents.src} alt="" width={art.spotContents.width} height={art.spotContents.height} sizes="(max-width: 600px) 60vw, 26vw" className="mag-spot mag-contents__spot" />
            </div>
            <ol className="mag-contents__list">
                {featured.map((work) => (
                    <li key={work.id}>
                        <a href={'#feature-' + work.id}>
                            <span className="mag-contents__thumb"><Image src={work.image} alt="" width={160} height={100} sizes="160px" /></span>
                            <span className="mag-contents__text">
                                <span className="mag-contents__name">{splitTitle(work.title).main}</span>
                                <span className="mag-contents__cat"><CategoryMark category={work.category ?? 'creative'} /></span>
                            </span>
                        </a>
                    </li>
                ))}
                <li><a href="#gallery"><span className="mag-contents__text"><span className="mag-contents__name">作品のページ</span><span className="mag-contents__cat">{gallery.length} 点</span></span></a></li>
                <li><a href="#profile"><span className="mag-contents__text"><span className="mag-contents__name">{profile.title}</span><span className="mag-contents__cat">経歴と道具</span></span></a></li>
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
                {/* 写真のリンクは下の「詳細」と同じ行き先。キーボードと読み上げでは 2 回出さない */}
                {href ? <SmartLink href={href} hidden>{photo}</SmartLink> : photo}
                {spread.sticker && <Sticker front={spread.sticker} back={spread.stickerBack} className="mag-spread__sticker" />}
                {spread.inset && (
                    <span className="mag-spread__inset">
                        <Image src={spread.inset.src} alt={spread.inset.alt} width={402} height={880} sizes="200px" />
                    </span>
                )}
            </figure>
            <div className="mag-spread__text">
                <p className="mag-spread__kicker">{spread.kicker}</p>
                <h3 id={'title-' + work.id} className={'mag-spread__title ' + titleClass(main)} data-plate={main}>
                    {main}
                    {sub && <span className="mag-spread__sub">{sub}</span>}
                </h3>
                <p className="mag-spread__quote">{spread.pullQuote}</p>
                <p className="mag-spread__body">{work.description}</p>
                <p className="mag-spread__meta">{[work.period, work.role].filter(Boolean).join('　')}</p>
                <div className="mag-spread__links">
                    {hasDetailPage(work) && (
                        <NextLink href={detailHref(work)} className="mag-spread__more">
                            詳細<span className="mag-sr-only">：{main}</span><span aria-hidden="true"> →</span>
                        </NextLink>
                    )}
                    {work.links.map((link) => (
                        <SmartLink key={link.url} href={link.url} arrow>{linkLabel(link)}</SmartLink>
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
        <section id="gallery" className="mag-gallery" aria-labelledby="gallery-title" data-rule>
            <header className="mag-gallery__head">
                <h2 id="gallery-title" data-plate="作品のページ">作品のページ</h2>
                <p>映像、3D、サウンド、コードで描いたもの。実務の仕事もここに置きました。</p>
            </header>
            <GalleryGrid items={items} />
        </section>
    );
}

function Profile() {
    return (
        <section id="profile" className="mag-profile" aria-labelledby="profile-title">
            <div className="mag-profile__head">
                <figure className="mag-print mag-profile__art">
                    <Image src={art.profile.src} alt={art.profile.alt} width={art.profile.width} height={art.profile.height} sizes="(max-width: 960px) 90vw, 40vw" />
                </figure>
                <h2 id="profile-title" data-plate={profile.title}>{profile.title}</h2>
                <p className="mag-profile__name">
                    <span lang="ja">白石 大晴</span>
                    <span lang="en">Taisei Shiroishi</span>
                </p>
            </div>
            <div className="mag-profile__text">
                {aboutData.bio.map((paragraph) => <p key={paragraph} className="mag-profile__bio">{paragraph}</p>)}
                <dl className="mag-profile__facts">
                    {aboutData.keyFacts?.map((fact) => (
                        <div key={fact.title}>
                            <dt>{fact.title}</dt>
                            <dd>{fact.description}</dd>
                        </div>
                    ))}
                </dl>
                <NextLink href="/resume" className="mag-profile__resume">経歴と実績を見る<span aria-hidden="true"> ↗</span></NextLink>
            </div>
        </section>
    );
}

export default function Magazine() {
    const featureIds = new Set(features.map((f) => f.workId));
    const gallery = works.filter((w) => !w.hidden && !featureIds.has(w.id) && w.id !== 'portfolio');

    return (
        <div className="mag">
            <SiteHeader />
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
                <Profile />
                <BackCover />
            </main>
            <GuideHand />
        </div>
    );
}
