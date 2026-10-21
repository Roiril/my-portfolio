'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { art } from '@/content/magazine-art';
import { HANDOFF, handOffset, pieceOffset } from './cover-hand';

// 表紙の絵。スクロールに合わせて、ロボットの手が持っている駒を盤の空いたマスへ下ろして置き、
// 駒を放して持ち上がる。さらに進むと、手はこの絵を離れて案内役（GuideHand）になる。
//
// 絵は描き直さず、元の 1 枚（cover-v2）を 4 枚の層に切り分けて重ねている
// （scripts/magazine/split_cover.py と split_hand.py）：
//   盤（いちばん下）→ 手 → 手に持った駒 → 手前の列の駒 2 つ（手がその後ろを通るので、いちばん上）
// 4 枚とも元の絵と同じ大きさなので、重ねるだけで位置がそろう。動かす量は cover-hand.ts。

export default function CoverArt() {
    const handRef = useRef<HTMLDivElement>(null);
    const pieceRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const hand = handRef.current;
        const piece = pieceRef.current;
        if (!hand || !piece) return;
        const still = () =>
            matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off';
        let frame = 0;
        const update = () => {
            frame = 0;
            // 動き OFF では、手は元の絵の位置のまま（駒を持っている姿がこの絵の本来の姿）
            const s = still() ? 0 : window.scrollY;
            const h = handOffset(s);
            const p = pieceOffset(s);
            hand.style.transform = `translate(${h.x.toFixed(3)}%, ${h.y.toFixed(3)}%)`;
            piece.style.transform = `translate(${p.x.toFixed(3)}%, ${p.y.toFixed(3)}%)`;
            // ここから先は案内役が同じ位置から引き継ぐ
            hand.style.visibility = s >= HANDOFF ? 'hidden' : '';
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        // 動きの ON/OFF を切り替えたら、スクロールを待たずに置き直す
        const observer = new MutationObserver(onScroll);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
        return () => {
            window.removeEventListener('scroll', onScroll);
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    const layer = (img: { src: string; width: number; height: number }) => (
        <Image src={img.src} alt="" width={img.width} height={img.height} priority sizes="(max-width: 760px) 100vw, 720px" />
    );

    return (
        <div className="cover-art">
            <Image src={art.coverBoard.src} alt={art.coverBoard.alt} width={art.coverBoard.width} height={art.coverBoard.height} priority sizes="(max-width: 760px) 100vw, 720px" />
            <div ref={handRef} className="cover-art__hand" aria-hidden="true">{layer(art.coverHand)}</div>
            <div ref={pieceRef} className="cover-art__piece" aria-hidden="true">{layer(art.coverPiece)}</div>
            <div className="cover-art__front" aria-hidden="true">{layer(art.coverFront)}</div>
        </div>
    );
}
