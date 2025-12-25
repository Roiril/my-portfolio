import { works } from '@/app/data/works';

export default function Works() {
  const allWorks = works;

  return (
    <section id="works" className="px-8 py-32 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* セクションヘッダー */}
        <div className="mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">
            Works
          </h2>
          <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl">
            Next.js、Three.js、Blender など複数の技術を組み合わせた実績。
            各プロジェクトは情緒的な体験設計を軸に制作されました。
          </p>
        </div>

        {/* 作品リスト - 統一デザイン */}
        <div className="flex flex-col gap-24 pointer-events-auto">
          {allWorks.map((work) => (
            <div key={work.id} className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              {/* 画像 */}
              <div className="w-full md:w-1/3 h-48 md:h-64 bg-gray-100 relative overflow-hidden flex-shrink-0">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* コンテンツ */}
              <div className="flex-1 flex flex-col">
                {/* Featured ラベル */}
                {work.featured && (
                  <span className="text-xs font-semibold text-black mb-4 uppercase tracking-widest">
                    Featured
                  </span>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 leading-tight">
                  {work.title}
                </h3>

                <p className="text-sm sm:text-base text-gray-800 mb-6 leading-7 whitespace-pre-line">
                  {work.description}
                </p>

                {/* タグ */}
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

                {/* リンク・ステータス */}
                {work.isCurrent ? (
                  <div className="text-xs sm:text-sm text-gray-700 font-medium">
                    ← このサイト
                  </div>
                ) : work.links.length > 0 ? (
                  <div className="flex flex-row gap-3">
                    {work.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2 border-2 border-black text-black text-xs sm:text-sm font-medium hover:bg-black hover:text-white transition-colors duration-200 text-center"
                      >
                        {link.type === 'launch'
                          ? 'Launch'
                          : link.label || 'Video'}
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
