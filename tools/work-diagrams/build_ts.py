"""生成した SVG を文字列の表にまとめる。ページはこの表から読む（実行時にファイルを読まない）。

出力: src/content/work-diagrams/index.ts
routes.py / figures.py / mawarimi.py のあとに実行する。
"""
import glob
import json
import os
import re

from common import OUT

items = {}
for path in sorted(glob.glob(os.path.join(OUT, "*.svg"))):
    m = re.fullmatch(r"(.+)-(wide|tall)\.svg", os.path.basename(path))
    assert m, path
    with open(path, encoding="utf-8") as f:
        items.setdefault(m[1], {})[m[2]] = f.read()
for name, v in items.items():
    assert set(v) == {"wide", "tall"}, name

lines = [
    "// tools/work-diagrams/build_ts.py が生成する。手で直さない",
    "export const workDiagrams: Record<string, { wide: string; tall: string }> = {",
]
for name, v in items.items():
    lines.append(f"  {json.dumps(name)}: {{")
    lines.append(f"    wide: {json.dumps(v['wide'], ensure_ascii=False)},")
    lines.append(f"    tall: {json.dumps(v['tall'], ensure_ascii=False)},")
    lines.append("  },")
lines.append("};")
path = os.path.join(OUT, "index.ts")
tmp = path + ".tmp"
with open(tmp, "w", encoding="utf-8", newline="\n") as f:
    f.write("\n".join(lines) + "\n")
os.replace(tmp, path)
print(len(items), "diagrams")
