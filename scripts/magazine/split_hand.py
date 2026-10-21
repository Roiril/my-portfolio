# 表紙の手の層（split_cover.py が作る layer-cover-hand.png）を、さらに「手だけ」と「持っている駒」に分ける。
# 駒を盤に置いたあと、手だけが離れて案内役になるため。絵は描き直さない。
#   hand-only : 手。駒の後ろに隠れていた指の縁は、すぐ外側の色を数画素だけ伸ばして埋める
#   piece     : 手に持った駒（背景は透明）
#   guide-lift: 手だけを絵の範囲で切り詰めたもの。案内役が表紙から飛び立つときに使う
# どれも layer-cover-hand.png と同じ大きさのキャンバス（guide-lift だけ切り詰め）。
#   py -3.11 scripts/magazine/split_hand.py
import sys
from pathlib import Path
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')
SRC = Path(r'G:\マイドライブ\shubie\design-study\2026-10-19\codex')
hand = Image.open(SRC / 'layer-cover-hand.png').convert('RGBA')
W, H = hand.size

# 駒の外形（元の絵を 3 倍に拡大して測った）：左 762・右 848・上 503・下 658。
# 上は半円、下は角の丸い四角。輪郭の線のにじみまで取るため 2px 広げる
L, R, T, B = 763, 850, 501, 660
# 指が駒の右の縁に接しているのは y=612 まで。それより下で埋めると、駒の影まで伸ばしてしまう
FINGER_BOTTOM = 612
OUTLINE = (14, 16, 38, 255)
mask = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(mask)
r = (R - L) / 2
d.ellipse([L, T, R, T + 2 * r], fill=255)
d.rounded_rectangle([L, T + r, R, B], radius=16, fill=255)

piece = Image.new('RGBA', (W, H), (0, 0, 0, 0))
piece.paste(hand, mask=mask)

only = hand.copy()
px, mk = only.load(), mask.load()
src = hand.load()
for y in range(T, B + 1):
    xs = [x for x in range(L - 1, R + 2) if mk[x, y]]
    if not xs:
        continue
    xl, xr = xs[0], xs[-1]
    for x in xs:
        px[x, y] = (0, 0, 0, 0)
    # 駒の右の縁のすぐ外に指があれば、その色を内側へ伸ばし、伸ばした先に輪郭の線を引く
    # （指が駒の後ろへ回り込んでいた分。伸ばさないと、指が駒の形にえぐれて見える）
    right = src[xr + 1, y]
    if y <= FINGER_BOTTOM and right[3] > 200 and sum(right[:3]) < 360:
        end = max(xl, xr - 18)
        for x in range(xr, end, -1):
            px[x, y] = right
        for x in range(end + 1, end + 4):
            px[x, y] = OUTLINE
    # 指より下では、駒の輪郭のにじみが縁の外に 1〜2px 残るので消す
    if y > FINGER_BOTTOM:
        for x in list(range(xl - 3, xl)) + list(range(xr + 1, xr + 4)):
            px[x, y] = (0, 0, 0, 0)
        continue
    left = src[xl - 1, y]
    if left[3] > 200 and sum(left[:3]) < 360 and src[xl - 4, y][3] > 200:
        end = min(xr, xl + 6)
        for x in range(xl, end):
            px[x, y] = left
        for x in range(end - 3, end):
            px[x, y] = OUTLINE

# 駒の左の縁には親指の先が少し重なっていた。縁の 4px を輪郭の線にし、その内側の青は紙の白に戻す
pp = piece.load()
for y in range(T, B + 1):
    xs = [x for x in range(L, R + 1) if mk[x, y] and pp[x, y][3] > 0]
    if not xs:
        continue
    xl = xs[0]
    for x in range(xl, xl + 4):
        pp[x, y] = OUTLINE
    for x in range(xl + 4, xl + 12):
        r_, g_, b_, a_ = pp[x, y]
        if a_ and b_ > r_ + 60:
            pp[x, y] = (255, 255, 255, 255)

only.save(SRC / 'layer-cover-hand-only.png')
piece.save(SRC / 'layer-cover-piece.png')
box = only.split()[3].getbbox()
only.crop(box).save(SRC / 'guide-lift.png')
print('hand-only bbox', box, 'piece bbox', piece.split()[3].getbbox())
