import { Link } from '@/components/ui';

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
                    HCI Researcher &amp; Interaction Designer ｜ HCI / XR / AI
                </p>
                <p className="text-sm sm:text-base text-gray-700 mb-12 leading-relaxed">
                    HCI研究者・インタラクションデザイナー．人・ロボット・AIの意図伝達をテーマに，研究と開発をしています．
                    <br />
                    Meiji Univ. / Tokyo
                </p>

                <h1 className="text-5xl sm:text-6xl font-black text-black leading-tight mb-12">
                    白石大晴
                    <br />
                    Shiroishi Taisei
                </h1>

                <p className="text-base sm:text-lg text-gray-800 leading-7 max-w-2xl mb-12">
                    人・ロボット・AIが「次に何をしようとしているか」を，相手の負担を増やさず伝える．
                    <br />
                    個人研究では，企画から実装，ユーザ評価までを一人で回してきました．
                </p>

                <div className="flex flex-row gap-10 mb-0">
                    <Link href="#works">View Works</Link>
                    <Link href="#contact">Contact</Link>
                </div>
            </div>
        </section>
    );
}
