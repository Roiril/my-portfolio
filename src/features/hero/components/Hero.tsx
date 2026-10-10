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
            const arrangement = smooth(clamp((current - .12) / .74));
            const intro = smooth(clamp((current - .46) / .34));
            root.style.setProperty('--hero-progress', String(current));
            root.style.setProperty('--opening-opacity', String(1 - smooth(clamp(current / .42))));
            root.style.setProperty('--opening-y', -current * 100 + 'px');
            root.style.setProperty('--art-x', (width > 760 ? -width * .45 * arrangement : 0) + 'px');
            root.style.setProperty('--art-y', (width <= 760 ? -arrangement * height * .24 : 0) + 'px');
            root.style.setProperty('--art-scale', String(1 - arrangement * .12));
            root.style.setProperty('--intro-opacity', String(intro));
            root.style.setProperty('--intro-y', (1 - intro) * 40 + 'px');
            root.dataset.progress = current.toFixed(3);
            progressRef.current = current;
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
            target = enabled && innerHeight > 620 ? clamp((scrollY - offset) / travel) : 0;
            if (!enabled) { current = 0; paint(); return; }
            if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
        };
        const measure = () => {
            width = root.clientWidth;
            height = root.querySelector<HTMLElement>('.immersive-hero__stage')?.clientHeight || innerHeight;
            travel = Math.max(1, root.offsetHeight - height);
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
                <div className="immersive-hero__guides" aria-hidden="true"><span /><span /><span /></div>
                <div className="immersive-hero__art" aria-hidden="true">
                    <div className="immersive-hero__fallback">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ rotate: i * 3 + 'deg', scale: 1 - i * .035 }} />)}</div>
                    <InteractionScene progressRef={progressRef} motionEnabled={enabled} />
                    <span className="immersive-hero__figure-note">FORM STUDY — 01</span>
                </div>
                <div className="immersive-hero__opening site-container">
                    <p className="immersive-hero__eyebrow">PORTFOLIO <span>2026</span></p>
                    <div className="immersive-hero__identity">
                        <p className="immersive-hero__name">白石 大晴</p>
                        <h1 id="hero-title" lang="en">Taisei<br />Shiroishi<span aria-hidden="true">.</span></h1>
                        <p className="immersive-hero__description">人とコンピュータの関わりを研究しています。<br />XRの体験やWebアプリを制作しています。</p>
                    </div>
                    <div className="immersive-hero__bottom"><span>MEIJI UNIVERSITY / TOKYO</span><span className="immersive-hero__scroll">SCROLL<span aria-hidden="true">↓</span></span></div>
                </div>
                <div className="immersive-hero__introduction site-container">
                    <div className="immersive-hero__context">
                        <p className="section-kicker">RESEARCH &amp; PRACTICE</p>
                        <h2>HCIの研究。<br />XRとWebの制作。</h2>
                        <p>人と機械が同じ場所で作業するときの<br className="desktop-break" />関わり方を研究しています。</p>
                        <p>企画から実装とユーザ評価まで。<br />試作したものを使ってもらいながら確かめています。</p>
                    </div>
                </div>
                <div className="immersive-hero__index site-container" aria-hidden="true"><span>01 / FORM &amp; STRUCTURE</span><span>↓ WORKS</span></div>
            </div>
        </section>
    );
}
