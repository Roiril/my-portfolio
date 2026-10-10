import type { CSSProperties } from 'react';

export default function GeometryMark({ variant = 'fan' }: { variant?: 'fan' | 'planes' }) {
    return (
        <div className={'geometry-mark geometry-mark--' + variant} aria-hidden="true">
            {Array.from({ length: 20 }, (_, index) => <i key={index} style={{ '--mark-index': index } as CSSProperties} />)}
        </div>
    );
}
