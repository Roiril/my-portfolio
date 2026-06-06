import Image from 'next/image';
import { aboutData } from '@/content/about';
import { SectionHeader, Tag } from '@/components/ui';

export default function About() {
    return (
        <section id="about" className="px-8 py-12 bg-gray-50">
            <div className="max-w-3xl mx-auto">
                {/* セクションヘッダー & プロフィール画像 */}
                <div className="flex items-center gap-4 sm:gap-6 mb-8">
                    {aboutData.profileImage && (
                        <div className="flex-shrink-0">
                            <Image
                                src={aboutData.profileImage.src}
                                alt={aboutData.profileImage.alt}
                                width={80}
                                height={80}
                                className="w-14 h-14 sm:w-20 sm:h-20 rounded-full object-cover border border-black/10 shadow-sm"
                                priority
                            />
                        </div>
                    )}
                    <SectionHeader title="About" size="md" className="mb-0 mt-6" />
                </div>

                {/* 紹介文 */}
                <div className="mb-6 pointer-events-auto">
                    <div className="space-y-4">
                        {aboutData.bio.map((paragraph, index) => (
                            <p
                                key={index}
                                className="text-base sm:text-lg text-gray-800 leading-relaxed"
                            >
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* 通底する3つの軸 */}
                {aboutData.axes && aboutData.axes.length > 0 && (
                    <div className="mb-10 pointer-events-auto border-t border-b border-gray-200 divide-y divide-gray-200">
                        {aboutData.axes.map((axis) => (
                            <div key={axis.tag} className="flex gap-4 sm:gap-6 py-4">
                                <span className="text-2xl font-black text-gray-300 leading-none w-6 flex-shrink-0">
                                    {axis.tag}
                                </span>
                                <div>
                                    <h3 className="text-base font-bold text-black mb-1 leading-snug">
                                        {axis.title}
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {axis.body}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 2カラム構成のグリッド (Key Facts & Tools) */}
                <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-6 pointer-events-auto">
                    {/* Key Facts */}
                    {aboutData.keyFacts?.map((fact) => (
                        <div key={fact.title} className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                                {fact.title}
                            </span>
                            <span className="text-base text-gray-800 leading-normal">
                                {fact.description}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Skill Sections - モバイルでは1列、幅広で2列 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-8 mt-10 pointer-events-auto">
                    {aboutData.toolSections?.map((section) => (
                        <div key={section.title} className="flex flex-col">
                            <span className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">
                                {section.title}
                            </span>

                            <div className="flex flex-wrap gap-1.5">
                                {section.categories?.flatMap((category) =>
                                    category.items.flatMap((item) =>
                                        item.name.split(',').map((s) => s.trim())
                                    )
                                ).map((toolName) => (
                                    <Tag key={toolName}>{toolName}</Tag>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
