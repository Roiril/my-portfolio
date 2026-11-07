import { Shippori_Mincho, Zen_Kaku_Gothic_New } from 'next/font/google';

// トップページだけで使う 2 書体。英字の大見出し（Anton）は layout.tsx の共通のものを使う
const serif = Shippori_Mincho({ weight: ['500', '700'], subsets: ['latin'], variable: '--font-front-serif', display: 'swap', preload: false });
const sans = Zen_Kaku_Gothic_New({ weight: ['400', '500', '900'], subsets: ['latin'], variable: '--font-front-sans', display: 'swap', preload: false });

export const frontFonts = `${serif.variable} ${sans.variable}`;
