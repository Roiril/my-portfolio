'use client';

import { useState } from 'react';
import { contactMessage } from '@/content/contact';
import { SITE_EMAIL, SOCIAL_LINKS } from '@/constants/site';
import { copyToClipboard } from '@/lib/clipboard';

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
                <h2 className="text-2xl font-bold text-black mb-6">
                    Contact
                </h2>

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
                        <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative pb-1 text-base sm:text-lg font-bold text-black border-b-2 border-black/10 transition-all duration-300"
                        >
                            <span>{link.platform} ↗</span>
                            <div className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
