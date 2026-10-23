'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { art, type ArtImage } from '@/content/magazine-art';
import { HAND_BOX, HANDOFF, SRC_H, SRC_W, easeInOut, handOffset } from './cover-hand';

// 案内役の手。表紙で駒を置いた手が、小さくなって読む人について来る。
// 節ごとに行き先としぐさを決めてあり、そこへばねで飛んでいく：
//   目次      … 読んでいる行（マウスを載せた行）を指さす
//   特集      … 「詳細」を手のひらで「どうぞ」と示す
//   作品      … 絞り込みのボタンを指さす。押すとグッジョブ
//   プロフィール … 経歴のボタンの横でグッジョブ
//   連絡先    … メールアドレスを指さす。コピーするとグッジョブ、いちばん下では手を振る
// しぐさは修士研究で「伝わった」動き（指さし・どうぞ・ガッツポーズ・ハイタッチ）から選んだ。
// 押すとハイタッチを返す。動き OFF と「視差効果を減らす」では出さない（表紙の手もその場に残る）。

type PoseKey = 'lift' | 'point' | 'dozo' | 'thumbsUp' | 'wave';
type Pose = {
    img: ArtImage;
    // 行き先に当てる点（絵の幅・高さに対する割合。左右反転する前の向きで）
    tip: [number, number];
    // PC での幅（px）
    width: number;
};

// tip は public/images/magazine の各絵を測った値（指さしと「どうぞ」は指先、ほかは左の縁）。
// グッジョブは握りこぶしをボタンの高さにそろえ、立てた親指が上の行に掛からないようにしている
const POSES: Record<PoseKey, Pose> = {
    lift: { img: art.guideLift, tip: [0.5, 0.5], width: 0 },
    point: { img: art.guidePoint, tip: [0.995, 0.21], width: 136 },
    dozo: { img: art.guideDozo, tip: [0.995, 0.34], width: 136 },
    thumbsUp: { img: art.guideThumbsUp, tip: [0, 0.45], width: 86 },
    wave: { img: art.guideWave, tip: [0, 0.5], width: 86 },
};
const POSE_KEYS = Object.keys(POSES) as PoseKey[];

type Aim = { pose: Exclude<PoseKey, 'lift'>; flip: boolean; x: number; y: number };

// スマホと狭い画面では行き先を追わず、右下の隅に座ってしぐさだけ変える（本文に重ならないように）
const NARROW = 960;
const NARROW_SCALE = 0.6;
// 表紙から最初の行き先まで飛ぶあいだのスクロール量（画面の高さに対する割合）
const FLIGHT = 0.5;
// 固定のナビ（.mag-nav）の下端より少し下。案内役はここより上へ出ない
const NAV_BOTTOM = 64;
// ばね（少しだけ行き過ぎて戻る）
const STIFFNESS = 170;
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.72;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function poseSize(key: PoseKey, narrow: boolean) {
    const p = POSES[key];
    const w = p.width * (narrow ? NARROW_SCALE : 1);
    return { w, h: (w * p.img.height) / p.img.width };
}

function tipOf(key: PoseKey, flip: boolean) {
    const [fx, fy] = POSES[key].tip;
    return { fx: flip ? 1 - fx : fx, fy };
}

/** 文字の最後の行の右端（折り返した長い文字でも、最後の文字の直後を指せるように） */
function textEnd(el: Element) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = range.getClientRects();
    return rects.length ? rects[rects.length - 1] : el.getBoundingClientRect();
}

/** 横に並んだ要素の 1 行目の右端と、その行の中心の高さ */
function firstLineEnd(container: Element) {
    const items = Array.from(container.children).map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
    if (!items.length) return null;
    const top = items[0].top;
    const line = items.filter((r) => Math.abs(r.top - top) < 6);
    return { x: Math.max(...line.map((r) => r.right)), y: top + items[0].height / 2 };
}

