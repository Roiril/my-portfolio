import { works } from '@/content/works';
import { SectionHeader, Tag, Link } from '@/components/ui';

export default function Works() {
    const allWorks = works;

    return (
        <section id="works" className="px-8 py-12 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10">
                    <SectionHeader title="Works" />
                    <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl">
                        研究・インターン・個人開発から，映像やクリエイティブコーディングまでをまとめています．
                    </p>
                </div>

                <div className="flex flex-col gap-10 pointer-events-auto">
                    {allWorks.map((work) => (
                        <div key={work.id} className="flex flex-col md:flex-row gap-8 md:gap-12 items-start pb-10 border-b border-gray-200 last:border-b-0">
                            <div className="w-full md:w-1/3 h-48 md:h-64 bg-gray-100 relative overflow-hidden flex-shrink-0 flex items-center justify-center">
                                {work.image ? (
                                    <img
                                        src={work.image}
                                        alt={work.title}
                                        className={`w-full h-full ${work.imageFit === 'contain' ? 'object-contain' : 'object-cover'}`}
                                    />
                                ) : (
                                    <span className="text-[10px] text-gray-400 tracking-widest uppercase">
                                        Image coming soon
                                    </span>
                                )}
                            </div>

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

                                <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 leading-tight">
                                    {work.title}
                                </h3>

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
                                    <div className="flex flex-row gap-8">
                                        {work.links.map((link) => (
                                            <Link
                                                key={link.url}
                                                href={link.url}
                                                isExternal
                                                size="sm"
                                            >
                                                {link.type === 'launch'
                                                    ? 'Launch'
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
        </section>
    );
}
