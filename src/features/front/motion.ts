// トップページの動き。面ごとにスクロールと、触れたときの動きを持つ。
// 中身を読むのに動きは要らない。動きを減らす設定では、触ったときの応答だけを残す

const TONES = { ink: '#14110e', light: '#f1ebe2' } as const;
type Tone = keyof typeof TONES;
// 文字の色ごとの、見出しの帯の色。文字と反対の明るさにする
const BANDS: Record<Tone, string> = { ink: 'rgba(244, 241, 234, .94)', light: 'rgba(11, 9, 8, .9)' };

// 盤の絵の寸法と、盤の面から絵の座標への射影
const BOARD = {
  W: 1672,
  H: 941,
  piece: [705, 530] as const,
  M: [
    [714.052817951394, 226.12319218726705, 514],
    [-71.40047711346358, 95.2809378261518, 658],
    [0.11946473833308482, -0.17764089756970328, 1],
  ],
};
const CLIP_HOLD = 1700;
const CLIP_STAGGER = 420;
const GRID_STAGGER = [0, 74, 28, 112];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const ease = (t: number) => t * t * (3 - 2 * t);

function need<T extends Element>(selector: string, parent: ParentNode = document): T {
  const el = parent.querySelector<T>(selector);
  if (!el) throw new Error(`トップページの要素が見つからない: ${selector}`);
  return el;
}
const all = <T extends Element>(selector: string, parent: ParentNode = document): T[] => Array.from(parent.querySelectorAll<T>(selector));

function boardPoint(a: number, b: number): [number, number] {
  const m = BOARD.M;
  const w = m[2][0] * a + m[2][1] * b + m[2][2];
  return [(m[0][0] * a + m[0][1] * b + m[0][2]) / w, (m[1][0] * a + m[1][1] * b + m[1][2]) / w];
}

