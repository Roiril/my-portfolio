'use client';

import { useEffect, useState } from 'react';

type Props = {
    images: string[];
    alt: string;
    fit?: 'cover' | 'contain';
    // 詳細ページを持つ作品だけ true（ホバーでスライドショー＋ズーム）
    interactive?: boolean;
};

// 作品カードの画像。interactive な場合はホバー中にギャラリー画像を
// クロスフェードで順番に切り替える（スライドショー）。
export function WorkCardMedia({ images, alt, fit = 'cover', interactive = false }: Props) {
    const [active, setActive] = useState(0);
    const [hovering, setHovering] = useState(false);

    // ホバー中だけ一定間隔で次の画像へ。停止時のリセットは onMouseLeave 側で行う
    useEffect(() => {
        if (!hovering || images.length <= 1) return;
        const id = setInterval(() => {
            setActive((i) => (i + 1) % images.length);
        }, 1100);
        return () => clearInterval(id);
    }, [hovering, images.length]);

    const handleEnter = () => setHovering(true);
    const handleLeave = () => {
        setHovering(false);
        setActive(0);
    };

    const fitClass = fit === 'contain' ? 'object-contain' : 'object-cover';

    // 単一画像 or 非インタラクティブ：従来どおりの1枚表示
    if (!interactive || images.length <= 1) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={images[0]}
                alt={alt}
                className={`w-full h-full ${fitClass} ${
                    interactive ? 'transition-transform duration-500 ease-out group-hover:scale-[1.04]' : ''
                }`}
            />
        );
    }

    return (
        <div
            className="w-full h-full relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    key={src}
                    src={src}
                    alt={alt}
                    className={`absolute inset-0 w-full h-full ${fitClass} transition-all duration-500 ease-out ${
                        i === active ? 'opacity-100' : 'opacity-0'
                    } ${hovering ? 'scale-[1.04]' : 'scale-100'}`}
                />
            ))}
        </div>
    );
}

export default WorkCardMedia;
