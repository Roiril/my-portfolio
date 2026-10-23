import Image from 'next/image';
import NextLink from 'next/link';
import { art, type ArtImage } from '@/content/magazine-art';
import { detailHref, hasDetailPage } from '@/features/works';
import type { Work, WorkCategory, WorkLink } from '@/features/works/types';

// 誌面のあちこちで使う小さな部品と関数。サーバー側の誌面と、クライアント側の操作部品の両方から使う

export const CATEGORY_LABEL: Record<WorkCategory, string> = {
    research: '研究',
    personal: '個人開発',
    internship: '実務',
    creative: '制作',
};

// 分類ごとの小さな挿絵（2 色刷りのアイコン）
const CATEGORY_ICON: Record<WorkCategory, ArtImage> = {
    research: art.iconResearch,
    personal: art.iconPersonal,
    internship: art.iconInternship,
    creative: art.iconCreative,
};

export function CategoryMark({ category }: { category: WorkCategory }) {
    const icon = CATEGORY_ICON[category];
    return (
        <span className="mag-cat">
            <Image src={icon.src} alt="" width={icon.width} height={icon.height} sizes="32px" className="mag-cat__icon" />
            {CATEGORY_LABEL[category]}
        </span>
    );
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

// 作品の行き先。詳細ページがあればそちら、無ければ最初のリンク
export function workHref(work: Work): string | undefined {
    return hasDetailPage(work) ? detailHref(work) : work.links[0]?.url;
}

export function linkLabel(link: WorkLink): string {
    if (link.label) return link.label;
    return link.type === 'launch' ? 'サイトを開く' : link.type === 'paper' ? '論文を読む' : '動画を見る';
}

// hidden：同じ行き先のリンクがすぐ近くにあるとき、キーボードと読み上げから外す（マウスでは押せる）
// arrow：文の後ろに ↗ を付ける（読み上げには出さない）
export function SmartLink({ href, className, children, hidden, arrow }: { href: string; className?: string; children: React.ReactNode; hidden?: boolean; arrow?: boolean }) {
    const newTab = isExternal(href) || href.endsWith('.pdf') || href.startsWith('/demos/');
    const a11y = hidden ? { tabIndex: -1, 'aria-hidden': true } : {};
    const body = (
        <>
            {children}
            {arrow && <span aria-hidden="true"> ↗</span>}
            {newTab && !hidden && <span className="mag-sr-only">（新しいタブで開きます）</span>}
        </>
    );
    if (newTab) {
        return <a href={href} className={className} target="_blank" rel="noopener noreferrer" {...a11y}>{body}</a>;
    }
    return <NextLink href={href} className={className} {...a11y}>{body}</NextLink>;
}

export { splitTitle, titleClass } from '@/lib/work-title';
