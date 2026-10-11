'use client';

import { useLayoutEffect } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** Keep every image's destination in normal layout. Only its visual layer travels. */
export default function WorkGridFlight() {
    const { enabled } = useMotion();

    useLayoutEffect(() => {
        const section = document.getElementById('works');
        const source = section?.querySelector<HTMLElement>('.works-launchpad__square');
        if (!section || !source || !enabled || window.innerHeight <= 620) return;

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
            const origin = source.getBoundingClientRect();
            const originX = origin.left + origin.width / 2;
            const originY = origin.top + origin.height / 2;
            const viewport = window.innerHeight;
            const mobile = window.innerWidth <= 760;
            let activeFlight = 0;
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top + window.scrollY;
            const turn = 180 + Math.max(0, window.scrollY - sectionTop) / viewport * 110;
            source.style.setProperty('--bundle-turn', `${turn.toFixed(1)}deg`);

            cards.forEach((card, index) => {
                const item = media[index];
                if (!item) return;
                if (!card.getClientRects().length) {
                    reset(card, item);
                    return;
                }

                // Read the card's layout box: the media's rendered rect already
                // includes last frame's transform and would feed back into itself.
                const cardRect = card.getBoundingClientRect();
                const left = cardRect.left + item.offsetLeft;
                const top = cardRect.top + item.offsetTop;
                const width = item.offsetWidth;
                const height = item.offsetHeight;
                // The second image in each pair follows the first as the row arrives.
                const stagger = !mobile && index % 2 ? viewport * .12 : 0;
                const start = viewport * (mobile ? .94 : .82) - stagger;
                const finish = viewport * (mobile ? .62 : .42) - stagger;
                const progress = clamp((start - top) / (start - finish));

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
            const heroProgress = Number(document.querySelector<HTMLElement>('.immersive-hero')?.dataset.progress ?? 0);
            const sharedShape = smooth(clamp((heroProgress - .94) / .06));
            const exit = smooth(clamp((sectionRect.bottom - 100) / 200));
            source.style.opacity = ((.55 + activeFlight * .2) * handoff * sharedShape * exit).toFixed(3);
        };

        const schedule = () => {
            if (!disposed && !frame) frame = requestAnimationFrame(measure);
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
            window.clearTimeout(restorationCheck);
            source.style.removeProperty('opacity');
            source.style.removeProperty('--bundle-turn');
            cards.forEach((card, index) => { if (media[index]) reset(card, media[index]!); });
        };
    }, [enabled]);

    return null;
}
