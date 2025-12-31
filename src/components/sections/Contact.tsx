'use client';

import { useState } from 'react';
import { socialLinks, contactMessage } from '@/content/contact';

const emailAddress = 'rinkyouaoi@gmail.com';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailAddress);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = emailAddress;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="px-8 py-16 bg-white">
      <div className="max-w-4xl mx-auto text-center pointer-events-auto">
        <h2 className="text-4xl sm:text-5xl font-black text-black mb-8">
          Contact
        </h2>

        <p className="text-lg sm:text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
          {contactMessage}
        </p>

        <div className="flex flex-col items-center mb-16">
          <button
            type="button"
            onClick={handleCopy}
            className="group flex flex-col items-center transition-all duration-300"
          >
            <div className="relative pb-1">
              <span className="text-2xl sm:text-4xl font-bold text-black border-b-4 border-black/10 transition-all duration-300">
                {emailAddress}
              </span>
              <div className="absolute bottom-[-1px] left-0 w-0 h-[4px] bg-black transition-all duration-300 group-hover:w-full"></div>
            </div>
            <div className="mt-4 text-xs font-semibold tracking-widest uppercase text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {copied ? 'Copied to clipboard' : 'Click to copy email'}
            </div>
          </button>
        </div>

        <div className="flex flex-row justify-center gap-12 sm:gap-16">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative pb-1 text-xl sm:text-2xl font-bold text-black border-b-2 border-black/10 transition-all duration-300"
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
