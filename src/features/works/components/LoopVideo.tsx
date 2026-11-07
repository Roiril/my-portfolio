'use client';

import { useEffect, useRef } from 'react';
import { useMotion } from '@/components/motion/MotionProvider';

// 音のない短い映像。画面に入っている間だけ再生する。動きを減らす設定では静止画のまま
export default function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
    const ref = useRef<HTMLVideoElement>(null);
    const { enabled } = useMotion();

    useEffect(() => {
        const video = ref.current;
        if (!video || !enabled || !('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) video.play().catch(() => undefined);
                else video.pause();
            }
        }, { threshold: 0.2 });
        observer.observe(video);
        return () => {
            observer.disconnect();
            video.pause();
        };
    }, [enabled]);

    return <video ref={ref} src={src} poster={poster} aria-label={label} muted loop playsInline preload="none" />;
}
