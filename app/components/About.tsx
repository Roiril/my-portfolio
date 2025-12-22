import { aboutData } from '@/app/data/about';

export default function About() {
  return (
    <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-black drop-shadow-sm pointer-events-auto">
        About Me
      </h2>

      {/* Bio */}
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200 backdrop-blur-sm pointer-events-auto mb-8">
        {aboutData.bio.map((paragraph, index) => (
          <p key={index} className="leading-relaxed text-gray-700 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tool Sections */}
      <div className="space-y-6 pointer-events-auto">
        {aboutData.toolSections.map((section) => (
          <div
            key={section.title}
            className="bg-white/80 p-6 rounded-2xl shadow-lg border border-gray-200 backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-black mb-4 pb-2 border-b border-gray-200">
              {section.title}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {section.categories.map((category) => (
                <div key={category.title}>
                  <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    {category.title}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item) => (
                      <span
                        key={item.name}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-sm border border-gray-200 hover:bg-gray-200 transition-colors"
                      >
                        <span className="font-medium">{item.name}</span>
                        {item.description && (
                          <span className="text-gray-500 text-xs">
                            / {item.description}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