export default function GuideHand() {
    const rootRef = useRef<HTMLButtonElement>(null);
    const popRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const pop = popRef.current;
        if (!root || !pop) return;
        const imgs = new Map(POSE_KEYS.map((k) => [k, root.querySelector<HTMLImageElement>(`img[data-pose="${k}"]`)]));
        const still = () =>
            matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off';

        let mode: 'hidden' | 'flight' | 'free' = 'hidden';
        let shown: PoseKey | null = null;
        let shownFlip = false;
        const pos = { x: 0, y: 0 };
        const vel = { x: 0, y: 0 };
        let override: { pose: Aim['pose']; until: number } | null = null;
        let hoveredRow: Element | null = null;
        let frame = 0;
        let last = 0;

        const show = (key: PoseKey, flip: boolean, popScale = 0.82) => {
            if (key === shown && flip === shownFlip) return;
            const wasShown = shown;
            imgs.forEach((img, k) => img?.toggleAttribute('data-on', k === key));
            root.toggleAttribute('data-flip', flip);
            shown = key;
            shownFlip = flip;
            // 最初の 1 枚と、飛んでいる最中の絵へ戻るときは跳ねさせない
            if (wasShown && key !== 'lift') {
                pop.animate(
                    [{ transform: `scale(${popScale})` }, { transform: 'scale(1.08)', offset: 0.6 }, { transform: 'scale(1)' }],
                    { duration: 420, easing: 'cubic-bezier(.22, 1, .36, 1)' },
                );
            }
        };

        const place = (left: number, top: number, w: number, originX: number, originY: number, rot: number) => {
            root.style.width = w.toFixed(1) + 'px';
            root.style.transformOrigin = `${originX.toFixed(1)}px ${originY.toFixed(1)}px`;
            pop.style.transformOrigin = root.style.transformOrigin;
            root.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`;
        };

        const setMode = (next: typeof mode) => {
            if (mode === next) return;
            mode = next;
            root.dataset.state = next;
            const hidden = next === 'hidden';
            root.tabIndex = hidden ? -1 : 0;
            root.setAttribute('aria-hidden', String(hidden));
        };

        // --- いま読んでいる節から、行き先としぐさを決める ---------------------
        const aim = (vw: number, vh: number): Aim => {
            const narrow = vw <= NARROW;
            const line = vh * 0.6;
            const sections = Array.from(document.querySelectorAll('#contents, .mag-spread, #gallery, #profile, #contact'));
            let active = sections[0];
            for (const s of sections) if (s.getBoundingClientRect().top < line) active = s;
            const id = active?.id ?? '';
            const colophon = document.querySelector('.mag-back__colophon');
            const atBottom = colophon ? colophon.getBoundingClientRect().top < vh : false;

            let pose: Aim['pose'] = 'point';
            let flip = true;
            if (active?.classList.contains('mag-spread')) pose = 'dozo';
            else if (id === 'profile') { pose = 'thumbsUp'; flip = false; }
            else if (id === 'contact' && atBottom) { pose = 'wave'; flip = false; }
            else if (id === 'contents' && !narrow) flip = false;
            if (override && override.until > performance.now()) {
                pose = override.pose;
                flip = pose === 'point' || pose === 'dozo';
            }

            if (narrow) {
                // 右下の隅。絵の右下の角を、画面の右下から 14px 内側に置く
                const { w, h } = poseSize(pose, true);
                const { fx, fy } = tipOf(pose, flip);
                return { pose, flip, x: vw - 14 - w + fx * w, y: vh - 14 - h + fy * h };
            }

            let x = vw - 40;
            let y = vh * 0.5;
            if (id === 'contents') {
                const list = active.querySelector('.mag-contents__list');
                const rows = Array.from(active.querySelectorAll('.mag-contents__list li'));
                let row = hoveredRow;
                if (!row) {
                    let best = Infinity;
                    for (const r of rows) {
                        const b = r.getBoundingClientRect();
                        const d = Math.abs(b.top + b.height / 2 - vh * 0.5);
                        if (d < best) { best = d; row = r; }
                    }
                }
                if (list && row) {
                    const b = row.getBoundingClientRect();
                    x = list.getBoundingClientRect().left - 10;
                    y = b.top + b.height / 2;
                }
            } else if (active?.classList.contains('mag-spread')) {
                const links = active.querySelector('.mag-spread__links');
                const end = links && firstLineEnd(links);
                if (end) { x = end.x + 14; y = end.y; }
            } else if (id === 'gallery') {
                const end = firstLineEnd(active.querySelector('.mag-filter') ?? active);
                if (end) { x = end.x + 14; y = end.y; }
            } else if (id === 'profile') {
                const b = active.querySelector('.mag-profile__resume')?.getBoundingClientRect();
                if (b) { x = b.right + 18; y = b.top + b.height / 2; }
            } else if (id === 'contact') {
                const email = active.querySelector('.mag-back__email');
                if (email) {
                    const b = textEnd(email);
                    x = b.right + 16;
                    y = b.top + b.height / 2;
                }
            }
            return { pose, flip, x, y };
        };

        // --- 1 コマ ----------------------------------------------------------
        const tick = (now: number) => {
            frame = 0;
            const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
            last = now;
            const s = window.scrollY;
            if (still() || s < HANDOFF) {
                setMode('hidden');
                last = 0;
                return;
            }
            const vw = document.documentElement.clientWidth;
            const vh = window.innerHeight;
            const narrow = vw <= NARROW;
            const target = aim(vw, vh);
            const size = poseSize(target.pose, narrow);
            const tip = tipOf(target.pose, target.flip);
            const p = (s - HANDOFF) / (vh * FLIGHT);

            if (p < 1) {
                // 表紙の手が離れた位置から、最初の行き先まで。スクロールの量で決める（戻せば戻る）
                const cover = document.querySelector('.cover-art')?.getBoundingClientRect();
                if (!cover) return;
                const off = handOffset(s);
                const heroW = (HAND_BOX.w / SRC_W) * cover.width;
                const heroCx = cover.left + (HAND_BOX.x / SRC_W + off.x / 100) * cover.width + heroW / 2;
                const heroCy = cover.top + (HAND_BOX.y / SRC_H + off.y / 100) * cover.height + ((HAND_BOX.h / SRC_H) * cover.height) / 2;
                // 降りた瞬間に、しぐさの絵と中心がそろう位置
                const endCx = target.x + (0.5 - tip.fx) * size.w;
                const endCy = target.y + (0.5 - tip.fy) * size.h;
                const e = easeInOut(Math.max(0, p));
                // 大きさは先に縮める（大きいまま画面の上へ流れていくと、ナビに隠れて見失う）
                const w = lerp(heroW, size.w, 1 - (1 - Math.max(0, p)) ** 3);
                const h = (w * HAND_BOX.h) / HAND_BOX.w;
                const cx = lerp(heroCx, endCx, e);
                // 表紙は上へ流れていくので、手はナビの下より上へは行かせない
                const cy = Math.max(lerp(heroCy, endCy, e), NAV_BOTTOM + h / 2);
                setMode('flight');
                show('lift', false);
                place(cx - w / 2, cy - h / 2, w, w / 2, h / 2, -Math.sin(Math.PI * e) * 14);
                pos.x = target.x;
                pos.y = target.y;
                vel.x = vel.y = 0;
                last = 0;
                return;
            }

            if (mode === 'hidden') {
                // 途中から読み込んだとき（再読み込み・リンクで飛んできた）は、行き先にそのまま現れる
                pos.x = target.x;
                pos.y = target.y;
                vel.x = vel.y = 0;
            }
            setMode('free');
            show(target.pose, target.flip);

            const ax = STIFFNESS * (target.x - pos.x) - DAMPING * vel.x;
            const ay = STIFFNESS * (target.y - pos.y) - DAMPING * vel.y;
            vel.x += ax * dt;
            vel.y += ay * dt;
            pos.x += vel.x * dt;
            pos.y += vel.y * dt;

            // 横へ動くと進む向きへ少し傾く
            const rot = clamp(vel.x * 0.012, -12, 12);
            const ox = tip.fx * size.w;
            const oy = tip.fy * size.h;
            // 絵が画面からはみ出さないように（行き先が画面の外でも、縁で待つ）
            const left = clamp(pos.x - ox, 8, vw - size.w - 8);
            const top = clamp(pos.y - oy, NAV_BOTTOM, vh - size.h - 8);
            place(left, top, size.w, ox, oy, rot);

            const settled = Math.hypot(target.x - pos.x, target.y - pos.y) < 0.3 && Math.hypot(vel.x, vel.y) < 4;
            const waiting = override && override.until > now;
            if (!settled || waiting) frame = requestAnimationFrame(tick);
            else last = 0;
        };
        const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };

        const react = (pose: Aim['pose'], ms: number) => {
            override = { pose, until: performance.now() + ms };
            if (shown === pose) shown = null; // 同じしぐさでも、もう一度跳ねさせる
            kick();
            window.setTimeout(kick, ms + 20);
        };

        // --- 読む人の操作に応える ---------------------------------------------
        const onPointerOver = (e: PointerEvent) => {
            const row = (e.target as Element).closest?.('.mag-contents__list li');
            if (row !== hoveredRow) { hoveredRow = row; kick(); }
        };
        const onFocusIn = (e: FocusEvent) => {
            const row = (e.target as Element).closest?.('.mag-contents__list li');
            if (row) { hoveredRow = row; kick(); }
        };
        const onClick = (e: MouseEvent) => {
            const t = e.target as Element;
            if (t.closest?.('.mag-filter__chip')) react('thumbsUp', 1300);
            if (t.closest?.('.mag-back__email')) {
                // コピーに成功したら封筒が飛ぶ（BackCover が is-sent を付ける）。それを見てからグッジョブ
                window.setTimeout(() => {
                    if (document.querySelector('.mag-back__art.is-sent')) react('thumbsUp', 2200);
                }, 120);
            }
        };
        const onHighFive = () => react('wave', 1100);
        const onPointerLeave = () => { hoveredRow = null; kick(); };

        const list = document.querySelector('.mag-contents__list');
        list?.addEventListener('pointerover', onPointerOver as EventListener);
        list?.addEventListener('pointerleave', onPointerLeave);
        list?.addEventListener('focusin', onFocusIn as EventListener);
        document.addEventListener('click', onClick);
        root.addEventListener('click', onHighFive);
        window.addEventListener('scroll', kick, { passive: true });
        window.addEventListener('resize', kick);
        const observer = new MutationObserver(kick);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
        root.dataset.state = 'hidden';
        root.tabIndex = -1;
        kick();

        return () => {
            list?.removeEventListener('pointerover', onPointerOver as EventListener);
            list?.removeEventListener('pointerleave', onPointerLeave);
            list?.removeEventListener('focusin', onFocusIn as EventListener);
            document.removeEventListener('click', onClick);
            root.removeEventListener('click', onHighFive);
            window.removeEventListener('scroll', kick);
            window.removeEventListener('resize', kick);
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <button ref={rootRef} type="button" className="mag-guide" aria-label="案内役の手とハイタッチする" aria-hidden="true">
            <span ref={popRef} className="mag-guide__pop">
                <span className="mag-guide__bob">
                    {POSE_KEYS.map((key) => (
                        <Image
                            key={key}
                            data-pose={key}
                            src={POSES[key].img.src}
                            alt=""
                            width={POSES[key].img.width}
                            height={POSES[key].img.height}
                            sizes={key === 'lift' ? '(max-width: 760px) 90vw, 560px' : '160px'}
                            loading="eager"
                            draggable={false}
                        />
                    ))}
                </span>
            </span>
        </button>
    );
}
