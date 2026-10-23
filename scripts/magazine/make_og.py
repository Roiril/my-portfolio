"""SNS で共有したときに出る画像（public/images/og.png, 1200x630）を、表紙と同じ組みで作る。

表紙の絵は public/images/magazine/cover-*.webp の 4 層を重ねて元の 1 枚に戻し、
白い紙の上に乗算で刷る。誌名・名前・ステッカーは誌面の CSS（magazine.css）と同じ色と書体。

書体:
  Anton        … next build / next dev が .next/static/media に落とす woff2 を使う（Pillow は woff2 を読める）
  Noto Sans JP … Windows に入っている可変フォント。--jp で差し替えられる

使い方:  py -3.11 scripts/magazine/make_og.py
"""

import argparse
import glob
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
W, H = 1200, 630
PAPER = (255, 255, 255)
INK = (18, 18, 18)
GRAY = (95, 95, 95)
COBALT = (36, 51, 255)

ISSUE_LEFT = '2026 年 秋号'
ISSUE_RIGHT = 'HCI と ものづくり'
MASTHEAD = 'ROIL'
NAME_JA = '白石 大晴'
NAME_EN = 'Taisei Shiroishi'
ROLE = '明治大学大学院　HCI 研究'
STICKER = ('IVRC2026', '総合優勝')


def find_anton() -> str:
    for path in sorted(glob.glob(os.path.join(ROOT, '.next', 'static', 'media', '*.woff2'))):
        try:
            if ImageFont.truetype(path, 20).getname()[0] == 'Anton':
                return path
        except OSError:
            continue
    sys.exit('Anton が見つからない。先に npm run dev か npm run build を一度走らせる')


def jp_font(path: str, size: int, weight: str) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(path, size)
    try:
        font.set_variation_by_name(weight)
    except (OSError, ValueError):
        pass
    return font


def cover_art() -> Image.Image:
    names = ['board', 'hand', 'piece', 'front']
    layers = []
    for name in names:
        hits = glob.glob(os.path.join(ROOT, 'public', 'images', 'magazine', f'cover-{name}-*.webp'))
        if len(hits) != 1:
            sys.exit(f'cover-{name} が 1 枚に決まらない: {hits}')
        layers.append(Image.open(hits[0]).convert('RGBA'))
    sizes = {layer.size for layer in layers}
    if len(sizes) != 1:
        sys.exit(f'表紙の層の大きさがそろっていない: {sizes}')
    art = Image.new('RGBA', layers[0].size, (255, 255, 255, 0))
    for layer in layers:
        art = Image.alpha_composite(art, layer)
    white = Image.new('RGB', art.size, PAPER)
    white.paste(art, mask=art.split()[3])
    return white


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--anton', default=None)
    parser.add_argument('--jp', default=os.path.expandvars(r'%LOCALAPPDATA%\Microsoft\Windows\Fonts\NotoSansJP-VariableFont_wght.ttf'))
    parser.add_argument('--out', default=os.path.join(ROOT, 'public', 'images', 'og.png'))
    args = parser.parse_args()
    anton = args.anton or find_anton()
    if not os.path.exists(args.jp):
        sys.exit(f'日本語の書体が無い: {args.jp}')

    page = Image.new('RGB', (W, H), PAPER)
    draw = ImageDraw.Draw(page)
    margin = 48

    # 号と特集の帯。下に 3px の罫
    small = jp_font(args.jp, 22, 'Bold')
    draw.text((margin, 30), ISSUE_LEFT, font=small, fill=INK)
    right_w = draw.textlength(ISSUE_RIGHT, font=small)
    draw.text((W - margin - right_w, 30), ISSUE_RIGHT, font=small, fill=INK)
    draw.rectangle((margin, 66, W - margin, 68), fill=INK)

    # 誌名。左に寄せ、名前を下に置ける高さに収める
    mast_top, mast_h_target = 68 + 22, 372
    mast = ImageFont.truetype(anton, 400)
    box = draw.textbbox((0, 0), MASTHEAD, font=mast)
    mast = ImageFont.truetype(anton, round(400 * mast_h_target / (box[3] - box[1])))
    box = draw.textbbox((0, 0), MASTHEAD, font=mast)
    draw.text((margin - box[0], mast_top - box[1]), MASTHEAD, font=mast, fill=COBALT)
    mast_right = margin + (box[2] - box[0])
    mast_bottom = mast_top + (box[3] - box[1])

    # 表紙の絵を誌名の右端に重ね刷りする（乗算。紙の白は消える）
    art = cover_art()
    art_w = 600
    art = art.resize((art_w, round(art.height * art_w / art.width)), Image.LANCZOS)
    x0, y0 = W - margin - art_w + 30, H - art.height + 36
    region = page.crop((x0, y0, x0 + art.width, y0 + art.height))
    page.paste(ImageChops.multiply(region, art), (x0, y0))
    draw = ImageDraw.Draw(page)

    # 名前は誌名の下、左揃え。和名と英名を同じ行に並べ、所属を下に
    name_font = jp_font(args.jp, 64, 'Black')
    en_font = ImageFont.truetype(anton, 40)
    role_font = jp_font(args.jp, 22, 'Bold')
    y = mast_bottom + 26
    b = draw.textbbox((0, 0), NAME_JA, font=name_font)
    draw.text((margin - b[0], y - b[1]), NAME_JA, font=name_font, fill=INK)
    name_bottom = y + (b[3] - b[1])
    eb = draw.textbbox((0, 0), NAME_EN, font=en_font)
    draw.text((margin + (b[2] - b[0]) + 24 - eb[0], name_bottom - (eb[3] - eb[1]) - eb[1]), NAME_EN, font=en_font, fill=INK)
    rb = draw.textbbox((0, 0), ROLE, font=role_font)
    draw.text((margin - rb[0], name_bottom + 16 - rb[1]), ROLE, font=role_font, fill=GRAY)

    # ステッカー（コバルトの丸に白抜き、-12 度）
    d = 176
    sticker = Image.new('RGBA', (d, d), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sticker)
    sd.ellipse((0, 0, d - 1, d - 1), fill=COBALT)
    lines = [(STICKER[0], ImageFont.truetype(anton, 34)), (STICKER[1], jp_font(args.jp, 30, 'Black'))]
    heights = [sd.textbbox((0, 0), t, font=f) for t, f in lines]
    total = sum(b[3] - b[1] for b in heights) + 10
    ty = (d - total) / 2
    for (text, font), b in zip(lines, heights):
        sd.text(((d - (b[2] - b[0])) / 2 - b[0], ty - b[1]), text, font=font, fill=(255, 255, 255))
        ty += b[3] - b[1] + 10
    sticker = sticker.rotate(12, resample=Image.BICUBIC, expand=True)
    sx = min(mast_right + 24, W - margin - sticker.width)
    page.paste(sticker, (sx, 96), sticker)

    tmp = args.out + '.tmp.png'
    page.save(tmp, optimize=True)
    os.replace(tmp, args.out)
    print(args.out, page.size, os.path.getsize(args.out), 'bytes')


if __name__ == '__main__':
    main()
