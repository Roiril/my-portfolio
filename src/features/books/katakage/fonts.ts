import { Dela_Gothic_One, Zen_Kaku_Gothic_New } from 'next/font/google';

// 攻略本の紙面と同じ 2 書体。題字と数字、本文
const display = Dela_Gothic_One({ weight: '400', subsets: ['latin'], variable: '--font-kt-display', display: 'swap', preload: false });
const body = Zen_Kaku_Gothic_New({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-kt-body', display: 'swap', preload: false });

export const katakageFonts = `${display.variable} ${body.variable}`;
