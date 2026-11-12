import Image from 'next/image';
import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Hero, LinkItem, Mark, Page, Pic, Section, Slot, WorkPageDef } from '@/content/work-pages';
import { frontFonts } from '@/features/front/fonts';
import LoopVideo from './LoopVideo';
import WorkFigure from './WorkFigure';
import XPost from './XPost';
import './work-page.css';

const HALF = '(max-width: 760px) 100vw, 50vw';
const GENERATED = '生成した画像によるイメージです。';

function ExternalMark({ url }: { url: string }) {
    if (url.startsWith('/')) return null;
    return <span aria-hidden="true"> ↗</span>;
}

function Links({ items }: { items: LinkItem[] }) {
    return (
        <p className="wp-links">
            {items.map((l) => {
                const external = !l.url.startsWith('/');
                return (
                    <a key={l.url} href={l.url} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {l.label}
                        <ExternalMark url={l.url} />
                        {external && <span className="wp-sr">（新しいタブで開きます）</span>}
                    </a>
                );
            })}
        </p>
    );
}

// 見出しは読点の後でだけ折り返す
function Phrases({ text }: { text: string }) {
    return <>{text.split(/(?<=、)/).map((part) => <span key={part} className="wp-phrase">{part}</span>)}</>;
}

function Figure({ pic, sizes }: { pic: Pic; sizes: string }) {
    return (
        <figure className="wp-pic">
            <Image src={pic.src} alt={pic.alt} width={pic.w} height={pic.h} sizes={sizes} />
            {(pic.caption || pic.generated) && <figcaption>{pic.caption}{pic.generated && GENERATED}</figcaption>}
        </figure>
    );
}

// 面いっぱいに置く画像。切り抜きの位置は pos で決める
function Bleed({ pic, sizes, priority }: { pic: Pic; sizes: string; priority?: boolean }) {
    const ratio = { '--ratio': `${pic.w} / ${pic.h}` } as CSSProperties;
    return (
        <figure className="wp-bleed" style={ratio}>
            <Image src={pic.src} alt={pic.alt} fill sizes={sizes} priority={priority} style={pic.pos ? { objectPosition: pic.pos } : undefined} />
            {pic.generated && <figcaption>{GENERATED}</figcaption>}
        </figure>
    );
}

