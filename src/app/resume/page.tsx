"use client";

import { works } from '@/content/works';
import {
    resumeProfile,
    resumeEducation,
    resumeSkills,
    resumeAwards,
} from '@/content/resume';
import type { Work } from '@/features/works/types';

const research = works.filter((w) => w.category === 'research');
const internship = works.filter((w) => w.category === 'internship');
const personal = works.filter((w) => w.category === 'personal');

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="text-[12px] font-bold tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-2.5 uppercase">
            {children}
        </h2>
    );
}

function WorkRow({ work }: { work: Work }) {
    const meta = [work.period, work.role].filter(Boolean).join('　/　');
    return (
        <div className="break-inside-avoid grid grid-cols-[8.5rem_1fr] gap-x-4 py-1.5">
            <div className="text-[10.5px] text-gray-500 leading-snug pt-0.5">{meta}</div>
            <div>
                <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-[13px] font-bold text-black leading-snug">{work.title}</h3>
                    {work.isCurrent && (
                        <span className="text-[9px] text-gray-400 tracking-widest uppercase shrink-0">
                            in progress
                        </span>
                    )}
                </div>
                <p className="text-[11px] text-gray-700 leading-relaxed mt-0.5">{work.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {work.tags.map((t) => (
                        <span key={t} className="text-[9.5px] text-gray-600 bg-gray-100 border border-gray-200 px-1.5 py-0.5">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ResumePage() {
    return (
        <main className="min-h-screen bg-neutral-200 py-8 print:bg-white print:py-0">
            {/* ツールバー（画面のみ・印刷時は非表示） */}
            <div className="print:hidden max-w-[800px] mx-auto mb-4 flex items-center justify-between px-4">
                <a href="/" className="text-sm text-gray-600 hover:text-black underline">
                    ← サイトに戻る
                </a>
                <button
                    onClick={() => window.print()}
                    className="text-sm font-semibold bg-black text-white px-5 py-2 hover:bg-gray-800"
                >
                    PDFで保存 / 印刷
                </button>
            </div>

            {/* A4シート */}
            <article className="resume-sheet bg-white text-gray-900 mx-auto max-w-[800px] shadow-lg px-12 py-10 print:shadow-none print:max-w-none print:w-full print:px-0 print:py-0">
                {/* ヘッダー */}
                <header className="border-b-2 border-black pb-4 mb-5">
                    <div className="flex items-end justify-between flex-wrap gap-2">
                        <div>
                            <h1 className="text-[28px] font-black leading-none">{resumeProfile.name}</h1>
                            <p className="text-[12px] text-gray-500 mt-1 tracking-wide">{resumeProfile.kana}</p>
                        </div>
                        <p className="text-[13px] font-bold text-black">{resumeProfile.title}</p>
                    </div>
                    <p className="text-[12px] text-gray-700 mt-2.5 leading-relaxed">{resumeProfile.tagline}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-[10.5px] text-gray-600 mt-2.5">
                        <span>{resumeProfile.email}</span>
                        <span>{resumeProfile.location}</span>
                        {resumeProfile.links.map((l) => (
                            <span key={l.platform}>
                                {l.platform}: {l.url.replace(/^https?:\/\//, '')}
                            </span>
                        ))}
                    </div>
                </header>

                {/* 概要 */}
                <section className="mb-5">
                    <SectionTitle>Summary</SectionTitle>
                    <p className="text-[11.5px] text-gray-800 leading-relaxed">{resumeProfile.summary}</p>
                </section>

                {/* 学歴 */}
                <section className="mb-5 break-inside-avoid">
                    <SectionTitle>学歴 / Education</SectionTitle>
                    {resumeEducation.map((e) => (
                        <div key={e.title} className="grid grid-cols-[8.5rem_1fr] gap-x-4 py-1">
                            <div className="text-[10.5px] text-gray-500 pt-0.5">{e.period}</div>
                            <div>
                                <p className="text-[12px] font-semibold text-black leading-snug">{e.title}</p>
                                {e.detail && <p className="text-[10.5px] text-gray-600">{e.detail}</p>}
                            </div>
                        </div>
                    ))}
                </section>

                {/* 研究 */}
                <section className="mb-5">
                    <SectionTitle>研究 / Research</SectionTitle>
                    {research.map((w) => (
                        <WorkRow key={w.id} work={w} />
                    ))}
                </section>

                {/* インターン・職務経験 */}
                <section className="mb-5">
                    <SectionTitle>インターン / Experience</SectionTitle>
                    {internship.map((w) => (
                        <WorkRow key={w.id} work={w} />
                    ))}
                </section>

                {/* 個人開発 */}
                <section className="mb-5">
                    <SectionTitle>個人開発 / Projects</SectionTitle>
                    {personal.map((w) => (
                        <WorkRow key={w.id} work={w} />
                    ))}
                    <p className="text-[10.5px] text-gray-500 mt-1.5">
                        ほか，映像・3D・クリエイティブコーディング作品はポートフォリオサイトに掲載．
                    </p>
                </section>

                {/* スキル */}
                <section className="mb-5 break-inside-avoid">
                    <SectionTitle>スキル / Skills</SectionTitle>
                    <div className="space-y-2">
                        {resumeSkills.map((tier) => (
                            <div key={tier.label} className="grid grid-cols-[8.5rem_1fr] gap-x-4 items-start">
                                <div className="pt-0.5">
                                    <p className="text-[11px] font-bold text-black">{tier.label}</p>
                                    <p className="text-[9.5px] text-gray-500 leading-snug">{tier.note}</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {tier.items.map((it) => (
                                        <span key={it} className="text-[10px] text-gray-700 bg-gray-100 border border-gray-200 px-2 py-0.5">
                                            {it}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 受賞・活動 */}
                <section className="break-inside-avoid">
                    <SectionTitle>受賞・活動 / Awards</SectionTitle>
                    {resumeAwards.map((a) => (
                        <div key={a.text} className="grid grid-cols-[8.5rem_1fr] gap-x-4 py-1">
                            <div className="text-[10.5px] text-gray-500 pt-0.5">{a.period}</div>
                            <p className="text-[11.5px] text-gray-800">{a.text}</p>
                        </div>
                    ))}
                </section>
            </article>
        </main>
    );
}
