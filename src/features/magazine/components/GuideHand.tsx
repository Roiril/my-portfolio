'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { art, type ArtImage } from '@/content/magazine-art';
import { COPIED_EVENT } from './BackCover';
import { HAND_BOX, HANDOFF, SRC_H, SRC_W, coverMotion, easeInOut, handOffset } from './cover-hand';

// 案内役の手。表紙で駒を置いた手が、小さくなって読む人について来る。
// 節ごとに行き先としぐさを決めてあり、そこへばねで飛んでいく：
//   目次      … 読んでいる行（マウスを載せた行）を指さす
//   特集      … 「詳細」を手のひらで「どうぞ」と示す
//   作品      … 絞り込みのボタンを指さす。押すとグッジョブ
//   プロフィール … 経歴のボタンの横でグッジョブ
//   連絡先    … メールアドレスを指さす。コピーするとグッジョブ、いちばん下では手を振る
// しぐさは修士研究で「伝わった」動き（指さし・どうぞ・ガッツポーズ・ハイタッチ）から選んだ。
// 押すとハイタッチを返す。動き OFF と「視差効果を減らす」では出さない（表紙の手もその場に残る）。
//
// 読む邪魔をしないための決まり：
//   ・行き先が画面の外にあるあいだは、身を引いて消える（画面の縁に残ると本文に重なるため）。
//     行き先が画面に入ると、縁から飛んできて現れる
//   ・スマホでも同じ対象を追う。手を小さくし、操作部の横に確保した余白から案内する

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
    dozo: { img: art.guideDozo, tip: [0.975, 0.24], width: 136 },
    thumbsUp: { img: art.guideThumbsUp, tip: [0, 0.45], width: 86 },
    wave: { img: art.guideWave, tip: [0, 0.5], width: 86 },
};
const POSE_KEYS = Object.keys(POSES) as PoseKey[];

// none：この節には指す物が無い（リンクの無い見開きなど）。そのときは身を引く
type Aim = { pose: Exclude<PoseKey, 'lift'>; flip: boolean; x: number; y: number; section: string; none?: boolean };

