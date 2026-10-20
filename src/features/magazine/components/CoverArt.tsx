'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { art } from '@/content/magazine-art';

// 表紙の絵（ロボットの手と斜めから見た盤）。スクロールに合わせて、盤の空いたマスへ駒を 1 つ置く。
//
// 置く位置と大きさは、絵の盤を測って決めた：
// - 盤の上面の四隅から射影を作り、4 × 4 マスと判定（市松の一致 87.5%）
// - 置くのは奥から 2 列目・左から 2 番目の青いマス。描かれたマスの青い領域の重心が (981, 771)
// - 立っている駒の幅は奥の列 75px、手前の列 90〜95px。2 列目なので 80px
const SRC_W = 1448;
const SRC_H = 1086;
const BASE = { x: 981, y: 779 };
const PIECE_W = 80;

const pct = {
    left: ((BASE.x - PIECE_W / 2) / SRC_W) * 100,
    bottom: ((SRC_H - BASE.y) / SRC_H) * 100,
    width: (PIECE_W / SRC_W) * 100,
};

// 置き終わるまでのスクロール量（px）
const DISTANCE = 240;

export default function CoverArt() {
    const pieceRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = pieceRef.current;
        if (!el) return;
        const still = () =>
            matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off';
        let frame = 0;
        const update = () => {
            frame = 0;
            const p = still() ? 1 : Math.min(1, Math.max(0, window.scrollY / DISTANCE));
            el.style.setProperty('--drop', String(p));
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
    }, []);

    return (
        <div className="cover-art">
            <Image src={art.cover.src} alt={art.cover.alt} width={art.cover.width} height={art.cover.height} priority sizes="(max-width: 760px) 100vw, 720px" />
            <span
                ref={pieceRef}
                className="cover-art__piece"
                style={{ left: `${pct.left}%`, bottom: `${pct.bottom}%`, width: `${pct.width}%` }}
                aria-hidden="true"
            >
                <Image src={art.coverPiece.src} alt="" width={art.coverPiece.width} height={art.coverPiece.height} sizes="80px" />
            </span>
        </div>
    );
}
