import Image from 'next/image';

type Props = { src: string; alt: string; fit?: 'cover' | 'contain' };

export function WorkCardMedia({ src, alt, fit = 'cover' }: Props) {
    return (
        <Image src={src} alt={alt} fill
            sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1320px) calc((100vw - 112px) / 2), 604px"
            className={'work-image work-image--' + fit} />
    );
}

export default WorkCardMedia;
