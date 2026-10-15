'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMotion } from './MotionProvider';
import './scroll-choreography.css';

type Target = {
    element: HTMLElement;
    kind: 'rule' | 'section' | 'frame' | 'heading';
    progress: number;
    complete: boolean;
};
const clamp = (value: number) => Math.max(0, Math.min(1, value));

function progressAt(target: Target, rect: DOMRectReadOnly, viewport: number) {
    if (target.kind === 'section') return clamp((viewport - rect.top) / (viewport + rect.height));
    const start = target.kind === 'heading' ? .96 : .92;
    const end = target.kind === 'heading' ? .7 : .38;
    return clamp((viewport * start - rect.top) / (viewport * (start - end)));
}
function propertyFor(target: Target) {
    return target.kind === 'rule' ? '--rule-progress'
        : target.kind === 'section' ? '--section-progress'
            : target.kind === 'frame' ? '--frame-clip' : '--reveal-progress';
}

export default function ScrollChoreography() {
    const { enabled } = useMotion();
    const pathname = usePathname();

    useEffect(() => {
        if (!enabled || !('IntersectionObserver' in window)) return;
        const targets: Target[] = [
            ...document.querySelectorAll<HTMLElement>('[data-scroll-rule], [data-scroll-section], [data-scroll-frame], [data-scroll-reveal="heading"]'),
        ].map(element => ({
            element,
            kind: element.hasAttribute('data-scroll-rule') ? 'rule'
                : element.hasAttribute('data-scroll-section') ? 'section'
                    : element.hasAttribute('data-scroll-frame') ? 'frame' : 'heading',
            progress: -1,
            complete: false,
        }));
        const byElement = new Map(targets.map(target => [target.element, target]));
        const visible = new Set<Target>();
        let frame = 0;

        const paint = (target: Target, progress: number) => {
            if (target.progress === progress) return;
            target.progress = progress;
            target.element.style.setProperty(propertyFor(target),
                target.kind === 'frame' ? ((1 - progress) * 100).toFixed(2) + '%' : progress.toFixed(4));
        };
        const measure = () => {
            frame = 0;
            const viewport = window.innerHeight;
            // Read rectangles together before writing. Image travel has its own controller.
            const measurements = [...visible].map(target => ({
                target, rect: target.element.getBoundingClientRect(),
            }));
            for (const { target, rect } of measurements) {
                if (rect.width === 0 || rect.height === 0) continue;
                const progress = target.complete ? 1 : progressAt(target, rect, viewport);
                paint(target, progress);
                if (target.kind === 'heading' && progress >= 1) target.complete = true;
            }
        };
        const schedule = () => {
            if (!frame && visible.size && !document.hidden) frame = requestAnimationFrame(measure);
        };
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                const target = byElement.get(entry.target as HTMLElement);
                if (!target) continue;
                if (entry.isIntersecting) visible.add(target);
                else {
                    visible.delete(target);
                    if (entry.boundingClientRect.height > 0 && entry.boundingClientRect.bottom < 0) {
                        paint(target, 1);
                        if (target.kind === 'heading') target.complete = true;
                    }
                }
            }
            schedule();
        }, { rootMargin: '12% 0px' });

        const initial = targets.map(target => ({ target, rect: target.element.getBoundingClientRect() }));
        for (const { target, rect } of initial) {
            target.element.dataset.scrollActive = '';
            const progress = rect.width && rect.height ? progressAt(target, rect, innerHeight) : 0;
            paint(target, progress);
            if (target.kind === 'heading' && progress >= 1) target.complete = true;
            observer.observe(target.element);
        }
        const onVisibility = () => {
            if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
            else schedule();
        };
        const resizeObserver = new ResizeObserver(schedule);
        resizeObserver.observe(document.body);
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule, { passive: true });
        document.addEventListener('visibilitychange', onVisibility);
        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            resizeObserver.disconnect();
            window.removeEventListener('scroll', schedule);
            window.removeEventListener('resize', schedule);
            document.removeEventListener('visibilitychange', onVisibility);
            for (const target of targets) {
                target.element.style.removeProperty(propertyFor(target));
                delete target.element.dataset.scrollActive;
            }
        };
    }, [enabled, pathname]);
    return null;
}
