'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMotion } from './MotionProvider';

export default function RevealObserver() {
    const { enabled } = useMotion();
    const pathname = usePathname();

    useEffect(() => {
        const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];

        if (!enabled || targets.length === 0) {
            targets.forEach((target) => delete target.dataset.revealReady);
            return;
        }

        if (!('IntersectionObserver' in window)) {
            targets.forEach((target) => target.classList.add('is-revealed'));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
        );

        targets.forEach((target) => {
            const bounds = target.getBoundingClientRect();
            if (bounds.top < window.innerHeight && bounds.bottom > 0) {
                target.classList.add('is-revealed');
                return;
            }

            observer.observe(target);
            target.dataset.revealReady = '';
        });

        return () => {
            observer.disconnect();
            targets.forEach((target) => delete target.dataset.revealReady);
        };
    }, [enabled, pathname]);

    return null;
}
