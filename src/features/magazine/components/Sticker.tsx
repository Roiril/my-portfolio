'use client';

import { useEffect, useRef, useState } from 'react';

// 画面の下から 35% の線を越えたら、一度だけ叩きつけるように貼る（appear.css の appear-slap）。
// スクロールに合わせて逆再生すると、行き過ぎの揺れがゴムのように見えるので、これだけは時間で動かす。
// 読み込んだ時点で見えているシール（表紙など）は、もう貼ってあるものとして動かさない
function useSlap<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || !('IntersectionObserver' in window)) return;
        if (document.documentElement.dataset.motion !== 'on') return;
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.dataset.slap = 'ready';
        const observer = new IntersectionObserver((entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            el.dataset.slap = 'go';
            observer.disconnect();
        }, { rootMargin: '0px 0px -35% 0px' });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

// 押すと裏返る丸いシール。表と裏に 1 つずつ事実を書く。
// 裏が無いシールは押せないので、ただの印刷として置く（触っても動かさない）
export default function Sticker({ front, back, className }: { front: string; back?: string; className?: string }) {
    const [flipped, setFlipped] = useState(false);
    const [touched, setTouched] = useState(false);
    const spanRef = useSlap<HTMLSpanElement>();
    const buttonRef = useSlap<HTMLButtonElement>();
    const spoken = (text: string) => text.replace(/\n/g, ' ');
    if (!back) {
        return (
            <span ref={spanRef} className={'mag-sticker ' + (className ?? '')}>
                <span className="mag-sticker__face">{front}</span>
            </span>
        );
    }

    // 名前は「いま見えている面」。裏返した直後は、新しく見えた面を読み上げで知らせる
    // （フォーカスしたままの名前の変化は、読み上げソフトによっては読まれないため）
    const shown = spoken(flipped ? back : front);
    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                className={'mag-sticker mag-sticker--flip ' + (className ?? '')}
                aria-label={shown + '（押すと裏返る）'}
                data-flipped={flipped ? 'true' : undefined}
                onClick={() => { setFlipped((v) => !v); setTouched(true); }}
            >
                <span className="mag-sticker__face mag-sticker__face--front" aria-hidden="true">{front}</span>
                <span className="mag-sticker__face mag-sticker__face--back" aria-hidden="true">{back}</span>
            </button>
            <span className="mag-sr-only" aria-live="polite">{touched ? shown : ''}</span>
        </>
    );
}
