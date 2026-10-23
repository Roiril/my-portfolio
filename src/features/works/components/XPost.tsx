// X の投稿を、誌面の組みで見せる（サーバーコンポーネント）。
// 公式の埋め込み（widgets.js）は、ブラウザの設定によって高さ 0 のまま表示されないことがあったので使わない。
// 代わりに、公開されている投稿データ（react-tweet と同じ syndication API）をビルド時に取り、
// 動画は X の配信 URL を <video> でそのまま再生する。取れなかったときは投稿へのリンクだけを出す。

type Variant = { content_type: string; bitrate?: number; url: string };
type TweetData = {
    text: string;
    created_at: string;
    mediaDetails?: { type: string; media_url_https: string; original_info?: { width: number; height: number }; video_info?: { variants: Variant[] } }[];
};

// react-tweet と同じ、投稿 ID から token を作る式
const tokenOf = (id: string) => ((Number(id) / 1e15) * Math.PI).toString(6 ** 2).replace(/(0+|\.)/g, '');

async function fetchTweet(id: string): Promise<TweetData | null> {
    try {
        const res = await fetch(`https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=${tokenOf(id)}&lang=ja`, { next: { revalidate: 60 * 60 * 24 } });
        if (!res.ok) return null;
        return (await res.json()) as TweetData;
    } catch {
        return null;
    }
}

export default async function XPost({ url, title, caption }: { url: string; title: string; caption?: string }) {
    const id = url.match(/status\/(\d+)/)?.[1];
    const tweet = id ? await fetchTweet(id) : null;
    const media = tweet?.mediaDetails?.[0];
    const mp4 = media?.video_info?.variants.filter((v) => v.content_type === 'video/mp4').sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0];
    const ratio = media?.original_info ? `${media.original_info.width} / ${media.original_info.height}` : '16 / 9';
    // 本文の末尾に付く t.co の短縮 URL は、下に投稿へのリンクを置くので外す
    const text = tweet?.text.replace(/\s*https:\/\/t\.co\/\S+/g, '').trim();

    return (
        <figure className="case-post">
            {mp4 ? (
                <div className="case-post__frame" style={{ aspectRatio: ratio }}>
                    <video controls preload="none" playsInline poster={media?.media_url_https} aria-label={title}>
                        <source src={mp4.url} type="video/mp4" />
                    </video>
                </div>
            ) : null}
            <figcaption>
                <strong>{title}</strong>
                {caption && <span>{caption}</span>}
                {text && <q className="case-post__text">{text}</q>}
                <a href={url} target="_blank" rel="noopener noreferrer">X で投稿を見る<span aria-hidden="true"> ↗</span><span className="case-sr-only">（新しいタブで開きます）</span></a>
            </figcaption>
        </figure>
    );
}
