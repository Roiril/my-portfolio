import Image from 'next/image';

type Props = { src: string; alt: string; fit?: 'cover' | 'contain'; wide?: boolean; eager?: boolean };

export function WorkCardMedia({ src, alt, fit = 'cover', wide = false, eager = false }: Props) {
    return (
        <Image src={src} alt={alt} fill
            loading={eager ? 'eager' : 'lazy'}
            unoptimized={eager}
            sizes={wide
                ? '(max-width: 760px) calc(100vw - 40px), (max-width: 1440px) calc(58vw - 64px), 820px'
                : '(max-width: 760px) calc(100vw - 40px), (max-width: 1440px) calc((100vw - 160px) / 2), 696px'}
            className={'work-image work-image--' + fit} />
    );
}

export default WorkCardMedia;
