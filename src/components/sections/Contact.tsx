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
    <section id="contact" className="px-8 py-10 bg-fafafa">
      <div className="max-w-3xl mx-auto text-center pointer-events-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">
          お問い合わせ
        </h2>

        <p className="text-base sm:text-lg text-gray-800 mb-8 leading-7">
          {contactMessage}
        </p>

        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="text-base text-gray-800">Email</span>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 border-2 border-black bg-black text-white font-medium hover:bg-white hover:text-black transition-colors duration-200 inline-flex items-center justify-center"
          >
            <span className="text-base">{emailAddress}</span>
          </button>
          <span className="text-sm text-gray-600">
            {copied ? 'コピーしました' : 'クリックでコピー'}
          </span>
        </div>

        <div className="flex flex-row flex-wrap justify-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors duration-200 inline-flex items-center justify-center gap-2 text-base"
            >
              {link.icon ? <span className="text-lg">{link.icon}</span> : null}
              <span>{link.platform}</span>
            </a>
          ))}
        </div>

        <p className="text-sm sm:text-base text-gray-700 mt-4">
          作ったものを投げてます。よかったらフォローして見ていってください。
        </p>
      </div>
    </section>
  );
}
