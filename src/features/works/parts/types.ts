export type Pic = {
    src: string;
    alt: string;
    w: number;
    h: number;
    caption?: string;
    // 生成した画像なら画面に書く
    generated?: boolean;
};
