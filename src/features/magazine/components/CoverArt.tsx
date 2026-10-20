'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { art } from '@/content/magazine-art';

// 表紙の絵。スクロールに合わせて、ロボットの手が持っている駒を盤の空いたマスへ下ろして置く。
//
// 絵は描き直さず、元の 1 枚（cover-v2）を 3 枚の層に切り分けて重ねている（scripts/magazine/split_cover.py）：
//   盤（いちばん下）→ 手（動く）→ 手前の列の駒 2 つ（手がその後ろを通るので、手より上に置く）
// 3 枚とも元の絵と同じ大きさなので、重ねるだけで位置がそろう。
//
// 動かす量は元の絵を測って決めた：
// - 盤の上面の四隅から射影を作り、4 × 4 マスと判定（市松の一致 87.5%）
// - 置くのは奥から 2 列目・左から 2 番目の青いマス。描かれたマスの青い領域の重心が (981, 771)、駒の底は y=779
// - 手に持った駒の底の中心は (807, 651)。よって手は右へ 174px、下へ 128px 動かす
const SRC_W = 1448;
const SRC_H = 1086;
const MOVE = { x: ((981 - 807) / SRC_W) * 100, y: ((779 - 651) / SRC_H) * 100 };
// 下ろす途中で少し持ち上げる量（手の高さに対する %）
const LIFT = 2.5;

// 置き終わるまでのスクロール量（px）
const DISTANCE = 320;

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export default function CoverArt() {
    const handRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = handRef.current;
        if (!el) return;
        const still = () =>
            matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off';
        let frame = 0;
        const update = () => {
            frame = 0;
            // 動き OFF では、手は元の絵の位置のまま（駒を持っている姿がこの絵の本来の姿）
            const t = still() ? 0 : ease(Math.min(1, Math.max(0, window.scrollY / DISTANCE)));
            const lift = Math.sin(Math.PI * t) * LIFT;
            el.style.transform = `translate(${(MOVE.x * t).toFixed(3)}%, ${(MOVE.y * t - lift).toFixed(3)}%)`;
        };
        const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
    }, []);

    return (
        <div className="cover-art">
            <Image src={art.coverBoard.src} alt={art.coverBoard.alt} width={art.coverBoard.width} height={art.coverBoard.height} priority sizes="(max-width: 760px) 100vw, 720px" />
            <div ref={handRef} className="cover-art__hand" aria-hidden="true">
                <Image src={art.coverHand.src} alt="" width={art.coverHand.width} height={art.coverHand.height} priority sizes="(max-width: 760px) 100vw, 720px" />
            </div>
            <div className="cover-art__front" aria-hidden="true">
                <Image src={art.coverFront.src} alt="" width={art.coverFront.width} height={art.coverFront.height} priority sizes="(max-width: 760px) 100vw, 720px" />
            </div>
        </div>
    );
}
