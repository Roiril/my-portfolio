"use client";
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

// ランダムな数値を生成する関数
const random = (min: number, max: number) => Math.random() * (max - min) + min;

// ひらがなのリスト
const hiraganaChars = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";

// 四角形のデータの型定義
type Square = {
  id: number;
  side: 'left' | 'right'; 
  initialLeft?: string;   
  initialRight?: string;  
  size: string;
  opacity: number;
  duration: string; 
  delay: string;
  char: string;
  fixedX?: number;
  fixedY?: number; 
};

export default function Home() {
  const [squares, setSquares] = useState<Square[]>([]);
  
  const draggingRef = useRef<{ id: number, side: 'left'|'right', offsetX: number, offsetY: number } | null>(null);

  useEffect(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const count = Math.max(10, Math.floor(width / 30));

    const generateSquares = (side: 'left' | 'right') => {
      return Array.from({ length: count }).map((_, i) => {
        const sizeVal = random(20, 100); 
        const durationVal = sizeVal * 0.6 + 20; 

        return {
          id: i,
          side: side,
          [side === 'left' ? 'initialLeft' : 'initialRight']: `${random(0, 25)}%`,
          size: `${sizeVal}px`,
          opacity: random(0.3, 0.7),
          duration: `${durationVal}s`,
          delay: `-${random(0, durationVal)}s`,
          char: hiraganaChars[Math.floor(random(0, hiraganaChars.length))],
        } as Square;
      });
    };

    setSquares([...generateSquares('left'), ...generateSquares('right')]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;

      const { id, side, offsetX, offsetY } = draggingRef.current;
      const newX = e.pageX - offsetX;
      const newY = e.pageY - offsetY;

      setSquares((prev) => prev.map(sq => {
        if (sq.id === id && sq.side === side) {
          return { ...sq, fixedX: newX, fixedY: newY };
        }
        return sq;
      }));
    };

    const handleMouseUp = () => {
      if (draggingRef.current) {
        draggingRef.current = null;
        document.body.style.cursor = 'auto'; 
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, square: Square) => {
    e.preventDefault(); 
    e.stopPropagation();

    const element = e.currentTarget;
    const rect = element.getBoundingClientRect();
    
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    draggingRef.current = {
      id: square.id,
      side: square.side,
      offsetX,
      offsetY
    };

    const currentX = rect.left + window.scrollX;
    const currentY = rect.top + window.scrollY;

    setSquares((prev) => prev.map(sq => {
      if (sq.id === square.id && sq.side === square.side) {
        return { ...sq, fixedX: currentX, fixedY: currentY };
      }
      return sq;
    }));

    document.body.style.cursor = 'grabbing'; 
  };

  return (
    <main className="relative min-h-screen text-gray-900 font-sans overflow-hidden bg-white">
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -10%;
            transform: rotate(0deg);
          }
          100% {
            top: 110%;
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* ▼▼▼ 四角形の装飾層 (z-0) ▼▼▼ */}
      <div className="absolute inset-0 z-0 pointer-events-none h-full overflow-hidden grayscale">
        {squares.map((sq) => {
          const isFixed = sq.fixedX !== undefined && sq.fixedY !== undefined;
          return (
            <div
              key={`${sq.side}-${sq.id}`}
              className="absolute bg-black/10 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-800 font-bold select-none pointer-events-auto cursor-grab active:cursor-grabbing hover:bg-black/20 hover:shadow-md hover:scale-105 transition-colors duration-200"
              style={{
                width: sq.size,
                height: sq.size,
                opacity: sq.opacity,
                borderRadius: '8px',
                fontSize: `calc(${sq.size} * 0.6)`,
                ...(isFixed ? {
                  position: 'absolute', 
                  left: sq.fixedX,
                  top: sq.fixedY,
                  right: 'auto', 
                  transform: 'rotate(0deg)', 
                  animation: 'none',
                  zIndex: 50, 
                } : {
                  left: sq.side === 'left' ? sq.initialLeft : undefined,
                  right: sq.side === 'right' ? sq.initialRight : undefined,
                  animationName: 'fall',
                  animationDuration: sq.duration,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationDelay: sq.delay,
                })
              }}
              onMouseDown={(e) => handleMouseDown(e, sq)}
            >
              {sq.char}
            </div>
          );
        })}
      </div>


      {/* ▼▼▼ コンテンツ層（z-10） ▼▼▼ */}
      <div className="relative z-10 pointer-events-none">
        
        {/* ヒーローセクション */}
        <section className="relative flex flex-col items-center justify-center h-screen px-4 overflow-hidden">
          
          {/* 背景画像 */}
          <div 
            className="absolute inset-0 z-0 grayscale"
            style={{
              backgroundImage: "url('/images/Roil_hci_icon.png')", 
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center', 
              opacity: 0.1, 
            }}
          ></div>

          {/* コンテンツ */}
          <div className="relative z-10 text-center space-y-4 pointer-events-auto">
            <h1 className="text-5xl font-extrabold tracking-tight text-black sm:text-6xl drop-shadow-sm">
               <span className="text-gray-600">Shiroishi</span> Lab
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              明治大学/先端メディアサイエンス学科
              <br />
              面白いと思ったものを作る。
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a href="#works" className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition shadow-lg">
                View Works
              </a>
              <a href="#contact" className="px-6 py-3 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-black transition shadow-lg">
                Contact Me
              </a>
            </div>
          </div>
        </section>

        {/* Aboutセクション */}
        <section id="about" className="py-20 px-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-black drop-shadow-sm pointer-events-auto">About Me</h2>
          <div className="bg-white/80 p-8 rounded-2xl shadow-lg border border-gray-200 backdrop-blur-sm pointer-events-auto">
            <p className="leading-relaxed text-gray-700 mb-4">
              はじめまして。明治大学の先端メディアサイエンス学科に所属しています。
              大学ではヒューマンコンピューターインタラクション(HCI)の研究をしつつ、個人開発でUnityやWebアプリケーションを作っています。
            </p>
            <p className="leading-relaxed text-gray-700">
              このサイトはNext.jsとSupabaseで作ってVercelで公開しています。 <br />
              「面白いと思ったもの」をこれからはいっぱい作っていこうと思います。
            </p>
            
            <div className="mt-6">
              <h3 className="font-bold text-black mb-2">Technical Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Unity', 'Blender', 'Processing', 'TypeScript', 'Next.js', 'React', 'Supabase','C#' ,'Python', 'Suno AI'].map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm border border-gray-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Worksセクション */}
        <section id="works" className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-black drop-shadow-sm pointer-events-auto">Works</h2>
            
            {/* 🔥 Featured Work */}
            <div className="mb-12 pointer-events-auto">
              <div className="bg-white/80 rounded-2xl overflow-hidden shadow-xl border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition group">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="h-64 md:h-auto relative overflow-hidden bg-black">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: "url('/images/UniqloCap.png')" }}
                    ></div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="mb-2">
                      <span className="text-xs font-bold px-2 py-1 bg-black text-white rounded uppercase tracking-wider">Featured</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-black">Concept Movie: UNIQLO "Future Service"</h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      企画からCG制作(Blender)、VFX合成、動画編集、そしてBGMの作曲まで、全工程を単独で制作した架空のサービス紹介動画。
                      実写映像と3DCGを違和感なく合成し、近未来の購買体験を映像化しました。
                      クリエイティブの総力を結集した意欲作です。
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {['Blender', 'VFX', 'Video Editing', 'Composition', 'DTM'].map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">{tag}</span>
                      ))}
                    </div>
                    <div>
                      <a href="https://youtu.be/-q5xsLlaN8M?si=NFpSSjy8pEHkGonn" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white bg-black px-5 py-2 rounded-full hover:bg-gray-800 transition text-sm font-medium">
                        <span>▶</span> Watch on YouTube
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* その他の作品（グリッド表示） */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* ① アクアリウム */}
              <div className="bg-white/80 rounded-xl overflow-hidden shadow-lg border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition pointer-events-auto flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: "url('/images/AcuariumPrograming.png')" }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 text-black">Generative Aquarium</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Processingを用いたプロシージャル・アニメーション。
                    コードによって生み出された魚たちが、群れを成して自律的に泳ぎ回る様子をシミュレーションしました。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">Processing</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">Generative Art</span>
                  </div>
                  <a href="https://youtu.be/J4vsNST7PLU?si=BqNEA6MSnnqmbqEN" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black underline text-sm transition">
                    View Video →
                  </a>
                </div>
              </div>

              {/* ② 明治大学3Dモデル */}
              <div className="bg-white/80 rounded-xl overflow-hidden shadow-lg border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition pointer-events-auto flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: "url('/images/Meiji3fVideoCapture.png')" }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 text-black">Digital Twin: Meiji Univ.</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    明治大学中野キャンパス3階をBlenderでフォトリアルに再現。
                    実際の建築図面や取材に基づき、空間の広がりや照明の反射まで緻密にモデリングしました。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">Blender</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">3D Modeling</span>
                  </div>
                  <a href="https://youtu.be/NfEQQwtwIPQ?si=VnYnw4MvY2MxgkEi" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black underline text-sm transition">
                    View Video →
                  </a>
                </div>
              </div>

              {/* ④ 作曲 & AI */}
              <div className="bg-white/80 rounded-xl overflow-hidden shadow-lg border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition pointer-events-auto flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: "url('/images/StudioOneCap.png')" }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 text-black">AI-Augmented Composition</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    人間の感性とAIの生成能力の協働実験。
                    StudioOneで制作したトラックをベースに、生成AI(Suno)を用いて楽曲を展開・拡張。クリエイターとAIの共創を探求しました。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">StudioOne</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">Suno AI</span>
                  </div>
                  <div className="flex gap-3 text-sm">
                    <a href="https://youtube.com/shorts/EPZ6CyN0CKQ?si=bLckXFs04Tpznf-P" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black underline transition">
                      Original
                    </a>
                    <span className="text-gray-300">|</span>
                    <a href="https://youtube.com/shorts/61PpnNePhsk?si=EbQLesmbgxvFs2jA" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black underline transition">
                      AI Ver.
                    </a>
                  </div>
                </div>
              </div>

              {/* ⑤ Web App: Markdown Diary */}
              <div className="bg-white/80 rounded-xl overflow-hidden shadow-lg border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition pointer-events-auto flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: "url('/images/DairyMarkdown.png')" }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 text-black">Web App: Markdown Diary</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    Next.jsとSupabaseでフルスクラッチ開発した日記アプリ。
                    認証、CRUD、セキュリティ設定を完備し、プライベートな記録ツールとして日常的に使用可能なレベルに仕上げました。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">Next.js</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">Supabase</span>
                  </div>
                  <div className="mt-auto">
                    <a href="https://my-markdown-diary.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white bg-black px-4 py-2 rounded-full hover:bg-gray-800 transition text-sm font-medium w-full justify-center">
                      <span>🚀</span> Launch App
                    </a>
                  </div>
                </div>
              </div>

              {/* ⑥ Interactive Portfolio */}
              <div className="bg-white/80 rounded-xl overflow-hidden shadow-lg border border-gray-200 backdrop-blur-sm hover:border-gray-400 transition pointer-events-auto flex flex-col">
                <div className="h-48 bg-gray-100 relative overflow-hidden group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: "url('/images/MyPortfolio.png')" }}
                  ></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-2 text-black">Interactive Portfolio</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">
                    このサイト自体も作品の一つです。
                    「つかんで置ける」背景の文字など、HCI専攻らしくデジタル空間に物理的な手触りを持たせるインタラクションを実装しました。
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">Next.js</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-300">React</span>
                  </div>
                  <div className="mt-auto text-sm text-gray-500 text-center">
                    You are here now!
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contactセクション */}
        <section id="contact" className="py-20 px-6 max-w-2xl mx-auto text-center">
          <div className="pointer-events-auto">
            <h2 className="text-3xl font-bold mb-8 text-black drop-shadow-sm">Contact</h2>
            <p className="text-gray-600 mb-8">
              HCI関連の研究や開発について、お気軽にご連絡ください。
            </p>
            <div className="flex justify-center gap-6">
              <a href="https://www.youtube.com/@Roil_HCI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-black transition">
                <span className="text-xl">📺</span> YouTube
              </a>
              <a href="https://x.com/Roil_HCI" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-black transition">
                <span className="text-xl">✖</span> X (Twitter)
              </a>
            </div>
          </div>
        </section>

        {/* フッター */}
        <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200">
          <span className="pointer-events-auto">
            © {new Date().getFullYear()} Shiroishi Lab / Roil. All rights reserved.
          </span>
        </footer>

      </div>
    </main>
  );
}