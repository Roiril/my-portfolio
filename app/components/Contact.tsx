import { socialLinks, contactMessage } from '@/app/data/contact';

export default function Contact() {
  return (
    <section id="contact" className="px-8 py-48 bg-fafafa">
      <div className="max-w-3xl mx-auto text-center pointer-events-auto">
        {/* セクションヘッダー */}
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">
          Get in Touch
        </h2>

        {/* メッセージ */}
        <p className="text-base sm:text-lg text-gray-800 mb-24 leading-7">
          {contactMessage}
        </p>

        {/* ソーシャルリンク */}
        <div className="flex flex-row flex-wrap justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors duration-200 inline-flex items-center justify-center gap-3"
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.platform}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
