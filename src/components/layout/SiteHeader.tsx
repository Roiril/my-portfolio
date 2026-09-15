import Image from 'next/image';
import Link from 'next/link';

export default function SiteHeader() {
    return (
        <header className="site-header">
            <Link className="site-header__skip" href="/#works">View Works</Link>
            <div className="site-container site-header__inner">
                <Link className="site-header__brand" href="/#top" aria-label="Roil ホーム">
                    <Image
                        src="/images/Roil_hci_icon.png"
                        alt=""
                        width={36}
                        height={36}
                        priority
                    />
                    <span translate="no">Roil</span>
                </Link>

                <nav className="site-header__nav" aria-label="サイト内ナビゲーション">
                    <Link href="/#works">Works</Link>
                    <Link href="/#about">About</Link>
                    <Link href="/#links">Links</Link>
                    <Link href="/resume">Resume <span aria-hidden="true">↗</span></Link>
                </nav>
            </div>
        </header>
    );
}
