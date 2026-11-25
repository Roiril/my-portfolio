import type { Metadata } from 'next';
import { workPages } from '@/content/work-pages';
import { works } from '@/content/works';

// 詳細ページの検索結果と共有の情報
export function workMetadata(id: string): Metadata {
    const page = workPages.find((p) => p.id === id);
    const work = works.find((w) => w.id === id && !w.hidden);
    if (!page || !work) throw new Error(`作品がありません: ${id}`);
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
