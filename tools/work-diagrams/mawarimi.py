"""廻リ視の部屋。寸法とカメラの位置は fixed-cam-vr の show.json（layout, cameras）の値。

床 1.8 x 1.8 m、タイル 0.15 m、L 字の壁は 2 辺とも 0.955 m、高さ 1.8 m。
カメラの区画は layout.grid.cells。行 0 が z の大きい側、列 0 が x の小さい側。
実座標 (X, Z) を図の (x, y) = (X, -Z) に写す。
"""
import math
from common import Iso, NIGHT, FONT, rounded_path, save

GRID = ["111222222222", "111222222222", "111222222222", "111000000000", "111000000000", "111000000000",
        "111000000000", "111000000000", "111000000000", "111000000000", "000000000000", "000000000000"]
CAMS = [
    ("A", 1.0, -0.72, 0.89, -61.5),
    ("B", -0.68, -1.05, 0.12, 0.0),
    ("C", 1.05, 1.05, 1.35, -110.0),
]
TILE, FLOOR = 0.15, 0.9
HFOV = 77.4


def assert_data():
    # 区画の向きの校正: 各カメラが自分の区画の中心の側を向いていること
    for idx, (name, X, Z, _h, yaw) in enumerate(CAMS):
        pts = [(-FLOOR + (c + .5) * TILE, FLOOR - (r + .5) * TILE) for r, row in enumerate(GRID) for c, v in enumerate(row) if v == str(idx)]
        assert pts, name
        cx = sum(p[0] for p in pts) / len(pts)
        cz = sum(p[1] for p in pts) / len(pts)
        fx, fz = math.sin(math.radians(yaw)), math.cos(math.radians(yaw))
        dot = (cx - X) * fx + (cz - Z) * fz
        assert dot > 0, (name, dot)


def loop(d):
    """L 字の壁のまわりを距離 d で 1 周する折れ線（実座標）"""
    a, b = -0.5, 0.5
    e = 0.455
    return [(a - d, b + d), (e + d, b + d), (e + d, b - d), (a + d, b - d), (a + d, -e - d), (a - d, -e - d)]


