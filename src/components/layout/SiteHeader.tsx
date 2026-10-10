'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ArtIcon from '@/components/ui/ArtIcon';
import { useMotion } from '@/components/motion/MotionProvider';
import './site-navigation.css';

const SECTION_LINKS = [
    { href: '/#works', id: 'works', label: 'Works' },
    { href: '/#about', id: 'about', label: 'About' },
    { href: '/#links', id: 'links', label: 'Links' },
] as const;

function MotionControl() {
    const { enabled, reducedMotion, toggleMotion } = useMotion();
    const descriptionId = useId();

    return (
        <>
            <button
                className="site-header__motion"
                type="button"
                aria-pressed={enabled}
                aria-describedby={reducedMotion ? descriptionId : undefined}
                disabled={reducedMotion}
                onClick={toggleMotion}
            >
                動き {enabled ? 'ON' : 'OFF'}
            </button>
            {reducedMotion && (
                <span className="site-header__visually-hidden" id={descriptionId}>
                    端末の設定に合わせて動きを停止しています
                </span>
            )}
        </>
    );
}

function NavigationLinks({ activeId, onNavigate }: { activeId: string | null; onNavigate?: () => void }) {
    return (
        <>
            {SECTION_LINKS.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    aria-current={activeId === item.id ? 'location' : undefined}
                    onClick={onNavigate}
                >
                    {item.label}
                </Link>
            ))}
            <Link
                href="/resume"
                aria-current={activeId === 'resume' ? 'location' : undefined}
                onClick={onNavigate}
            >
                Resume <ArtIcon name="arrow" size={14} />
            </Link>
        </>
    );
}

export default function SiteHeader({ skipHref = '#main-content' }: { skipHref?: string }) {
    const pathname = usePathname();
    const [visibleSectionId, setVisibleSectionId] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuButtonRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const activeId = pathname === '/resume' ? 'resume' : pathname === '/' ? visibleSectionId : null;

    const closeMenu = useCallback(() => {
        setMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
    }, []);

    useEffect(() => {
        if (pathname !== '/') return;

        const sections = SECTION_LINKS.map(({ id }) => document.getElementById(id)).filter(
            (section): section is HTMLElement => section instanceof HTMLElement,
        );
        const visibleSections = new Map<string, number>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) visibleSections.set(entry.target.id, entry.intersectionRatio);
                    else visibleSections.delete(entry.target.id);
                }

                const current = [...visibleSections.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
                setVisibleSectionId(current);
            },
            {
                rootMargin: '-88px 0px -55% 0px',
                threshold: [0, 0.15, 0.35, 0.6],
            },
        );

        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, [pathname]);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (!menuOpen) {
            if (dialog.open) dialog.close();
            return;
        }

        if (!dialog.open) dialog.showModal();
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => firstMenuLinkRef.current?.focus());

        return () => {
            document.body.style.overflow = previousOverflow;
            if (dialog.open) dialog.close();
        };
    }, [menuOpen]);

    useEffect(() => {
        const wideScreen = window.matchMedia('(min-width: 761px)');
        const closeOnDesktop = (event: MediaQueryListEvent) => {
            if (event.matches) closeMenu();
        };

        wideScreen.addEventListener('change', closeOnDesktop);
        return () => wideScreen.removeEventListener('change', closeOnDesktop);
    }, [closeMenu]);

    useEffect(() => {
        const updateProgress = () => {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
            progressRef.current?.style.setProperty('--scroll-progress', String(progress));
            frame = 0;
        };
        const scheduleUpdate = () => {
            if (!frame) frame = requestAnimationFrame(updateProgress);
        };
        let frame = requestAnimationFrame(updateProgress);
        const resizeObserver = 'ResizeObserver' in window
            ? new ResizeObserver(scheduleUpdate)
            : null;

        window.addEventListener('scroll', scheduleUpdate, { passive: true });
        window.addEventListener('resize', scheduleUpdate, { passive: true });
        if (resizeObserver) {
            resizeObserver.observe(document.documentElement);
            resizeObserver.observe(document.body);
        }
        return () => {
            window.removeEventListener('scroll', scheduleUpdate);
            window.removeEventListener('resize', scheduleUpdate);
            resizeObserver?.disconnect();
            cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <header className="site-header">
            <Link className="site-header__skip" href={skipHref}>本文へ移動</Link>
            <div className="site-container site-header__inner">
                <Link className="site-header__brand" href="/#top" aria-label="Roil ホーム">
                    <ArtIcon name="brand" size={40} />
                    <span className="site-header__brand-text" translate="no">Roil</span>
                    <span className="site-header__note">RESEARCH &amp; MAKING</span>
                </Link>

                <div className="site-header__desktop-actions">
                    <nav className="site-header__nav" aria-label="サイト内ナビゲーション">
                        <NavigationLinks activeId={activeId} />
                    </nav>
                    <MotionControl />
                </div>

                <div className="site-header__mobile-actions">
                    <MotionControl />
                    <button
                        ref={menuButtonRef}
                        className="site-header__menu-button"
                        type="button"
                        aria-expanded={menuOpen}
                        aria-controls="site-navigation-menu"
                        aria-haspopup="dialog"
                        onClick={() => setMenuOpen(true)}
                    >
                        Menu
                    </button>
                </div>
            </div>

            <dialog
                ref={dialogRef}
                className="site-header__menu-dialog"
                id="site-navigation-menu"
                aria-label="サイト内ナビゲーション"
                onCancel={(event) => {
                    event.preventDefault();
                    closeMenu();
                }}
                onClose={() => setMenuOpen(false)}
                onClick={(event) => {
                    if (event.target === event.currentTarget) closeMenu();
                }}
            >
                <div className="site-header__menu-panel">
                    <div className="site-header__menu-heading">
                        <span>Navigation</span>
                        <button type="button" onClick={closeMenu}>閉じる</button>
                    </div>
                    <nav className="site-header__menu-nav" aria-label="モバイルナビゲーション">
                        {SECTION_LINKS.map((item, index) => (
                            <Link
                                key={item.id}
                                ref={index === 0 ? firstMenuLinkRef : undefined}
                                href={item.href}
                                aria-current={activeId === item.id ? 'location' : undefined}
                                onClick={closeMenu}
                            >
                                <span>{String(index + 1).padStart(2, '0')}</span>
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/resume"
                            aria-current={activeId === 'resume' ? 'location' : undefined}
                            onClick={closeMenu}
                        >
                            <span>04</span>
                            Resume <ArtIcon name="arrow" size={18} />
                        </Link>
                    </nav>
                </div>
            </dialog>

            <div className="site-header__progress" ref={progressRef} aria-hidden="true" />
        </header>
    );
}
