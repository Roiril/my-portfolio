import { aboutData } from '@/content/about';

export default function About() {
  return (
    <section id="about" className="px-8 py-10 bg-fafafa">
      <div className="max-w-6xl mx-auto">
        {/* セクションヘッダー */}
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">
            About
          </h2>
        </div>

        {/* 上段：リード */}
        <div className="border-t border-gray-200 pt-10 mb-10 pointer-events-auto">
          <div className="space-y-6">
            {aboutData.bio.map((paragraph, index) => (
              <p
                key={index}
                className="text-base sm:text-lg text-gray-800 leading-7"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* 下段：Key Facts */}
        {aboutData.keyFacts && aboutData.keyFacts.length > 0 && (
          <div className="border-t border-gray-200 pt-12 mb-10 pointer-events-auto">
            <div className="grid grid-cols-2 gap-6">
              {aboutData.keyFacts.map((fact) => (
                <div key={fact.title}>
                  <p className="text-sm font-semibold text-gray-800 mb-2">
                    {fact.title}
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    {fact.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Sections */}
        <div className="space-y-16 pointer-events-auto">
          {aboutData.toolSections.map((section) => (
            <div key={section.title} className="border-t border-gray-200 pt-12">
              <h3 className="text-lg sm:text-xl font-bold text-black mb-6">
                {section.title}
              </h3>

              <div className={section.title === 'Making With' ? 'space-y-6' : 'space-y-12'}>
                {section.categories.map((category) => (
                  <div key={category.title || 'untitled'}>
                    {category.title && (
                      <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-widest mb-3">
                        {category.title}
                      </h4>
                    )}
                    {section.title === 'AI Nature Creation' ? (
                      <div className="flex flex-wrap gap-6">
                        {category.items.map((item, index) => (
                          <div key={item.name} className={`flex-1 min-w-[180px] ${index !== category.items.length - 1 ? 'border-r border-gray-300 pr-6' : ''}`}>
                            <div className="text-gray-800 font-bold text-sm">
                              {item.name}
                            </div>
                            {item.description && (
                              <div className="text-gray-700 text-xs mt-2">
                                {item.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 gap-y-1">
                        {category.items.map((item) => (
                          <div key={item.name}>
                            <span className="text-xs text-gray-700 bg-gray-100 border border-gray-200 px-2 py-1 inline-block">
                              {item.name}
                            </span>
                            {item.description && (
                              <div className="text-gray-700 text-xs mt-2 ml-0.5">
                                {item.description}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
