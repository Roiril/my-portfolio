import { socialLinks, contactMessage } from '@/app/data/contact';

export default function Contact() {
  return (
    <section id="contact" className="py-20 px-6 max-w-2xl mx-auto text-center">
      <div className="pointer-events-auto">
        <h2 className="text-3xl font-bold mb-8 text-black drop-shadow-sm">Contact</h2>
        <p className="text-gray-600 mb-8">{contactMessage}</p>
        <div className="flex justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.platform}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-500 hover:text-black transition"
            >
              <span className="text-xl">{link.icon}</span> {link.platform}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
