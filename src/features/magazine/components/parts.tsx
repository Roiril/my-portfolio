import Image from 'next/image';
import NextLink from 'next/link';
import { art, type ArtImage } from '@/content/magazine-art';
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
    return work.detail ? '/works/' + work.id : work.links[0]?.url;
}

export function linkLabel(link: WorkLink): string {
    if (link.label) return link.label;
    return link.type === 'launch' ? 'サイトを開く' : link.type === 'paper' ? '論文を読む' : '動画を見る';
}

export function SmartLink({ href, className, children, ariaLabel }: { href: string; className?: string; children: React.ReactNode; ariaLabel?: string }) {
    if (isExternal(href) || href.endsWith('.pdf') || href.startsWith('/demos/')) {
        return <a href={href} className={className} aria-label={ariaLabel} target="_blank" rel="noopener noreferrer">{children}</a>;
    }
    return <NextLink href={href} className={className} aria-label={ariaLabel}>{children}</NextLink>;
}

// 「廻リ視 — Mawarimi」のような題を、日本語の題と英語の副題に分ける
export function splitTitle(title: string): { main: string; sub?: string } {
    const [main, sub] = title.split(' — ');
    return { main, sub };
}

// 英字だけの題は詰まった英字書体で、日本語を含む題は日本語の極太で組む
const isLatin = (text: string) => !/[぀-ヿ㐀-鿿]/.test(text);

export function titleClass(main: string): string {
    return [isLatin(main) ? 'is-latin' : 'is-ja', main.length > 9 ? 'is-long' : ''].filter(Boolean).join(' ');
}