export function startFrontMotion(): () => void {
  const page = need<HTMLElement>('.front');
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || root.dataset.motion === 'off';
  const touch = matchMedia('(hover: none)').matches;

  // 片付けをまとめる。ページを離れたら、聞き取り・タイマー・描画予約をすべて止める
  const listeners = new AbortController();
  const { signal } = listeners;
  const timers = new Set<number>();
  const frames = new Set<number>();
  const undo: Array<() => void> = [];
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
    timers.add(id);
    return id;
  };
  const cancelLater = (id: number) => { clearTimeout(id); timers.delete(id); };
  const nextFrame = (fn: () => void) => {
    const id = requestAnimationFrame(() => { frames.delete(id); fn(); });
    frames.add(id);
  };

  page.classList.add('js');
  undo.push(() => page.classList.remove('js'));

  let vw = innerWidth;
  let vh = innerHeight;
  let u = 1;
  let mobile = false;
  const measure = () => {
    vw = innerWidth;
    vh = innerHeight;
    mobile = vw <= 760;
    u = root.clientWidth / (mobile ? 375 : 1440);
  };
  measure();
  // 上端が画面の from の位置にあるとき 0、to の位置に来たとき 1
  const prog = (top: number, from: number, to: number) => clamp((vh * from - top) / (vh * (from - to)), 0, 1);

  // 目標へ少しずつ寄る値。止まったら描画をやめる
  function chaser(apply: (v: number) => void, rate = 0.14) {
    let cur = 0;
    let target = 0;
    let run = false;
    function step() {
      cur += (target - cur) * rate;
      if (Math.abs(target - cur) < 0.2) {
        cur = target;
        run = false;
        apply(cur);
        return;
      }
      apply(cur);
      nextFrame(step);
    }
    return (t: number) => {
      target = t;
      if (reduce) {
        cur = t;
        apply(t);
        return;
      }
      if (!run) {
        run = true;
        nextFrame(step);
      }
    };
  }

  // ───── 見出し：いま読んでいる面に色を合わせる ─────
  const chrome = need<HTMLElement>('#chrome');
  const faces = all<HTMLElement>('#front-main > section');
  let lastScrollY = scrollY;
  undo.push(() => chrome.classList.remove('is-away', 'is-past'));
  function tone() {
    const y = 30;
    let cur = faces[0];
    for (const face of faces) {
      const r = face.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) cur = face;
    }
    const sub = cur.querySelector('.wo-low');
    let l = cur.dataset.l as Tone;
    let right = cur.dataset.r as Tone;
    if (sub && sub.getBoundingClientRect().top <= y) {
      l = 'ink';
      right = 'ink';
    }
    chrome.style.setProperty('--tone-l', TONES[l]);
    chrome.style.setProperty('--tone-r', TONES[right]);
    chrome.style.setProperty('--band-l', BANDS[l]);
    chrome.style.setProperty('--band-r', BANDS[right]);
    const past = scrollY > 60;
    chrome.classList.toggle('is-past', past);
    chrome.dataset.side = cur.dataset.face;

    // 下へ読むあいだは隠し、上へ戻すと出す。指の小さな揺れでは切り替えない
    const dy = scrollY - lastScrollY;
    if (!past || dy < -6) chrome.classList.remove('is-away');
    else if (dy > 6) chrome.classList.add('is-away');
    if (!past || Math.abs(dy) > 6) lastScrollY = scrollY;
  }

  // ───── 入口：線が指す側へ開き、読み進めると左右がずれて割れる ─────
  const door = need<HTMLElement>('.door-face');
  const lab = need<HTMLElement>('.lab');
  const stu = need<HTMLElement>('.stu');
  const names = all<HTMLElement>('.door-face .name');
  const setDoor = chaser((v) => door.style.setProperty('--d', `${v}px`));
  if (!touch) {
    door.addEventListener('pointermove', (e) => {
      const h = Math.min(vw / 1440, vh / 900);
      setDoor((0.5 - e.clientX / vw) * 2 * 96 * h);
    }, { signal });
    door.addEventListener('pointerleave', () => setDoor(0), { signal });
  }
  names.forEach((el, i) => {
    el.addEventListener('click', () => {
      setDoor((i === 0 ? 1 : -1) * vw * (mobile ? 0.12 : 0.07));
      later(() => {
        document.getElementById(i === 0 ? 'research' : 'mawarimi')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        setDoor(0);
      }, 260);
    }, { signal });
  });
  function doorScroll() {
    const r = door.getBoundingClientRect();
    if (r.bottom < 0) return;
    const p = clamp(-r.top / r.height, 0, 1);
    if (mobile) {
      lab.style.translate = '';
      stu.style.translate = '';
      names[0].style.translate = `${-p * vw * 0.34}px 0`;
      names[1].style.translate = `${p * vw * 0.34}px 0`;
    } else {
      names[0].style.translate = '';
      names[1].style.translate = '';
      lab.style.translate = `0 ${-p * r.height * 0.2}px`;
      stu.style.translate = `0 ${p * r.height * 0.2}px`;
    }
  }

  // ───── 手：盤のマスを指すと駒を運び、押すと合図する ─────
  const handFace = need<HTMLElement>('.hand-face');
  const handImg = need<HTMLElement>('[data-hand]');
  const kanji = need<HTMLElement>('.kanji');
  const board = need<HTMLElement>('.hand-face .layer');
  const cells = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  cells.setAttribute('class', 'hand-cells');
  cells.setAttribute('viewBox', `0 0 ${BOARD.W} ${BOARD.H}`);
  cells.setAttribute('aria-hidden', 'true');
  const hand = { x: 0, y: 0, tx: 0, ty: 0, s: 1, nod: -1, run: false };
  function handDraw() {
    const s = ease(hand.s);
    const bx = (1 - s) * -92 * u;
    const by = (1 - s) * -176 * u;
    const br = (1 - s) * -6;
    let dip = 0;
    if (hand.nod >= 0) {
      const t = (performance.now() - hand.nod) / 760;
      if (t >= 1) hand.nod = -1;
      else dip = Math.abs(Math.sin(t * Math.PI * 2)) * 15 * u;
    }
    const lean = clamp((hand.tx - hand.x) * 0.012, -5, 5);
    handImg.style.transform = `translate(${bx + hand.x}px,${by + hand.y + dip}px) rotate(${br + lean}deg)`;
  }
  function handStep() {
    hand.x += (hand.tx - hand.x) * 0.1;
    hand.y += (hand.ty - hand.y) * 0.1;
    handDraw();
    if (Math.abs(hand.tx - hand.x) > 0.3 || Math.abs(hand.ty - hand.y) > 0.3 || hand.nod >= 0) {
      nextFrame(handStep);
    } else {
      hand.x = hand.tx;
      hand.y = hand.ty;
      hand.run = false;
      handDraw();
    }
  }
  function handGo(tx: number, ty: number) {
    hand.tx = tx;
    hand.ty = ty;
    if (reduce) {
      hand.x = tx;
      hand.y = ty;
      handDraw();
      return;
    }
    if (!hand.run) {
      hand.run = true;
      nextFrame(handStep);
    }
  }
  const cellCentre = new Map<SVGPolygonElement, [number, number]>();
  let onCell: SVGPolygonElement | null = null;
  let handTimer = 0;
  function pick(cell: SVGPolygonElement | null) {
    onCell?.classList.remove('on');
    onCell = cell;
    if (!cell) {
      handGo(0, 0);
      return;
    }
    cell.classList.add('on');
    const k = board.offsetWidth / BOARD.W;
    const c = cellCentre.get(cell)!;
    handGo((c[0] - BOARD.piece[0]) * k, (c[1] - 26 - BOARD.piece[1]) * k);
  }
  function nod() {
    if (reduce) return;
    hand.nod = performance.now();
    if (!hand.run) {
      hand.run = true;
      nextFrame(handStep);
    }
  }
  const cellSize = 1 / 6;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      const a = i * cellSize;
      const b = j * cellSize;
      const corners = [boardPoint(a, b), boardPoint(a + cellSize, b), boardPoint(a + cellSize, b + cellSize), boardPoint(a, b + cellSize)];
      const cell = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      cell.setAttribute('points', corners.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' '));
      cellCentre.set(cell, boardPoint(a + cellSize / 2, b + cellSize / 2));
      cell.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') pick(cell); }, { signal });
      cell.addEventListener('pointerdown', () => cancelLater(handTimer), { signal });
      cell.addEventListener('click', () => {
        pick(cell);
        nod();
        if (touch) {
          cancelLater(handTimer);
          handTimer = later(() => pick(null), 2600);
        }
      }, { signal });
      cells.appendChild(cell);
    }
  }
  board.parentNode!.insertBefore(cells, board.nextSibling);
  undo.push(() => cells.remove());
  cells.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') pick(null); }, { signal });
  function handScroll() {
    const r = handFace.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    hand.s = prog(r.top, 1, 0.12);
    const after = clamp(-r.top / r.height, 0, 1);
    kanji.style.translate = `0 ${(1 - ease(hand.s)) * 110 * u - after * 90 * u}px`;
    board.style.translate = `0 ${(1 - ease(hand.s)) * 70 * u}px`;
    cells.style.translate = board.style.translate;
    handDraw();
  }

  // ───── 廻リ視：部屋が寄り、指した所が照らされ、カメラは 1 台ずつ切り替わる ─────
  const world = need<HTMLElement>('.world');
  const room = need<HTMLElement>('.world > img.bg');
  const worldTitle = need<HTMLElement>('.world-title');
  let litTimer = 0;
  function lightAt(e: PointerEvent | MouseEvent) {
    const r = world.getBoundingClientRect();
    world.style.setProperty('--mx', `${e.clientX - r.left}px`);
    world.style.setProperty('--my', `${e.clientY - r.top}px`);
    world.classList.add('is-lit');
  }
  world.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') lightAt(e); }, { signal });
  world.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') world.classList.remove('is-lit'); }, { signal });
  world.addEventListener('click', (e) => {
    if (!touch) return;
    lightAt(e);
    cancelLater(litTimer);
    litTimer = later(() => world.classList.remove('is-lit'), 2600);
  }, { signal });
  const camsBox = need<HTMLElement>('.cams');
  const camEls = all<HTMLElement>('.cam');
  let camHeld: HTMLElement | null = null;
  const setLive = (c: HTMLElement) => camEls.forEach((el) => el.classList.toggle('is-live', el === c));
  function camScroll() {
    const r = camsBox.getBoundingClientRect();
    const on = r.top < vh * 0.82 && r.bottom > vh * 0.18;
    camsBox.classList.toggle('has-live', on || !!camHeld);
    if (camHeld || !on) return;
    let best = camEls[clamp(Math.floor(prog(r.top, 0.7, -0.15) * 3), 0, 2)];
    if (mobile) {
      let dist = Infinity;
      for (const el of camEls) {
        const b = el.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - vh * 0.5);
        if (d < dist) {
          dist = d;
          best = el;
        }
      }
    }
    setLive(best);
  }
  camEls.forEach((el) => {
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse') return;
      camHeld = el;
      setLive(el);
    }, { signal });
    el.addEventListener('pointerleave', (e) => {
      if (e.pointerType !== 'mouse') return;
      camHeld = null;
      camScroll();
    }, { signal });
    el.addEventListener('click', () => {
      if (!touch) return;
      camHeld = el;
      setLive(el);
      later(() => {
        if (camHeld === el) {
          camHeld = null;
          camScroll();
        }
      }, 3000);
    }, { signal });
  });
  function worldScroll() {
    const r = world.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
    room.style.transform = `scale(${1.02 + p * 0.1})`;
    worldTitle.style.translate = `0 ${(p - 0.45) * 90 * u}px`;
  }

  // ───── WhiteOut：筆跡が赤い先から伸びる。なぞって塗る。場面が動く。数字が増える ─────
  const splash = need<HTMLElement>('.wo-splash');
  const woTop = need<HTMLElement>('.wo-top');
  function woScroll() {
    const r = woTop.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = prog(r.top, 0.92, 0.02);
    splash.style.transform = `scale(${0.14 + 0.86 * (1 - Math.pow(1 - p, 2.2))})`;
  }
  const figures = all<HTMLElement>('.fig b').map((b) => {
    const node = b.firstChild as Text;
    const text = node.nodeValue ?? '';
    return { el: b.parentElement!, node, text, value: parseFloat(text.replace(/,/g, '')), decimals: (text.split('.')[1] ?? '').length };
  });
  undo.push(() => figures.forEach((f) => { f.node.nodeValue = f.text; }));
  function figureScroll() {
    for (const f of figures) {
      const r = f.el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) continue;
      const p = prog(r.top, 1.02, 0.8);
      if (p >= 1) {
        if (f.node.nodeValue !== f.text) f.node.nodeValue = f.text;
        continue;
      }
      const n = f.value * (1 - Math.pow(1 - p, 3));
      f.node.nodeValue = f.decimals ? n.toFixed(f.decimals) : Math.round(n).toLocaleString('en-US');
    }
  }

  const canvas = need<HTMLCanvasElement>('#ink');
  const inkBox = canvas.parentElement!;
  const woFace = inkBox.parentElement!;
  const ctx = canvas.getContext('2d')!;
  function sizeCanvas() {
    const d = Math.min(devicePixelRatio || 1, 2);
    const w = inkBox.clientWidth;
    const h = inkBox.clientHeight;
    if (canvas.width === Math.round(w * d) && canvas.height === Math.round(h * d)) return;
    let old: HTMLCanvasElement | null = null;
    if (canvas.width) {
      old = document.createElement('canvas');
      old.width = canvas.width;
      old.height = canvas.height;
      old.getContext('2d')!.drawImage(canvas, 0, 0);
    }
    canvas.width = Math.round(w * d);
    canvas.height = Math.round(h * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    if (old) ctx.drawImage(old, 0, 0, w, h);
  }
  sizeCanvas();
  const blot = (x: number, y: number, r: number) => {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  // 塗った割合を、縮めた複製で数える
  const percent = need<HTMLElement>('#wo-pct');
  const small = document.createElement('canvas');
  small.width = 96;
  small.height = 60;
  const smallCtx = small.getContext('2d', { willReadFrequently: true })!;
  let countTimer = 0;
  function countPaint() {
    if (countTimer) return;
    countTimer = later(() => {
      countTimer = 0;
      smallCtx.clearRect(0, 0, 96, 60);
      smallCtx.drawImage(canvas, 0, 0, 96, 60);
      const data = smallCtx.getImageData(0, 0, 96, 60).data;
      let n = 0;
      for (let i = 3; i < data.length; i += 4) if (data[i] > 70) n++;
      percent.textContent = ((n / 5760) * 100).toFixed(1);
    }, 140);
  }
  const inkStyle = () => {
    ctx.fillStyle = '#f8f6f0';
    ctx.strokeStyle = '#f8f6f0';
    ctx.lineCap = 'round';
  };
  let lastInk: { x: number; y: number } | null = null;
  woFace.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const b = canvas.getBoundingClientRect();
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    if (y < 0 || y > b.height) {
      lastInk = null;
      return;
    }
    inkStyle();
    const unit = b.width / 1440;
    if (lastInk) {
      const dist = Math.hypot(x - lastInk.x, y - lastInk.y);
      ctx.lineWidth = Math.max(10, 46 - dist * 0.32) * unit;
      ctx.beginPath();
      ctx.moveTo(lastInk.x, lastInk.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      const drops = Math.min(4, Math.floor(dist / 26));
      for (let i = 0; i < drops; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = (18 + Math.random() * 60) * unit;
        blot(x + Math.cos(a) * s, y + Math.sin(a) * s, (1 + Math.random() * Math.random() * 7) * unit);
      }
      countPaint();
    }
    lastInk = { x, y };
  }, { signal });
  woFace.addEventListener('pointerleave', () => { lastInk = null; }, { signal });
  // 押した所にインクが飛ぶ。指でなぞると読み進められないので、押すだけにする
  inkBox.addEventListener('click', (e) => {
    if ((e.target as Element).closest?.('a')) return;
    const b = canvas.getBoundingClientRect();
    const x = e.clientX - b.left;
    const y = e.clientY - b.top;
    if (y < 0 || y > b.height) return;
    inkStyle();
    const unit = b.width / (mobile ? 375 : 1440);
    blot(x, y, (touch ? 24 : 34) * unit);
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = (28 + Math.pow(Math.random(), 1.6) * 150) * unit;
      blot(x + Math.cos(a) * s, y + Math.sin(a) * s, (0.8 + Math.random() * Math.random() * 11) * unit);
    }
    countPaint();
  }, { signal });

  // 場面は画面に入っている間ずっと動く。伸びきった所で少し止まり、また初めから。触れた場面は初めから描き直す
  let framesOn = false;
  const clips = all<HTMLElement>('.wo-clip').map((c) => {
    let video: HTMLVideoElement | null = null;
    let hold = 0;
    let wait = 0;
    function make(): HTMLVideoElement {
      if (video) return video;
      const v = document.createElement('video');
      v.muted = true;
      v.playsInline = true;
      v.preload = 'auto';
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('aria-hidden', 'true');
      v.addEventListener('loadeddata', () => c.classList.add('is-play'), { signal });
      v.addEventListener('ended', () => {
        if (reduce) return;
        hold = later(() => { if (framesOn) start(); }, CLIP_HOLD);
      }, { signal });
      v.src = c.dataset.clip ?? '';
      c.appendChild(v);
      undo.push(() => {
        v.pause();
        v.remove();
        c.classList.remove('is-play');
      });
      video = v;
      return v;
    }
    function start() {
      cancelLater(hold);
      cancelLater(wait);
      const v = make();
      if (v.readyState > 0) v.currentTime = 0;
      // 省電力などで拒まれたときは静止画のまま残す
      v.play().catch(() => {});
    }
    function pause() {
      cancelLater(hold);
      cancelLater(wait);
      video?.pause();
    }
    if (!touch && !reduce) c.addEventListener('pointerenter', start, { signal });
    c.addEventListener('click', start, { signal });
    c.addEventListener('focus', () => { if (c.matches(':focus-visible')) start(); }, { signal });
    return {
      pause,
      startAfter: (ms: number) => {
        cancelLater(wait);
        wait = later(start, ms);
      },
    };
  });
  const frameBox = need<HTMLElement>('.wo-frames');
  const frameEls = all<HTMLElement>('.wo-clip');
  if (!reduce) {
    const observer = new IntersectionObserver((entries) => {
      framesOn = entries[entries.length - 1].isIntersecting;
      clips.forEach((clip, i) => {
        if (framesOn) clip.startAfter(i * CLIP_STAGGER);
        else clip.pause();
      });
    }, { rootMargin: '10% 0px' });
    observer.observe(frameBox);
    undo.push(() => observer.disconnect());
  }
  function frameScroll() {
    const r = frameBox.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = ease(prog(r.top, 1, 0.34));
    frameEls.forEach((el, i) => {
      const row = Math.floor(i / 2);
      const side = i % 2 ? 1 : -1;
      el.style.translate = `${(1 - p) * side * (46 + row * 26) * u}px ${(1 - p) * (34 + row * 34) * u}px`;
    });
  }

  // ───── 研究と業務：見開きが開く。触れたページが少し持ち上がる ─────
  const sheetsBox = need<HTMLElement>('.sheets');
  const sheetEls = all<HTMLElement>('.sheet');
  const rightColumn = need<HTMLElement>('.sheets-col.r');
  function sheetOn(el: HTMLElement, on: boolean) {
    el.classList.toggle('is-on', on);
    sheetsBox.classList.toggle('has-on', !!sheetsBox.querySelector('.sheet.is-on'));
  }
  sheetEls.forEach((el) => {
    el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') sheetOn(el, true); }, { signal });
    el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') sheetOn(el, false); }, { signal });
    el.addEventListener('focus', () => sheetOn(el, true), { signal });
    el.addEventListener('blur', () => sheetOn(el, false), { signal });
    // 指では 1 度目で持ち上げ、2 度目で開く。「詳しく見る」を押したときはすぐ開く
    if (touch) {
      el.addEventListener('click', (e) => {
        if (!el.classList.contains('is-on') && !(e.target as Element).closest('u')) e.preventDefault();
        const was = el.classList.contains('is-on');
        sheetEls.forEach((other) => other.classList.remove('is-on'));
        sheetOn(el, !was);
      }, { signal });
    }
  });
  function sheetScroll() {
    for (const el of sheetEls) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh * 0.2 || r.top > vh * 1.2) continue;
      const right = el.children[1] as HTMLElement;
      const p = ease(mobile ? prog(el.children[0].getBoundingClientRect().bottom, 1, 0.58) : prog(r.top, 1, 0.5));
      right.style.transform = p >= 1 ? 'none' : mobile ? `rotateX(${(1 - p) * -104}deg)` : `rotateY(${(1 - p) * -104}deg)`;
    }
    if (mobile) {
      rightColumn.style.translate = '';
      return;
    }
    const r = sheetsBox.getBoundingClientRect();
    if (r.bottom > 0 && r.top < vh) rightColumn.style.translate = `0 ${(0.5 - clamp((vh - r.top) / (vh + r.height), 0, 1)) * 150 * u}px`;
  }

  // ───── アプリ：逆向きに流れる。couple-sync は寄り添い、cogni-storage は一列に並ぶ ─────
  const apps = need<HTMLElement>('.apps');
  const appFlow = ([['.p1', 190], ['.p2', 96], ['.kitten', 300], ['.p3', -170], ['.p4', -84]] as const)
    .map(([selector, amount]) => ({ el: need<HTMLElement>(selector, apps), amount }));
  const setApps = chaser((v) => apps.style.setProperty('--d', `${v}px`), 0.1);
  if (!touch) {
    apps.addEventListener('pointermove', (e) => {
      if (mobile) return;
      const b = apps.getBoundingClientRect();
      const side = e.clientX - b.left < b.width / 2;
      apps.classList.toggle('on-a', side);
      apps.classList.toggle('on-b', !side);
      setApps((side ? 1 : -1) * 54 * u);
    }, { signal });
    apps.addEventListener('pointerleave', () => {
      apps.classList.remove('on-a', 'on-b');
      setApps(0);
    }, { signal });
  }
  all<HTMLElement>('.app-part', apps).forEach((part, i) => {
    const name = i === 0 ? 'on-a' : 'on-b';
    need<HTMLElement>('.shelf', part).addEventListener('click', () => {
      if (!touch) return;
      apps.classList.remove(name);
      void apps.offsetWidth;
      apps.classList.add(name);
      later(() => apps.classList.remove(name), 1500);
    }, { signal });
  });
  function appScroll() {
    for (const f of appFlow) {
      const host = mobile ? f.el.parentElement! : apps;
      const r = host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const p = ease(prog(r.top, 1, mobile ? 0.45 : 0.1));
      f.el.style.translate = `0 ${(1 - p) * f.amount * (mobile ? 0.28 : 1) * u}px`;
    }
  }

  // ───── 小さな作品：触れた所から円で色が戻る。列ごとにずれて揃う ─────
  const items = all<HTMLElement>('.item');
  items.forEach((item) => {
    const img = need<HTMLImageElement>('img', item);
    const thumb = document.createElement('span');
    const colour = img.cloneNode() as HTMLImageElement;
    thumb.className = 'thumb';
    colour.className = 'c';
    colour.alt = '';
    colour.removeAttribute('loading');
    colour.setAttribute('aria-hidden', 'true');
    img.parentNode!.insertBefore(thumb, img);
    thumb.append(img, colour);
    undo.push(() => {
      thumb.parentNode?.insertBefore(img, thumb);
      thumb.remove();
    });
    const at = (e: PointerEvent) => {
      const b = thumb.getBoundingClientRect();
      item.style.setProperty('--x', `${e.clientX - b.left}px`);
      item.style.setProperty('--y', `${e.clientY - b.top}px`);
    };
    if (!touch) {
      item.addEventListener('pointerenter', (e) => {
        at(e);
        item.classList.add('is-on');
      }, { signal });
      item.addEventListener('pointerleave', (e) => {
        at(e);
        item.classList.remove('is-on');
      }, { signal });
    }
  });
  if (touch) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-on', entry.isIntersecting));
    }, { rootMargin: '-38% 0px -38% 0px' });
    items.forEach((el) => observer.observe(el));
    undo.push(() => observer.disconnect());
  }
  function gridScroll() {
    const columns = mobile ? 2 : 4;
    items.forEach((item, i) => {
      const r = item.getBoundingClientRect();
      if (r.bottom < -vh * 0.3 || r.top > vh * 1.4) return;
      const shift = parseFloat(item.style.translate.split(' ')[1] || '0');
      const p = ease(prog(r.top - shift, 1.02, 0.52));
      item.style.translate = `0 ${(1 - p) * GRID_STAGGER[i % columns] * (mobile ? 0.6 : 1) * u * 1.6}px`;
    });
  }

  // ───── プロフィール：入口で割った名前が中央の線で合う ─────
  const closing = need<HTMLElement>('.closing');
  const leftName = need<HTMLElement>('.cl h2');
  const rightName = need<HTMLElement>('.cr h2');
  function closeScroll() {
    const r = closing.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const end = scrollY + vh >= root.scrollHeight - 2;
    const pl = end ? 1 : ease(prog(leftName.parentElement!.getBoundingClientRect().top, 0.98, 0.36));
    const pr = end ? 1 : ease(prog(rightName.parentElement!.getBoundingClientRect().top, 0.98, 0.36));
    leftName.style.translate = `${(1 - pl) * -vw * 0.3}px 0`;
    rightName.style.translate = `${(1 - pr) * vw * 0.3}px 0`;
    closing.style.setProperty('--cp', pl.toFixed(3));
  }

  // ───── まとめて回す ─────
  let ticking = false;
  function frame() {
    ticking = false;
    tone();
    if (reduce) return;
    doorScroll();
    handScroll();
    worldScroll();
    camScroll();
    woScroll();
    frameScroll();
    figureScroll();
    sheetScroll();
    appScroll();
    gridScroll();
    closeScroll();
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    nextFrame(frame);
  }
  addEventListener('scroll', onScroll, { passive: true, signal });
  addEventListener('resize', () => {
    measure();
    sizeCanvas();
    onScroll();
  }, { signal });
  frame();

  return () => {
    listeners.abort();
    timers.forEach((id) => clearTimeout(id));
    frames.forEach((id) => cancelAnimationFrame(id));
    undo.reverse().forEach((fn) => fn());
  };
}
