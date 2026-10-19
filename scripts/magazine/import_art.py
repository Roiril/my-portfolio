# 生成した PNG を webp にしてサイトへ取り込み、寸法つきの一覧（magazine-art.ts）を書き出す。
# 元の PNG（Codex で生成した 2 色刷りの挿絵）とプロンプトは Google Drive の
# shubie/design-study/2026-10-19/codex/ にある。描き直したらこのスクリプトを流し直す。
#   py -3.11 scripts/magazine/import_art.py
import io, os, sys
from pathlib import Path
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')
SRC = Path(r'G:\マイドライブ\shubie\design-study\2026-10-19\codex')
ROOT = Path(r'C:\Users\kouga\Projects\Web\my-portfolio')
PUB = ROOT / 'public'

# key: (生成ファイル名, 置き場（public からの相対）, 最大幅, alt)
ITEMS = {
    'cover': ('cover', 'images/magazine/cover.webp', 1600, '人の手とロボットの手が、おばけの形のゲームの駒を一緒につまんでいる。まわりに VR ヘッドセット、歯車、手の動きを描いたスケッチ帳'),
    'profile': ('profile', 'images/magazine/profile.webp', 1200, '作業机を真上から見た絵。ノートパソコン、VR ヘッドセット、ロボットの手の模型、方眼ノート、付箋'),
    'spotContents': ('spot-contents', 'images/magazine/spot-contents.webp', 900, ''),
    'spotGallery': ('spot-gallery', 'images/magazine/spot-gallery.webp', 900, ''),
    'spotContact': ('spot-contact', 'images/magazine/spot-contact.webp', 900, ''),
    'iconResearch': ('icon-research', 'images/magazine/icon-research.webp', 160, ''),
    'iconPersonal': ('icon-personal', 'images/magazine/icon-personal.webp', 160, ''),
    'iconInternship': ('icon-internship', 'images/magazine/icon-internship.webp', 160, ''),
    'iconCreative': ('icon-creative', 'images/magazine/icon-creative.webp', 160, ''),
    'logoMark': ('logo-mark', 'images/magazine/logo-mark.webp', 160, ''),
    'arrow': ('ui-arrow', 'images/magazine/arrow.webp', 160, ''),
}
THUMBS = {
    'thumb-ai-tools': 'images/works/ai-business-tools/illust.webp',
    'thumb-ai-music': 'images/works/ai-composition/illust.webp',
}

missing = [n for n, *_ in ITEMS.values() if not (SRC / f'{n}.png').exists()] + [n for n in THUMBS if not (SRC / f'{n}.png').exists()]
if missing:
    sys.exit('欠けている画像: ' + ', '.join(missing))

def save(name, rel, max_w):
    im = Image.open(SRC / f'{name}.png').convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    dst = PUB / rel
    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst, 'WEBP', quality=86, method=6)
    return im.size, dst.stat().st_size

lines = ["// scripts/magazine/import_art.py が書き出す。手で書き換えない（寸法を画像と一致させるため）",
         "export type ArtImage = { src: string; width: number; height: number; alt: string };", "",
         "export const art = {"]
for key, (name, rel, max_w, alt) in ITEMS.items():
    (w, h), size = save(name, rel, max_w)
    lines.append(f"    {key}: {{ src: '/{rel}', width: {w}, height: {h}, alt: '{alt}' }},")
    print(key, w, h, size)
lines += ["} satisfies Record<string, ArtImage>;", ""]
(ROOT / 'src/content/magazine-art.ts').write_text('\n'.join(lines), encoding='utf-8', newline='\n')

for name, rel in THUMBS.items():
    (w, h), size = save(name, rel, 1500)
    print(name, w, h, size)

# ファビコン（Next.js の src/app/icon.png）
logo = Image.open(SRC / 'logo-mark.png').convert('RGB').resize((512, 512), Image.LANCZOS)
logo.save(ROOT / 'src/app/icon.png')
print('icon.png 512')
