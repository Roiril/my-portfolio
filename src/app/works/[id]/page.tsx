import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { workPages } from '@/content/work-pages';
import { works } from '@/content/works';
import { frontHrefOfWork } from '@/features/front';
import WorkPage from '@/features/works/components/WorkPage';

type Params = { id: string };

const workOf = (id: string) => {
    const work = works.find((w) => w.id === id && !w.hidden);
    if (!work) throw new Error(`作品がありません: ${id}`);
    return work;
};

export function generateStaticParams(): Params[] {
    return workPages.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
    const { id } = await params;
    const page = workPages.find((p) => p.id === id);
    if (!page) return {};
    const work = workOf(id);
    const title = `${work.title} | 白石大晴 Portfolio`;
    return {
        // X の動画の配信元（video.twimg.com）は、外のサイトからの Referer が付くと 403 を返す。
        // X の動画を置くページだけ Referer を送らないようにする
        referrer: work.media?.some((m) => m.type === 'x') ? 'no-referrer' : undefined,
        title,
        description: page.say,
        alternates: { canonical: '/works/' + work.id },
        openGraph: {
            title,
            description: page.say,
            url: '/works/' + work.id,
            images: work.image ? [{ url: work.image }] : undefined,
        },
    };
}

export default async function WorkDetailPage({ params }: { params: Promise<Params> }) {
    const { id } = await params;
    const index = workPages.findIndex((p) => p.id === id);
    if (index < 0) notFound();
    const page = workPages[index];
    const neighbor = (i: number) => (workPages[i] ? { page: workPages[i], title: workOf(workPages[i].id).title } : undefined);
    return (
        <WorkPage
            page={page}
            title={workOf(id).title}
            backHref={frontHrefOfWork(id)}
            prev={neighbor(index - 1)}
            next={neighbor(index + 1)}
        />
    );
}
