import { Work } from '@/app/types';

type Props = {
  work: Work;
};

export default function WorkCard({ work }: Props) {
  return (
    <div className="bg-white/80 rounded-xl overflow-hidden shadow-lg border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition pointer-events-auto flex flex-col">
      <div className="h-48 bg-gray-100 relative overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${work.image}')` }}
        ></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2 text-black">{work.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{work.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        {work.isCurrent ? (
          <div className="mt-auto text-sm text-gray-500 text-center">
            You are here now!
          </div>
        ) : work.links.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-auto">
            {work.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  link.type === 'launch'
                    ? "inline-flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition text-sm font-medium"
                    : "inline-flex items-center gap-2 text-gray-700 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200 border border-gray-300 transition text-sm font-medium"
                }
              >
                {link.type === 'launch' ? (
                  <>
                    <span>🚀</span> Launch App
                  </>
                ) : (
                  <>
                    <span>▶</span> {link.label || 'Video'}
                  </>
                )}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
