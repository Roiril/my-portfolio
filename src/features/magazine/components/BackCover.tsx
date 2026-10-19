'use client';

import { useEffect, useRef, useState } from 'react';
import NextLink from 'next/link';
import { contactMessage } from '@/content/contact';
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';
import Image from 'next/image';
import { copyToClipboard } from '@/lib/clipboard';
import { art } from '@/content/magazine-art';

type CopyStatus = 'idle' | 'success' | 'error';

export default function BackCover() {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    }, []);

    const handleCopy = async () => {
        const success = await copyToClipboard(SITE_EMAIL);
        if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
        if (!success) {
            setCopyStatus('error');
            return;
        }
        setCopyStatus('success');
        resetTimerRef.current = setTimeout(() => setCopyStatus('idle'), 2000);
    };

    return (
        <footer id="contact" className="mag-back" aria-labelledby="contact-title">
            <figure className={'mag-print mag-back__art' + (copyStatus === 'success' ? ' is-sent' : '')}>
                <Image src={art.spotContact.src} alt="" width={art.spotContact.width} height={art.spotContact.height} sizes="(max-width: 600px) 60vw, 24vw" />
            </figure>
            <h2 id="contact-title" className="mag-back__title">連絡先</h2>
            <p className="mag-back__message">{contactMessage}</p>
            <button type="button" className="mag-back__email" onClick={handleCopy} aria-describedby="copy-email-status">
                {SITE_EMAIL}
            </button>
            <p id="copy-email-status" className="mag-back__status" aria-live="polite">
                {copyStatus === 'success'
                    ? 'メールアドレスをコピーしました'
                    : copyStatus === 'error'
                        ? 'コピーできませんでした。下の「メールを送る」から開いてください。'
                        : '押すとメールアドレスをコピーします'}
            </p>
            <div className="mag-back__links">
                <a href={'mailto:' + SITE_EMAIL}>メールを送る ↗</a>
                {SOCIAL_LINKS.map((link) => (
                    <a key={link.platform} href={link.url} target="_blank" rel="noopener noreferrer">{link.platform} ↗</a>
                ))}
                <NextLink href="/resume">経歴 ↗</NextLink>
            </div>
            <p className="mag-back__colophon">
                <span>ROIL　{new Date().getFullYear()}</span>
                <span>白石大晴のポートフォリオ</span>
                <a href="#top">表紙へ戻る ↑</a>
            </p>
        </footer>
    );
}