function Render({ slot }: { slot: Slot }): ReactNode {
    switch (slot.k) {
        case 'h':
            return slot.small ? <h3 className="wp-h3">{slot.text}</h3> : <h2 className="wp-h2"><Phrases text={slot.text} /></h2>;
        case 'p':
            return <div className="wp-text">{slot.text.map((t) => <p key={t}>{t}</p>)}</div>;
        case 'note':
            return <p className="wp-note">{slot.text}</p>;
        case 'pic':
            return <Figure pic={slot.pic} sizes="(max-width: 760px) 100vw, 80vw" />;
        case 'pics':
            return (
                <div className="wp-pics" data-cols={slot.cols}>
                    {slot.pics.map((pic) => <Figure key={pic.src} pic={pic} sizes={`(max-width: 760px) 50vw, ${Math.round(100 / slot.cols)}vw`} />)}
                </div>
            );
        case 'yt':
            return (
                <figure className={slot.portrait ? 'wp-yt wp-yt--portrait' : 'wp-yt'}>
                    <div className="wp-yt__frame">
                        <iframe src={`https://www.youtube-nocookie.com/embed/${slot.id}?rel=0`} title={slot.title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" />
                    </div>
                    {slot.caption && <figcaption>{slot.caption}</figcaption>}
                </figure>
            );
        case 'clips':
            return (
                <div className="wp-clips" data-count={slot.items.length}>
                    {slot.items.map((c) => <LoopVideo key={c.src} src={c.src} poster={c.poster} label={c.label} />)}
                </div>
            );
        case 'video':
            return (
                <figure className="wp-video">
                    <video src={slot.src} poster={slot.poster} title={slot.title} aria-label={slot.title} controls playsInline preload="none" />
                    {slot.caption && <figcaption>{slot.caption}</figcaption>}
                </figure>
            );
        case 'phones':
            return (
                <div className="wp-phones" data-count={slot.pics.length}>
                    {slot.pics.map((pic) => (
                        <figure key={pic.src}>
                            <Image src={pic.src} alt={pic.alt} width={pic.w} height={pic.h} sizes="(max-width: 760px) 44vw, 20vw" />
                            {pic.caption && <figcaption>{pic.caption}</figcaption>}
                        </figure>
                    ))}
                </div>
            );
        case 'list':
            return (
                <dl className="wp-list">
                    {slot.items.map((i) => (
                        <div key={i.title}>
                            <dt>{i.title}</dt>
                            <dd>{i.body}</dd>
                        </div>
                    ))}
                </dl>
            );
        case 'numbers':
            return slot.items.length ? (
                <dl className="wp-numbers">
                    {slot.items.map((n) => (
                        <div key={n.label}>
                            <dd>{n.value}{n.unit && <small>{n.unit}</small>}</dd>
                            <dt>{n.label}</dt>
                        </div>
                    ))}
                </dl>
            ) : null;
        case 'stack':
            return (
                <dl className="wp-stack">
                    {slot.items.map((s) => (
                        <div key={s.label}>
                            <dt>{s.label}</dt>
                            <dd>{s.items.join('　')}</dd>
                        </div>
                    ))}
                </dl>
            );
        case 'credits':
            return (
                <div className="wp-credits">
                    <h3 className="wp-h3">{slot.title}</h3>
                    <ul>{slot.items.map((c) => <li key={c}>{c}</li>)}</ul>
                </div>
            );
        case 'links':
            return <Links items={slot.items} />;
        case 'post':
            return <XPost url={slot.url} title={slot.title} caption={slot.caption} stats={slot.stats} />;
    }
}

function Slots({ slots }: { slots: Slot[] }) {
    return <>{slots.map((slot, i) => <Render key={i} slot={slot} />)}</>;
}

function HalfPage({ page }: { page: Page }) {
    if ('bleed' in page) {
        return (
            <div className="wp-page wp-page--bleed" data-tone={page.tone}>
                {page.bleed.map((pic) => <Bleed key={pic.src} pic={pic} sizes={HALF} />)}
            </div>
        );
    }
    return (
        <div className="wp-page" data-tone={page.tone}>
            <Slots slots={page.slots} />
        </div>
    );
}

function SectionBlock({ section }: { section: Section }) {
    switch (section.type) {
        case 'spread':
            return (
                <section className="wp-spread">
                    <HalfPage page={section.left} />
                    <HalfPage page={section.right} />
                </section>
            );
        case 'full':
            return (
                <section className="wp-full" data-tone={section.tone}>
                    <Slots slots={section.slots} />
                </section>
            );
        case 'figure':
            return (
                <section className="wp-figure" data-tone={section.tone}>
                    <WorkFigure name={section.name} caption={section.caption} />
                    {section.side && <div className="wp-figure__side"><Slots slots={section.side} /></div>}
                </section>
            );
        case 'wideFigure':
            return (
                <section className="wp-widefig" data-tone={section.tone}>
                    {section.head && <div className="wp-widefig__head"><Slots slots={section.head} /></div>}
                    <WorkFigure name={section.name} caption={section.caption} />
                </section>
            );
    }
}

function MarkText({ mark, ink }: { mark: Extract<Mark, { type: 'text' }>; ink: string }) {
    return (
        <>
            <span className="wp-mark__l">{mark.text}</span>
            <span className="wp-mark__r" aria-hidden="true" data-ink={ink}>{mark.text}</span>
        </>
    );
}

function HeroMedia({ hero }: { hero: Hero }) {
    switch (hero.type) {
        case 'pic':
            if (hero.fit === 'contain') {
                return <div className="wp-hero__contain"><Image src={hero.pic.src} alt={hero.pic.alt} width={hero.pic.w} height={hero.pic.h} sizes={HALF} priority /></div>;
            }
            return <Bleed pic={hero.pic} sizes={HALF} priority />;
        case 'clip':
            return <div className="wp-hero__clip"><LoopVideo src={hero.src} poster={hero.poster} label={hero.label} /></div>;
        case 'phones':
            return (
                <div className="wp-hero__phones">
                    <Bleed pic={hero.bg} sizes={HALF} priority />
                    <div className="wp-hero__phoneset">
                        {hero.phones.map((pic) => <Image key={pic.src} src={pic.src} alt={pic.alt} width={pic.w} height={pic.h} sizes="(max-width: 760px) 40vw, 20vw" priority />)}
                    </div>
                </div>
            );
    }
}

export default function WorkPage({ page, title, backHref, prev, next }: { page: WorkPageDef; title: string; backHref: string; prev?: { page: WorkPageDef; title: string }; next?: { page: WorkPageDef; title: string } }) {
    const { mark } = page;
    const markStyle = {
        '--mark-top': page.markTop ?? 110,
        ...(mark.type === 'text' ? { '--mark': mark.size, '--mark-m': mark.sizeM } : {}),
        ...(mark.type === 'logo' && mark.size ? { '--logo': mark.size } : {}),
    } as CSSProperties;
    // 題字の下端。ここから下に画像を置く
    const band = page.band && mark.type === 'text' ? (page.markTop ?? 110) + mark.size * 1.06 + 18 : 0;

    return (
        <div className={`wp ${frontFonts}`}>
            <header className="wp-hero">
                <div className="wp-hero__l" data-tone={page.heroTone[0]}>
                    <p className="wp-say"><Phrases text={page.say} /></p>
                    {page.sub && <p className="wp-sub">{page.sub}</p>}
                    {page.award && <p className="wp-award">{page.award}</p>}
                    {page.meta && <p className="wp-meta">{page.meta}</p>}
                    {page.links && <Links items={page.links} />}
                </div>
                <div className="wp-hero__r" data-tone={page.heroTone[1]} style={{ '--band': band } as CSSProperties}>
                    <HeroMedia hero={page.hero} />
                </div>
                <h1 className={`wp-mark wp-mark--${mark.type === 'logo' ? 'logo' : mark.font}`} style={markStyle} data-tone={page.heroTone[0]}>
                    {mark.type === 'logo'
                        ? <Image src={mark.src} alt={mark.alt} width={mark.w} height={mark.h} sizes="(max-width: 760px) 90vw, 70vw" priority />
                        : <MarkText mark={mark} ink={page.markRight ?? (page.heroTone[1] === 'night' ? 'light' : 'ink')} />}
                </h1>
                <Link className="wp-back" href={backHref} data-tone={page.heroTone[0]}>トップへ戻る</Link>
            </header>

            <main>
                {page.sections.map((section, i) => <SectionBlock key={i} section={section} />)}
            </main>

            <nav className="wp-spread wp-nextprev" aria-label="前後の作品">
                <NextPrev label="前の作品" none="最初の作品です" item={prev} backHref={backHref} tone="paper" />
                <NextPrev label="次の作品" none="最後の作品です" item={next} backHref={backHref} tone="night" />
            </nav>

            <footer className="wp-foot">
                <p>© {new Date().getFullYear()} Taisei Shiroishi</p>
                <p className="wp-foot__title">{title}</p>
            </footer>
        </div>
    );
}

function NextPrev({ label, none, item, backHref, tone }: { label: string; none: string; item?: { page: WorkPageDef; title: string }; backHref: string; tone: 'paper' | 'night' }) {
    if (!item) {
        return (
            <Link className="wp-page wp-np" data-tone={tone} href={backHref}>
                <span className="wp-np__label">{none}</span>
                <span className="wp-np__title">トップへ戻る</span>
            </Link>
        );
    }
    return (
        <Link className="wp-page wp-np" data-tone={tone} href={`/works/${item.page.id}`}>
            <span className="wp-np__label">{label}</span>
            <span className="wp-np__title">{item.title}</span>
            <span className="wp-np__say">{item.page.say}</span>
            <span className="wp-np__thumb"><Image src={item.page.thumb} alt="" width={320} height={214} sizes="(max-width: 760px) 40vw, 22vw" /></span>
        </Link>
    );
}
