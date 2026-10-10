'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMotion } from './MotionProvider';
import './scroll-choreography.css';

type DriftTarget = {
    media: HTMLElement;
    image: HTMLImageElement;
    current: number;
    target: number;
};

type ProgressTarget = {
    element: HTMLElement;
    kind: 'rule' | 'section';
    current: number;
    target: number;
};

const MAX_DRIFT = 18;
const IMAGE_SCALE = 1.04;
const TIME_CONSTANT = 80;

function clamp(value: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function driftFromRect(rect: DOMRectReadOnly) {
    const viewportCenter = window.innerHeight / 2;
    const travel = viewportCenter + rect.height / 2;
    const progress = travel > 0 ? (viewportCenter - (rect.top + rect.height / 2)) / travel : 0;
    const gapSafeDrift = Math.max(0, rect.height * (IMAGE_SCALE - 1) / 2 - 1);
    const amplitude = Math.min(MAX_DRIFT, gapSafeDrift);
    return clamp(progress, -1, 1) * amplitude;
}

function ruleProgressFromRect(rect: DOMRectReadOnly) {
    const start = window.innerHeight * .92;
    const end = window.innerHeight * .38;
    return clamp((start - rect.top) / (start - end));
}

function sectionProgressFromRect(rect: DOMRectReadOnly) {
    return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
}

function progressFromRect(target: ProgressTarget, rect: DOMRectReadOnly) {
    return target.kind === 'rule' ? ruleProgressFromRect(rect) : sectionProgressFromRect(rect);
}

export default function ScrollChoreography() {
    const { enabled } = useMotion();
    const pathname = usePathname();

    useEffect(() => {
        const driftTargets = [...document.querySelectorAll<HTMLElement>('.work-media')]
            .map((media): DriftTarget | null => {
                const image = media.querySelector<HTMLImageElement>('.work-image:not(.work-image--contain)');
                return image ? { media, image, current: 0, target: 0 } : null;
            })
            .filter((target): target is DriftTarget => target !== null);
        const progressTargets: ProgressTarget[] = [
            ...[...document.querySelectorAll<HTMLElement>('[data-scroll-rule]')]
                .map((element): ProgressTarget => ({ element, kind: 'rule', current: 0, target: 0 })),
            ...[...document.querySelectorAll<HTMLElement>('[data-scroll-section]')]
                .map((element): ProgressTarget => ({ element, kind: 'section', current: 0, target: 0 })),
        ];

        if (!enabled || !('IntersectionObserver' in window)) return;
        if (driftTargets.length === 0 && progressTargets.length === 0) return;

        const driftByElement = new Map(driftTargets.map((target) => [target.media, target]));
        const progressByElement = new Map(progressTargets.map((target) => [target.element, target]));
        const visibleDriftTargets = new Set<DriftTarget>();
        const visibleProgressTargets = new Set<ProgressTarget>();
        let frame = 0;
        let measureFrame = 0;
        let previousTime = 0;

        progressTargets.forEach((target) => {
            target.element.dataset.scrollActive = '';
            target.element.style.setProperty(
                target.kind === 'rule' ? '--rule-progress' : '--section-progress',
                '0',
            );
        });

        const hasVisibleTargets = () => visibleDriftTargets.size > 0 || visibleProgressTargets.size > 0;

        const halt = () => {
            if (frame) cancelAnimationFrame(frame);
            if (measureFrame) cancelAnimationFrame(measureFrame);
            frame = 0;
            measureFrame = 0;
            previousTime = 0;
        };

        const tick = (time: number) => {
            frame = 0;
            if (!hasVisibleTargets()) {
                previousTime = 0;
                return;
            }

            const elapsed = previousTime ? Math.min(64, time - previousTime) : 16;
            const easing = 1 - Math.exp(-elapsed / TIME_CONSTANT);
            let moving = false;
            previousTime = time;

            visibleDriftTargets.forEach((target) => {
                const distance = target.target - target.current;
                if (Math.abs(distance) < .05) target.current = target.target;
                else {
                    target.current += distance * easing;
                    moving = true;
                }

                const drift = `${target.current.toFixed(2)}px`;
                target.image.style.setProperty('--media-drift', drift);
                target.media.dataset.drift = drift;
            });

            visibleProgressTargets.forEach((target) => {
                const distance = target.target - target.current;
                if (Math.abs(distance) < .002) target.current = target.target;
                else {
                    target.current += distance * easing;
                    moving = true;
                }

                target.element.style.setProperty(
                    target.kind === 'rule' ? '--rule-progress' : '--section-progress',
                    target.current.toFixed(4),
                );
            });

            if (moving && document.visibilityState === 'visible') frame = requestAnimationFrame(tick);
            else previousTime = 0;
        };

        const start = () => {
            if (!frame && hasVisibleTargets() && document.visibilityState === 'visible') {
                frame = requestAnimationFrame(tick);
            }
        };

        const measureVisibleTargets = () => {
            measureFrame = 0;
            visibleDriftTargets.forEach((target) => {
                target.target = driftFromRect(target.media.getBoundingClientRect());
            });
            visibleProgressTargets.forEach((target) => {
                target.target = progressFromRect(target, target.element.getBoundingClientRect());
            });
            start();
        };

        const scheduleMeasurement = () => {
            if (!measureFrame && hasVisibleTargets() && document.visibilityState === 'visible') {
                measureFrame = requestAnimationFrame(measureVisibleTargets);
            }
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const element = entry.target as HTMLElement;
                const driftTarget = driftByElement.get(element);
                if (driftTarget) {
                    if (entry.isIntersecting) {
                        driftTarget.target = driftFromRect(entry.boundingClientRect);
                        visibleDriftTargets.add(driftTarget);
                        driftTarget.media.dataset.drift = `${driftTarget.current.toFixed(2)}px`;
                    } else {
                        visibleDriftTargets.delete(driftTarget);
                        delete driftTarget.media.dataset.drift;
                    }
                    return;
                }

                const progressTarget = progressByElement.get(element);
                if (!progressTarget) return;
                if (entry.isIntersecting) {
                    progressTarget.target = progressFromRect(progressTarget, entry.boundingClientRect);
                    visibleProgressTargets.add(progressTarget);
                } else {
                    visibleProgressTargets.delete(progressTarget);
                    const completed = entry.boundingClientRect.bottom <= 0 ? 1 : 0;
                    progressTarget.current = completed;
                    progressTarget.target = completed;
                    progressTarget.element.style.setProperty(
                        progressTarget.kind === 'rule' ? '--rule-progress' : '--section-progress',
                        String(completed),
                    );
                }
            });

            if (!hasVisibleTargets()) halt();
            else start();
        }, { rootMargin: '8% 0px' });

        const handleVisibility = () => {
            if (document.visibilityState === 'hidden') halt();
            else start();
        };

        driftTargets.forEach((target) => observer.observe(target.media));
        progressTargets.forEach((target) => observer.observe(target.element));
        window.addEventListener('scroll', scheduleMeasurement, { passive: true });
        window.addEventListener('resize', scheduleMeasurement, { passive: true });
        document.addEventListener('visibilitychange', handleVisibility);

        return () => {
            halt();
            observer.disconnect();
            window.removeEventListener('scroll', scheduleMeasurement);
            window.removeEventListener('resize', scheduleMeasurement);
            document.removeEventListener('visibilitychange', handleVisibility);
            driftTargets.forEach((target) => {
                target.image.style.removeProperty('--media-drift');
                delete target.media.dataset.drift;
            });
            progressTargets.forEach((target) => {
                target.element.style.removeProperty('--rule-progress');
                target.element.style.removeProperty('--section-progress');
                delete target.element.dataset.scrollActive;
            });
        };
    }, [enabled, pathname]);

    return null;
}
