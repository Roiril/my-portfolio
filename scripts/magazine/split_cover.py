# 表紙の絵（cover-v2.png）を、スクロールで動かすための 3 枚の層に切り分ける。絵は描き直さない。
#   board : 盤と、立っている駒（手の部分を白で抜いたもの）
#   hand  : ロボットの手と、手に持った駒（背景は透明）
#   front : 手前の列の駒 2 つ（背景は透明）。手がマスへ下りるとき、手より手前に見せるため
# 3 枚とも元の絵と同じ大きさのキャンバスなので、重ねるだけで位置がそろう。
#   py -3.11 scripts/magazine/split_cover.py
from collections import deque
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter

SRC = Path(r'G:\マイドライブ\shubie\design-study\2026-10-19\codex')
im = Image.open(SRC / 'cover-v2.png').convert('RGB')
W, H = im.size
px = im.load()

# --- 手：盤より上（盤の上面の最も高い点は y=658）にある、白でない画素 ----------------
# 盤の奥の駒（右奥）は x>1100 にあるので、x<1050 に限ると手だけになる。
# 手に持った駒の底は y≈651 まで届くので、盤の左の角より左側だけ少し下まで取る
def in_hand_area(x, y):
    return (x < 1050 and y < 652) or (x < 860 and y < 666)

hand_area = Image.new('L', (W, H), 0)
d = ImageDraw.Draw(hand_area)
d.rectangle([0, 0, 1049, 651], fill=255)
d.rectangle([0, 0, 859, 665], fill=255)

# 手の範囲の中で、縁につながった白（外側）を透明にする
near_white = im.convert('L').point(lambda v: 255 if v >= 236 else 0)
masked = Image.new('L', (W, H), 0)
masked.paste(near_white, mask=hand_area)          # 範囲の外は 0（＝白ではない扱いにしない）
outside = Image.new('L', (W, H), 255)              # 範囲の外は外側扱い
outside.paste(Image.new('L', (W, H), 0), mask=hand_area)
mark = Image.composite(masked, Image.new('L', (W, H), 255), hand_area)  # 範囲外は白(255)としてつなげる
for x in range(W):
    for y in (0, H - 1):
        if mark.getpixel((x, y)) == 255:
            ImageDraw.floodfill(mark, (x, y), 128)
for y in range(H):
    for x in (0, W - 1):
        if mark.getpixel((x, y)) == 255:
            ImageDraw.floodfill(mark, (x, y), 128)
hand_alpha = Image.composite(mark.point(lambda v: 0 if v == 128 else 255), Image.new('L', (W, H), 0), hand_area)
hand = im.convert('RGBA'); hand.putalpha(hand_alpha)
hand.save(SRC / 'layer-cover-hand.png')

# --- 盤：手の範囲を丸ごと白にする（手の輪郭のにじみまで消す。この範囲に盤は入っていない） ---
board = im.copy()
board.paste((255, 255, 255), mask=hand_area)
board.save(SRC / 'layer-cover-board.png')

# --- 手前の駒：胴の内側から塗り広げ、黒い輪郭の太さぶん膨らませる ----------------
# 胴は白と青の網点なので「黒でない（いちばん明るい成分が 120 を超える）」画素を伝って広げる。
# 盤のマスのベタ塗りの青は伝わない（伝うと足元のマスまで取り込む）
def passable(c):
    r, g, b = c
    return max(c) > 120 and not (r < 90 and g < 110 and b > 180)

def body_mask(seed):
    m = Image.new('L', (W, H), 0); mp = m.load()
    q = deque([seed]); mp[seed] = 255; n = 0
    while q:
        x, y = q.popleft(); n += 1
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < W and 0 <= ny < H and not mp[nx, ny] and passable(px[nx, ny]):
                mp[nx, ny] = 255; q.append((nx, ny))
        if n > 60000:
            raise SystemExit(f'塗り広げが駒の外へ漏れた: seed={seed}')
    return m, n

front_alpha = Image.new('L', (W, H), 0)
for seed in [(870, 820), (1120, 880)]:          # 手前の列の 2 つ（左と右）
    m, n = body_mask(seed)
    print('piece', seed, 'body px', n, 'bbox', m.getbbox())
    front_alpha = Image.composite(Image.new('L', (W, H), 255), front_alpha, m.filter(ImageFilter.MaxFilter(17)))
front = im.convert('RGBA'); front.putalpha(front_alpha)
front.save(SRC / 'layer-cover-front.png')
print('hand bbox', hand_alpha.getbbox(), 'front bbox', front_alpha.getbbox())
