'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type ZoomItem = { n: number; title: string; alt: string; src: string };

const OpenContext = createContext<(n: number) => void>(() => {});

// 押したページを大きく開く。左右の矢印と前後のボタンで送る
export function ZoomProvider({ pages, children }: { pages: ZoomItem[]; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const item = pages.find((p) => p.n === n);

  const open = useCallback((next: number) => {
    setN(next);
    if (!dialog.current?.open) dialog.current?.showModal();
  }, []);

  useEffect(() => {
    body.current?.scrollTo(0, 0);
  }, [n]);

  const turn = (step: number) => {
    if (pages.some((p) => p.n === n + step)) setN(n + step);
  };

  return (
    <OpenContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="kt-zoom"
        aria-label={item ? `${item.n}ページ ${item.title}` : undefined}
        onClose={() => setN(0)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') turn(-1);
          if (e.key === 'ArrowRight') turn(1);
        }}
      >
        {item && (
          <>
            <div className="kt-zoom__bar">
              <p><b>{item.n}</b>{item.title}</p>
              <div>
                <button type="button" onClick={() => turn(-1)} disabled={n <= 1}>前へ</button>
                <button type="button" onClick={() => turn(1)} disabled={n >= pages.length}>次へ</button>
                <button type="button" onClick={() => dialog.current?.close()}>閉じる</button>
              </div>
            </div>
            <div className="kt-zoom__body" ref={body} tabIndex={0} role="region" aria-label="ページの画">
              {/* eslint-disable-next-line @next/next/no-img-element -- 大きいまま見せるため、縮小しない */}
              <img src={item.src} alt={item.alt} width={1600} height={2264} />
            </div>
          </>
        )}
      </dialog>
    </OpenContext.Provider>
  );
}

export function ZoomPage({ n, children }: { n: number; children: ReactNode }) {
  const open = useContext(OpenContext);
  return (
    <button type="button" className="kt-page" onClick={() => open(n)}>
      <span className="kt-sr">{n}ページを大きく開く。</span>
      {children}
    </button>
  );
}
