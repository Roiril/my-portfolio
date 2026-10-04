import Link from 'next/link';
import ArtIcon from '@/components/ui/ArtIcon';

export default function SiteHeader({ skipHref = '/#works' }: { skipHref?: string }) {
    return (
        <header className="site-header">
            <Link className="site-header__skip" href={skipHref}>{skipHref === '/#works' ? 'View Works' : '本文へ移動'}</Link>
            <div className="site-container site-header__inner">
                <Link className="site-header__brand" href="/#top" aria-label="Roil ホーム">
                    <ArtIcon name="brand" size={40} />
                    <span translate="no">Roil</span>
                    <span className="site-header__note">RESEARCH &amp; MAKING</span>
                </Link>

                <nav className="site-header__nav" aria-label="サイト内ナビゲーション">
                    <Link href="/#works">Works</Link>
                    <Link href="/#about">About</Link>
                    <Link href="/#links">Links</Link>
                    <Link href="/resume">Resume <ArtIcon name="arrow" size={14} /></Link>
                </nav>
            </div>
        </header>
    );
}
