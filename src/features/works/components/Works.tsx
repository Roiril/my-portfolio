import NextLink from 'next/link';
import { works } from '@/content/works';
import { Work, WorkCategory } from '@/features/works/types';
import { SectionHeader, Tag, Link } from '@/components/ui';
import { WorkCardMedia } from './WorkCardMedia';

const CATEGORY_GROUPS: { key: WorkCategory; label: string; sublabel: string }[] = [
    { key: 'research', label: '研究 / Research', sublabel: 'HCI・XRの研究プロジェクト' },
    { key: 'internship', label: 'インターン / Internship', sublabel: '実務で開発・運用したもの' },
    { key: 'personal', label: '個人開発 / Personal', sublabel: '自分の生活と研究のために作ったツール' },
    { key: 'creative', label: '制作 / Creative', sublabel: '映像・3D・サウンド・クリエイティブコーディング' },
];

function groupOf(work: Work): WorkCategory {
    return work.category ?? 'creative';
}

export default function Works() {
    return (
        <section id="works" className="px-8 py-12 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <SectionHeader title="Works" />
                    <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl">
                        研究・インターン・個人開発から，映像やクリエイティブコーディングまでをまとめています．
                    </p>
                </div>

                {CATEGORY_GROUPS.map(({ key, label, sublabel }) => {
                    const groupWorks = works.filter((w) => groupOf(w) === key && !w.hidden);
                    if (groupWorks.length === 0) return null;
                    return (
                        <div key={key} className="mb-14 last:mb-0">
                            <div className="mb-8 border-b-2 border-black pb-2">
                                <h3 className="text-sm font-bold text-black tracking-widest uppercase">
                                    {label}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
                            </div>

                            <div className="flex flex-col gap-10 pointer-events-auto">
                                {groupWorks.map((work) => (
                        <div
                            key={work.id}
                            className={`group relative flex flex-col md:flex-row gap-8 md:gap-12 items-start pb-10 border-b border-gray-200 last:border-b-0 ${
                                work.detail
                                    ? 'md:-mx-6 md:px-6 md:pt-6 rounded-sm transition-colors duration-300 hover:bg-gray-50 cursor-pointer'
                                    : ''
                            }`}
                        >
                            {work.detail ? (
                                <NextLink
                                    href={`/works/${work.id}`}
                                    aria-label={`${work.title} の詳細を見る`}
                                    className="absolute inset-0 z-10"
                                />
                            ) : null}
                            {(() => {
                                const boxClass = 'w-full md:w-1/3 h-48 md:h-64 bg-gray-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center';
                                if (!work.image) {
                                    return (
                                        <div className={boxClass}>
                                            <span className="text-[10px] text-gray-400 tracking-widest uppercase">
                                                Image coming soon
                                            </span>
                                        </div>
                                    );
                                }
                                if (!work.detail) {
                                    return (
                                        <div className={boxClass}>
                                            <WorkCardMedia images={[work.image]} alt={work.title} fit={work.imageFit} />
                                        </div>
                                    );
                                }
                                const detailImages = [
                                    ...(work.detail.gallery?.map((g) => g.src) ?? []),
                                    ...(work.detail.sections?.flatMap((s) => s.gallery?.map((g) => g.src) ?? []) ?? []),
                                ];
                                const slideImages = [work.image, ...detailImages];
                                return (
                                    <NextLink
                                        href={`/works/${work.id}`}
                                        tabIndex={-1}
                                        aria-hidden
                                        className={`relative z-20 ${boxClass}`}
                                    >
                                        <WorkCardMedia
                                            images={slideImages}
                                            alt={work.title}
                                            fit={work.imageFit}
                                            interactive
                                        />
                                    </NextLink>
                                );
                            })()}

                            <div className="flex-1 flex flex-col">
                                {work.featured && (
                                    <span className="text-xs font-semibold text-black mb-4 uppercase tracking-widest">
                                        Featured
                                    </span>
                                )}

                                {(work.period || work.role) && (
                                    <p className="text-xs text-gray-500 mb-2">
                                        {[work.period, work.role].filter(Boolean).join('　/　')}
                                    </p>
                                )}

                                <h4 className={`text-xl sm:text-2xl font-bold text-black mb-4 leading-tight ${work.detail ? 'underline decoration-2 underline-offset-4 decoration-transparent transition-colors duration-300 group-hover:decoration-black' : ''}`}>
                                    {work.title}
                                </h4>

                                <p className="text-sm sm:text-base text-gray-800 mb-2 leading-7 whitespace-pre-line">
                                    {work.description}
                                </p>

                                <div className="flex flex-wrap gap-3 mb-6">
                                    {work.tags.map((tag) => (
                                        <Tag key={tag}>{tag}</Tag>
                                    ))}
                                </div>

                                {work.isCurrent ? (
                                    <div className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                                        Currently in development
                                    </div>
                                ) : null}
                                {work.links.length > 0 ? (
                                    <div className="relative z-20 flex flex-row gap-8 self-start">
                                        {work.links.map((link) => (
                                            <Link
                                                key={link.url}
                                                href={link.url}
                                                isExternal
                                                size="sm"
                                            >
                                                {link.type === 'launch'
                                                    ? link.label || 'Launch'
                                                    : link.type === 'paper'
                                                        ? link.label || 'Paper'
                                                        : link.label || 'Video'}
                                            </Link>
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
