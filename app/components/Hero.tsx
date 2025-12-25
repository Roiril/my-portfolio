export default function Hero() {
  return (
    <section className="relative px-8 pt-8 pb-16 bg-white overflow-hidden">
      {/* 背景：気づかない程度に */}
      <div
        className="absolute inset-0 z-0 opacity-5 hero-bg"
        style={{
          backgroundImage: "url('/images/Roil_hci_icon.png')",
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="relative z-10 max-w-3xl">
        {/* Eyebrow：所属/領域 */}
        <p className="text-xs sm:text-sm font-semibold text-gray-600 tracking-widest uppercase mb-4">
          白石 大晴 / Roil
        </p>
        <p className="text-sm sm:text-base text-gray-700 mb-16 leading-relaxed">
          明治大学先端メディアサイエンス学科<br />
          HCI研究 / Web × 3D / AI-assisted Making
        </p>

        {/* H1：改行位置を意味で固定 */}
        <h1 className="text-5xl sm:text-6xl font-black text-black leading-tight mb-16">
          情緒的で気持ちいい<br />
          デジネな体験を
        </h1>

        {/* サブコピー：体験特徴優先 */}
        <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl mb-20">
          かわいい/かっこいい動きでデジタルを生き生きと<br />
          Next.js・Unity・Blenderで制作しています。
        </p>

        {/* CTA：主従明確 */}
        <div className="flex flex-row gap-4 mb-0">
          <a
            href="#works"
            className="px-8 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors duration-200 text-center sm:text-left"
          >
            作品を見る
          </a>
          <a
            href="#contact"
            className="px-8 py-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-colors duration-200 text-center sm:text-left"
          >
            お問い合わせ
          </a>
        </div>
      </div>
    </section>
  );
}
