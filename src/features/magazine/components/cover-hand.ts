// 表紙の手の動き。表紙の絵（CoverArt）と案内役（GuideHand）の両方が同じ値を使う。
// 案内役は、表紙の手が離れた位置から飛び立つので、2 つの計算がずれると継ぎ目が見える。
//
// スクロール量（px）で 3 段に分ける：
//   0 → PLACE              手が駒を持ったまま、空いたマスへ下ろす
//   PLACE → HANDOFF        駒を放し、手だけが少し持ち上がる
//   HANDOFF →              表紙の手を隠し、同じ位置から案内役が飛び立つ
//
// 動かす量は元の絵を測って決めた：
// - 盤の上面の四隅から射影を作り、4 × 4 マスと判定（市松の一致 87.5%）
// - 置くのは奥から 2 列目・左から 2 番目の青いマス。描かれたマスの青い領域の重心が (981, 771)、駒の底は y=779
// - 手に持った駒の底の中心は (807, 651)。よって手は右へ 174px、下へ 128px 動かす
export const SRC_W = 1448;
export const SRC_H = 1086;
const MOVE = { x: ((981 - 807) / SRC_W) * 100, y: ((779 - 651) / SRC_H) * 100 };
// 下ろす途中で少し持ち上げる量（絵の高さに対する %）
const LIFT = 2.5;
// 駒を放したあと、手が持ち上がる量（絵の幅・高さに対する %）
const RELEASE = { x: 3, y: -12 };

export const PLACE = 320;
export const HANDOFF = 460;

// 手だけの層（cover-hand）の中で、手が描かれている範囲（split_hand.py の出力を測った値）
export const HAND_BOX = { x: 45, y: 57, w: 925, h: 609 };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** 駒の位置（絵の幅・高さに対する %）。置いたあとは動かない */
export function pieceOffset(scrollY: number) {
    const t = easeInOut(clamp01(scrollY / PLACE));
    const lift = Math.sin(Math.PI * t) * LIFT;
    return { x: MOVE.x * t, y: MOVE.y * t - lift };
}

/** 手の位置（絵の幅・高さに対する %）。駒を置くまでは駒と一緒に、そのあとは手だけ持ち上がる */
export function handOffset(scrollY: number) {
    const piece = pieceOffset(scrollY);
    const r = easeOut(clamp01((scrollY - PLACE) / (HANDOFF - PLACE)));
    return { x: piece.x + RELEASE.x * r, y: piece.y + RELEASE.y * r };
}
