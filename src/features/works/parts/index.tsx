import Image from 'next/image';
import type { ReactNode } from 'react';
import type { Pic } from './types';
import LoopVideo from './LoopVideo';
import './base.css';

export { default as WorkFigure } from './WorkFigure';
export { default as XPost, XVoice } from './XPost';
export { default as Shell } from './Shell';
export type { Pic } from './types';

const GENERATED = '生成した画像によるイメージです。';

// 見出しは読点の後でだけ折り返す
export function Ph({ text }: { text: string }) {
    return <>{text.split(/(?<=、)/).map((t) => <span key={t} className="wk-ph">{t}</span>)}</>;
}

export function Text({ items }: { items: string[] }) {
    return <div className="wk-text">{items.map((t) => <p key={t}>{t}</p>)}</div>;
}

export function Links({ items }: { items: { label: string; url: string }[] }) {
    return (
        <p className="wk-links">
            {items.map((l) => {
                const external = !l.url.startsWith('/');
                return (
                    <a key={l.url} href={l.url} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {l.label}
                        {external && <span aria-hidden="true"> ↗</span>}
                        {external && <span className="wk-sr">（新しいタブで開きます）</span>}
                    </a>
                );
            })}
        </p>
    );
}

export function Photo({ pic, sizes = '(max-width: 900px) 100vw, 50vw', className = '', priority }: { pic: Pic; sizes?: string; className?: string; priority?: boolean }) {
    return (
        <figure className={`wk-pic ${className}`}>
            <Image src={pic.src} alt={pic.alt} width={pic.w} height={pic.h} sizes={sizes} priority={priority} />
            {(pic.caption || pic.generated) && <figcaption>{pic.caption}{pic.generated && GENERATED}</figcaption>}
        </figure>
    );
}

// 面いっぱいに敷く絵。real は実物の画像で、生成の注記を出さない
export function Art({ src, alt, className = '', sizes = '100vw', priority, real }: { src: string; alt: string; className?: string; sizes?: string; priority?: boolean; real?: boolean }) {
    return (
        <figure className={`wk-art ${className}`}>
            <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />
            {!real && <figcaption>{GENERATED}</figcaption>}
        </figure>
    );
}

// 最初の面。絵の余白に題字を組む
export function Hero({ src, alt, real, children, after }: { src: string; alt: string; real?: boolean; children: ReactNode; after?: ReactNode }) {
    return (
        <header className="wk-hero">
            <div className="wk-hero__copy">{children}</div>
            <Art className="wk-hero__art" src={src} alt={alt} real={real} priority />
            {after}
        </header>
    );
}

export function Yt({ id, title, caption, tall }: { id: string; title: string; caption?: string; tall?: boolean }) {
    return (
        <figure className={tall ? 'wk-yt wk-yt--tall' : 'wk-yt'}>
            <div className="wk-yt__frame">
                <iframe src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`} title={title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" />
            </div>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    );
}

export function Clip({ src, label, className = '' }: { src: string; label: string; className?: string }) {
    return <div className={`wk-clip ${className}`}><LoopVideo src={`${src}.mp4`} poster={`${src}.webp`} label={label} /></div>;
}

export function List({ items, className = '' }: { items?: { title: string; body: string }[]; className?: string }) {
    return (
        <dl className={`wk-list ${className}`}>
            {items?.map((i) => <div key={i.title}><dt>{i.title}</dt><dd>{i.body}</dd></div>)}
        </dl>
    );
}

export function Nums({ items }: { items?: { value: string; unit?: string; label: string }[] }) {
    return (
        <dl className="wk-nums">
            {items?.map((n) => <div key={n.label}><dd>{n.value}{n.unit && <small>{n.unit}</small>}</dd><dt>{n.label}</dt></div>)}
        </dl>
    );
}

export function Stack({ items }: { items: { label: string; items: string[] }[] }) {
    return (
        <dl className="wk-stack">
            {items.map((s) => <div key={s.label}><dt>{s.label}</dt><dd>{s.items.join('　')}</dd></div>)}
        </dl>
    );
}
