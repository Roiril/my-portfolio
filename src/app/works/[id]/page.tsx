import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { works } from '@/content/works';
import { features } from '@/content/magazine';
import { hasDetailPage } from '@/features/works';
import Footer from '@/components/layout/Footer';
import SiteHeader from '@/components/layout/SiteHeader';
import CoupleSyncDetail from '@/features/works/components/CoupleSyncDetail';
import WorkCaseStudy, { type CaseTheme } from '@/features/works/components/WorkCaseStudy';

type Params = { id: string };

// 特集でない作品の色。誌面の地と同じ白・黒・コバルト
const DEFAULT_THEME: CaseTheme = { paper: '#ffffff', ink: '#121212', accent: '#2433ff' };

// 詳細ページを持つ作品（一覧に出しているものだけ）。前後の作品への送りもこの順
const pages = works.filter((w) => !w.hidden && hasDetailPage(w));

export function generateStaticParams(): Params[] {
    return pages.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { id } = await params;
    const work = pages.find((w) => w.id === id);
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
    const index = pages.findIndex((w) => w.id === id);
    if (index < 0) notFound();
    const work = pages[index];

    if (id === 'couple-sync') {
        return <><SiteHeader skipHref="#couple-content" /><CoupleSyncDetail tech={work.tech} /><Footer /></>;
    }

    const theme = features.find((f) => f.workId === id)?.theme ?? DEFAULT_THEME;
    return (
        <>
            <SiteHeader />
            <WorkCaseStudy work={work} theme={theme} prev={pages[index - 1]} next={pages[index + 1]} />
            <Footer />
        </>
    );
}
