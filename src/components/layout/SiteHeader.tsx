'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMotion } from '@/components/motion/MotionProvider';
import { art } from '@/content/magazine-art';
import { issue } from '@/content/magazine';
import './site-navigation.css';

// 誌面（トップ）と作品の詳細ページで共通のナビ。
// 行き先はトップの節。トップでは、いま読んでいる節に印を付ける
const SECTIONS = [
    { id: 'contents', label: '目次' },
    { id: 'features', label: '特集' },
    { id: 'gallery', label: '作品' },
    { id: 'profile', label: 'プロフィール' },
    { id: 'contact', label: '連絡' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

function MotionControl() {
    const { enabled, reducedMotion, toggleMotion } = useMotion();
    const descriptionId = useId();

    return (
        <>
            <button
                className="site-nav__motion"
                type="button"
                aria-pressed={enabled}
                aria-describedby={reducedMotion ? descriptionId : undefined}
                disabled={reducedMotion}
                onClick={toggleMotion}
            >
                {/* 見える文字は <html data-motion>（描画前に head のスクリプトが決める）から CSS で選ぶ。
                    React の状態から出すと、読み込みのたびに一瞬「OFF」と出てから「ON」に変わる */}
                動き <span className="site-nav__on">ON</span><span className="site-nav__off">OFF</span>
            </button>
            {reducedMotion && (
                <span className="site-nav__sr-only" id={descriptionId}>
                    端末の設定に合わせて動きを止めています
                </span>
            )}
        </>
    );
}

export default function SiteHeader({ skipHref = '#main-content' }: { skipHref?: string }) {
    const pathname = usePathname();
    const onTop = pathname === '/';
    const [current, setCurrent] = useState<SectionId | null>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => {
        let frame = 0;
        const update = () => {
            frame = 0;
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
            progressRef.current?.style.setProperty('--scroll-progress', progress.toFixed(4));
            if (!onTop) return;
            // ナビの下端から画面の 3 分の 1 までに頭が入った節を「いま読んでいる節」とする。
            // いちばん下まで来たら、短い裏表紙（連絡）でも印が付くようにする
            const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + window.innerHeight / 3;
            let next: SectionId | null = null;
            for (const { id } of SECTIONS) {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= line) next = id;
            }
            if (scrollable > 0 && window.scrollY >= scrollable - 2) next = 'contact';
            setCurrent(next);
        };
        const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        const resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(document.body);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule, { passive: true });
        return () => {
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            resizeObserver.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, [onTop]);

    return (
        <header ref={navRef} className="site-nav">
            <a className="site-nav__skip" href={skipHref}>本文へ移動</a>
            <div className="site-nav__bar">
                <Link href="/#top" className="site-nav__brand" aria-label={issue.masthead + '　表紙へ'}>
                    <Image src={art.logoMark.src} alt="" width={art.logoMark.width} height={art.logoMark.height} sizes="40px" className="site-nav__mark" />
                    <span aria-hidden="true">{issue.masthead}</span>
                </Link>
                <nav className="site-nav__links" aria-label="誌面の目次">
                    {SECTIONS.map((s) => (
                        <Link key={s.id} href={'/#' + s.id} aria-current={onTop && current === s.id ? 'location' : undefined}>
                            {s.label}
                        </Link>
                    ))}
                    <Link href="/resume">経歴<span aria-hidden="true"> ↗</span></Link>
                </nav>
                <MotionControl />
            </div>
            <div className="site-nav__progress" ref={progressRef} aria-hidden="true" />
        </header>
    );
}
