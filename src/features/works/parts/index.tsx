import Image, { getImageProps } from 'next/image';
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

// 面いっぱいに敷く絵。real は実物の画像で、生成の注記を出さない。tall は 900px 以下で使う縦長の版
export function Art({ src, tall, alt, className = '', sizes = '100vw', priority, real }: { src: string; tall?: string; alt: string; className?: string; sizes?: string; priority?: boolean; real?: boolean }) {
    return (
        <figure className={`wk-art ${className}`}>
            {tall ? <TwoWay src={src} tall={tall} alt={alt} /> : <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />}
            {!real && <figcaption>{GENERATED}</figcaption>}
        </figure>
    );
}

// 横長と縦長を、幅で読み分ける
function TwoWay({ src, tall, alt }: { src: string; tall: string; alt: string }) {
    const common = { alt, fill: true, sizes: '100vw', loading: 'eager', fetchPriority: 'high' } as const;
    const { props: { srcSet, ...rest } } = getImageProps({ ...common, src });
    const { props: { srcSet: tallSet } } = getImageProps({ ...common, src: tall });
    return (
        <picture>
            <source media="(max-width: 900px)" srcSet={tallSet} sizes="100vw" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img {...rest} srcSet={srcSet} alt={alt} />
        </picture>
    );
}

// 最初の面。絵の余白に題字を組む
export function Hero({ src, tall, alt, real, sizes, children, after }: { src: string; tall?: string; alt: string; real?: boolean; sizes?: string; children: ReactNode; after?: ReactNode }) {
    return (
        <header className={tall ? 'wk-hero wk-hero--tall' : 'wk-hero'}>
            <div className="wk-hero__copy">{children}</div>
            <Art className="wk-hero__art" src={src} tall={tall} alt={alt} sizes={sizes} real={real} priority />
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
