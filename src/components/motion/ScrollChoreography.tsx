'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMotion } from './MotionProvider';
import './scroll-choreography.css';

type Target = {
    element: HTMLElement;
    kind: 'rule' | 'section' | 'media' | 'heading';
    progress: number;
    complete: boolean;
    image: HTMLImageElement | null;
};

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));

function progressAt(target: Target, rect: DOMRectReadOnly, viewport: number) {
    if (target.kind === 'section') return clamp((viewport - rect.top) / (viewport + rect.height));
    const start = target.kind === 'heading' ? .96 : .98;
    const end = target.kind === 'heading' ? .7 : .54;
    return clamp((viewport * start - rect.top) / (viewport * (start - end)));
}

function propertyFor(target: Target) {
    return target.kind === 'rule' ? '--rule-progress'
        : target.kind === 'section' ? '--section-progress' : '--reveal-progress';
}

export default function ScrollChoreography() {
    const { enabled } = useMotion();
    const pathname = usePathname();

    useEffect(() => {
        if (!enabled || !('IntersectionObserver' in window)) return;

        const targets: Target[] = [
            ...document.querySelectorAll<HTMLElement>('[data-scroll-rule], [data-scroll-section], [data-scroll-reveal]'),
        ].map((element) => ({
            element,
            kind: element.hasAttribute('data-scroll-rule') ? 'rule'
                : element.hasAttribute('data-scroll-section') ? 'section'
                    : element.dataset.scrollReveal === 'heading' ? 'heading' : 'media',
            progress: -1,
            complete: false,
            image: element.closest('.work-card--lead')
                ? element.querySelector<HTMLImageElement>('.work-image:not(.work-image--contain)') : null,
        }));

        const byElement = new Map(targets.map(target => [target.element, target]));
        const visible = new Set<Target>();
        let frame = 0;

        const paint = (target: Target, progress: number) => {
            if (target.progress === progress) return;
            target.progress = progress;
            target.element.style.setProperty(propertyFor(target), progress.toFixed(4));
        };

        const measure = () => {
            frame = 0;
            // Read every rectangle before changing styles. No work runs between inputs.
            const viewport = window.innerHeight;
            const measurements = [...visible].map(target => ({
                target, rect: target.element.getBoundingClientRect(),
            }));
            for (const { target, rect } of measurements) {
                if (rect.width === 0 || rect.height === 0) continue;
                const progress = target.complete ? 1 : progressAt(target, rect, viewport);
                paint(target, progress);
                if ((target.kind === 'media' || target.kind === 'heading') && progress >= 1) {
                    target.complete = true;
                    target.element.dataset.scrollComplete = '';
                }
                if (target.image) {
                    const travel = viewport / 2 + rect.height / 2;
                    const amplitude = Math.min(8, Math.max(0, rect.height * .02 - 1));
                    const drift = clamp((viewport / 2 - rect.top - rect.height / 2) / travel, -1, 1) * amplitude;
                    target.image.style.setProperty('--media-drift', drift.toFixed(2) + 'px');
                }
            }
        };
        const schedule = () => {
            if (!frame && visible.size && !document.hidden) frame = requestAnimationFrame(measure);
        };

        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                const target = byElement.get(entry.target as HTMLElement);
                if (!target) continue;
                if (entry.isIntersecting) {
                    visible.add(target);
                } else {
                    visible.delete(target);
                    // A fast scroll or an anchor jump may skip the entry interval entirely.
                    if (entry.boundingClientRect.height > 0 && entry.boundingClientRect.bottom < 0) {
                        paint(target, 1);
                        if (target.kind === 'media' || target.kind === 'heading') {
                            target.complete = true;
                            target.element.dataset.scrollComplete = '';
                        }
                    }
                }
            }
            schedule();
        }, { rootMargin: '12% 0px' });

        // Enhanced states are opt-in: no JS, reduced motion and cleanup remain readable.
        // A restored scroll position must start in its final visible state.
        const initial = targets.map(target => ({ target, rect: target.element.getBoundingClientRect() }));
        for (const { target, rect } of initial) {
            target.element.dataset.scrollActive = '';
            const progress = rect.width && rect.height ? progressAt(target, rect, innerHeight) : 0;
            paint(target, progress);
            if ((target.kind === 'media' || target.kind === 'heading') && progress >= 1) {
                target.complete = true;
                target.element.dataset.scrollComplete = '';
            }
            observer.observe(target.element);
        }

        const onFocus = (event: FocusEvent) => {
            const focused = event.target;
            if (!(focused instanceof Element)) return;
            for (const target of targets) {
                if (target.kind !== 'media' && target.kind !== 'heading') continue;
                if (target.element.contains(focused)) {
                    target.complete = true;
                    target.element.dataset.scrollComplete = '';
                    paint(target, 1);
                }
            }
        };
        const onVisibility = () => {
            if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
            else schedule();
        };
        const resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(document.body);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule, { passive: true });
        document.addEventListener('visibilitychange', onVisibility);
        document.addEventListener('focusin', onFocus);

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            document.removeEventListener('visibilitychange', onVisibility);
            document.removeEventListener('focusin', onFocus);
            for (const target of targets) {
                target.element.style.removeProperty(propertyFor(target));
                target.image?.style.removeProperty('--media-drift');
                delete target.element.dataset.scrollActive;
                delete target.element.dataset.scrollComplete;
            }
        };
    }, [enabled, pathname]);

    return null;
}
