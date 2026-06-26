import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { works } from '@/content/works';
import { WorkGalleryImage } from '@/features/works/types';
import { Tag, Link as ExternalLink } from '@/components/ui';
import Footer from '@/components/layout/Footer';

type Params = { id: string };

// sm以上の列数に応じたグリッドクラス（Tailwindに拾わせるため静的に列挙）
const GRID_COLS: Record<number, string> = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
};

// 列数ごとの画像の高さ（縦幅を揃えるため固定し、はみ出しは object-cover で切り取る）
const CELL_HEIGHT: Record<number, string> = {
    2: 'h-60 sm:h-80',
    3: 'h-44 sm:h-56',
    4: 'h-36 sm:h-44',
};

function Gallery({
    images,
    fallbackAlt,
    columns = 2,
}: {
    images: WorkGalleryImage[];
    fallbackAlt: string;
    columns?: 2 | 3 | 4;
}) {
    return (
        <div className={`grid ${GRID_COLS[columns]} gap-4 sm:gap-5`}>
            {images.map((img) => (
                <div
                    key={img.src}
                    className={`bg-gray-100 overflow-hidden border border-gray-200 ${CELL_HEIGHT[columns]} ${
                        img.wide ? 'sm:col-span-2 sm:h-96' : ''
                    }`}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.src}
                        alt={img.alt ?? fallbackAlt}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
}

// detail を持つ作品だけ静的に書き出す
export function generateStaticParams(): Params[] {
    return works.filter((w) => w.detail).map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { id } = await params;
    const work = works.find((w) => w.id === id && w.detail);
    if (!work) return {};
    const description = work.detail?.lead ?? work.description;
    return {
        title: `${work.title} | 白石大晴 Portfolio`,
        description,
        openGraph: {
            title: `${work.title} | 白石大晴 Portfolio`,
            description,
            images: work.image ? [{ url: work.image }] : undefined,
        },
    };
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
    const { id } = await params;
    const work = works.find((w) => w.id === id && w.detail);
    if (!work || !work.detail) notFound();

    const { detail } = work;

    return (
        <main className="relative min-h-screen text-gray-900 font-sans bg-white">
            <article className="px-8 py-16 sm:py-20">
                <div className="max-w-4xl mx-auto">
                    {/* 戻る */}
                    <Link
                        href="/#works"
                        className="text-xs text-gray-500 tracking-widest uppercase border-b-2 border-black/10 pb-0.5 transition-colors hover:text-black"
                    >
                        ← Works
                    </Link>

                    {/* ヘッダー */}
                    <header className="mt-8 mb-10 border-b-2 border-black pb-6">
                        {(work.period || work.role) && (
                            <p className="text-xs text-gray-500 mb-3">
                                {[work.period, work.role].filter(Boolean).join('　/　')}
                            </p>
                        )}
                        <h1 className="text-3xl sm:text-4xl font-bold text-black leading-tight mb-5">
                            {work.title}
                        </h1>
                        {detail.lead && (
                            <p className="text-base sm:text-lg text-gray-800 leading-8 max-w-2xl">
                                {detail.lead}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-3 mt-6">
                            {work.tags.map((tag) => (
                                <Tag key={tag}>{tag}</Tag>
                            ))}
                        </div>
                        {work.links.length > 0 && (
                            <div className="flex flex-row flex-wrap gap-8 mt-6">
                                {work.links.map((link) => (
                                    <ExternalLink key={link.url} href={link.url} isExternal size="sm">
                                        {link.type === 'launch'
                                            ? link.label || 'Launch'
                                            : link.type === 'paper'
                                              ? link.label || 'Paper'
                                              : link.label || 'Video'}
                                    </ExternalLink>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* 本文 */}
                    {detail.body && detail.body.length > 0 && (
                        <div className="mb-12 max-w-2xl flex flex-col gap-5">
                            {detail.body.map((paragraph, i) => (
                                <p key={i} className="text-sm sm:text-base text-gray-800 leading-8">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    )}

                    {/* 単一ギャラリー */}
                    {detail.gallery && detail.gallery.length > 0 && (
                        <Gallery images={detail.gallery} fallbackAlt={work.title} />
                    )}

                    {/* セクション（小作品集など） */}
                    {detail.sections && detail.sections.length > 0 && (
                        <div className="flex flex-col gap-14">
                            {detail.sections.map((section, i) => (
                                <section key={section.title ?? i}>
                                    {section.title && (
                                        <h2 className="text-lg sm:text-xl font-bold text-black mb-3 border-b border-gray-200 pb-2">
                                            {section.title}
                                        </h2>
                                    )}
                                    {section.body && section.body.length > 0 && (
                                        <div className="mb-5 max-w-2xl flex flex-col gap-3">
                                            {section.body.map((paragraph, j) => (
                                                <p key={j} className="text-sm sm:text-base text-gray-800 leading-8">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                    {section.gallery && section.gallery.length > 0 && (
                                        <Gallery
                                            images={section.gallery}
                                            fallbackAlt={section.title ?? work.title}
                                            columns={section.columns}
                                        />
                                    )}
                                    {section.links && section.links.length > 0 && (
                                        <div className="flex flex-row flex-wrap gap-8 mt-5">
                                            {section.links.map((link) => (
                                                <ExternalLink key={link.url} href={link.url} isExternal size="sm">
                                                    {link.type === 'launch'
                                                        ? link.label || 'Launch'
                                                        : link.type === 'paper'
                                                          ? link.label || 'Paper'
                                                          : link.label || 'Video'}
                                                </ExternalLink>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </article>
            <Footer />
        </main>
    );
}
