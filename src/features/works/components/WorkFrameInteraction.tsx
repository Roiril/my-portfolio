'use client';

import { useEffect } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';

export default function WorkFrameInteraction() {
    const { enabled } = useMotion();

    useEffect(() => {
        const section = document.getElementById('works');
        if (!section || !enabled) return;

        let frame = 0;
        let active: HTMLElement | null = null;
        let nextX = 50;
        let nextY = 50;

        const paint = () => {
            frame = 0;
            if (!active) return;
            active.style.setProperty('--focus-x', `${nextX}%`);
            active.style.setProperty('--focus-y', `${nextY}%`);
        };
        const reset = () => {
            if (frame) cancelAnimationFrame(frame);
            frame = 0;
            if (active) {
                delete active.dataset.frameActive;
                active.style.removeProperty('--focus-x');
                active.style.removeProperty('--focus-y');
            }
            active = null;
        };
        const locate = (event: PointerEvent) => {
            const media = (event.target as Element).closest<HTMLElement>('.work-card--lead .work-media--linked');
            if (!media || !section.contains(media)) return null;
            const rect = media.getBoundingClientRect();
            nextX = Math.max(12, Math.min(88, (event.clientX - rect.left) / rect.width * 100));
            nextY = Math.max(15, Math.min(85, (event.clientY - rect.top) / rect.height * 100));
            return media;
        };
        const move = (event: PointerEvent) => {
            if (event.pointerType === 'touch') return;
            const media = locate(event);
            if (media !== active) reset();
            if (!media) return;
            active = media;
            active.dataset.frameActive = '';
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const press = (event: PointerEvent) => {
            const media = locate(event);
            if (media !== active) reset();
            if (!media) return;
            active = media;
            active.dataset.frameActive = '';
            paint();
        };
        const leave = (event: PointerEvent) => {
            if (active && !active.contains(event.relatedTarget as Node)) reset();
        };

        section.addEventListener('pointermove', move, { passive: true });
        section.addEventListener('pointerdown', press, { passive: true });
        section.addEventListener('pointerup', reset, { passive: true });
        section.addEventListener('pointercancel', reset, { passive: true });
        section.addEventListener('pointerout', leave, { passive: true });
        window.addEventListener('scroll', reset, { passive: true });
        return () => {
            section.removeEventListener('pointermove', move);
            section.removeEventListener('pointerdown', press);
            section.removeEventListener('pointerup', reset);
            section.removeEventListener('pointercancel', reset);
            section.removeEventListener('pointerout', leave);
            window.removeEventListener('scroll', reset);
            reset();
        };
    }, [enabled]);

    return null;
}
