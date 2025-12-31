import { works } from '@/content/works';

export default function Works() {
  const allWorks = works;

  return (
    <section id="works" className="px-8 py-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">
            Works
          </h2>
          <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl">
            Next.js，Three.js，Blender，Unityなどを用いた制作物をまとめています．
          </p>
        </div>

        <div className="flex flex-col gap-10 pointer-events-auto">
          {allWorks.map((work) => (
            <div key={work.id} className="flex flex-col md:flex-row gap-8 md:gap-12 items-start pb-10 border-b border-gray-200 last:border-b-0">
              <div className="w-full md:w-1/3 h-48 md:h-64 bg-gray-100 relative overflow-hidden flex-shrink-0">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col">
                {work.featured && (
                  <span className="text-xs font-semibold text-black mb-4 uppercase tracking-widest">
                    Featured
                  </span>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 leading-tight">
                  {work.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-800 mb-2 leading-7 whitespace-pre-line">
                  {work.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-6">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {work.isCurrent ? (
                  <div className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                    Currently in development
                  </div>
                ) : work.links.length > 0 ? (
                  <div className="flex flex-row gap-8">
                    {work.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative pb-0.5 text-sm font-bold text-black border-b-2 border-black/10 transition-colors duration-300 inline-flex items-center gap-0.5"
                      >
                        <span>{link.type === 'launch' ? 'Launch' : link.label || 'Video'} ↗</span>
                        <div className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></div>
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