// スマホでも対象を追い、手の大きさだけ画面に合わせる。
const NARROW = 600;
const NARROW_SCALE = 0.6;
// 固定のナビ（.site-nav）の下端から、これだけ下までしか上がらない
const NAV_GAP = 12;
// 行き先が画面の上下の縁からこれ以上外へ出たら身を引き、これ以上内へ入ったら戻る（境目でちらつかないように差を付ける）
const AWAY_OUT = 0;
const AWAY_IN = 24;
// ばね（少しだけ行き過ぎて戻る）
const STIFFNESS = 170;
const DAMPING = 2 * Math.sqrt(STIFFNESS) * 0.72;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function poseSize(key: PoseKey, narrow: boolean) {
    const p = POSES[key];
    const scale = narrow ? NARROW_SCALE : clamp(document.documentElement.clientWidth / 1100, 0.72, 1);
    const w = p.width * scale;
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

/** 横に並んだ要素の 1 行目の右端と、その行の中心の高さ（高さの違う札と文字が並んでも、中心の高さで同じ行とみなす） */
function firstLineEnd(container: Element) {
    const items = Array.from(container.children).map((c) => c.getBoundingClientRect()).filter((r) => r.width > 0);
    if (!items.length) return null;
    const y = items[0].top + items[0].height / 2;
    const line = items.filter((r) => Math.abs(r.top + r.height / 2 - y) < 6);
    return { left: Math.min(...line.map((r) => r.left)), right: Math.max(...line.map((r) => r.right)), y };
}

// 案内役の手が重なってはいけない、読む・押す物。写真には重なってよい（白い縁取りでシールのように見える）
// 目次の行はリンクの箱ではなく中身で測る（スマホでは行の右に手の居場所を空けてあるため）
const READABLE = [
    'h2', 'h3', 'p', 'dt', 'dd',
    '.mag-contents__name', '.mag-contents__cat', '.mag-contents__thumb', '.mag-spread__links a', '.mag-spread__facts li', '.mag-spread__credits li',
    '.mag-filter__chip', '.mag-tile__caption', '.mag-profile__resume', '.mag-back__email', '.mag-back__links a',
].join(', ');
// 絵の外周には透明な余白があるので、その分を内側へ寄せて重なりを測る
const HAND_INSET = 0.14;

export default function GuideHand() {
    const rootRef = useRef<HTMLButtonElement>(null);
    const popRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const pop = popRef.current;
        if (!root || !pop) return;
        const coverElement = document.querySelector('.cover-art');
        if (!coverElement) return;
        const imgs = new Map(POSE_KEYS.map((k) => [k, root.querySelector<HTMLImageElement>(`img[data-pose="${k}"]`)]));
        const still = () =>
            matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.motion === 'off';

        let mode: 'hidden' | 'flight' | 'free' | 'away' = 'hidden';
        let shown: PoseKey | null = null;
        let shownFlip = false;
        const pos = { x: 0, y: 0 };
        const vel = { x: 0, y: 0 };
        let override: { pose: Aim['pose']; until: number } | null = null;
        let hoveredRow: Element | null = null;
        let frame = 0;
        let last = 0;
        const timers = new Set<number>();
        const navBottom = () => (document.querySelector('.site-nav')?.getBoundingClientRect().bottom ?? 52) + NAV_GAP;
        // 指定の時刻にもう一度コマを回す（引っ込む・しぐさを戻す時刻に、スクロールが無くても動くように）
        const wakeAt = (time: number) => {
            const id = window.setTimeout(() => { timers.delete(id); kick(); }, Math.max(0, time - performance.now()) + 20);
            timers.add(id);
        };

        const show = (key: PoseKey, flip: boolean, popScale = 0.82) => {
            if (key === shown && flip === shownFlip) return;
            const wasShown = shown;
            imgs.forEach((img, k) => img?.toggleAttribute('data-on', k === key));
            root.toggleAttribute('data-flip', flip);
            root.dataset.pose = key;
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
            const hidden = next === 'hidden' || next === 'away';
            root.tabIndex = hidden ? -1 : 0;
            root.setAttribute('aria-hidden', String(hidden));
        };

        // --- いま読んでいる節から、行き先としぐさを決める ---------------------
        const aim = (vw: number, vh: number): Aim => {
            const narrow = matchMedia(`(max-width: ${NARROW}px)`).matches;
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
            else if (id === 'contents') flip = false;
            if (override && override.until > performance.now()) {
                pose = override.pose;
                flip = pose === 'point' || pose === 'dozo';
            }

            let x = vw - 40;
            let y = vh * 0.5;
            let found = false;
            const top0 = navBottom();
            // 行き先 (px, py) に指先を当てたとき、手の絵が実際に置かれる範囲（tick と同じく画面の中へ押し込んだ位置）
            const handRect = (px: number, py: number, f: boolean) => {
                const { w, h } = poseSize(pose, narrow);
                const t = tipOf(pose, f);
                const left = clamp(px - t.fx * w, 8, vw - w - 8);
                const top = clamp(clamp(py, top0, vh) - t.fy * h, top0, vh - h - 8);
                const ix = w * HAND_INSET;
                const iy = h * HAND_INSET;
                return { left: left + ix, right: left + w - ix, top: top + iy, bottom: top + h - iy };
            };
            type Box = { left: number; right: number; top: number; bottom: number };
            const meets = (a: Box, b: Box) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
            // 文字の段落は箱が列の幅いっぱいなので、実際に文字がある行の範囲で測る
            const blocked = (hand: Box) => Array.from(active?.querySelectorAll(READABLE) ?? []).some((el) => {
                if (!meets(el.getBoundingClientRect(), hand)) return false;
                if (!el.matches('h2, h3, p, dt, dd, .mag-back__email')) return true;
                const range = document.createRange();
                range.selectNodeContents(el);
                return Array.from(range.getClientRects()).some((r) => r.width > 0 && meets(r, hand));
            });
            // 指す物の横（既定の側 → 反対の側）に置く。どちらに置いても読む物に重なるなら、身を引く
            const beside = (left: number, right: number, cy: number, preferLeft = false, adjust?: (px: number, f: boolean) => number) => {
                const { w, h } = poseSize(pose, narrow);
                const leftFits = left >= w + 22;
                const first = preferLeft ? leftFits : right + w + 22 > vw && leftFits;
                for (const fromLeft of [first, !first]) {
                    if (fromLeft && !leftFits) continue;
                    const f = (pose === 'point' || pose === 'dozo') ? !fromLeft : fromLeft;
                    let px = fromLeft ? left - 14 : right + 14;
                    if (adjust) px = adjust(px, f);
                    // スマホの折り返したボタン列では、次の行に手が掛からないよう中央に収める。
                    const py = narrow ? cy + (tipOf(pose, f).fy - 0.5) * h : cy;
                    if (blocked(handRect(px, py, f))) continue;
                    flip = f;
                    x = px;
                    y = py;
                    found = true;
                    return;
                }
            };
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
                    const text = row.querySelector('.mag-contents__text')?.getBoundingClientRect();
                    beside(list.getBoundingClientRect().left, text?.right ?? b.right, b.top + b.height / 2, true);
                }
            } else if (active?.classList.contains('mag-spread')) {
                const links = active.querySelector('.mag-spread__links');
                const end = links && firstLineEnd(links);
                if (end && links) {
                    // 2 行目に長いリンクがあるときも、確保した右の余白に収める。
                    const reserved = matchMedia('(max-width: 1100px)').matches;
                    beside(end.left, end.right, end.y, false, (px, f) => {
                        if (!reserved || !f) return px;
                        const { w } = poseSize(pose, narrow);
                        return Math.max(px, links.getBoundingClientRect().right - w + tipOf(pose, f).fx * w);
                    });
                }
            } else if (id === 'gallery') {
                const filter = active.querySelector('.mag-filter');
                const end = filter && firstLineEnd(filter);
                if (end) beside(end.left, end.right, end.y);
            } else if (id === 'profile') {
                const b = active.querySelector('.mag-profile__resume')?.getBoundingClientRect();
                if (b) beside(b.left, b.right, b.top + b.height / 2);
            } else if (id === 'contact') {
                const email = active.querySelector('.mag-back__email');
                if (email) {
                    const b = narrow ? email.getBoundingClientRect() : textEnd(email);
                    beside(b.left, b.right, b.top + b.height / 2);
                }
            }
            return { pose, flip, x, y, section: id, none: !found };
        };

        // --- 1 コマ ----------------------------------------------------------
        const tick = (now: number) => {
            frame = 0;
            const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
            last = now;
            const motion = coverMotion(coverElement);
            const s = motion.scroll;
            if (still() || s < HANDOFF) {
                setMode('hidden');
                last = 0;
                return;
            }
            const vw = document.documentElement.clientWidth;
            const vh = window.innerHeight;
            const narrow = matchMedia(`(max-width: ${NARROW}px)`).matches;
            const target = aim(vw, vh);
            if (root.dataset.section !== target.section) root.dataset.section = target.section;
            const size = poseSize(target.pose, narrow);
            const tip = tipOf(target.pose, target.flip);
            const p = motion.flight;

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
                const endCy = clamp(target.y + (0.5 - tip.fy) * size.h, navBottom() + size.h / 2, vh - size.h / 2 - 8);
                const e = easeInOut(Math.max(0, p));
                // 大きさは先に縮める（大きいまま画面の上へ流れていくと、ナビに隠れて見失う）
                const w = lerp(heroW, size.w, 1 - (1 - Math.max(0, p)) ** 3);
                const h = (w * HAND_BOX.h) / HAND_BOX.w;
                const cx = lerp(heroCx, endCx, e);
                // 表紙は上へ流れていくので、手はナビの下より上へは行かせない
                const cy0 = lerp(heroCy, endCy, e);
                const cy = lerp(cy0, Math.max(cy0, navBottom() + h / 2), e);
                setMode('flight');
                show('lift', false);
                place(cx - w / 2, cy - h / 2, w, w / 2, h / 2, -Math.sin(Math.PI * e) * 14);
                pos.x = target.x;
                pos.y = target.y;
                vel.x = vel.y = 0;
                last = 0;
                return;
            }

            const top0 = navBottom();
            // 行き先が画面の外なら身を引く。押そうとしている（フォーカスがある）あいだは引かない
            const margin = mode === 'away' ? AWAY_IN : AWAY_OUT;
            const outside = Boolean(target.none) || target.y < top0 + margin || target.y > vh - margin;
            const away = outside && document.activeElement !== root;
            // ばねの行き先は画面の中に収める（外の行き先まで追って、戻るときに遠くから飛んでこないように）
            target.x = clamp(target.x, 0, vw);
            target.y = clamp(target.y, top0, vh);
            if (mode === 'hidden') {
                // 途中から読み込んだとき（再読み込み・リンクで飛んできた）は、行き先にそのまま現れる
                pos.x = target.x;
                pos.y = target.y;
                vel.x = vel.y = 0;
            }
            setMode(away ? 'away' : 'free');
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
            // 絵が画面からはみ出さないようにする。
            const left = clamp(pos.x - ox, 8, vw - size.w - 8);
            const top = clamp(pos.y - oy, top0, vh - size.h - 8);
            place(left, top, size.w, ox, oy, rot);

            const settled = Math.hypot(target.x - pos.x, target.y - pos.y) < 0.3 && Math.hypot(vel.x, vel.y) < 4;
            if (!settled) frame = requestAnimationFrame(tick);
            else last = 0;
        };
        const kick = () => { if (!frame) frame = requestAnimationFrame(tick); };

        const react = (pose: Aim['pose'], ms: number) => {
            override = { pose, until: performance.now() + ms };
            // しぐさを元に戻す時刻に起こす。
            wakeAt(override.until);
            if (shown === pose) shown = null; // 同じしぐさでも、もう一度跳ねさせる
            kick();
        };

        // --- 読む人の操作に応える ---------------------------------------------
        const onPointerOver = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            const row = (e.target as Element).closest?.('.mag-contents__list li');
            if (row !== hoveredRow) { hoveredRow = row; kick(); }
        };
        const onFocusIn = (e: FocusEvent) => {
            const row = (e.target as Element).closest?.('.mag-contents__list li');
            if (row) { hoveredRow = row; kick(); }
        };
        // キーボードで目次の一覧から出たら、読んでいる行（画面の中央の行）を指す動きに戻す
        const onFocusOut = (e: FocusEvent) => {
            const next = e.relatedTarget as Element | null;
            if (!next?.closest?.('.mag-contents__list')) { hoveredRow = null; kick(); }
        };
        const onClick = (e: MouseEvent) => {
            if ((e.target as Element).closest?.('.mag-filter__chip')) react('thumbsUp', 1300);
        };
        // メールアドレスのコピーに成功したとき（BackCover が知らせる）
        const onCopied = () => react('thumbsUp', 2200);
        const onHighFive = () => react('wave', 1100);
        const onPointerLeave = () => { hoveredRow = null; kick(); };

        const list = document.querySelector('.mag-contents__list');
        list?.addEventListener('pointerover', onPointerOver as EventListener);
        list?.addEventListener('pointerleave', onPointerLeave);
        list?.addEventListener('focusin', onFocusIn as EventListener);
        list?.addEventListener('focusout', onFocusOut as EventListener);
        document.addEventListener('click', onClick);
        window.addEventListener(COPIED_EVENT, onCopied);
        root.addEventListener('click', onHighFive);
        window.addEventListener('scroll', kick, { passive: true });
        window.addEventListener('resize', kick);
        const resizeObserver = new ResizeObserver(kick);
        resizeObserver.observe(coverElement);
        resizeObserver.observe(document.querySelector('.mag-cover') ?? coverElement);
        const observer = new MutationObserver(kick);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
        root.dataset.state = 'hidden';
        root.tabIndex = -1;
        kick();

        return () => {
            list?.removeEventListener('pointerover', onPointerOver as EventListener);
            list?.removeEventListener('pointerleave', onPointerLeave);
            list?.removeEventListener('focusin', onFocusIn as EventListener);
            list?.removeEventListener('focusout', onFocusOut as EventListener);
            document.removeEventListener('click', onClick);
            window.removeEventListener(COPIED_EVENT, onCopied);
            timers.forEach((id) => window.clearTimeout(id));
            root.removeEventListener('click', onHighFive);
            window.removeEventListener('scroll', kick);
            window.removeEventListener('resize', kick);
            resizeObserver.disconnect();
            observer.disconnect();
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    return (
        <button ref={rootRef} type="button" className="mag-guide" aria-label="案内役の手とハイタッチする" aria-hidden="true">
            <span ref={popRef} className="mag-guide__pop">
                <span className="mag-guide__bob">
                    <span className="mag-guide__skin">
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
            </span>
        </button>
    );
}
