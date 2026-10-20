# 生成した PNG を webp にしてサイトへ取り込み、寸法つきの一覧（magazine-art.ts）を書き出す。
# 元の PNG（Codex で生成した 2 色刷りの挿絵）とプロンプトは Google Drive の
# shubie/design-study/2026-10-19/codex/ にある。描き直したらこのスクリプトを流し直す。
#   py -3.11 scripts/magazine/import_art.py
import hashlib, io, os, re, sys
from pathlib import Path
from PIL import Image, ImageDraw

sys.stdout.reconfigure(encoding='utf-8')
SRC = Path(r'G:\マイドライブ\shubie\design-study\2026-10-19\codex')
ROOT = Path(r'C:\Users\kouga\Projects\Web\my-portfolio')
PUB = ROOT / 'public'

# key: (生成ファイル名, 置き場（public からの相対）, 最大幅, alt[, 背景を透明に抜くか])
# 表紙の絵に重ねる駒は、絵の外側の白だけを透明に抜く（輪郭の内側の白は残す）
ITEMS = {
    'cover': ('cover-v2', 'images/magazine/cover.webp', 1600, 'ロボットの手がゲームの駒をつまんでいる。手前の盤には駒が立っている'),
    'coverPiece': ('layer-piece-v1', 'images/magazine/cover-piece.webp', 300, '', True),
    'profile': ('profile-v2', 'images/magazine/profile.webp', 1200, '研究で使う道具。Meta Quest 3 とロボットの手'),
    'spotContents': ('spot-contents-v2', 'images/magazine/spot-contents.webp', 900, ''),
    'spotContact': ('spot-contact-v2', 'images/magazine/spot-contact.webp', 900, ''),
    'iconResearch': ('icon-research', 'images/magazine/icon-research.webp', 160, ''),
    'iconPersonal': ('icon-personal', 'images/magazine/icon-personal.webp', 160, ''),
    'iconInternship': ('icon-internship', 'images/magazine/icon-internship.webp', 160, ''),
    'iconCreative': ('icon-creative', 'images/magazine/icon-creative.webp', 160, ''),
    'logoMark': ('logo-mark-v2', 'images/magazine/logo-mark.webp', 160, ''),
    'arrow': ('ui-arrow', 'images/magazine/arrow.webp', 160, ''),
}
THUMBS = {
    'thumb-ai-tools-v2': 'images/works/ai-business-tools/illust.webp',
    'thumb-ai-music-v2': 'images/works/ai-composition/illust.webp',
}

missing = [v[0] for v in ITEMS.values() if not (SRC / f'{v[0]}.png').exists()] + [n for n in THUMBS if not (SRC / f'{n}.png').exists()]
if missing:
    sys.exit('欠けている画像: ' + ', '.join(missing))

# ファイル名に中身のハッシュを入れる。同じ URL のまま中身を差し替えると、
# Next.js の画像最適化と CDN が古い絵を返し続けるため（2026-10-19 に実際に起きた）
def cutout(im):
    """画像の縁につながった白だけを透明にし、絵の範囲で切り詰める"""
    rgb = im.convert('RGB')
    w, h = rgb.size
    near_white = rgb.convert('L').point(lambda v: 255 if v >= 236 else 0)
    # 縁から塗りつぶして、外側の白（128）と内側の白（255 のまま）を分ける
    for x in range(w):
        for y in (0, h - 1):
            if near_white.getpixel((x, y)) == 255:
                ImageDraw.floodfill(near_white, (x, y), 128)
    for y in range(h):
        for x in (0, w - 1):
            if near_white.getpixel((x, y)) == 255:
                ImageDraw.floodfill(near_white, (x, y), 128)
    alpha = near_white.point(lambda v: 0 if v == 128 else 255)
    out = rgb.convert('RGBA')
    out.putalpha(alpha)
    box = alpha.getbbox()
    pad = 4
    box = (max(0, box[0] - pad), max(0, box[1] - pad), min(w, box[2] + pad), min(h, box[3] + pad))
    return out.crop(box)


def save(name, rel, max_w, transparent=False):
    im = Image.open(SRC / f'{name}.png')
    im = cutout(im) if transparent else im.convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, 'WEBP', quality=86, method=6, exact=transparent)
    data = buf.getvalue()
    stem, ext = os.path.splitext(rel)
    rel = f'{stem}-{hashlib.sha1(data).hexdigest()[:8]}{ext}'
    dst = PUB / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    # 同じ置き場の古い版（ハッシュ違い）を消す
    # 「cover-」で前方一致させると cover-piece まで消えるので、ハッシュ 8 桁の版だけに絞る
    own = re.compile(re.escape(Path(stem).name) + r'-[0-9a-f]{8}' + re.escape(ext) + '$')
    for old in dst.parent.iterdir():
        if old != dst and own.match(old.name):
            old.unlink()
    plain = PUB / f'{stem}{ext}'
    if plain.exists():
        plain.unlink()
    dst.write_bytes(data)
    return rel, im.size, len(data)

lines = ["// scripts/magazine/import_art.py が書き出す。手で書き換えない（寸法を画像と一致させるため）",
         "export type ArtImage = { src: string; width: number; height: number; alt: string };", "",
         "export const art = {"]
for key, (name, rel, max_w, alt, *opt) in ITEMS.items():
    rel, (w, h), size = save(name, rel, max_w, transparent=bool(opt and opt[0]))
    lines.append(f"    {key}: {{ src: '/{rel}', width: {w}, height: {h}, alt: '{alt}' }},")
    print(key, rel, w, h, size)
lines += ["} satisfies Record<string, ArtImage>;", ""]
(ROOT / 'src/content/magazine-art.ts').write_text('\n'.join(lines), encoding='utf-8', newline='\n')

# サムネは works.ts が参照しているので、そちらのパスも書き換える
works_ts = ROOT / 'src/content/works.ts'
works_src = works_ts.read_text(encoding='utf-8')
for name, rel in THUMBS.items():
    new_rel, (w, h), size = save(name, rel, 1500)
    stem, ext = os.path.splitext(rel)
    pattern = re.compile(re.escape('/' + stem) + r'(-[0-9a-f]{8})?' + re.escape(ext))
    works_src, n = pattern.subn('/' + new_rel, works_src)
    assert n == 1, (rel, n)
    print(name, new_rel, w, h, size)
works_ts.write_text(works_src, encoding='utf-8', newline='\n')

# ファビコン（Next.js の src/app/icon.png）
logo = Image.open(SRC / 'logo-mark-v2.png').convert('RGB').resize((512, 512), Image.LANCZOS)
logo.save(ROOT / 'src/app/icon.png')
print('icon.png 512')
