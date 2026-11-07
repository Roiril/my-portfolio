// アプリの面の猫。座った 1 枚で止まっていて、決まった動きのときだけコマを送る。
// どの動きも座った 1 枚から始まり、座った 1 枚で終わる。コマの間は補間しない。
// 順番は public/images/front/cat-sheet.webp の並び（8 列 × 4 段）と同じ。

const SHEET = '/images/front/cat-sheet.webp';
const COLS = 8;
const ROWS = 4;
const FRAMES = [
  'base', 'g2', 'g3', 'g4', 'g5', 'g6', 'g7', 'g8',
  'g9', 'g10', 'g11', 'g12', 'blink1', 'blink2', 't1', 't2',
  't3', 't4', 'e1', 'e2', 'l1', 'l2', 'y2', 'y3',
  'y4', 'y5', 'y6', 'y7', 'y8', 'y9', 'y10', 'y11',
] as const;
type Frame = (typeof FRAMES)[number];
type Clip = readonly (readonly [Frame, number])[];

// [コマ, 保持する ms]。最後は必ず base へ戻す
const WASH: Clip = [
  ['g2', 130], ['g3', 110],
  ['g4', 170], ['g5', 130], ['g6', 170], ['g5', 130], ['g4', 170], ['g5', 130],
  ['g7', 130], ['g8', 160], ['g9', 210], ['g8', 130], ['g9', 210], ['g10', 120],
  ['g11', 120], ['g12', 260],
];
const YAWN: Clip = [
  ['y2', 120], ['y3', 110], ['y4', 120], ['y5', 140], ['y6', 520],
  ['y7', 160], ['y8', 120], ['y9', 110], ['y10', 260], ['y11', 110],
];
const IDLE: readonly Clip[] = [
  [['blink1', 50], ['blink2', 90], ['blink1', 50]],
  [['t1', 110], ['t2', 130], ['t3', 210], ['t2', 110], ['t1', 110]],
  [['t4', 240], ['t1', 120]],
  [['e1', 70], ['e2', 110], ['e1', 70], ['base', 130], ['e1', 70], ['e2', 90], ['e1', 70]],
  [['l1', 700], ['base', 180], ['l2', 620]],
];
const IDLE_MIN = 6000;
const IDLE_MAX = 11000;
const BLINK_EVERY = 2; // 2 回に 1 回はまばたき

export function startKitten(cat: HTMLElement, signal: AbortSignal, touch: boolean): () => void {
  const layer = cat.querySelector<HTMLElement>('.kitten-frames');
  if (!layer) throw new Error('猫のコマの層が見つからない');

  let ready = false;
  let seen = false;
  let inView = false;
  let playing = false;
  let idleCount = 0;
  let clipTimer = 0;
  let idleTimer = 0;
  const show = (frame: Frame) => {
    const i = FRAMES.indexOf(frame);
    layer.style.backgroundPosition = `${((i % COLS) / (COLS - 1)) * 100}% ${(Math.floor(i / COLS) / (ROWS - 1)) * 100}%`;
    cat.dataset.frame = frame;
  };

  const play = (clip: Clip) => {
    if (!ready || playing) return;
    playing = true;
    clearTimeout(idleTimer);
    let i = 0;
    const step = () => {
      if (i === clip.length) {
        show('base');
        playing = false;
        cat.dataset.played = String(Number(cat.dataset.played ?? 0) + 1);
        scheduleIdle();
        return;
      }
      const [frame, hold] = clip[i++];
      show(frame);
      clipTimer = window.setTimeout(step, hold);
    };
    step();
  };

  const scheduleIdle = () => {
    clearTimeout(idleTimer);
    if (!inView || !seen) return;
    idleTimer = window.setTimeout(() => {
      idleCount += 1;
      const others = IDLE.slice(1);
      play(idleCount % BLINK_EVERY === 0 ? IDLE[0] : others[Math.floor(Math.random() * others.length)]);
    }, IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN));
  };

  const enter = () => {
    if (!ready || !inView) return;
    if (!seen) {
      seen = true;
      play(WASH);
    } else if (!playing) {
      scheduleIdle();
    }
  };

  // 面の近くへ来てからコマの画像を読む。読めるまでは座った 1 枚のまま
  const near = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    near.disconnect();
    const image = new Image();
    image.src = SHEET;
    image.decode().then(() => {
      if (signal.aborted) return;
      layer.style.backgroundImage = `url(${SHEET})`;
      show('base');
      cat.classList.add('is-ready');
      ready = true;
      enter();
    }).catch(() => {
      // コマが読めなくても座った 1 枚が残る
    });
  }, { rootMargin: '60% 0px' });
  near.observe(cat);

  const inside = new IntersectionObserver((entries) => {
    inView = entries[entries.length - 1].isIntersecting;
    if (inView) enter();
    else clearTimeout(idleTimer);
  }, { threshold: 0.7 });
  inside.observe(cat);

  if (touch) cat.addEventListener('click', () => play(YAWN), { signal });
  else cat.addEventListener('pointerenter', () => play(YAWN), { signal });

  return () => {
    near.disconnect();
    inside.disconnect();
    clearTimeout(clipTimer);
    clearTimeout(idleTimer);
  };
}
