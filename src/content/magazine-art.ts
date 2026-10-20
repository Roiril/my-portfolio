// scripts/magazine/import_art.py が書き出す。手で書き換えない（寸法を画像と一致させるため）
export type ArtImage = { src: string; width: number; height: number; alt: string };

export const art = {
    coverBoard: { src: '/images/magazine/cover-board-938b5dea.webp', width: 1448, height: 1086, alt: '盤の上に駒が立っている。ロボットの手が駒をつまんで、空いたマスへ置こうとしている' },
    coverHand: { src: '/images/magazine/cover-hand-640c0934.webp', width: 1448, height: 1086, alt: '' },
    coverFront: { src: '/images/magazine/cover-front-76fe15ef.webp', width: 1448, height: 1086, alt: '' },
    profile: { src: '/images/magazine/profile-d395a7e4.webp', width: 1200, height: 900, alt: '研究で使う道具。Meta Quest 3 とロボットの手' },
    spotContents: { src: '/images/magazine/spot-contents-8c7153f7.webp', width: 900, height: 1200, alt: '' },
    spotContact: { src: '/images/magazine/spot-contact-ae28736d.webp', width: 900, height: 675, alt: '' },
    iconResearch: { src: '/images/magazine/icon-research-464a8552.webp', width: 160, height: 160, alt: '' },
    iconPersonal: { src: '/images/magazine/icon-personal-9531a081.webp', width: 160, height: 160, alt: '' },
    iconInternship: { src: '/images/magazine/icon-internship-988117b3.webp', width: 160, height: 160, alt: '' },
    iconCreative: { src: '/images/magazine/icon-creative-68e7bc4c.webp', width: 160, height: 160, alt: '' },
    logoMark: { src: '/images/magazine/logo-mark-6a00c583.webp', width: 160, height: 160, alt: '' },
    arrow: { src: '/images/magazine/arrow-0f402ef3.webp', width: 160, height: 320, alt: '' },
} satisfies Record<string, ArtImage>;
