export default function Hero() {
  return (
    <section className="relative px-8 pt-8 pb-16 bg-white overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-5 hero-bg"
        style={{
          backgroundImage: "url('/images/Roil_hci_icon.png')",
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold text-gray-600 tracking-widest uppercase mb-4">
          HCI / Portfolio / Roil
        </p>
        <p className="text-sm sm:text-base text-gray-700 mb-16 leading-relaxed">
          HCIを軸に、Web・3D・XRの体験を設計・実装しています。
          <br />
          Human-Computer Interaction / Web / 3D / AI-assisted Making
        </p>

        <h1 className="text-5xl sm:text-6xl font-black text-black leading-tight mb-16">
          白石大晴
          <br />
          Taisei Shiroishi
        </h1>

        <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl mb-20">
          人の行動や感覚に寄り添う体験を、デザインと実装で形にします。
          <br />
          Next.js・Unity・Blenderを中心に制作中。
        </p>

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
            連絡する
          </a>
        </div>
      </div>
    </section>
  );
}
