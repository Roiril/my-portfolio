'use client';

import { useState } from 'react';

// 押すと裏返る丸いシール。表と裏に 1 つずつ事実を書く。
// 裏が無いシールは押せないので、ただの印刷として置く（触っても動かさない）
export default function Sticker({ front, back, className }: { front: string; back?: string; className?: string }) {
    const [flipped, setFlipped] = useState(false);
    const [touched, setTouched] = useState(false);
    const spoken = (text: string) => text.replace(/\n/g, ' ');
    if (!back) {
        return (
            <span className={'mag-sticker ' + (className ?? '')}>
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
