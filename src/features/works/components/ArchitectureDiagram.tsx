import type { Diagram, DiagramIcon, DiagramNode } from '../types';

// 構成図をデータからインライン SVG で描く。
// 作法は HCI 論文のシステム図に合わせる：
//   モノ … 線画＋太字の名前（囲まない）＋小さな仕様
//   ソフト … 点線の枠＋斜体の名前＋小さな機能
//   線の意味は線の上に直接書く（凡例を作らない）。破線は無線・通知
// 色は白地・黒・灰の 3 つだけ。ページの色に関係なく、白い紙に刷った図として置く。

// 座標系：升目 1 つが CELL_W × CELL_H。ノードの中心は升目の中心
const CELL_W = 240;
const CELL_H = 160;
const PAD = 12;
const INK = '#1a1a1a';
const GRAY = '#666666';
const RULE = '#8c8c8c';

// 日本語は 1 文字 1em、英数字は 0.6em として幅を見積もる（配置の当たりを付けるためだけに使う）
function textWidth(text: string, size: number): number {
    let w = 0;
    for (const ch of text) w += /[　-鿿＀-￯]/.test(ch) ? size : size * 0.6;
    return w;
}

type Box = { cx: number; cy: number; left: number; right: number; top: number; bottom: number };

function boxOf(n: DiagramNode): Box {
    const cx = PAD + n.x * CELL_W + CELL_W / 2;
    const cy = PAD + n.y * CELL_H + CELL_H / 2;
    if (n.icon) {
        const half = Math.max(32, textWidth(n.label ?? '', 15) / 2, textWidth(n.note ?? '', 12) / 2) + 4;
        return { cx, cy, left: cx - half, right: cx + half, top: cy - 40, bottom: cy + (n.note ? 52 : 34) };
    }
    const half = Math.max(textWidth(n.label ?? '', 14), textWidth(n.note ?? '', 12)) / 2 + 14;
    const h = n.note ? 58 : 36;
    return { cx, cy, left: cx - half, right: cx + half, top: cy - h / 2, bottom: cy + h / 2 };
}

// 中心から相手の中心へ向かう線が、自分の箱の縁を出る点
function exitPoint(b: Box, tx: number, ty: number, gap: number): [number, number] {
    const dx = tx - b.cx;
    const dy = ty - b.cy;
    const sx = dx === 0 ? Infinity : ((dx > 0 ? b.right : b.left) - b.cx) / dx;
    const sy = dy === 0 ? Infinity : ((dy > 0 ? b.bottom : b.top) - b.cy) / dy;
    const s = Math.min(sx, sy);
    const len = Math.hypot(dx, dy) || 1;
    return [b.cx + dx * s + (dx / len) * gap, b.cy + dy * s + (dy / len) * gap];
}

