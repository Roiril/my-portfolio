'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { hasDetailPage } from '@/features/works';
import type { Work } from '@/features/works/types';
import { CategoryMark, SmartLink, workHref } from './parts';

// 作品のページの絞り込み。分類（研究・制作…）はこのページでは偏るので、
// 作品のタグから「何で作ったか」の媒体に寄せて分ける。1 つの作品が複数の媒体に入ってよい
const MEDIA: { key: string; label: string; tags: string[] }[] = [
    { key: 'video', label: '映像', tags: ['Video', 'Animation', 'VFX', 'Filmora', 'Flow'] },
    { key: '3d', label: '3D', tags: ['3D', 'Blender', 'Digital Twin', 'Three.js'] },
    { key: 'sound', label: 'サウンド', tags: ['Sound', 'Studio One', 'SunoAI'] },
    { key: 'code', label: 'コード', tags: ['Creative Coding', 'Processing', 'Web', 'Web App', 'Next.js', 'Unity', 'MetaQuest', 'Supabase'] },
    { key: 'ai', label: 'AI', tags: ['AI', 'LLM', 'RAG', 'SunoAI', 'ChatGPT', 'Gemini'] },
];

const inMedium = (work: Work, key: string) => MEDIA.find((m) => m.key === key)?.tags.some((t) => work.tags.includes(t)) ?? false;

export default function GalleryGrid({ items }: { items: Work[] }) {
    const [active, setActive] = useState<string>('all');
    const filters = useMemo(() => [
        { key: 'all', label: 'すべて', count: items.length },
        ...MEDIA.map((m) => ({ key: m.key, label: m.label, count: items.filter((w) => inMedium(w, m.key)).length })).filter((f) => f.count > 0),
    ], [items]);
    const visible = active === 'all' ? items : items.filter((w) => inMedium(w, active));

    return (
        <>
            <div className="mag-filter" role="group" aria-label="作品を媒体で絞り込む">
                {filters.map((f) => (
                    <button key={f.key} type="button" className="mag-filter__chip" aria-pressed={active === f.key} onClick={() => setActive(f.key)}>
                        {f.label}<span className="mag-filter__count">{f.count}</span>
                    </button>
                ))}
            </div>
            <p className="mag-filter__status mag-sr-only" aria-live="polite">{active === 'all' ? `${items.length} 点の作品` : `${filters.find((f) => f.key === active)?.label}：${visible.length} 点`}</p>
            {/* 並びの型（4+2 ／ 2+2+2 ／ 3+3）は、表示中の作品の順番で決め直す */}
            <ul className="mag-gallery__grid" key={active}>
                {visible.map((work, index) => {
                    const href = workHref(work);
                    const body = (
                        <>
                            <span className="mag-tile__photo">
                                <Image src={work.image} alt="" width={900} height={600} sizes="(max-width: 760px) 100vw, 40vw" className={work.imageFit === 'contain' ? 'is-contain' : undefined} />
                            </span>
                            <span className="mag-tile__caption">
                                <span className="mag-tile__title">{work.title}</span>
                                <span className="mag-tile__note"><CategoryMark category={work.category ?? 'creative'} />{work.description}</span>
                                {hasDetailPage(work) && <span className="mag-tile__more" aria-hidden="true">詳細 →</span>}
                            </span>
                        </>
                    );
                    return (
                        <li key={work.id} className={'mag-tile mag-tile--' + (index % 7)} style={{ '--i': index } as React.CSSProperties}>
                            {href ? <SmartLink href={href} className="mag-tile__link">{body}</SmartLink> : <div className="mag-tile__link">{body}</div>}
                        </li>
                    );
                })}
            </ul>
        </>
    );
}
