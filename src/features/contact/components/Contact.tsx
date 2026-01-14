'use client';

import { useState } from 'react';
import { contactMessage } from '@/content/contact';
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';
import { copyToClipboard } from '@/lib/clipboard';
import { SectionHeader, Link } from '@/components/ui';

export default function Contact() {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(SITE_EMAIL);
        if (success) {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <section id="contact" className="px-8 py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto pointer-events-auto">
                <SectionHeader title="Contact" size="md" />

                <p className="text-base text-gray-800 mb-6 leading-relaxed max-w-2xl">
                    {contactMessage}
                </p>

                <div className="flex flex-col items-start mb-10">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="group flex flex-col items-start transition-all duration-300"
                    >
                        <div className="relative pb-1">
                            <span className="text-xl sm:text-2xl font-bold text-black border-b-4 border-black/10 transition-all duration-300">
                                {SITE_EMAIL}
                            </span>
                            <div className="absolute bottom-[-1px] left-0 w-0 h-[4px] bg-black transition-all duration-300 group-hover:w-full"></div>
                        </div>
                        <div className="mt-3 text-xs font-semibold tracking-widest uppercase text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            {copied ? 'Copied to clipboard' : 'Click to copy email'}
                        </div>
                    </button>
                </div>

                <div className="flex flex-row justify-start gap-8 sm:gap-12">
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
