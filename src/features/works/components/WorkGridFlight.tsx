'use client';

import { useLayoutEffect, useRef } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** Keep every image's destination in normal layout. Only its visual layer travels. */
export default function WorkGridFlight() {
    const { enabled } = useMotion();
    const reachedProgress = useRef(new WeakMap<HTMLElement, number>());

    useLayoutEffect(() => {
        const section = document.getElementById('works');
        const source = section?.querySelector<HTMLElement>('.works-launchpad__square');
        if (!section || !source || !enabled) return;

        const cards = [...section.querySelectorAll<HTMLElement>('.work-card')];
        const media = cards.map((card) => card.querySelector<HTMLElement>('.work-media'));
        let frame = 0;
        let disposed = false;

        const reset = (card: HTMLElement, item: HTMLElement) => {
            delete card.dataset.flightActive;
            item.style.removeProperty('transform');
            item.style.removeProperty('opacity');
            card.style.removeProperty('--flight-text-opacity');
        };

        const measure = () => {
            frame = 0;
            if (document.hidden) return;
            const viewport = window.innerHeight;
            if (viewport <= 620) {
                source.style.opacity = '0';
                cards.forEach((card, index) => { if (media[index]) reset(card, media[index]!); });
                return;
            }
            const sectionRect = section.getBoundingClientRect();
            if (sectionRect.top > viewport * 1.5 || sectionRect.bottom < 0) {
                source.style.opacity = '0';
                return;
            }
            const origin = source.getBoundingClientRect();
            const originX = origin.left + origin.width / 2;
            const originY = origin.top + origin.height / 2;
            const mobile = window.innerWidth <= 760;
            let activeFlight = 0;
            const sectionTop = sectionRect.top + window.scrollY;
            const turn = 180 + Math.max(0, window.scrollY - sectionTop) / viewport * 110;
            const measurements = cards.map((card, index) => {
                const item = media[index];
                if (!item || !card.getClientRects().length) return null;
                const rect = card.getBoundingClientRect();
                return { card, item, index, left: rect.left + item.offsetLeft, top: rect.top + item.offsetTop,
                    width: item.offsetWidth, height: item.offsetHeight };
            });
            const heroProgress = Number(document.querySelector<HTMLElement>('.immersive-hero')?.dataset.progress ?? 0);
            source.style.setProperty('--bundle-turn', `${turn.toFixed(1)}deg`);

            measurements.forEach((measurement, index) => {
                const card = cards[index];
                const item = media[index];
                if (!item) return;
                if (!measurement) {
                    reset(card, item);
                    return;
                }
                if (card.contains(document.activeElement)) {
                    reachedProgress.current.set(card, 1);
                    reset(card, item);
                    return;
                }

                // Read the card's layout box: the media's rendered rect already
                // includes last frame's transform and would feed back into itself.
                const { left, top, width, height } = measurement;
                // The second image in each pair follows the first as the row arrives.
                const stagger = !mobile && index % 2 ? viewport * .12 : 0;
                const start = viewport * 1.2 - stagger;
                const finish = viewport * .72 - stagger;
                // An image only advances: scrolling back or changing filters must
                // not send an already revealed image back to the launch point.
                const progress = Math.max(reachedProgress.current.get(card) ?? 0,
                    clamp((start - top) / (start - finish)));
                reachedProgress.current.set(card, progress);

                // Far-off cards require no paint or image compositing work.
                if (progress >= 1 || top + height < -viewport * .2) {
                    reset(card, item);
                    return;
                }
                if (top > start + viewport * .15) {
                    reset(card, item);
                    return;
                }

                const arrival = smooth(progress);
                activeFlight = Math.max(activeFlight, 1 - smooth(clamp(progress / .9)));
                const inverse = 1 - arrival;
                const centerX = left + width / 2;
                const centerY = top + height / 2;
                const scale = origin.width / Math.max(width, height);
                const currentScale = scale * inverse + arrival;
                item.style.transform = `translate3d(${((originX - centerX) * inverse).toFixed(1)}px, ${((originY - centerY) * inverse).toFixed(1)}px, 0) scale(${currentScale.toFixed(4)})`;
                item.style.opacity = String(smooth(clamp(progress / .16)));
                card.style.setProperty('--flight-text-opacity', String(smooth(clamp((progress - .3) / .45))));
                card.dataset.flightActive = '';
            });
            const handoff = smooth(clamp((viewport * .9 - sectionRect.top) / (viewport * .25)));
            const sharedShape = smooth(clamp((heroProgress - .94) / .06));
            const exit = smooth(clamp((sectionRect.bottom - 100) / 200));
            source.style.opacity = ((.55 + activeFlight * .2) * handoff * sharedShape * exit).toFixed(3);
        };

        const schedule = () => {
            if (!disposed && !frame && !document.hidden) frame = requestAnimationFrame(measure);
        };
        const visibility = () => {
            if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
            else schedule();
        };
        const resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(section);
        media.forEach((item) => { if (item) resizeObserver.observe(item); });
        const mutationObserver = new MutationObserver(schedule);
        const filter = section.querySelector('.works-filter');
        if (filter) mutationObserver.observe(filter, { attributes: true, attributeFilter: ['data-active-category'] });
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule, { passive: true });
        window.addEventListener('load', schedule);
        window.addEventListener('pageshow', schedule);
        document.addEventListener('portfolio-hero-progress', schedule);
        document.addEventListener('visibilitychange', visibility);
        section.addEventListener('focusin', schedule);
        section.addEventListener('focusout', schedule);
        // Some browsers restore scroll after hydration without dispatching scroll.
        const restorationCheck = window.setTimeout(schedule, 500);
        document.fonts.ready.then(schedule);
        measure();

        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            window.removeEventListener('load', schedule);
            window.removeEventListener('pageshow', schedule);
            document.removeEventListener('portfolio-hero-progress', schedule);
            document.removeEventListener('visibilitychange', visibility);
            section.removeEventListener('focusin', schedule);
            section.removeEventListener('focusout', schedule);
            window.clearTimeout(restorationCheck);
            source.style.removeProperty('opacity');
            source.style.removeProperty('--bundle-turn');
            cards.forEach((card, index) => { if (media[index]) reset(card, media[index]!); });
        };
    }, [enabled]);

    return null;
}
