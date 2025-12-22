"use client";
import { useRef } from 'react';

type Props = {
  uiPositions: Record<string, { x: number; y: number }>;
  onUiStart: (e: React.MouseEvent | React.TouchEvent, id: string) => void;
  onUiClick: (e: React.MouseEvent) => void;
  getUiStyle: (id: string) => React.CSSProperties;
};

export default function Hero({ uiPositions, onUiStart, onUiClick, getUiStyle }: Props) {
  return (
    <section className="relative flex flex-col items-center justify-center h-screen px-4 overflow-hidden">
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

      <div className="relative z-10 text-center space-y-4 pointer-events-auto">
        <h1
          className="text-5xl font-extrabold tracking-tight text-black sm:text-6xl drop-shadow-sm inline-block select-none active:cursor-grabbing"
          style={getUiStyle('title')}
          onMouseDown={(e) => onUiStart(e, 'title')}
          onTouchStart={(e) => onUiStart(e, 'title')}
        >
          <span className="text-gray-600">Roil's</span> Portfolio
        </h1>

        <p
          className="text-xl text-gray-600 max-w-2xl mx-auto cursor-grab active:cursor-grabbing select-none"
          style={getUiStyle('desc')}
          onMouseDown={(e) => onUiStart(e, 'desc')}
          onTouchStart={(e) => onUiStart(e, 'desc')}
        >
          白石 大晴 / 明治大学 FMS
          <br />
          情緒
        </p>

        <div
          className="mt-8 flex justify-center gap-4 cursor-grab active:cursor-grabbing"
          style={getUiStyle('buttons')}
          onMouseDown={(e) => onUiStart(e, 'buttons')}
          onTouchStart={(e) => onUiStart(e, 'buttons')}
        >
          <a
            href="#works"
            onClick={onUiClick}
            className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-gray-800 transition shadow-lg select-none"
            draggable={false}
          >
            View Works
          </a>
          <a
            href="#contact"
            onClick={onUiClick}
            className="px-6 py-3 rounded-full border border-gray-400 text-gray-600 hover:bg-gray-100 hover:text-black transition shadow-lg select-none"
            draggable={false}
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
