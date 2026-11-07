"""作品ページの図の共通部分。出力は src/content/work-diagrams/<name>-wide.svg と -tall.svg。

wide は PC で 600px 以上、tall は幅 343px のスマートフォンで読む大きさに文字を決める。
文字の書体はページの CSS（.wp-fig text）で上書きする。
"""
import os
import sys
from html import escape

sys.path.insert(0, os.path.expanduser("~/.agents/skills/diagram-design/tools"))
from iso import Iso, C30, S30  # noqa: E402,F401

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, "src", "content", "work-diagrams")
FONT = "'Zen Kaku Gothic New','Yu Gothic',sans-serif"

PAPER = {"bg": "#f5f2eb", "ink": "#14110e", "mid": "#8b867c", "soft": "#d9d4c8", "softer": "#e8e4da", "red": "#d8321f"}
NIGHT = {"bg": "#0b0908", "ink": "#f1ebe2", "mid": "#8f897f", "soft": "#2c2825", "softer": "#1b1816", "red": "#f0503f"}


def rounded_path(pts, r, closed=True):
    """折れ線の角を半径 r の二次曲線で丸めた d 文字列"""
    import math
    n = len(pts)
    out = []
    rng = range(n) if closed else range(1, n - 1)
    for i in rng:
        p0, p1, p2 = pts[(i - 1) % n], pts[i], pts[(i + 1) % n]
        d0 = math.dist(p0, p1)
        d1 = math.dist(p1, p2)
        k0 = min(r, d0 / 2) / d0
        k1 = min(r, d1 / 2) / d1
        a = (p1[0] + (p0[0] - p1[0]) * k0, p1[1] + (p0[1] - p1[1]) * k0)
        b = (p1[0] + (p2[0] - p1[0]) * k1, p1[1] + (p2[1] - p1[1]) * k1)
        out.append(("L" if out else "M") + f"{a[0]:.3f} {a[1]:.3f} Q{p1[0]:.3f} {p1[1]:.3f} {b[0]:.3f} {b[1]:.3f}")
    d = " ".join(out)
    if closed:
        return d + " Z"
    s, e = pts[0], pts[-1]
    if not out:
        return f"M{s[0]:.3f} {s[1]:.3f} L{e[0]:.3f} {e[1]:.3f}"
    return f"M{s[0]:.3f} {s[1]:.3f} " + "L" + d[1:] + f" L{e[0]:.3f} {e[1]:.3f}"


def save(g, name, variant, w, h, pal, title, desc):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, f"{name}-{variant}.svg")
    svg = g.svg(w, h, pal["bg"], title, desc).replace(f'width="{w}mm" height="{h}mm" ', "")
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(svg)
    os.replace(tmp, path)
    return path


def text_lines(g, x, y, lines, size, gap=None, **kw):
    gap = gap or size * 1.45
    for i, s in enumerate(lines):
        g.text(x, y + i * gap, s, size=size, **kw)


__all__ = ["Iso", "C30", "S30", "PAPER", "NIGHT", "FONT", "OUT", "rounded_path", "save", "text_lines", "escape"]
