'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import './sunset-landscape.css';

const WIDTH = 1280;
const HEIGHT = 512;
const DURATION = 3.6;
const WINDOWS = [[737, 430], [807, 385], [915, 395]] as const;
type Point = readonly [number, number];
const ease = (value: number) => value * value * (3 - 2 * value);

/** Two complete paintings share a fixed view; only deliberate input changes time. */
export default function SunsetLandscape() {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nearRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        const canvas = canvasRef.current;
        const nearCanvas = nearRef.current;
        const hero = root?.closest('section');
        const base = root?.querySelector<HTMLImageElement>('img');
        const foreground = root?.querySelector<HTMLImageElement>('.sunset-landscape__near img');
        const ctx = canvas?.getContext('2d');
        const nearCtx = nearCanvas?.getContext('2d');
        if (!root || !canvas || !hero || !base || !foreground || !ctx || !nearCtx) return;

        const nightImage = new window.Image();
        nightImage.src = '/images/identity/night-sky.webp';
        const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let nightTown: HTMLCanvasElement | null = null;
        let nightForeground: HTMLCanvasElement | null = null;
        let progress = 0;
        let target = 0;
        let bounds = canvas.getBoundingClientRect();
        let visible = true;
        let disposed = false;
        let frame = 0;
        let previous = 0;
        let candidate = -1;
        let dwell: ReturnType<typeof setTimeout> | null = null;
        let tap: { id: number; x: number; y: number; index: number } | null = null;
        let lastScrollY = window.scrollY;
        let intentStart = lastScrollY;
        let intentDirection = 0;
        let intentUntil = 0;
        let touchY = 0;
        let pendingDirection = 0;

        const drawable = () => !disposed && visible && !document.hidden && nightTown !== null;
        const measure = () => { bounds = canvas.getBoundingClientRect(); };
        const draw = () => {
            const alpha = ease(progress);
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            nearCtx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.imageSmoothingEnabled = false;
            nearCtx.imageSmoothingEnabled = false;
            // Use the whole authored painting. No punched sky masks or darkened panes.
            if (nightTown && alpha > 0) {
                ctx.globalAlpha = alpha;
                ctx.drawImage(nightTown, 0, 0);
            }
            if (nightForeground && alpha > 0) {
                nearCtx.globalAlpha = alpha;
                nearCtx.drawImage(nightForeground, 0, 0);
            }
            ctx.globalAlpha = 1;
            nearCtx.globalAlpha = 1;
            root.dataset.night = alpha.toFixed(3);
            root.dataset.journey = (progress * 4.4).toFixed(3);
            root.dataset.target = target ? 'night' : 'evening';
        };
        const halt = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
        const tick = (now: number) => {
            if (!drawable() || motion.matches) { halt(); return; }
            if (now - previous >= 40) {
                const dt = previous ? Math.min((now - previous) / 1000, .08) : .04;
                previous = now;
                progress = target > progress
                    ? Math.min(target, progress + dt / DURATION)
                    : Math.max(target, progress - dt / DURATION);
                draw();
                if (progress === target) { halt(); return; }
            }
            frame = requestAnimationFrame(tick);
        };
        const wake = () => {
            if (drawable() && !motion.matches && progress !== target && !frame) frame = requestAnimationFrame(tick);
        };
        const setNight = (night: boolean) => {
            const next = night ? 1 : 0;
            if (target === next && progress === next) return;
            target = next;
            root.dataset.target = night ? 'night' : 'evening';
            if (motion.matches) { halt(); progress = target; if (nightTown) draw(); }
            else wake();
        };
        const toggle = () => setNight(target === 0);
        const cancelDwell = () => { if (dwell !== null) clearTimeout(dwell); dwell = null; };
        const point = (x: number, y: number): Point => {
            const scale = Math.max(bounds.width / WIDTH, bounds.height / HEIGHT);
            return [(x - bounds.left - (bounds.width - WIDTH * scale) / 2) / scale,
                (y - bounds.top - (bounds.height - HEIGHT * scale) / 2) / scale];
        };
        const nearest = ([x, y]: Point, touch = false) => {
            let result = -1, best = Infinity;
            WINDOWS.forEach(([wx, wy], index) => {
                const radius = touch ? 50 : 25;
                const distance = ((x - wx) / radius) ** 2 + ((y - wy) / (radius * .85)) ** 2;
                if (distance < 1 && distance < best) { result = index; best = distance; }
            });
            return result;
        };
        const approach = (index: number) => {
            if (index === candidate) return;
            cancelDwell(); candidate = index;
            if (index >= 0 && drawable()) {
                dwell = setTimeout(() => {
                    dwell = null;
                    if (candidate === index && drawable()) toggle();
                }, motion.matches ? 0 : 160);
            }
        };
        const move = (event: PointerEvent) => {
            if (event.pointerType === 'touch') {
                if (tap && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 10) tap = null;
            } else if (drawable()) approach(nearest(point(event.clientX, event.clientY)));
        };
        const leave = () => approach(-1);
        const down = (event: PointerEvent) => {
            if (!drawable() || event.pointerType === 'mouse') return;
            if (!(event.target instanceof Element) || event.target.closest('a, button')) return;
            measure();
            const position = point(event.clientX, event.clientY);
            let index = nearest(position, true);
            if (index < 0 && position[0] > 560 && position[1] > 120 && position[1] < HEIGHT) index = 1;
            if (index >= 0) tap = { id: event.pointerId, x: event.clientX, y: event.clientY, index };
        };
        const up = (event: PointerEvent) => {
            if (tap?.id === event.pointerId && Math.hypot(event.clientX - tap.x, event.clientY - tap.y) <= 10 && drawable()) toggle();
            tap = null;
        };
        const cancelTap = () => { tap = null; };
        const sceneVisible = () => {
            const height = Math.max(0, Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0));
            return height >= Math.min(160, bounds.height * .4, innerHeight * .32);
        };
        const armScroll = (direction: number) => {
            const now = performance.now();
            // Passive input callbacks can follow compositor movement. Keep its prior position.
            if (direction !== intentDirection || now > intentUntil) intentStart = lastScrollY;
            intentDirection = direction; intentUntil = now + 700;
        };
        const scroll = () => {
            measure();
            const y = window.scrollY, direction = Math.sign(y - lastScrollY);
            if (direction) approach(-1);
            if (performance.now() <= intentUntil && direction === intentDirection
                && Math.abs(y - intentStart) >= 20) {
                // Upward intent is retained offscreen, so returning to the hero shows evening.
                if (direction < 0 || sceneVisible()) {
                    if (nightTown) setNight(direction > 0);
                    else pendingDirection = direction;
                }
            }
            lastScrollY = y;
        };
        const wheel = (event: WheelEvent) => { if (event.deltaY && !event.ctrlKey) armScroll(Math.sign(event.deltaY)); };
        const touchStart = (event: TouchEvent) => { touchY = event.touches[0]?.clientY ?? 0; };
        const touchMove = (event: TouchEvent) => {
            const touch = event.touches[0];
            const next = touch?.clientY ?? touchY;
            if (next !== touchY) armScroll(Math.sign(touchY - next));
            if (tap && touch && Math.hypot(touch.clientX - tap.x, next - tap.y) > 10) tap = null;
            touchY = next;
        };
        const scrollKey = (event: KeyboardEvent) => {
            if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
            if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [role="textbox"]')) return;
            if (event.key === ' ' && event.target instanceof Element && event.target.closest('a, button, [role="button"]')) return;
            if (['ArrowUp', 'PageUp', 'Home'].includes(event.key) || event.key === ' ' && event.shiftKey) armScroll(-1);
            else if (!event.shiftKey && ['ArrowDown', 'PageDown', ' ', 'End'].includes(event.key)) armScroll(1);
        };
        const focus = (event: FocusEvent) => {
            if (event.target instanceof Element && event.target.closest('.hero__actions a')) setNight(true);
        };
        const visibility = () => {
            if (!visible || document.hidden) { halt(); cancelDwell(); candidate = -1; tap = null; }
            else { measure(); if (nightTown) draw(); wake(); }
        };
        const preference = () => {
            cancelDwell(); halt();
            if (motion.matches) progress = target;
            if (nightTown) draw();
            wake();
        };
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
        const resize = new ResizeObserver(() => { measure(); approach(-1); });
        observer.observe(hero); resize.observe(hero);
        hero.addEventListener('pointerenter', measure, { passive: true });
        hero.addEventListener('pointermove', move, { passive: true });
        hero.addEventListener('pointerleave', leave, { passive: true });
        hero.addEventListener('pointerdown', down, { passive: true });
        hero.addEventListener('pointerup', up, { passive: true });
        hero.addEventListener('pointercancel', cancelTap, { passive: true });
        hero.addEventListener('focusin', focus);
        window.addEventListener('scroll', scroll, { passive: true });
        window.addEventListener('wheel', wheel, { passive: true });
        window.addEventListener('touchstart', touchStart, { passive: true });
        window.addEventListener('touchmove', touchMove, { passive: true });
        window.addEventListener('keydown', scrollKey);
        document.addEventListener('visibilitychange', visibility);
        motion.addEventListener('change', preference);

        void Promise.all([base.decode(), foreground.decode(), nightImage.decode()]).then(() => {
            if (disposed) return;
            nightTown = document.createElement('canvas'); nightTown.width = WIDTH; nightTown.height = HEIGHT;
            nightTown.getContext('2d')?.drawImage(nightImage, 0, 0, WIDTH, HEIGHT);
            nightForeground = document.createElement('canvas'); nightForeground.width = WIDTH; nightForeground.height = HEIGHT;
            const g = nightForeground.getContext('2d', { willReadFrequently: true });
            if (g) {
                g.drawImage(foreground, 0, 0, WIDTH, HEIGHT);
                const image = g.getImageData(0, 0, WIDTH, HEIGHT);
                for (let i = 0; i < image.data.length; i += 4) {
                    const red = image.data[i];
                    // Uniform exposure preserves alpha edges and dark silhouettes without patches.
                    image.data[i] = red * .48;
                    image.data[i + 1] *= .54;
                    image.data[i + 2] = image.data[i + 2] * .72 + red * .06;
                }
                g.putImageData(image, 0, 0);
            }
            measure(); lastScrollY = window.scrollY; draw();
            if (pendingDirection && performance.now() <= intentUntil) setNight(pendingDirection > 0);
            pendingDirection = 0; wake();
        }).catch(() => { /* A failed optional night image leaves the complete sunset intact. */ });

        return () => {
            disposed = true; halt(); cancelDwell(); observer.disconnect(); resize.disconnect();
            hero.removeEventListener('pointerenter', measure);
            hero.removeEventListener('pointermove', move);
            hero.removeEventListener('pointerleave', leave);
            hero.removeEventListener('pointerdown', down);
            hero.removeEventListener('pointerup', up);
            hero.removeEventListener('pointercancel', cancelTap);
            hero.removeEventListener('focusin', focus);
            window.removeEventListener('scroll', scroll);
            window.removeEventListener('wheel', wheel);
            window.removeEventListener('touchstart', touchStart);
            window.removeEventListener('touchmove', touchMove);
            window.removeEventListener('keydown', scrollKey);
            document.removeEventListener('visibilitychange', visibility);
            motion.removeEventListener('change', preference);
        };
    }, []);

    return (
        <div ref={rootRef} className="sunset-landscape" aria-hidden="true">
            <div className="sunset-landscape__frame">
                <div className="sunset-landscape__layer">
                    <Image src="/images/identity/sunset-town.webp" alt="" width={WIDTH} height={HEIGHT} priority unoptimized />
                </div>
                <div className="sunset-landscape__layer sunset-landscape__lights">
                    <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
                </div>
                <div className="sunset-landscape__layer sunset-landscape__near">
                    <Image src="/images/identity/sunset-foreground.webp" alt="" width={WIDTH} height={HEIGHT} priority unoptimized />
                    <canvas ref={nearRef} width={WIDTH} height={HEIGHT} className="sunset-landscape__night-near" />
                </div>
            </div>
        </div>
    );
}
