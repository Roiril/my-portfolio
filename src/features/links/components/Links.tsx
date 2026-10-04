'use client';

import { useEffect, useRef, useState } from 'react';
import { contactMessage } from '@/content/contact';
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';
import { copyToClipboard } from '@/lib/clipboard';
import ArtIcon from '@/components/ui/ArtIcon';

type CopyStatus = 'idle' | 'success' | 'error';

export default function Links() {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
        }
    }, []);

    const handleCopy = async () => {
        const success = await copyToClipboard(SITE_EMAIL);

        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
        }

        if (!success) {
            setCopyStatus('error');
            return;
        }

        setCopyStatus('success');
        resetTimerRef.current = setTimeout(() => setCopyStatus('idle'), 2000);
    };

    return (
        <section id="links" className="links-section">
            <div className="site-container links-section__inner">
                <p className="section-kicker">03 / ELSEWHERE</p>
                <h2 className="links-section__title">Links</h2>
                <p className="section-subtitle">連絡先と発信</p>
                <p className="links-section__message">{contactMessage}</p>

                <div className="links-section__email-block">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="links-section__email"
                        aria-describedby="copy-email-status"
                    >
                        <ArtIcon name="mail" size={28} />
                        <span>{SITE_EMAIL}</span>
                        <ArtIcon name="arrow" size={22} />
                    </button>
                    <p id="copy-email-status" className="links-section__copy-status" aria-live="polite">
                        {copyStatus === 'success'
                            ? 'メールアドレスをコピーしました'
                            : copyStatus === 'error'
                                ? 'コピーできませんでした。メールを開くかアドレスを選択してください。'
                                : 'クリックでメールアドレスをコピー'}
                    </p>
                    <a className="links-section__mailto" href={'mailto:' + SITE_EMAIL}>メールを送る</a>
                </div>

                <nav className="links-section__nav" aria-label="外部リンク">
                    {SOCIAL_LINKS.map((link) => (
                        <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.platform} <ArtIcon name="arrow" size={16} />
                        </a>
                    ))}
                    <a href="/resume">Resume <ArtIcon name="arrow" size={16} /></a>
                </nav>
            </div>
        </section>
    );
}
