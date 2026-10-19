'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { art } from '@/content/magazine-art';

// 表紙の盤。マスを選ぶと、ロボットの手が駒をそのマスへ置く（研究の「ロボットの手と卓上ゲームで遊ぶ」を一手だけ体験する）。
// 座標はすべて舞台（4:3）の幅に対する % と高さに対する % で持つ。画面の幅が変わっても位置はずれない。

const COLS = 4;
const ROWS = 3;
const INITIAL: number[] = [5, 6, 9];

// 盤（真上から見た 4 × 3 マス）。left・width は舞台の幅の %、top・height は高さの %
const BOARD = { left: 31, width: 66 };
const BOARD_H = (BOARD.width * (art.coverBoard.height / art.coverBoard.width) * 4) / 3;
const BOARD_TOP = 100 - BOARD_H - 3;
// 盤の外枠の太さ（盤の大きさに対する割合）。マスはその内側を等分する
const FRAME_X = 0.015;
const FRAME_Y = 0.022;

// 駒
const PIECE_W = 5.5;
const PIECE_H = (PIECE_W * (art.coverPiece.height / art.coverPiece.width) * 4) / 3;

// 手。休んでいる位置と、画像の中で指先がつまむ点（画像に対する割合。画像を測って決めた）
const HAND = { left: -9, top: -22, width: 50 };
const HAND_H = (HAND.width * (art.coverHand.height / art.coverHand.width) * 4) / 3;
const PINCH = { x: 0.756, y: 0.941 };
const REST_PINCH = { x: HAND.left + HAND.width * PINCH.x, y: HAND.top + HAND_H * PINCH.y };
// つまんだ駒は、上の端が指先より少し上に入る
const GRIP = 2;

function cellCenter(index: number) {
    const c = index % COLS;
    const r = Math.floor(index / COLS);
    const innerW = BOARD.width * (1 - FRAME_X * 2);
    const innerH = BOARD_H * (1 - FRAME_Y * 2);
    return {
        x: BOARD.left + BOARD.width * FRAME_X + innerW * ((c + 0.5) / COLS),
        y: BOARD_TOP + BOARD_H * FRAME_Y + innerH * ((r + 0.5) / ROWS),
        cellH: innerH / ROWS,
    };
}

// 盤に置いた駒の左上（底をマスの中心より少し下に置く）
function placedPos(index: number) {
    const { x, y, cellH } = cellCenter(index);
    const bottom = y + cellH * 0.3;
    return { left: x - PIECE_W / 2, top: bottom - PIECE_H };
}

const reducedMotion = () =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off');

type Phase = 'idle' | 'placing' | 'returning';

export default function CoverBoard() {
    const [placed, setPlaced] = useState<number[]>(INITIAL);
    const [target, setTarget] = useState<number | null>(null);
    const [phase, setPhase] = useState<Phase>('idle');
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => () => timers.current.forEach(clearTimeout), []);
    const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

    const place = useCallback((index: number) => {
        if (phase !== 'idle' || placed.includes(index)) return;
        if (reducedMotion()) {
            setPlaced((p) => [...p, index]);
            setTarget(null);
            return;
        }
        setTarget(index);
        setPhase('placing');
        later(() => {
            setPlaced((p) => [...p, index]);
            setPhase('returning');
            setTarget(null);
        }, 520);
        later(() => setPhase('idle'), 1100);
    }, [phase, placed]);

    const reset = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
        setPlaced(INITIAL);
        setTarget(null);
        setPhase('idle');
    };

    // 手の移動量：選んだマスに置いたときの駒の位置へ、つまむ点を合わせる
    let dx = 0;
    let dy = 0;
    if (target !== null) {
        const p = placedPos(target);
        dx = p.left + PIECE_W / 2 - REST_PINCH.x;
        dy = p.top + GRIP - REST_PINCH.y;
    }
    const holding = phase !== 'returning';
    const full = placed.length >= COLS * ROWS;
    const order = [...placed].sort((a, b) => a - b);

    return (
        <div className="cover-board">
            <div
                className="cover-board__stage"
                role="group"
                aria-label="盤のマスを選ぶと、ロボットの手が駒を置きます"
                onPointerLeave={() => phase === 'idle' && setTarget(null)}
            >
                <Image
                    src={art.coverBoard.src} alt="" width={art.coverBoard.width} height={art.coverBoard.height} priority
                    sizes="(max-width: 760px) 70vw, 420px" className="cover-board__board"
                    style={{ left: `${BOARD.left}%`, top: `${BOARD_TOP}%`, width: `${BOARD.width}%` }}
                />
                {order.map((index) => {
                    const p = placedPos(index);
                    return (
                        <Image
                            key={index} src={art.coverPiece.src} alt="" width={art.coverPiece.width} height={art.coverPiece.height}
                            sizes="60px" className="cover-board__piece is-placed"
                            style={{ left: `${p.left}%`, top: `${p.top}%`, width: `${PIECE_W}%`, zIndex: 2 + Math.floor(index / COLS) }}
                        />
                    );
                })}
                {/* 手とつまんだ駒は 1 つの組として動かす */}
                <div
                    className={'cover-board__arm' + (phase === 'placing' ? ' is-placing' : '')}
                    style={{ transform: `translate(${dx}cqw, ${(dy * 3) / 4}cqw)` }}
                >
                    <Image
                        src={art.coverPiece.src} alt="" width={art.coverPiece.width} height={art.coverPiece.height} sizes="60px"
                        className={'cover-board__piece is-held' + (holding && !full ? '' : ' is-hidden')}
                        style={{ left: `${REST_PINCH.x - PIECE_W / 2}%`, top: `${REST_PINCH.y - GRIP}%`, width: `${PIECE_W}%` }}
                    />
                    <Image
                        src={art.coverHand.src} alt="" width={art.coverHand.width} height={art.coverHand.height} priority
                        sizes="(max-width: 760px) 50vw, 320px" className="cover-board__hand"
                        style={{ left: `${HAND.left}%`, top: `${HAND.top}%`, width: `${HAND.width}%` }}
                    />
                </div>
                {Array.from({ length: COLS * ROWS }, (_, index) => {
                    const { x, y } = cellCenter(index);
                    const taken = placed.includes(index);
                    const w = (BOARD.width * (1 - FRAME_X * 2)) / COLS;
                    const h = (BOARD_H * (1 - FRAME_Y * 2)) / ROWS;
                    return (
                        <button
                            key={index} type="button" className="cover-board__cell"
                            style={{ left: `${x - w / 2}%`, top: `${y - h / 2}%`, width: `${w}%`, height: `${h}%` }}
                            aria-label={`横 ${(index % COLS) + 1}・縦 ${Math.floor(index / COLS) + 1} のマスに駒を置く`}
                            aria-disabled={taken || full}
                            onPointerEnter={() => phase === 'idle' && !taken && setTarget(index)}
                            onFocus={() => phase === 'idle' && !taken && setTarget(index)}
                            onBlur={() => phase === 'idle' && setTarget(null)}
                            onClick={() => place(index)}
                        />
                    );
                })}
            </div>
            <p className="cover-board__hint" aria-live="polite">
                {full ? (
                    <>盤が埋まりました<br /><button type="button" className="cover-board__reset" onClick={reset}>片付ける</button></>
                ) : (
                    <>マスを押すと、手が駒を置きます<br />{placed.length} / {COLS * ROWS}</>
                )}
            </p>
        </div>
    );
}
