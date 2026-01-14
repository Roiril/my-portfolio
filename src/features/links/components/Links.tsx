'use client';

import { useState } from 'react';
import { contactMessage } from '@/content/contact';
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';
import { copyToClipboard } from '@/lib/clipboard';
import { SectionHeader, Link } from '@/components/ui';

export default function Links() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const success = await copyToClipboard(SITE_EMAIL);
        if (success) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section id="links" className="px-8 py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto pointer-events-auto">
                <SectionHeader title="Links" size="md" />

                <p className="text-base text-gray-800 mb-6 leading-relaxed max-w-2xl">
                    {contactMessage}
                </p>

                <div className="flex flex-col items-start mb-10">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="group flex flex-col items-start transition-all duration-300 cursor-pointer"
                    >
                        <div className="relative pb-1">
                            <span className="text-xl sm:text-2xl font-bold text-black border-b-4 border-black/10 transition-all duration-300 group-hover:border-black">
                                {SITE_EMAIL}
                            </span>
                        </div>
                    </button>
                    <p className="mt-3 text-xs font-semibold tracking-widest uppercase text-gray-400">
                        {copied ? 'COPIED!' : 'Click to copy email'}
                    </p>
                </div>

                <div className="flex flex-row flex-wrap justify-start gap-8 sm:gap-12">
                    {SOCIAL_LINKS.map((link) => (
                        <Link
                            key={link.platform}
                            href={link.url}
                            isExternal
                        >
                            {link.platform}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
