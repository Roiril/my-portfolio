'use client';

import { useEffect, useRef, useState } from 'react';
import { contactMessage } from '@/content/contact';
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';
import { copyToClipboard } from '@/lib/clipboard';
import GeometryMark from '@/components/ui/GeometryMark';

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
        <section id="links" className="links-section contact-editorial" aria-labelledby="contact-title" data-scroll-section>
            <div className="site-container links-section__inner">
                <p className="section-kicker">03 / CONTACT</p>
                <div className="contact-editorial__heading">
                    <h2 id="contact-title" className="links-section__title" data-reveal data-scroll-rule>連絡先</h2>
                    <GeometryMark variant="planes" />
                </div>
                <p className="links-section__message">{contactMessage}</p>

                <div className="links-section__email-block" data-reveal>
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="links-section__email"
                        aria-describedby="copy-email-status"
                    >
                        <span>{SITE_EMAIL}</span>
                        <span className="contact-editorial__copy" aria-hidden="true">{copyStatus === 'success' ? '✓' : '⧉'}</span>
                    </button>
                    <p id="copy-email-status" className="links-section__copy-status" aria-live="polite">
                        {copyStatus === 'success'
                            ? 'メールアドレスをコピーしました'
                            : copyStatus === 'error'
                                ? 'コピーできませんでした。メールを開くかアドレスを選択してください。'
                                : 'クリックでメールアドレスをコピー'}
                    </p>
                    <a className="links-section__mailto round-link" href={'mailto:' + SITE_EMAIL}><span>メールを送る</span><span className="round-link__arrow" aria-hidden="true">↗</span></a>
                </div>

                <nav className="links-section__nav" aria-label="外部リンク" data-scroll-rule>
                    {SOCIAL_LINKS.map((link) => (
                        <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link.platform} <span aria-hidden="true">↗</span>
                        </a>
                    ))}
                    <a href="/resume">Resume <span aria-hidden="true">↗</span></a>
                </nav>
            </div>
        </section>
    );
}
