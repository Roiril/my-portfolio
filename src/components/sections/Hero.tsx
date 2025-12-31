export default function Hero() {
  return (
    <section className="relative px-8 pt-8 pb-12 bg-white overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-5 hero-bg"
        style={{
          backgroundImage: "url('/images/Roil_hci_icon.png')",
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
        }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <p className="text-xs sm:text-sm font-semibold text-gray-600 tracking-widest uppercase mb-4">
          HCI / Portfolio / Roil
        </p>
        <p className="text-sm sm:text-base text-gray-700 mb-12 leading-relaxed">
          HCIを軸に，Web・3D・XRの体験を設計・実装しています．
          <br />
          Human-Computer Interaction / Web / 3D / AI-assisted Making
        </p>

        <h1 className="text-5xl sm:text-6xl font-black text-black leading-tight mb-12">
          白石大晴
          <br />
          Shiroishi Taisei
        </h1>

        <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl mb-12">
          感覚に寄り添う体験を大事に．
          <br />
          Unity・ Antigravity・Blenderなどで制作中．
        </p>

        <div className="flex flex-row gap-10 mb-0">
          <a
            href="#works"
            className="group relative pb-1 text-base sm:text-lg font-bold text-black border-b-2 border-black/10 transition-colors duration-300"
          >
            <span>View Works</span>
            <div className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></div>
          </a>
          <a
            href="#contact"
            className="group relative pb-1 text-base sm:text-lg font-bold text-black border-b-2 border-black/10 transition-colors duration-300"
          >
            <span>Contact</span>
            <div className="absolute bottom-[-2px] left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></div>
          </a>
        </div>
      </div>
    </section>
  );
}
