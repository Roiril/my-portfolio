import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { works } from '@/content/works';
import { features } from '@/content/magazine';
import { hasDetailPage } from '@/features/works';
import Footer from '@/components/layout/Footer';
import SiteHeader from '@/components/layout/SiteHeader';
import CoupleSyncDetail from '@/features/works/components/CoupleSyncDetail';
import WorkCaseStudy, { type CaseBack, type CaseTheme } from '@/features/works/components/WorkCaseStudy';

type Params = { id: string };

// 詳細ページはトップの誌面と揃えず、作品ごとに 1 冊の雑誌として色を決める。
// 特集の作品は見開きと同じ色（magazine.ts）。そのほかは作品の写真から取った色。
// 差し色は小さな番号や副題にも使うので、地の上で読める濃さにする
const ART: Record<string, CaseTheme> = {
    'ai-business-tools': { paper: '#f4f5fb', ink: '#14163a', accent: '#2433ff' },
    'blender-works': { paper: '#f2efe9', ink: '#1d1b18', accent: '#b4441c' },
    'meiji-3d': { paper: '#eef1ee', ink: '#18211c', accent: '#2f6b4a' },
    'uniqlo-future': { paper: '#ffffff', ink: '#111111', accent: '#d7000f' },
    aquarium: { paper: '#fff6ec', ink: '#1f160e', accent: '#b34b09' },
    'ai-music-video': { paper: '#14121c', ink: '#efeaf7', accent: '#b69cff' },
    'retroTV-portfolio': { paper: '#f3ead8', ink: '#2a1f12', accent: '#a5520f' },
    'cube-diary': { paper: '#0c0d12', ink: '#e8eaf2', accent: '#8fd3ff' },
    'metaquest-devs': { paper: '#f2f4f7', ink: '#111827', accent: '#1d4ed8' },
    'ai-composition': { paper: '#fbf2f5', ink: '#24121a', accent: '#b0215a' },
};
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
        // X の動画の配信元（video.twimg.com）は、外のサイトからの Referer が付くと 403 を返す。
        // X の動画を置くページだけ Referer を送らないようにする
        referrer: work.media?.some((m) => m.type === 'x') ? 'no-referrer' : undefined,
        title: `${work.title} | 白石大晴 Portfolio`,
        description,
        alternates: { canonical: '/works/' + work.id },
        openGraph: {
            title: `${work.title} | 白石大晴 Portfolio`,
            description,
            url: '/works/' + work.id,
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
        return <><SiteHeader skipHref="#couple-content" /><CoupleSyncDetail tech={work.tech} /><Footer topHref="#couple-content" /></>;
    }

    const feature = features.find((f) => f.workId === id);
    // 詳細ページの差し色は小さな番号や副題に使うので、文字用の色（accentText）があればそちらを使う
    const base: CaseTheme & { accentText?: string } = feature?.theme ?? ART[id] ?? DEFAULT_THEME;
    const theme: CaseTheme = { paper: base.paper, ink: base.ink, accent: base.accentText ?? base.accent };
    // 特集の作品は見開きへ、そのほかは作品のページのその作品の位置へ戻す
    const back: CaseBack = feature
        ? { href: '/#feature-' + id, label: '特集へ戻る' }
        : { href: '/#work-' + id, label: '作品のページへ戻る' };
    return (
        <>
            <SiteHeader />
            <WorkCaseStudy work={work} theme={theme} back={back} prev={pages[index - 1]} next={pages[index + 1]} />
            <Footer />
        </>
    );
}
