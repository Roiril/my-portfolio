'use client';

import { useState } from 'react';

// 押すと裏返る丸いシール。表と裏に 1 つずつ事実を書く
export default function Sticker({ front, back, className }: { front: string; back?: string; className?: string }) {
    const [flipped, setFlipped] = useState(false);
    const spoken = (text: string) => text.replace(/\n/g, ' ');
    if (!back) {
        return (
            <span className={'mag-sticker ' + (className ?? '')}>
                <span className="mag-sticker__face">{front}</span>
            </span>
        );
    }

    return (
        <button
            type="button"
            className={'mag-sticker mag-sticker--flip ' + (className ?? '')}
            aria-pressed={flipped}
            aria-label={spoken(flipped ? back : front) + '（押すと裏返る）'}
            data-flipped={flipped ? 'true' : undefined}
            onClick={() => setFlipped((v) => !v)}
        >
            <span className="mag-sticker__face mag-sticker__face--front" aria-hidden="true">{front}</span>
            <span className="mag-sticker__face mag-sticker__face--back" aria-hidden="true">{back}</span>
        </button>
    );
}