function Icon({ kind }: { kind: DiagramIcon }) {
    const line = { fill: '#fff', stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
    switch (kind) {
        case 'hmd':
            return (
                <g {...line}>
                    <path d="M-34,-6 h6 M28,-6 h6" />
                    <path d="M-28,-12 q0,-8 8,-8 h40 q8,0 8,8 v14 q0,8 -8,8 h-12 l-6,-6 h-4 l-6,6 h-12 q-8,0 -8,-8 z" />
                </g>
            );
        case 'phone':
            return (
                <g {...line}>
                    <rect x={-13} y={-22} width={26} height={44} rx={4} />
                    <path d="M-4,16 h8" />
                </g>
            );
        case 'laptop':
            return (
                <g {...line}>
                    <rect x={-24} y={-20} width={48} height={30} rx={2} />
                    <path d="M-31,14 h62 l-5,7 h-52 z" />
                </g>
            );
        case 'pc':
            return (
                <g {...line}>
                    <rect x={-28} y={-22} width={56} height={34} rx={2} />
                    <path d="M-5,12 v7 M5,12 v7 M-14,20 h28" />
                </g>
            );
        case 'cloud':
            return (
                <g {...line}>
                    <path d="M-17,14 H18 A10,10 0 0 0 20,-6 A14,14 0 0 0 -7,-11 A12,12 0 0 0 -17,14 Z" />
                </g>
            );
        case 'db':
            return (
                <g {...line}>
                    <path d="M-20,-14 v28 a20,6 0 0 0 40,0 v-28" />
                    <ellipse cx={0} cy={-14} rx={20} ry={6} />
                    <path d="M-20,0 a20,6 0 0 0 40,0" fill="none" />
                </g>
            );
        case 'browser':
            return (
                <g {...line}>
                    <rect x={-28} y={-20} width={56} height={40} rx={2} />
                    <path d="M-28,-11 h56" />
                    <g fill={INK} stroke="none">
                        <circle cx={-22} cy={-15.5} r={1.6} />
                        <circle cx={-17} cy={-15.5} r={1.6} />
                        <circle cx={-12} cy={-15.5} r={1.6} />
                    </g>
                </g>
            );
        case 'camera':
            return (
                <g {...line}>
                    <rect x={-8} y={-18} width={16} height={6} rx={1} />
                    <rect x={-22} y={-12} width={44} height={28} rx={3} />
                    <circle cx={0} cy={2} r={8} />
                </g>
            );
        case 'person':
            // 人はシルエット。名前を付けない
            return (
                <g fill="#9a9a9a">
                    <circle cx={0} cy={-11} r={9} />
                    <path d="M-20,22 q0,-21 20,-21 q20,0 20,21 z" />
                </g>
            );
    }
}

export default function ArchitectureDiagram({ diagram, id }: { diagram: Diagram; id: string }) {
    const width = PAD * 2 + diagram.cols * CELL_W;
    const height = PAD * 2 + diagram.rows * CELL_H;
    const boxes = new Map(diagram.nodes.map((n) => [n.id, boxOf(n)]));
    const markerId = id + '-arrow';
    const descId = id + '-desc';

    return (
        <figure className="case-diagram">
            <div className="case-diagram__scroll">
                <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-labelledby={descId} className="case-diagram__svg" style={{ fontFamily: 'var(--case-text)' }}>
                    <desc id={descId}>{diagram.caption}</desc>
                    <defs>
                        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                            <path d="M0,0 L10,5 L0,10 z" fill={INK} />
                        </marker>
                    </defs>
                    <rect x={0} y={0} width={width} height={height} fill="#fff" />

                    {diagram.groups?.map((g) => (
                        <g key={g.label}>
                            <rect x={PAD + g.x * CELL_W + 6} y={PAD + g.y * CELL_H + 6} width={g.w * CELL_W - 12} height={g.h * CELL_H - 12} rx={10} fill="none" stroke={RULE} strokeWidth={1.4} strokeDasharray="2 4" strokeLinecap="round" />
                            <text x={PAD + g.x * CELL_W + 20} y={PAD + g.y * CELL_H + 28} fontSize={12} fontWeight={700} fill={GRAY}>{g.label}</text>
                        </g>
                    ))}

                    {diagram.edges.map((e) => {
                        const a = boxes.get(e.from);
                        const b = boxes.get(e.to);
                        if (!a || !b) return null;
                        const [x1, y1] = exitPoint(a, b.cx, b.cy, 4);
                        const [x2, y2] = exitPoint(b, a.cx, a.cy, 4);
                        const dx = x2 - x1;
                        const dy = y2 - y1;
                        const t = e.labelAt ?? 0.5;
                        const mx = x1 + dx * t;
                        const my = y1 + dy * t;
                        // 線の向きでラベルの置き方を変える。水平なら線の上、垂直なら線の右、斜めなら線から上側へ垂直にずらす
                        const horizontal = Math.abs(dy) < 4;
                        const vertical = Math.abs(dx) < 4;
                        let lx = mx, ly = my - 8, anchor: 'middle' | 'start' | 'end' = 'middle';
                        if (vertical) { lx = mx + 8; ly = my + 4; anchor = 'start'; }
                        else if (!horizontal) {
                            const len = Math.hypot(dx, dy);
                            let nx = -dy / len, ny = dx / len;
                            if (ny > 0) { nx = -nx; ny = -ny; }
                            lx = mx + nx * 8; ly = my + ny * 8;
                            anchor = nx < 0 ? 'end' : 'start';
                        }
                        return (
                            <g key={e.from + '-' + e.to}>
                                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={1.4} strokeDasharray={e.wireless ? '4 4' : undefined} markerEnd={`url(#${markerId})`} markerStart={e.both ? `url(#${markerId})` : undefined} />
                                {e.label && (
                                    <text x={lx} y={ly} textAnchor={anchor} fontSize={12} fill={INK} stroke="#fff" strokeWidth={4} paintOrder="stroke" strokeLinejoin="round">{e.label}</text>
                                )}
                            </g>
                        );
                    })}

                    {diagram.nodes.map((n) => {
                        const b = boxes.get(n.id)!;
                        if (n.icon) {
                            return (
                                <g key={n.id}>
                                    <g transform={`translate(${b.cx} ${b.cy - 14})`}><Icon kind={n.icon} /></g>
                                    {n.label && <text x={b.cx} y={b.cy + 28} textAnchor="middle" fontSize={15} fontWeight={700} fill={INK}>{n.label}</text>}
                                    {n.note && <text x={b.cx} y={b.cy + 46} textAnchor="middle" fontSize={12} fill={GRAY}>{n.note}</text>}
                                </g>
                            );
                        }
                        return (
                            <g key={n.id}>
                                <rect x={b.left} y={b.top} width={b.right - b.left} height={b.bottom - b.top} rx={6} fill="#fff" stroke={INK} strokeWidth={1.4} strokeDasharray="1.5 3.5" strokeLinecap="round" />
                                <text x={b.cx} y={n.note ? b.cy - 6 : b.cy + 5} textAnchor="middle" fontSize={14} fontStyle="italic" fontWeight={700} fill={INK}>{n.label}</text>
                                {n.note && <text x={b.cx} y={b.cy + 15} textAnchor="middle" fontSize={12} fill={GRAY}>{n.note}</text>}
                            </g>
                        );
                    })}
                </svg>
            </div>
            <figcaption>{diagram.caption}</figcaption>
        </figure>
    );
}
