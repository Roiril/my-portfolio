import { Work } from '@/app/types';

type Props = {
  work: Work;
};

export default function FeaturedWork({ work }: Props) {
  return (
    <div className="mb-12 pointer-events-auto">
      <div className="bg-white/80 rounded-2xl overflow-hidden shadow-xl border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition group">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="h-64 md:h-auto relative overflow-hidden bg-gray-100">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${work.image}')` }}
            ></div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-xs font-bold px-2 py-1 bg-black text-white rounded uppercase tracking-wider">
                Featured
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-black">{work.title}</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed whitespace-pre-line">
              {work.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            {work.links.length > 0 && (
              <div>
                <a
                  href={work.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white bg-black px-5 py-2 rounded-full hover:bg-gray-800 transition text-sm font-medium"
                >
                  <span>🚀</span> Launch App
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
