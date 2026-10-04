import Image from 'next/image';

export type ArtIconName = 'brand' | 'research' | 'internship' | 'personal' | 'creative' | 'arrow' | 'mail';

/** Original generated artwork. Text beside each icon supplies its accessible name. */
export default function ArtIcon({ name, className = '', size = 24 }: { name: ArtIconName; className?: string; size?: number }) {
    return <Image src={'/images/identity/' + name + '.webp'} alt="" aria-hidden="true" width={size} height={size} sizes={size + 'px'} className={'art-icon ' + className} />;
}
