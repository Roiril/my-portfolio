"""等角と幾何の図。whiteout と retroTV は等角の分解、aquarium と cube-diary は幾何。

aquarium の軌跡は 3 つの決まりを実際に計算したもの。cube-diary の球面は黄金角の実計算で、
螺旋と結び目は並べ方の形を示す計算。作品の実データではないのでキャプションに書く。
"""
import math
import random

from common import Iso, NIGHT, PAPER, FONT, save


def poly(g, pts, fill="none", stroke="none", sw=0.25, extra=""):
    d = "M" + " L".join(f"{a:.2f} {b:.2f}" for a, b in pts) + " Z"
    g.raw(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" {extra}/>')


def line(g, a, b, stroke, sw=0.25, extra=""):
    g.raw(f'<line x1="{a[0]:.2f}" y1="{a[1]:.2f}" x2="{b[0]:.2f}" y2="{b[1]:.2f}" stroke="{stroke}" stroke-width="{sw}" {extra}/>')


def lead(g, pal, ax, ay, tx, ty, lines, fs, anchor="start"):  # 罫は文字の上、線は罫の近い端へ
    width = max(len(s) for s in lines) * fs * .92
    x0, x1 = (tx, tx + width) if anchor == "start" else (tx - width, tx)
    ry = ty - fs * 1.15
    near = x0 if abs(ax - x0) < abs(ax - x1) else x1
    line(g, (ax, ay), (near, ry), pal["ink"], .2)
    line(g, (x0, ry), (x1, ry), pal["ink"], .2)
    for i, s in enumerate(lines):
        g.text(tx, ty + i * fs * 1.36, s, size=fs, anchor=anchor, weight="700" if i == 0 else "400", fill=pal["ink"] if i == 0 else pal["mid"])


# ---------- WhiteOut ----------
def ink_field(n=18):
    """塗りの例。前の位置から今の位置までをカプセルで塗るので、線がつながる"""
    rnd = random.Random(7)
    field = [[0.0] * n for _ in range(n)]
    strokes = []
    for k in range(5):
        a = rnd.uniform(0, 6.28)
        sx, sy = n * .45 + rnd.uniform(-1, 1), n * .55 + rnd.uniform(-1, 1)
        L = rnd.uniform(5, 10)
        ex, ey = sx + math.cos(a) * L, sy + math.sin(a) * L
        strokes.append((sx, sy, ex, ey))
    for sx, sy, ex, ey in strokes:
        for i in range(n):
            for j in range(n):
                px, py = i + .5, j + .5
                dx, dy = ex - sx, ey - sy
                t = max(0, min(1, ((px - sx) * dx + (py - sy) * dy) / (dx * dx + dy * dy)))
                d = math.hypot(px - sx - t * dx, py - sy - t * dy)
                v = max(0.0, 1.5 - d) / 1.5
                field[i][j] = max(field[i][j], v)
    return field, strokes


def whiteout(variant):
    pal = NIGHT
    wide = variant == "wide"
    W, H = (272, 256) if wide else (180, 330)
    u = 1.0
    size = 90 if wide else 78
    ox, oy = (118, 148) if wide else (78, 186)
    gapz = 62 if wide else 76
    fs = 4.1 if wide else 6.0
    g = Iso(ox=ox, oy=oy, u=u, sw=.3, font=FONT, ink=pal["ink"])
    n = 18
    c = size / n
    field, strokes = ink_field(n)

    # 下: 整数の配列。濃さで値を示す
    z = 0
    poly(g, [g.p(0, 0, z), g.p(size, 0, z), g.p(size, size, z), g.p(0, size, z)], fill="#141110", stroke=pal["ink"], sw=.4)
    for i in range(n):
        for j in range(n):
            v = field[i][j]
            if v > .02:
                lv = int(40 + 200 * v)
                col = f"#{lv:02x}{lv:02x}{lv:02x}"
                poly(g, [g.p(i * c, j * c, z), g.p((i + 1) * c, j * c, z), g.p((i + 1) * c, (j + 1) * c, z), g.p(i * c, (j + 1) * c, z)], fill=col)
    for k in range(1, n):
        wgt, op = (.4, 1) if k % 6 == 0 else (.15, .4)
        line(g, g.p(k * c, 0, z), g.p(k * c, size, z), pal["ink"], wgt, f'stroke-opacity="{op}"')
        line(g, g.p(0, k * c, z), g.p(size, k * c, z), pal["ink"], wgt, f'stroke-opacity="{op}"')

    for x, y in ((0, 0), (size, 0), (size, size), (0, size)):
        g.guide(x, y, 0, gapz, stroke=pal["mid"], sw=.2)

    # 中: 面ごとのテクスチャ。塗りが増えた面だけ赤で囲う
    z = gapz
    poly(g, [g.p(0, 0, z), g.p(size, 0, z), g.p(size, size, z), g.p(0, size, z)], fill="#0b0908", stroke=pal["ink"], sw=.4)
    face = size / 3
    changed = set()
    for i in range(n):
        for j in range(n):
            if field[i][j] > .5:
                changed.add((i // 6, j // 6))
    for k in (1, 2):
        line(g, g.p(k * face, 0, z), g.p(k * face, size, z), pal["ink"], .4)
        line(g, g.p(0, k * face, z), g.p(size, k * face, z), pal["ink"], .4)
    for a, b in sorted(changed):
        poly(g, [g.p(a * face, b * face, z), g.p((a + 1) * face, b * face, z), g.p((a + 1) * face, (b + 1) * face, z), g.p(a * face, (b + 1) * face, z)], fill=pal["red"], stroke=pal["red"], sw=.7, extra='fill-opacity=".22"')

    for x, y in ((0, 0), (size, 0), (size, size), (0, size)):
        g.guide(x, y, gapz, gapz * 2, stroke=pal["mid"], sw=.2)

    # 上: 画面。セルの格子を消し、白と黒に塗り分けた結果
    z = gapz * 2
    poly(g, [g.p(0, 0, z), g.p(size, 0, z), g.p(size, size, z), g.p(0, size, z)], fill="#000", stroke=pal["ink"], sw=.5)
    cp = " ".join(f"{a:.2f},{b:.2f}" for a, b in (g.p(0, 0, z), g.p(size, 0, z), g.p(size, size, z), g.p(0, size, z)))
    g.raw(f'<clipPath id="wo-screen-{variant}"><polygon points="{cp}"/></clipPath><g clip-path="url(#wo-screen-{variant})">')
    for sx, sy, ex, ey in strokes:
        a, b = g.p(sx * c, sy * c, z), g.p(ex * c, ey * c, z)
        line(g, a, b, "#fff", c * 2.1, 'stroke-linecap="round"')
    g.raw("</g>")
    sx, sy, ex, ey = strokes[0]
    h = g.p(ex * c, ey * c, z)
    g.raw(f'<circle cx="{h[0]:.2f}" cy="{h[1]:.2f}" r="{c * .85:.2f}" fill="{pal["red"]}"/>')

    edge = g.p(size, 0, 0)[0]
    if wide:
        tx = 208
        lead(g, pal, *g.p(size, 30, gapz * 2), tx, 50, ["画面", "シェーダーで白と地の色に", "塗り分ける"], fs)
        lead(g, pal, *g.p(size, 30, gapz), tx, 118, ["面ごとのテクスチャ", "3 × 3 の面。変わった面", "だけを送る"], fs)
        lead(g, pal, *g.p(size, 30, 0), tx, 186, ["整数の配列", "セルごとの塗り 0〜255", "どこが塗られたかは", "ここだけが知っている"], fs)
    else:
        lead(g, pal, *g.p(0, 0, gapz * 2), 5, 14, ["画面", "白と地の色に塗り分ける"], fs)
        lead(g, pal, *g.p(60, 0, gapz), 176, 112, ["テクスチャ", "変わった", "面だけ"], fs, anchor="end")
        lead(g, pal, *g.p(size, size, 0), 5, 300, ["整数の配列", "セルごとの塗り 0〜255"], fs)
    save(g, "whiteout-layers", variant, W, H, pal, "WhiteOut の塗りの層の図",
         "下から整数の配列、面ごとのテクスチャ、画面の 3 層を分解して重ねた図。塗りの正本は配列にあり、変わった面だけがテクスチャへ送られ、シェーダーが画面に塗り分ける。")


# ---------- Retro TV ----------
def retro(variant):
    pal = PAPER
    wide = variant == "wide"
    W, H = (272, 284) if wide else (180, 350)
    w_, d_ = (86, 64) if wide else (72, 54)
    ox, oy = (112, 158) if wide else (76, 190)
    gap = 46 if wide else 56
    fs = 4.1 if wide else 6.0
    g = Iso(ox=ox, oy=oy, u=1, sw=.32, font=FONT, ink=pal["ink"])

    def guides(z0, z1):
        for x, y in ((0, 0), (w_, 0), (w_, d_), (0, d_)):
            g.guide(x, y, z0, z1, stroke=pal["mid"], sw=.2)

    # 筐体。画面の穴があり、右につまみが 2 つ
    g.plate_hole(0, 0, -30, w_, d_, 30, 7, 7, w_ - 14, d_ - 14, fill="#e8e4da", stroke=pal["ink"])
    for i, y in enumerate((d_ * .32, d_ * .68)):
        g.xcyl(w_, w_ + 5, y, -15, 4.2, fill=pal["red"] if i == 0 else "#ffffff", stroke=pal["ink"])
    guides(0, gap)

    # 曲面。32 分割の平面を cos でふくらませる
    z = gap
    NX, NY = 32, 24
    def curved(i, j):
        fx, fy = i / NX, j / NY
        h = 6 * math.cos((fx - .5) * math.pi) * math.cos((fy - .5) * math.pi)
        return g.p(fx * w_, fy * d_, z + h)
    outline = [curved(i, 0) for i in range(NX + 1)] + [curved(NX, j) for j in range(NY + 1)] + [curved(i, NY) for i in range(NX, -1, -1)] + [curved(0, j) for j in range(NY, -1, -1)]
    poly(g, outline, fill="#ffffff", stroke=pal["ink"], sw=.4)
    for i in range(1, NX):
        pts = " ".join(f"{a:.2f},{b:.2f}" for a, b in (curved(i, j) for j in range(NY + 1)))
        g.raw(f'<polyline points="{pts}" fill="none" stroke="{pal["ink"]}" stroke-width=".15" stroke-opacity=".55"/>')
    for j in range(1, NY):
        pts = " ".join(f"{a:.2f},{b:.2f}" for a, b in (curved(i, j) for i in range(NX + 1)))
        g.raw(f'<polyline points="{pts}" fill="none" stroke="{pal["ink"]}" stroke-width=".15" stroke-opacity=".3"/>')
    guides(gap + 6, gap * 2)

    # 効果の層: 走査線、ノイズ、流れる帯
    z = gap * 2
    poly(g, [g.p(0, 0, z), g.p(w_, 0, z), g.p(w_, d_, z), g.p(0, d_, z)], fill="#ffffff", stroke=pal["ink"], sw=.4, extra='fill-opacity=".85"')
    for k in range(1, 20):
        line(g, g.p(0, k * d_ / 20, z), g.p(w_, k * d_ / 20, z), pal["ink"], .15, 'stroke-opacity=".6"')
    poly(g, [g.p(0, d_ * .55, z), g.p(w_, d_ * .55, z), g.p(w_, d_ * .7, z), g.p(0, d_ * .7, z)], fill=pal["red"], extra='fill-opacity=".85"')
    rnd = random.Random(3)
    for _ in range(46):
        a = g.p(rnd.uniform(2, w_ - 2), rnd.uniform(2, d_ - 2), z)
        g.raw(f'<circle cx="{a[0]:.2f}" cy="{a[1]:.2f}" r=".3" fill="{pal["ink"]}"/>')
    guides(gap * 2, gap * 3)

    # Canvas と 5 つのチャンネル
    z = gap * 3
    for i in range(4, 0, -1):
        off = i * 2.6
        poly(g, [g.p(0, 0, z + off), g.p(w_, 0, z + off), g.p(w_, d_, z + off), g.p(0, d_, z + off)], fill="#f0ece3", stroke=pal["ink"], sw=.2)
    poly(g, [g.p(0, 0, z), g.p(w_, 0, z), g.p(w_, d_, z), g.p(0, d_, z)], fill="#ffffff", stroke=pal["ink"], sw=.4)
    for y_, wid, s in ((.18, .5, .9), (.34, .72, .3), (.46, .62, .3), (.58, .68, .3), (.74, .3, .9)):
        line(g, g.p(w_ * .12, d_ * y_, z), g.p(w_ * (.12 + wid), d_ * y_, z), pal["ink"], s)

    if wide:
        tx = 206
        lead(g, pal, *g.p(w_, 12, gap * 3 + 8), tx, 34, ["チャンネル", "5 つの中身"], fs)
        lead(g, pal, *g.p(w_, 30, gap * 3), tx, 82, ["Canvas 2D", "幅 800px に描く"], fs)
        lead(g, pal, *g.p(w_, 30, gap * 2), tx, 134, ["ブラウン管の効果", "走査線とノイズ、", "流れる帯、周辺の減光"], fs)
        lead(g, pal, *g.p(w_, 30, gap + 3), tx, 196, ["湾曲した画面", "32 分割の平面を", "cos でふくらませる"], fs)
        lead(g, pal, *g.p(w_ + 5, d_ * .32, -15), tx, 256, ["つまみ", "チャンネルを変える"], fs)
    else:
        lead(g, pal, *g.p(0, 0, gap * 3 + 8), 5, 14, ["チャンネル", "5 つの中身"], fs)
        lead(g, pal, *g.p(50, 0, gap * 2), 176, 72, ["効果", "走査線と", "ノイズ"], fs, anchor="end")
        lead(g, pal, *g.p(50, 0, gap + 3), 176, 128, ["曲面", "32 分割"], fs, anchor="end")
        lead(g, pal, *g.p(w_ + 5, d_ * .32, -15), 176, 326, ["つまみ", "チャンネルを変える"], fs, anchor="end")
    save(g, "retrotv-layers", variant, W, H, pal, "Portfolio: Retro TV version の層の図",
         "上からチャンネルと Canvas、ブラウン管の効果、32 分割の湾曲した画面、つまみの付いた筐体を分解して重ねた図。")


# ---------- CubeDiary ----------
def cube(variant):
    pal = NIGHT
    wide = variant == "wide"
    W, H = (272, 130) if wide else (180, 330)
    fs = 4.1 if wide else 6.0
    g = Iso(font=FONT, ink=pal["ink"])
    s = 15.0 if wide else 19.0
    nx, ny = (22, 26) if wide else (34, 22)
    cells = [(1, 0), (0, 1), (1, 1), (2, 1), (3, 1), (1, 2)]
    rnd = random.Random(5)
    fills = ["#f1ebe2", "#c8c1b6", "#8f897f", "#5b5650", pal["red"], "#2c2825"]
    for (a, b), col in zip(cells, fills):
        g.raw(f'<rect x="{nx + a * s:.2f}" y="{ny + b * s:.2f}" width="{s}" height="{s}" fill="{col}" stroke="{pal["ink"]}" stroke-width=".4"/>')
    g.text(nx, ny + 3 * s + (fs * 1.9), "展開図", size=fs, weight="700", fill=pal["ink"])
    g.text(nx, ny + 3 * s + (fs * 3.2), "面ごとに写真を割り当てる", size=fs * .85, fill=pal["mid"])

    R = 27.0 if wide else 42.0
    centers = {"球面": (108, 62), "螺旋": (172, 62), "結び目": (236, 62)} if wide else {"球面": (90, 142), "螺旋": (45, 248), "結び目": (135, 248)}
    if not wide:
        R = 38.0
    rs = {"球面": R, "螺旋": R if wide else 36, "結び目": R if wide else 36}

    def draw_pts(pts, cx, cy, r):
        # 奥から手前へ。手前ほど大きい
        for x, y, z in sorted(pts, key=lambda p: p[2]):
            d = .75 + .55 * (z + 1) / 2
            q = (1.5 if wide else 2.0) * d
            X, Y = cx + x * r, cy + y * r
            col = fills[int(rnd.random() * 3)]
            g.raw(f'<rect x="{X - q:.2f}" y="{Y - q:.2f}" width="{q * 2:.2f}" height="{q * 2:.2f}" fill="{col}" fill-opacity="{.45 + .55 * (z + 1) / 2:.2f}"/>')

    N = 72
    # 黄金角で球面に置く
    ga = math.pi * (3 - math.sqrt(5))
    sphere = []
    for i in range(N):
        y = 1 - 2 * (i + .5) / N
        rr = math.sqrt(1 - y * y)
        sphere.append((math.cos(ga * i) * rr, y, math.sin(ga * i) * rr))
    spiral = []
    for i in range(N):
        t = i / N
        a = t * 6.28 * 3.2
        rr = .25 + .75 * t
        spiral.append((math.cos(a) * rr, (t - .5) * 1.1 + math.sin(a) * rr * .28, math.sin(a) * rr))
    knot = []
    for i in range(N):
        t = i / N * 6.283
        x = math.sin(t) + 2 * math.sin(2 * t)
        y = math.cos(t) - 2 * math.cos(2 * t)
        z = -math.sin(3 * t)
        knot.append((x / 3.1, y / 3.1, z))
    for name, pts in (("球面", sphere), ("螺旋", spiral), ("結び目", knot)):
        cx, cy = centers[name]
        draw_pts(pts, cx, cy, rs[name])
        note = {"球面": "黄金角で置く", "螺旋": "順に巻いていく", "結び目": "線でつなぐ形"}[name]
        y0 = cy + rs[name] + fs * 2.0
        g.text(cx, y0, name, size=fs, anchor="middle", weight="700", fill=pal["ink"])
        g.text(cx, y0 + fs * 1.35, note, size=fs * .85, anchor="middle", fill=pal["mid"])
    save(g, "cube-diary-geometry", variant, W, H, pal, "CubeDiary の展開図と並べ方の図",
         "6 面の展開図と、キューブの 3 種類の並べ方。球面、螺旋、結び目。")


# ---------- Aquarium ----------
def boids(n=38, steps=520, seed=4):
    rnd = random.Random(seed)
    fish = [[rnd.uniform(-.25, .25), rnd.uniform(-.25, .25), rnd.uniform(-1, 1), rnd.uniform(-1, 1)] for _ in range(n)]
    hist = [[] for _ in range(n)]
    for _ in range(steps):
        new = []
        for f in fish:
            near = [o for o in fish if o is not f and math.hypot(o[0] - f[0], o[1] - f[1]) < .55]
            ax = ay = 0.0
            if near:
                cx = sum(o[0] for o in near) / len(near)
                cy = sum(o[1] for o in near) / len(near)
                ax += (cx - f[0]) * .05        # 近くの仲間に寄る
                ay += (cy - f[1]) * .05
                vx = sum(o[2] for o in near) / len(near)
                vy = sum(o[3] for o in near) / len(near)
                ax += (vx - f[2]) * .10         # 向きを揃える
                ay += (vy - f[3]) * .10
                for o in near:                  # ぶつからない
                    d = math.hypot(o[0] - f[0], o[1] - f[1])
                    if d < .09 and d > 0:
                        ax -= (o[0] - f[0]) / d * .05
                        ay -= (o[1] - f[1]) / d * .05
            # 水槽の壁で向きを変える（群れの決まりとは別）
            ax -= f[0] * .22 * (abs(f[0]) > .62)
            ay -= f[1] * .22 * (abs(f[1]) > .62)
            vx, vy = f[2] + ax, f[3] + ay
            sp = math.hypot(vx, vy) or 1
            vx, vy = vx / sp, vy / sp
            new.append([f[0] + vx * .012, f[1] + vy * .012, vx, vy])
        fish = new
        for h, f in zip(hist, fish):
            h.append((f[0], f[1]))
    return fish, hist


def aquarium(variant):
    pal = PAPER
    wide = variant == "wide"
    W, H = (272, 150) if wide else (180, 290)
    fs = 4.1 if wide else 6.0
    g = Iso(font=FONT, ink=pal["ink"])
    fish, hist = boids()
    xs = [p[0] for h in hist for p in h]
    ys = [p[1] for h in hist for p in h]
    mx, my = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    span = max(max(xs) - min(xs), max(ys) - min(ys))
    cx, cy, S = (70, 75, 122 / span) if wide else (90, 86, 164 / span)
    P = lambda p: (cx + (p[0] - mx) * S, cy + (p[1] - my) * S)
    for i, h in enumerate(hist):
        col, sw = (pal["red"], .75) if i == 0 else (pal["ink"], .2)
        pts = " ".join(f"{a:.2f},{b:.2f}" for a, b in (P(q) for q in h[-120::3]))
        g.raw(f'<polyline points="{pts}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linejoin="round"/>')
    for i, f in enumerate(fish):
        X, Y = P(f)
        ang = math.atan2(f[3], f[2])
        q = 2.0
        pts = [(X + math.cos(ang) * q * 1.4, Y + math.sin(ang) * q * 1.4), (X + math.cos(ang + 2.5) * q, Y + math.sin(ang + 2.5) * q), (X + math.cos(ang - 2.5) * q, Y + math.sin(ang - 2.5) * q)]
        poly(g, pts, fill=pal["red"] if i == 0 else pal["ink"])

    # 3 つの決まり
    R = 19 if wide else 22
    rule_pos = [(160, 46), (216, 46), (160, 112)] if wide else [(32, 196), (92, 196), (150, 196)]
    if not wide:
        R = 21
    names = [("寄る", "近くの仲間の中心へ"), ("ぶつからない", "近すぎたら離れる"), ("揃える", "仲間と同じ向きへ")]
    if wide:
        rule_pos = [(158, 50), (212, 50), (158, 110)]
    for k, ((rx, ry), (nm, note)) in enumerate(zip(rule_pos, names)):
        g.raw(f'<circle cx="{rx}" cy="{ry}" r="{R}" fill="none" stroke="{pal["ink"]}" stroke-width=".3" stroke-dasharray="1 1"/>')
        g.raw(f'<circle cx="{rx}" cy="{ry}" r="1.9" fill="{pal["red"]}"/>')
        nb = [(-.55, -.45), (.5, -.55), (.55, .4), (-.35, .6)] if k != 1 else [(.32, -.22), (-.3, -.2), (.1, .36)]
        for dx, dy in nb:
            X, Y = rx + dx * R, ry + dy * R
            g.raw(f'<circle cx="{X:.2f}" cy="{Y:.2f}" r="1.5" fill="{pal["ink"]}"/>')
        def arrow(a, b, col, sw=.55):
            line(g, a, b, col, sw)
            ang = math.atan2(b[1] - a[1], b[0] - a[0])
            q = 2.0
            poly(g, [b, (b[0] + math.cos(ang + 2.6) * q, b[1] + math.sin(ang + 2.6) * q), (b[0] + math.cos(ang - 2.6) * q, b[1] + math.sin(ang - 2.6) * q)], fill=col)
        if k == 0:
            avg = (sum(d[0] for d in nb) / 4, sum(d[1] for d in nb) / 4)
            arrow((rx, ry), (rx + .55 * R * (avg[0] + .32), ry + .55 * R * (avg[1] - .32)), pal["red"])
        elif k == 1:
            for dx, dy in nb:
                arrow((rx, ry), (rx - dx * R * .85, ry - dy * R * .85), pal["red"])
        else:
            for dx, dy in nb:
                X, Y = rx + dx * R, ry + dy * R
                line(g, (X, Y), (X + 5, Y - 3.4), pal["ink"], .4)
            arrow((rx, ry), (rx + 8, ry - 5.4), pal["red"])
        ty = ry + R + fs * 1.3
        g.text(rx, ty, nm, size=fs, anchor="middle", weight="700", fill=pal["ink"])
        if wide:
            g.text(rx, ty + fs * 1.3, note, size=fs * .82, anchor="middle", fill=pal["mid"])
    if wide:
        g.text(212, 104, "3 つの決まりで", size=fs, anchor="start", weight="700", fill=pal["ink"])
        g.text(212, 104 + fs * 1.3, "計算した軌跡", size=fs, anchor="start", weight="700", fill=pal["ink"])
    else:
        for i, (nm, note) in enumerate(names):
            g.text(6, 252 + i * fs * 1.4, f"{nm}　{note}", size=fs * .85, fill=pal["mid"])
    save(g, "aquarium-rules", variant, W, H, pal, "Aquarium in Processing の 3 つの決まりの図",
         "1 匹の魚に与える 3 つの決まり、寄る、ぶつからない、揃えると、それを実際に計算したときの群れの軌跡。")


if __name__ == "__main__":
    for v in ("wide", "tall"):
        whiteout(v)
        retro(v)
        cube(v)
        aquarium(v)
    print("ok")
