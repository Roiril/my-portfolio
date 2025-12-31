import { aboutData } from '@/content/about';

export default function About() {
  return (
    <section id="about" className="px-8 py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* セクションヘッダー */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black font-sans">
            About
          </h2>
        </div>

        {/* 紹介文 */}
        <div className="mb-6 pointer-events-auto">
          <div className="space-y-3">
            {aboutData.bio.map((paragraph, index) => (
              <p
                key={index}
                className="text-base text-gray-800 leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Key Facts */}
        {aboutData.keyFacts && aboutData.keyFacts.length > 0 && (
          <div className="mb-6 pointer-events-auto">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {aboutData.keyFacts.map((fact) => (
                <div key={fact.title}>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    {fact.title}
                  </p>
                  <p className="text-base text-gray-800">
                    {fact.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Sections */}
        <div className="space-y-6 pointer-events-auto">
          {aboutData.toolSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
                {section.title}
              </h3>

              <div className="space-y-1.5">
                {section.categories.map((category) => (
                  <div key={category.title || 'untitled'}>
                    <div className="flex flex-col gap-1.5">
                      {category.items.map((item) => (
                        <div key={item.name} className="text-base font-medium text-gray-800 leading-tight">
                          {item.name}
                        </div>
                      ))}
                    </div>
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
