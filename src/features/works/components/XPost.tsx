import Image from 'next/image';
import type { Pic } from '@/content/work-pages';

// X の投稿を見開きの中に置く（サーバーコンポーネント）。
// 公式の埋め込み（widgets.js）は、ブラウザの設定によって高さ 0 のまま表示されないことがあったので使わない。
// 代わりに、公開されている投稿データ（react-tweet と同じ syndication API）をビルド時に取り、
// 動画は X の配信 URL を <video> でそのまま再生する。取れなかったときは投稿へのリンクだけを出す。

type Variant = { content_type: string; bitrate?: number; url: string };
type TweetData = {
    text: string;
    created_at: string;
    user?: { name: string; screen_name: string };
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

async function readPost(url: string) {
    const id = url.match(/status\/(\d+)/)?.[1];
    const tweet = id ? await fetchTweet(id) : null;
    const media = tweet?.mediaDetails?.[0];
    const mp4 = media?.video_info?.variants.filter((v) => v.content_type === 'video/mp4').sort((a, b) => (b.bitrate ?? 0) - (a.bitrate ?? 0))[0];
    const ratio = media?.original_info ? `${media.original_info.width} / ${media.original_info.height}` : '16 / 9';
    // 本文の末尾に付く t.co の短縮 URL は、投稿へのリンクを別に置くので外す
    const text = tweet?.text.replace(/\s*https:\/\/t\.co\/\S+/g, '').trim();
    return { tweet, media, mp4, ratio, text };
}

export default async function XPost({ url, title, caption, stats }: { url: string; title: string; caption?: string; stats?: { label: string; value: string }[] }) {
    const { media, mp4, ratio, text } = await readPost(url);

    return (
        <figure className="wp-post">
            {mp4 ? (
                <div className="wp-post__frame" style={{ aspectRatio: ratio }}>
                    <video controls preload="none" playsInline poster={media?.media_url_https} aria-label={title}>
                        <source src={mp4.url} type="video/mp4" />
                    </video>
                </div>
            ) : null}
            <figcaption>
                <strong>{title}</strong>
                {caption && <span>{caption}</span>}
                {text && <q>{text}</q>}
                {stats && stats.length > 0 && (
                    <dl>
                        {stats.map((s) => (
                            <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
                        ))}
                    </dl>
                )}
                <a href={url} target="_blank" rel="noopener noreferrer">X で投稿を見る<span aria-hidden="true"> ↗</span><span className="wp-sr">（新しいタブで開きます）</span></a>
            </figcaption>
        </figure>
    );
}

// 来場した方の投稿と、授賞式の写真を 1 つの面に組む
export async function XVoice({ url, title, photos, award }: { url: string; title: string[]; photos: string[]; award: Pic }) {
    const { tweet, media, mp4, ratio, text } = await readPost(url);
    const pictures = (tweet?.mediaDetails ?? []).filter((m) => m.type === 'photo');
    const posted = tweet && new Date(tweet.created_at).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="wp-voice">
            <h2 className="wp-voice__head">{title.map((t) => <span key={t} className="wp-phrase">{t}</span>)}</h2>
            <figure className="wp-voice__award">
                <Image src={award.src} alt={award.alt} width={award.w} height={award.h} sizes="(max-width: 760px) 46vw, 24vw" />
                {award.caption && <figcaption>{award.caption}</figcaption>}
            </figure>
            {mp4 && (
                <div className="wp-voice__video" style={{ aspectRatio: ratio }}>
                    <video controls preload="none" playsInline poster={media?.media_url_https} aria-label={title.join(' ')}>
                        <source src={mp4.url} type="video/mp4" />
                    </video>
                </div>
            )}
            <div className="wp-voice__text">
                {text && <blockquote cite={url}>{text}</blockquote>}
                <p className="wp-voice__by">
                    {tweet?.user && <span>{tweet.user.name}（@{tweet.user.screen_name}）さん</span>}
                    {posted && <span>{posted}</span>}
                    <a href={url} target="_blank" rel="noopener noreferrer">X で投稿を見る<span aria-hidden="true"> ↗</span><span className="wp-sr">（新しいタブで開きます）</span></a>
                </p>
            </div>
            {pictures.length > 0 && (
                <div className="wp-voice__photos">
                    {pictures.map((m, i) => (
                        // X の配信画像をそのまま出す
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={m.media_url_https} src={`${m.media_url_https}?name=small`} alt={photos[i] ?? ''} loading="lazy" decoding="async" />
                    ))}
                </div>
            )}
        </div>
    );
}
