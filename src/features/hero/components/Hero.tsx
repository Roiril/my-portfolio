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
        let targetArtX = 0;
        let targetArtY = 0;

        const paint = () => {
            const arrangement = smooth(clamp((current - .12) / .72));
            const intro = smooth(clamp((current - .32) / .21));
            const dark = smooth(clamp((current - .27) / .26));
            const gather = smooth(clamp((current - .50) / .48));
            root.style.setProperty('--hero-progress', String(current));
            root.style.setProperty('--opening-opacity', String(1 - smooth(clamp((current - .17) / .39))));
            root.style.setProperty('--opening-y', -current * 100 + 'px');
            const openingX = width > 760 ? width * .08 * arrangement : 0;
            const openingY = width <= 760 ? -height * .28 * arrangement : -height * .16 * arrangement;
            const openingScale = width <= 760 ? 1 - .18 * arrangement : 1 - .25 * arrangement;
            root.style.setProperty('--art-x', (openingX * (1 - gather) + targetArtX * gather) + 'px');
            root.style.setProperty('--art-y', (openingY * (1 - gather) + targetArtY * gather) + 'px');
            root.style.setProperty('--art-scale', String(openingScale * (1 - gather) + (width <= 760 ? .2 : .15) * gather));
            root.style.setProperty('--art-rotation', `${180 * gather}deg`);
            root.style.setProperty('--intro-opacity', String(intro));
            root.style.setProperty('--intro-y', ((1 - intro) * 40 - smooth(clamp((current - .70) / .3)) * (width <= 760 ? 280 : 140)) + 'px');
            root.style.setProperty('--paper-opacity', String(1 - dark));
            const portal = smooth(clamp((current - .78) / .18));
            root.style.setProperty('--wire-opacity', String(1 - smooth(clamp((current - .94) / .06))));
            root.style.setProperty('--portal-progress', String(portal * (1 - smooth(clamp((current - .86) / .14)))));
            root.style.setProperty('--portal-scale', String(.64 + portal * .36));
            root.style.setProperty('--bundle-turn', `${(current * 180).toFixed(1)}deg`);
            root.dataset.progress = current.toFixed(3);
            progressRef.current = current;
            document.dispatchEvent(new Event('portfolio-hero-progress'));
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
            const art = root.querySelector<HTMLElement>('.immersive-hero__art');
            const portal = root.querySelector<HTMLElement>('.immersive-hero__portal');
            if (art && portal) {
                targetArtX = portal.offsetLeft + portal.offsetWidth / 2 - art.offsetLeft - art.offsetWidth / 2;
                targetArtY = portal.offsetTop + portal.offsetHeight / 2 - art.offsetTop - art.offsetHeight / 2;
            }
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
                <div className="immersive-hero__guides site-container" aria-hidden="true"><span /><span /><span /></div>
                <div className="immersive-hero__visual site-container" aria-hidden="true"><div className="immersive-hero__art">
                    <div className="immersive-hero__fallback">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ rotate: i * 3 + 'deg', scale: 1 - i * .035 }} />)}</div>
                    <InteractionScene progressRef={progressRef} motionEnabled={enabled} />
                    <span className="immersive-hero__figure-note">FORM STUDY — 01</span>
                </div><div className="immersive-hero__portal" aria-hidden="true" /></div>
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
                        <p className="section-kicker">ENTERTAINMENT &amp; INTERACTION</p>
                        <h2><span>新しいエンタメ体験</span><span>人とコンピューターの間を設計</span></h2>
                        <p>XRの体験やWebアプリを制作しています。<br />人と機械の関わり方を、試作とユーザ評価を通じて研究しています。</p>
                    </div>
                </div>
                <div className="immersive-hero__index site-container" aria-hidden="true"><span>EXPLORE THE POSSIBILITIES</span><span>↓ SCROLL</span></div>
            </div>
        </section>
    );
}