def draw(variant, pal=NIGHT, out="mawarimi-room"):
    assert_data()
    wide = variant == "wide"
    W, H = (272, 200) if wide else (180, 236)
    ox, oy, u = (130, 142, 52) if wide else (84, 150, 44)
    fs = 4.1 if wide else 6.0
    g = Iso(ox=ox, oy=oy, u=u, sw=0.32, font=FONT, ink=pal["ink"])

    def P(X, Z, h=0.0):
        return g.p(X, -Z, h)

    def poly(pts, fill="none", stroke="none", sw=0.25, extra=""):
        d = "M" + " L".join(f"{a:.3f} {b:.3f}" for a, b in pts) + " Z"
        g.raw(f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" {extra}/>')

    def line(a, b, stroke=None, sw=0.25, extra=""):
        g.raw(f'<line x1="{a[0]:.3f}" y1="{a[1]:.3f}" x2="{b[0]:.3f}" y2="{b[1]:.3f}" stroke="{stroke or pal["ink"]}" stroke-width="{sw}" {extra}/>')

    # 床の厚み
    thick = 0.05
    poly([P(FLOOR, FLOOR - 1.8), P(FLOOR, FLOOR), P(FLOOR, FLOOR, -thick), P(FLOOR, FLOOR - 1.8, -thick)], fill=pal["bg"], stroke=pal["ink"], sw=.3)
    poly([P(FLOOR - 1.8, FLOOR - 1.8), P(FLOOR, FLOOR - 1.8), P(FLOOR, FLOOR - 1.8, -thick), P(FLOOR - 1.8, FLOOR - 1.8, -thick)], fill=pal["bg"], stroke=pal["ink"], sw=.3)

    # 区画ごとのタイル
    tone = {"0": pal["softer"], "1": pal.get("z1", "#4a4440"), "2": pal.get("z2", "#332e2b")}
    for r, row in enumerate(GRID):
        for c, v in enumerate(row):
            X0, Z0 = -FLOOR + c * TILE, FLOOR - r * TILE
            poly([P(X0, Z0), P(X0 + TILE, Z0), P(X0 + TILE, Z0 - TILE), P(X0, Z0 - TILE)], fill=tone[v], stroke=pal.get("tile", "#4a4540"), sw=.15)
    poly([P(-FLOOR, FLOOR), P(FLOOR, FLOOR), P(FLOOR, -FLOOR), P(-FLOOR, -FLOOR)], stroke=pal["ink"], sw=.35)

    # 歩く道。3 周を 3 本の輪で描く。輪は床に引く
    for i, d in enumerate((0.16, 0.25, 0.34)):
        pts = [P(X, Z) for X, Z in loop(d)]
        g.raw(f'<path d="{rounded_path(pts, 8)}" fill="none" stroke="{pal["red"]}" stroke-width="{0.85}" stroke-linejoin="round"/>')
    # 進む向きを矢印で 1 か所だけ示す（0 → 1 → 2 の順。内側から壁の端を回る）
    tip = P(-0.5 + 0.25, -0.05)
    tail = P(-0.5 + 0.25, 0.17)
    ang = math.atan2(tip[1] - tail[1], tip[0] - tail[0])
    size = 3.6
    pts = [(tip[0] + size * math.cos(ang), tip[1] + size * math.sin(ang)),
           (tip[0] + size * .8 * math.cos(ang + 2.3), tip[1] + size * .8 * math.sin(ang + 2.3)),
           (tip[0] + size * .8 * math.cos(ang - 2.3), tip[1] + size * .8 * math.sin(ang - 2.3))]
    poly(pts, fill=pal["red"])

    # L 字の壁。透かして、裏の道を見せる
    def wall(x1, z1, x2, z2):
        h = 1.8
        corners = [P(x1, z1), P(x2, z2), P(x2, z2, h), P(x1, z1, h)]
        poly(corners, fill=pal["ink"], extra='fill-opacity="0.07"', stroke=pal["ink"], sw=.42)
        # 骨組み
        steps = 4
        for i in range(1, steps):
            t = i / steps
            X, Z = x1 + (x2 - x1) * t, z1 + (z2 - z1) * t
            line(P(X, Z), P(X, Z, h), sw=.15, extra='stroke-opacity=".55"')
        for hh in (0.6, 1.2):
            line(P(x1, z1, hh), P(x2, z2, hh), sw=.15, extra='stroke-opacity=".55"')

    wall(-0.5, 0.5, 0.455, 0.5)
    wall(-0.5, 0.5, -0.5, -0.455)

    # カメラ。実物の高さと向きで置く。撮っている範囲は水平の画角の面で示す
    PITCH = {"A": -3.95, "B": 29.96, "C": -24.36}
    for name, X, Z, h, yaw in CAMS:
        base = P(X, Z)
        top = P(X, Z, h)
        L = 1.05
        ends = []
        for sgn in (-1, 1):
            ang_ = math.radians(yaw + sgn * HFOV / 2)
            zz = max(0.0, h + L * math.sin(math.radians(PITCH[name])))
            ends.append(P(X + math.sin(ang_) * L, Z + math.cos(ang_) * L, zz))
        poly([top, ends[0], ends[1]], fill=pal["ink"], stroke=pal["ink"], sw=.18, extra='fill-opacity="0.09" stroke-opacity=".7"')
        if name == "A":
            knee = (X, Z, h * .42)
            line(P(*knee), top, sw=.45)
            for dx, dz in ((.14, .02), (-.08, .12), (-.08, -.12)):
                line(P(*knee), P(X + dx, Z + dz), sw=.4)
        elif name == "C":
            line(base, top, sw=.22, extra='stroke-dasharray="1.2 1.2"')
            line(top, P(X + (.22 if wide else .1), Z, h), sw=.6)
        else:
            line(base, top, sw=.6)
        fx, fz = math.sin(math.radians(yaw)), math.cos(math.radians(yaw))
        rx, rz = fz, -fx
        w_, h_ = 0.07, 0.13
        poly([P(X - rx * w_, Z - rz * w_, h - h_ / 2), P(X + rx * w_, Z + rz * w_, h - h_ / 2),
              P(X + rx * w_, Z + rz * w_, h + h_ / 2), P(X - rx * w_, Z - rz * w_, h + h_ / 2)], fill=pal["ink"], stroke=pal["ink"], sw=.3)
        c = P(X, Z, h + h_ * .22)
        g.raw(f'<circle cx="{c[0]:.3f}" cy="{c[1]:.3f}" r=".7" fill="{pal["bg"]}"/>')

    # 文字。文字の上に短い罫を置き、罫の近い端へ引き出し線をつなぐ
    def lead(ax, ay, tx, ty, lines, anchor="start", inset=0):
        width = max(len(s) for s in lines) * fs * .92
        x0, x1 = (tx, tx + width) if anchor == "start" else (tx - width, tx)
        ry = ty - fs * 1.15
        near = x0 if abs(ax - x0) < abs(ax - x1) else x1
        line((ax, ay), (near, ry), sw=.2)
        line((x0, ry), (x1, ry), sw=.2)
        for i, s in enumerate(lines):
            g.text(tx + (inset if anchor == "start" else -inset), ty + i * fs * 1.4, s, size=fs, anchor=anchor, weight="700" if i == 0 else "400", fill=pal["ink"] if i == 0 else pal["mid"])

    A0, B0 = P(CAMS[0][1], CAMS[0][2]), P(CAMS[1][1], CAMS[1][2])
    C1 = P(CAMS[2][1], CAMS[2][2], CAMS[2][3] + .08)
    wtop = P(-0.5, 0.0, 1.8)
    if wide:
        lead(*wtop, 10, 40, ["L 字の壁", "2 辺 0.955 m", "高さ 1.8 m"])
        lead(*C1, 262, 30, ["カメラ C", "棚のアーム", "高さ 1.35 m"], anchor="end")
        lead(*P(.455 + .34, .3), 262, 92, ["歩く道", "壁のまわりを 3 周"], anchor="end")
        lead(*P(.9, -.9), 262, 136, ["床", "1.8 × 1.8 m"], anchor="end")
        lead(*A0, 180, 178, ["カメラ A", "三脚", "高さ 0.89 m"])
        lead(*B0, 12, 170, ["カメラ B", "床に置く", "高さ 0.12 m"])
    else:
        lead(*wtop, 6, 16, ["L 字の壁", "0.955 m × 2"])
        lead(*C1, 176, 18, ["カメラ C", "棚のアーム 1.35 m"], anchor="end", inset=7)
        lead(*A0, 176, 214, ["カメラ A", "三脚 0.89 m"], anchor="end")
        lead(*B0, 5, 214, ["カメラ B", "床 0.12 m"])
        lead(*P(-.26, -.45), 62, 214, ["歩く道", "3 周"])
    return save(g, out, variant, W, H, pal,
                "廻リ視の部屋の図",
                "1.8 メートル四方の床に L 字の壁が立ち、3 台のスマートフォンが別々の高さから床を撮る。体験者は壁のまわりを 3 周歩く。床の濃さはどのカメラの映像に切り替わるかを示す。")


if __name__ == "__main__":
    for v in ("wide", "tall"):
        print(draw(v))
