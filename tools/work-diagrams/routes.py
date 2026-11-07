"""路線図の形の図。つながりは src/content/works-tech.ts と works-diagrams.ts に書いた事実だけ。

座標は wide のもの。tall は x と y を入れ替えて縦に流す（45 度が保たれる）。
stations: (x, y, 名前, 説明, wide での文字の位置, tall での文字の位置, 大きい駅か)
位置は u 上 / d 下 / l 左 / r 右。
"""
from common import Iso, NIGHT, PAPER, FONT, rounded_path, save

BLUE = "#1f5fbf"
YEL = "#e9a800"


def fig(name, pal, title, desc, W, H, lines, stations, tall):
    for variant in ("wide", "tall"):
        wide = variant == "wide"
        tw, th, ox, oy = tall
        cw, ch = (W, H) if wide else (tw, th)
        T = (lambda x, y: (x, y)) if wide else (lambda x, y: (y + ox, x + oy))
        fs, fn = (3.7, 3.15) if wide else (6.0, 5.1)
        lw, r = (2.4, 2.3) if wide else (3.0, 3.0)
        g = Iso(font=FONT, ink=pal["ink"])
        for color, pts, *rest in lines:
            dash = rest[0] if rest else None
            P = [T(*p) for p in pts]
            d = rounded_path(P, 6, closed=False)
            extra = f' stroke-dasharray="{dash}"' if dash else ""
            g.raw(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{lw}" stroke-linejoin="round" stroke-linecap="round"{extra}/>')
        for x, y, nm, note, sw, st, *big in stations:
            X, Y = T(x, y)
            bigger = bool(big and big[0])
            rr = r * (1.45 if bigger else 1)
            if nm or note or bigger or True:
                g.raw(f'<circle cx="{X:.2f}" cy="{Y:.2f}" r="{rr:.2f}" fill="{pal["bg"]}" stroke="{pal["ink"]}" stroke-width="{1.1 if bigger else .85}"/>')
            side = sw if wide else st
            lines_ = [nm] + (note.split("|") if note else [])
            gap = fn * 1.32
            hh = fs + gap * (len(lines_) - 1)
            pad = rr + (1.8 if wide else 2.4)
            if side == "u":
                tx, ty, a = X, Y - pad - .8 - gap * (len(lines_) - 1), "middle"
            elif side == "d":
                tx, ty, a = X, Y + pad + fs * .85, "middle"
            elif side == "r":
                tx, ty, a = X + pad, Y + fs * .36 - gap * (len(lines_) - 1) / 2, "start"
            elif side in ("ur", "ul", "dr", "dl"):
                tx = X + rr * .7 if side[1] == "r" else X - rr * .7
                a = "start" if side[1] == "r" else "end"
                ty = Y - pad - gap * (len(lines_) - 1) if side[0] == "u" else Y + pad + fs * .85
            else:
                tx, ty, a = X - pad, Y + fs * .36 - gap * (len(lines_) - 1) / 2, "end"
            # 端の駅は左右へはみ出さないように揃える
            if a == "middle":
                if tx < 22:
                    tx, a = X - rr, "start"
                elif tx > cw - 22:
                    tx, a = X + rr, "end"
            g.text(tx, ty, nm, size=fs, anchor=a, weight="700", fill=pal["ink"])
            for i, s in enumerate(lines_[1:]):
                g.text(tx, ty + gap * (i + 1), s, size=fn, anchor=a, fill=pal["mid"])
        save(g, name, variant, cw, ch, pal, title, desc)


def couple():
    p = PAPER
    fig("couple-sync-route", p, "couple-sync の同期の路線図",
        "自分の端末の画面と IndexedDB から送信待ちの列を通って Supabase へ行き、通知と差分の取得で相手の端末へ届く。通信が切れている間は送信待ちの列で待つ。",
        268, 142,
        [
            (p["ink"], [(86, 92), (108, 114), (140, 114)], "2.6 3.4"),
            (BLUE, [(134, 38), (180, 38), (180, 84)]),
            (p["red"], [(16, 112), (60, 112), (86, 86), (134, 38), (180, 84), (208, 112), (250, 112)]),
        ],
        [
            (16, 112, "画面", "部屋のものを開く", "u", "r"),
            (60, 112, "IndexedDB", "まず端末に書く", "d", "r"),
            (86, 86, "送信待ちの列", "消えずに残る", "l", "ul"),
            (140, 114, "ここで待つ", "通信が切れている間", "d", "r"),
            (134, 38, "Supabase", "関数を通して|書き込む", "l", "l", True),
            (180, 38, "Realtime", "変更を知らせる", "r", "l"),
            (180, 84, "差分の取得", "サーバーの通し番号で", "r", "r"),
            (208, 112, "IndexedDB", "", "d", "r"),
            (250, 112, "相手の画面", "", "u", "r"),
        ],
        (214, 300, 6, 18))


def cogni():
    p = PAPER
    fig("cogni-storage-route", p, "cogni-storage の路線図",
        "アプリの画面から IndexedDB と送信待ちの列を通って Supabase へ行き、ほかの端末へ差分が届く。依頼は Supabase を通して Claude Code に届き、返答が画面へ戻る。研究メモは git に残り、ビルドのときにアプリへ入る。",
        268, 146,
        [
            (p["ink"], [(18, 26), (18, 112)]),
            (YEL, [(134, 34), (200, 34), (248, 34)]),
            (BLUE, [(134, 40), (182, 88), (248, 88)]),
            (p["red"], [(18, 118), (62, 118), (92, 88), (140, 40)]),
        ],
        [
            (18, 26, "研究メモ", "Markdown で書く", "r", "d"),
            (18, 68, "git", "追記の履歴を残す", "r", "u"),
            (18, 118, "アプリの画面", "", "d", "r", True),
            (62, 118, "IndexedDB", "画面はここから表示", "d", "r"),
            (92, 88, "送信待ちの列", "古い変更はまとめる", "r", "r"),
            (137, 37, "Supabase", "4 つの表", "u", "l", True),
            (248, 34, "Claude Code", "依頼を受けて処理する|返答は画面へ届く", "d", "r"),
            (182, 88, "通し番号", "前回の続きから取る", "d", "r"),
            (248, 88, "ほかの端末", "", "d", "r"),
        ],
        (214, 300, 0, 16))


def business():
    p = PAPER
    fig("ai-business-tools-route", p, "AI 業務ツールの路線図",
        "商談の内容から見積書の下書きを作る線と、質問からマニュアルを検索して答える線が、人が確かめる駅で合流する。",
        268, 122,
        [
            (p["ink"], [(16, 94), (72, 94), (112, 60), (152, 94), (196, 60)]),
            (p["red"], [(16, 26), (72, 26), (112, 60), (152, 26), (196, 60), (250, 60)]),
        ],
        [
            (16, 26, "商談の内容", "", "u", "r"),
            (16, 94, "質問", "", "d", "r"),
            (72, 94, "マニュアルを検索", "", "d", "r"),
            (112, 60, "LLM", "", "l", "l"),
            (152, 26, "見積書の下書き", "", "u", "r"),
            (152, 94, "根拠つきの答え", "どの箇所を見たかを示す", "d", "r"),
            (196, 60, "人が確かめる", "", "dr", "l", True),
            (250, 60, "使う", "", "u", "r"),
        ],
        (190, 290, 14, 18))


def intent():
    p = PAPER
    fig("intentlayer-route", p, "IntentLayer の路線図",
        "意図を書き、空間に置き、必要なときに見るまでは共通で、その先が HMD 版と Web 版に分かれる。",
        268, 128,
        [
            (YEL, [(108, 114), (150, 114), (176, 92)]),
            (p["ink"], [(16, 62), (128, 62), (160, 92), (250, 92)]),
            (p["red"], [(16, 58), (128, 58), (160, 26), (250, 26)]),
        ],
        [
            (16, 60, "意図を書く", "本人が書く", "u", "r"),
            (66, 60, "空間に置く", "書いた人のそばに", "u", "r"),
            (116, 60, "スキャンする", "見たいときだけ", "u", "r"),
            (198, 26, "HMD 版", "Quest 3 のパススルー", "u", "r"),
            (250, 26, "頭の上に表示", "空間アンカーで固定", "d", "r"),
            (198, 92, "Web 版", "React Three Fiber", "d", "r"),
            (250, 92, "部屋の上に表示", "位置は Supabase に保存", "u", "r"),
            (108, 114, "部屋のメッシュ", "スマートフォンの LiDAR", "d", "r"),
        ],
        (214, 300, 6, 16))


def meiji():
    p = PAPER
    fig("meiji-3d-route", p, "Meiji Univ 3F の路線図",
        "歩幅で測り、形を作り、写真を貼ったモデルを、VR での議論とシェーダーの実験に使う。",
        268, 112,
        [
            (p["ink"], [(16, 58), (140, 58), (172, 90), (250, 90)]),
            (p["red"], [(16, 54), (140, 54), (172, 24), (250, 24)]),
        ],
        [
            (16, 56, "測る", "歩幅を基準にする", "u", "r"),
            (76, 56, "形を作る", "柱や什器はモデリング", "d", "r"),
            (134, 56, "写真を貼る", "現地で撮る", "u", "r"),
            (250, 24, "VR で議論する", "未来の姿を検討する", "d", "r"),
            (250, 90, "見え方を変える", "シェーダーグラフ", "u", "r"),
        ],
        (190, 290, 12, 18))


def mv():
    p = NIGHT
    fig("ai-music-video-route", p, "AI Generated Music Video の路線図",
        "ChatGPT と Gemini で案を出し、Suno AI で曲を、Flow で映像の素材を作り、Filmora で 1 本に編集する。",
        268, 112,
        [
            (BLUE if False else "#7fb2ff", [(16, 56), (56, 56), (86, 88), (150, 88), (186, 56)]),
            (p["red"], [(16, 56), (56, 56), (86, 24), (150, 24), (186, 56), (250, 56)]),
        ],
        [
            (16, 56, "案を出す", "ChatGPT|Gemini", "d", "r"),
            (118, 24, "曲", "Suno AI", "d", "r"),
            (118, 88, "映像の素材", "Flow", "u", "l"),
            (186, 56, "編集", "Filmora", "d", "l", True),
            (250, 56, "ミュージックビデオ", "", "u", "r"),
        ],
        (190, 290, 16, 16))


def compo():
    p = PAPER
    fig("ai-composition-route", p, "AI-Augmented Composition の路線図",
        "Studio One で作った元の曲が 2 本に分かれ、1 本はそのまま、もう 1 本は Suno AI で広げた版になる。",
        268, 104,
        [
            (p["ink"], [(16, 52), (70, 52), (102, 20), (250, 20)]),
            (p["red"], [(16, 52), (70, 52), (102, 84), (250, 84)]),
        ],
        [
            (16, 52, "元の曲を作る", "Studio One", "d", "r"),
            (250, 20, "Original", "元の曲", "d", "l"),
            (160, 84, "広げる", "Suno AI", "u", "l"),
            (250, 84, "AI Ver.", "聞き比べられる", "u", "l"),
        ],
        (190, 290, 28, 16))


if __name__ == "__main__":
    for f in (couple, cogni, business, intent, meiji, mv, compo):
        f()
    print("ok")
