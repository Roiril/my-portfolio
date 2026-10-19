// scripts/magazine/import_art.py が書き出す。手で書き換えない（寸法を画像と一致させるため）
export type ArtImage = { src: string; width: number; height: number; alt: string };

export const art = {
    cover: { src: '/images/magazine/cover.webp', width: 1448, height: 1086, alt: '人の手とロボットの手が、おばけの形のゲームの駒を一緒につまんでいる。まわりに VR ヘッドセット、歯車、手の動きを描いたスケッチ帳' },
    profile: { src: '/images/magazine/profile.webp', width: 1200, height: 900, alt: '作業机を真上から見た絵。ノートパソコン、VR ヘッドセット、ロボットの手の模型、方眼ノート、付箋' },
    spotContents: { src: '/images/magazine/spot-contents.webp', width: 900, height: 1200, alt: '' },
    spotGallery: { src: '/images/magazine/spot-gallery.webp', width: 900, height: 675, alt: '' },
    spotContact: { src: '/images/magazine/spot-contact.webp', width: 900, height: 675, alt: '' },
    iconResearch: { src: '/images/magazine/icon-research.webp', width: 160, height: 160, alt: '' },
    iconPersonal: { src: '/images/magazine/icon-personal.webp', width: 160, height: 160, alt: '' },
    iconInternship: { src: '/images/magazine/icon-internship.webp', width: 160, height: 160, alt: '' },
    iconCreative: { src: '/images/magazine/icon-creative.webp', width: 160, height: 160, alt: '' },
    logoMark: { src: '/images/magazine/logo-mark.webp', width: 160, height: 160, alt: '' },
    arrow: { src: '/images/magazine/arrow.webp', width: 160, height: 320, alt: '' },
} satisfies Record<string, ArtImage>;
