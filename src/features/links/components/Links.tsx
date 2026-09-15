'use client';

import { useEffect, useRef, useState } from 'react';
import { contactMessage } from '@/content/contact';
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';
import { copyToClipboard } from '@/lib/clipboard';

export default function Links() {
    const [copied, setCopied] = useState(false);
    const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
        }
    }, []);

    const handleCopy = async () => {
        const success = await copyToClipboard(SITE_EMAIL);
        if (!success) return;

        if (resetTimerRef.current) {
            clearTimeout(resetTimerRef.current);
        }
        setCopied(true);
        resetTimerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="links" className="links-section">
            <div className="site-container links-section__inner">
                <h2 className="links-section__title">Links</h2>
                <p className="links-section__message">{contactMessage}</p>

                <div className="links-section__email-block">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="links-section__email"
                        aria-describedby="copy-email-status"
                    >
                        {SITE_EMAIL}
                    </button>
                    <p id="copy-email-status" className="links-section__copy-status" aria-live="polite">
                        {copied ? 'COPIED!' : 'Click to copy email'}
                    </p>
                </div>

                <nav className="links-section__nav" aria-label="外部リンク">
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
                    <a href="/resume">Resume</a>
                </nav>
            </div>
        </section>
    );
}
