'use client';

import { useEffect, useRef } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';
import InteractionScene from './InteractionScene';
import './hero-editorial.css';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export default function Hero() {
    const { enabled } = useMotion();
    const rootRef = useRef<HTMLElement>(null);
    const progressRef = useRef(0);
    const renderRef = useRef<(() => void) | null>(null);
    const enteredRef = useRef(false);

    useEffect(() => {
        const root = rootRef.current;
        if (!enabled || !root || enteredRef.current) return;
        enteredRef.current = true;
        if (window.scrollY > 8 || window.location.hash) return;

        const lines = root.querySelectorAll<HTMLElement>('.immersive-hero__title-line > span');
        const animations = [...lines].map((line, index) => line.animate(
            [{ translate: '0 105%' }, { translate: '0 0' }],
            { duration: 680, delay: index * 70, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' },
        ));
        const art = root.querySelector<HTMLElement>('.immersive-hero__art');
        if (art) animations.push(art.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 640, easing: 'ease-out' }));
        // Cancel on scroll so navigation never waits for the opening sequence.
        const cancel = () => animations.forEach(animation => animation.cancel());
        window.addEventListener('scroll', cancel, { passive: true, once: true });
        return () => {
            cancel();
            window.removeEventListener('scroll', cancel);
        };
    }, [enabled]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        let frame = 0;
        let current = 0;
        let target = 0;
        let lastTime = 0;
        let visible = true;
        let travel = 1;
        let offset = 0;
        let width = root.clientWidth;
        let height = innerHeight;

        const paint = () => {
            const arrangement = smooth(clamp((current - .12) / .73));
            root.style.setProperty('--hero-progress', String(current));
            root.style.setProperty('--opening-y', -arrangement * (width <= 760 ? 20 : 48) + 'px');
            root.style.setProperty('--art-y', arrangement * height * .035 + 'px');
            root.style.setProperty('--art-scale', String(1 - arrangement * .08));
            root.dataset.progress = current.toFixed(3);
            progressRef.current = current;
            renderRef.current?.();
        };
        const tick = (now: number) => {
            const delta = lastTime ? Math.min(now - lastTime, 64) : 16;
            lastTime = now;
            current += (target - current) * (1 - Math.exp(-delta / 85));
            if (Math.abs(target - current) < .0002) current = target;
            paint();
            if (current !== target && visible && !document.hidden) frame = requestAnimationFrame(tick);
            else { frame = 0; lastTime = 0; }
        };
        const update = () => {
            target = enabled ? clamp((scrollY - offset) / travel) : 0;
            if (!enabled) { current = 0; paint(); return; }
            if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const measure = () => {
            width = root.clientWidth;
            height = root.querySelector<HTMLElement>('.immersive-hero__stage')?.clientHeight || innerHeight;
            travel = width > 760 && innerHeight > 620
                ? Math.max(1, root.offsetHeight - height) : height * .7;
            offset = root.getBoundingClientRect().top + scrollY;
            update();
        };
        const onVisibility = () => {
            if (document.hidden) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
            else update();
        };
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible) update();
            else { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
        });
        observer.observe(root);
        const resizeObserver = new ResizeObserver(measure);
        resizeObserver.observe(root);
        measure();
        current = target;
        paint();
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', measure, { passive: true });
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', measure);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, [enabled]);

    return (
        <section ref={rootRef} id="top" className="immersive-hero" aria-labelledby="hero-title">
            <div className="immersive-hero__stage">
                <div className="immersive-hero__guides site-container" aria-hidden="true"><span /><span /><span /></div>
                <div className="immersive-hero__visual site-container" aria-hidden="true"><div className="immersive-hero__art">
                    <div className="immersive-hero__fallback">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ rotate: i * 3 + 'deg', scale: 1 - i * .035 }} />)}</div>
                    <InteractionScene progressRef={progressRef} renderRef={renderRef} motionEnabled={enabled} />
                </div></div>
                <div className="immersive-hero__opening site-container">
                    <p className="immersive-hero__eyebrow">PORTFOLIO <span>2026</span></p>
                    <div className="immersive-hero__identity">
                        <p className="immersive-hero__name">白石 大晴</p>
                        <h1 id="hero-title" lang="en"><span className="immersive-hero__title-line"><span>Taisei</span></span><span className="immersive-hero__title-line"><span>Shiroishi<span className="immersive-hero__period" aria-hidden="true">.</span></span></span></h1>
                        <p className="immersive-hero__description">人とコンピュータの関わりを研究しています。<br />XRの体験やWebアプリを制作しています。</p>
                    </div>
                    <div className="immersive-hero__bottom">
                        <span>MEIJI UNIVERSITY / TOKYO</span>
                        <a href="#works" className="immersive-hero__scroll"><span>作品を見る</span><span className="immersive-hero__scroll-arrow" aria-hidden="true">↓</span></a>
                    </div>
                </div>
                <div className="immersive-hero__track site-container" aria-hidden="true"><span /></div>
            </div>
        </section>
    );
}
