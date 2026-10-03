import { readFile, writeFile, mkdir, cp, readdir } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';

const require = createRequire(import.meta.url);
const runtimeModules = process.env.CODEX_ARTWORK_MODULES ?? path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const sharp = require(require.resolve('sharp', { paths: [runtimeModules] }));
const templates = import.meta.dirname;
const badges = '.portfolio-demo-badge{position:fixed;z-index:10000;left:50%;top:8px;transform:translateX(-50%);border:1px solid currentColor;border-radius:20px;padding:3px 7px;background:#fff5dc;color:#675849;font:700 10px/1.2 system-ui;letter-spacing:.1em;pointer-events:none}';
const preferences = `<script>window.portfolioDemoStorage={getItem:key=>window.localStorage.getItem('portfolio-demo:couple-sync:'+key),setItem:(key,value)=>window.localStorage.setItem('portfolio-demo:couple-sync:'+key,value),removeItem:key=>window.localStorage.removeItem('portfolio-demo:couple-sync:'+key)};</script>`;
export const demoCsp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; media-src 'self' data: blob:; connect-src 'none'; worker-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'";

async function textFiles(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (item.name === 'node_modules') continue;
    const file = path.join(directory, item.name);
    if (item.isDirectory()) files.push(...await textFiles(file));
    else if (/\.(?:tsx?|js|css|html)$/.test(item.name)) files.push(file);
  }
  return files;
}

export function anonymousNames(code) {
  return code.replaceAll('たいせい', 'ユウ').replaceAll('ひな', 'マオ').replace(/(['"`])たい\1/g, '$1ユウ$1').replace(/(?<![ぁ-んァ-ヶ一-龠])たい(?=\s|<|と|は|に|の|が|[、。・=（])/g, 'ユウ');
}

function cardSvg(title, copy, color = '#e9d8b5') {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><rect width="600" height="800" fill="${color}"/><rect x="30" y="30" width="540" height="740" rx="16" fill="#fff8e8"/><circle cx="300" cy="185" r="80" fill="#f1c1b8"/><text x="300" y="200" text-anchor="middle" font-family="Meiryo,sans-serif" font-size="46" fill="#795548">${title}</text><text x="300" y="405" text-anchor="middle" font-family="Meiryo,sans-serif" font-size="25" fill="#795548">${copy}</text><text x="300" y="680" text-anchor="middle" font-family="Meiryo,sans-serif" font-size="19" fill="#9a826f">公開デモ用の架空のアルバム</text></svg>`);
}

function syntheticAudio(seconds = 153) {
  const rate = 8000;
  const pcm = Buffer.alloc(rate * seconds);
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
  for (let i = 0; i < pcm.length; i++) {
    const time = i / rate;
    const envelope = Math.exp(-5 * (time % .75));
    pcm[i] = Math.round(128 + 9 * envelope * Math.sin(2 * Math.PI * notes[Math.floor(time / .75) % notes.length] * time));
  }
  const header = Buffer.alloc(44);
  header.write('RIFF'); header.writeUInt32LE(36 + pcm.length, 4); header.write('WAVEfmt ', 8); header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22); header.writeUInt32LE(rate, 24); header.writeUInt32LE(rate, 28); header.writeUInt16LE(1, 32); header.writeUInt16LE(8, 34); header.write('data', 36); header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

export async function prepareAnonymousAssets(source, stage) {
  const assets = path.join(stage, 'src/assets');
  await mkdir(path.join(assets, 'memories'), { recursive: true });
  await mkdir(path.join(assets, 'birthday'), { recursive: true });
  for (const file of ['avatar_ai.png', 'games/icon-hakoniwa.png', 'games/icon-futari-island.png']) {
    await mkdir(path.dirname(path.join(assets, file)), { recursive: true });
    await cp(path.join(source, 'src/assets', file), path.join(assets, file));
  }
  for (const [name, color] of [['avatar_tai.png', '#93bdc2'], ['avatar_hina.png', '#e5a5a5'], ['hero.png', '#bdd8ad'], ['dating_start_photo.png', '#e9d8b5']]) {
    await sharp(cardSvg('DEMO', 'ふたりのデモアルバム', color)).resize(name.startsWith('avatar') ? 256 : 600, name.startsWith('avatar') ? 256 : 800).png().toFile(path.join(assets, name));
  }
  const colors = ['#e9d8b5', '#c8dcc2', '#e9c5be', '#c4d9df', '#d7c7df', '#eee0b8'];
  const tiles = await Promise.all(colors.map((color, i) => sharp(cardSvg(String(i + 1).padStart(2, '0'), 'ふたりの思い出', color)).resize(240, 320).jpeg({ quality: 85 }).toBuffer()));
  for (let i = 1; i <= 216; i++) await writeFile(path.join(assets, 'memories', `${String(i).padStart(3, '0')}.jpg`), tiles[(i - 1) % tiles.length]);
  for (const [name, text] of [['title-greeting.jpg', 'お誕生日おめでとう'], ['note-2.jpg', 'いつもありがとう'], ['note-3.jpg', 'また一緒に散歩しよう'], ['note-4.jpg', 'ふたりで新しいことを'], ['note-5.jpg', 'これからもよろしく']]) {
    await sharp(cardSvg('DEMO', text)).jpeg({ quality: 90 }).toFile(path.join(assets, 'birthday', name));
  }
  await writeFile(path.join(assets, 'birthday/music.mp3'), syntheticAudio());
  await mkdir(path.join(templates, 'assets'), { recursive: true });
  await writeFile(path.join(templates, 'assets/demo-memory.jpg'), tiles[0]);
}

export async function anonymizeLegacy(stage, source) {
  await prepareAnonymousAssets(source, stage);
  for (const file of await textFiles(stage)) {
    let code = anonymousNames(await readFile(file, 'utf8'));
    code = code.replace(/(?:window\.)?localStorage\.(getItem|setItem|removeItem)\(/g, 'window.portfolioDemoStorage.$1(');
    const relative = path.relative(stage, file).split(path.sep).join('/');
    if (relative === 'src/db.ts') code = code.replace("openDB<CoupleSyncDB>('couple-sync', 11", "openDB<CoupleSyncDB>('couple-sync-portfolio-demo-v2', 11");
    if (relative === 'src/App.tsx') code = code.replace("const DATING_START_DATE = '2024-12-30';", "const DATING_START_DATE = '2025-04-01';");
    if (relative === 'src/main.tsx') {
      code = code.replace(/\n\/\/ PWA:[\s\S]*$/, '');
      code = code.replace("import App from './App.tsx'", "import App from './App.tsx'\nimport { supabase } from './supabase'\nimport { forceSyncFromSupabase } from './db'");
      code = code.replace("createRoot(document.getElementById('root')!).render(", "supabase.ready.then(() => forceSyncFromSupabase()).then(() => {\ncreateRoot(document.getElementById('root')!).render(") + '\n})\n';
    }
    if (relative === 'src/utils/date.ts') code = code.replace('HINA_BIRTHDAY_MONTH = 5', 'HINA_BIRTHDAY_MONTH = 2');
    if (relative === 'src/views/MemoriesView.tsx') code = code.replace("month === '05' && day === '14'", "month === '02' && day === '14'");
    if (relative === 'src/views/BirthdayView.tsx') code = code.replaceAll('2026 / 5 / 14', '2026 / 2 / 14');
    if (relative === 'src/views/MemoryReel.tsx') {
      const scenes = Array.from({ length: 216 }, (_, i) => ({ photoId: String(i + 1).padStart(3, '0'), ...(i % 18 === 0 ? { text: 'ふたりのデモアルバム', icon: 'heart' } : {}) }));
      code = code.replace(/const DEFAULT_SCENES: Scene\[\] = \[[\s\S]*?\n\];/, `const DEFAULT_SCENES: Scene[] = ${JSON.stringify(scenes)};`);
      if (code.includes('2024-12-30')) code = code.replaceAll('2024-12-30', '2025-04-01');
    }
    if (relative === 'src/timetable/timetableData.ts') {
      const timetable = [
        { id: 'demo-mon-1', userId: 'taisei', dayOfWeek: 0, startTime: '09:00', endTime: '10:30', subject: 'デザイン入門', location: 'A101' },
        { id: 'demo-wed-2', userId: 'taisei', dayOfWeek: 2, startTime: '11:00', endTime: '12:30', subject: 'プログラミング', location: 'B202' },
        { id: 'demo-tue-1', userId: 'hina', dayOfWeek: 1, startTime: '09:00', endTime: '10:30', subject: '色彩演習', location: 'C103' },
        { id: 'demo-fri-3', userId: 'hina', dayOfWeek: 4, startTime: '13:00', endTime: '14:30', subject: 'ものづくり', location: '工房' },
      ];
      code = code.replace(/export const defaultTimetable: TimetableEntry\[\] = \[[\s\S]*?\n\];/, `export const defaultTimetable: TimetableEntry[] = ${JSON.stringify(timetable)};`);
    }
    if (relative === 'src/timetable/Timetable.tsx') {
      const periods = [0, 1, 2, 3, 4, 5].map(i => ({ label: `${i + 1}限`, start: `${String(9 + i * 2).padStart(2, '0')}:00`, end: `${String(10 + i * 2).padStart(2, '0')}:30` }));
      code = code.replace(/const PERIODS_BY_USER: Record<'taisei' \| 'hina', Period\[\]> = \{[\s\S]*?\n\};/, `const PERIODS_BY_USER: Record<'taisei' | 'hina', Period[]> = ${JSON.stringify({ taisei: periods, hina: periods })};`);
    }
    if (relative === 'src/utils/designSwitch.ts') code = code.replace('`/px4k-9vnq/room/${hash ? `#${hash}` : \'\'}`', '`/demos/couple-sync/index.html${hash ? `#${hash}` : \'\'}`');
    if (relative === 'src/index.css') code += '\n' + badges + '\nbody:has([class*="containerGameLocked"]) .portfolio-demo-badge{top:auto;bottom:8px;left:auto;right:8px;transform:none}';
    if (relative === 'src/games/KanjiWrite/KanjiWrite.tsx') code = code.replaceAll("'/js/", "'/demos/couple-sync/legacy/js/");
    if (relative === 'index.html') {
      code = code.replace(/<script>\s*\/\/ 通常の起動[\s\S]*?<\/script>/, '');
      code = code.replace(/<link[^>]+href="https:\/\/fonts[^>]+>/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
      code = code.replace(/<link[^>]+rel="manifest"[^>]+>/g, '').replaceAll(', maximum-scale=1.0, user-scalable=no', '');
      code = code.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" /><meta http-equiv="Content-Security-Policy" content="${demoCsp}">`);
      code = code.replace('<body>', '<body>' + preferences + '<span class="portfolio-demo-badge" aria-hidden="true">DEMO</span><p style="position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)">架空の記録を使う公開デモです。保存内容はこのブラウザにだけ残ります。</p>');
      code = code.replace(/(href|src)="\/(?!src\/)([^"#]+)"/g, '$1="/demos/couple-sync/legacy/$2"');
    }
    await writeFile(file, code);
  }
  await writeFile(path.join(stage, 'src/supabase.ts'), "import { createClient } from '@supabase/supabase-js';\nexport const supabase = createClient();\n");
  await writeFile(path.join(stage, 'src/utils/shubieLive.ts'), await readFile(path.join(templates, 'couple-live.ts.txt'), 'utf8'));
}

export async function anonymizeRoom(stage) {
  for (const file of await textFiles(stage)) {
    let code = anonymousNames(await readFile(file, 'utf8'));
    code = code.replace(/(?:window\.)?localStorage\.(getItem|setItem|removeItem)\(/g, 'window.portfolioDemoStorage.$1(');
    const relative = path.relative(stage, file).split(path.sep).join('/');
    if (relative === 'room-content.js') {
      code = code.replace("export const LEGACY_URL = 'https://couple-sync-seven.vercel.app/px4k-9vnq';", "export const LEGACY_URL = new URL('/demos/couple-sync/legacy/index.html', location.origin).href;");
    }
    if (relative === 'design-switch.js') code = code.replaceAll('/px4k-9vnq/room', '/demos/couple-sync').replaceAll('new URL(LEGACY_URL)', 'new URL(LEGACY_URL, current.origin)');
    if (relative === 'sync/engine.js') code = code.replace("'couple-room-v1'", "'couple-room-portfolio-demo-v2'");
    if (relative === 'play-store.js') {
      code = code.replaceAll("'room-play-v1'", "'room-play-portfolio-demo-v2'");
      const initial = 'if (stored === undefined && key === undefined) return { state: createPlayState(), migrated: false };';
      if (!code.includes(initial)) throw new Error('Current room progress initializer changed');
      code = code.replace(initial, "if (stored === undefined && key === undefined) return { state: { ...createPlayState(), coins: 15, unlocked: ['flower-rug', 'linen-curtains'] }, migrated: false };");
    }
    if (relative === 'weather-config.js') code = 'export const weatherLocation = { latitude: 0, longitude: 0 };';
    if (relative === 'environment.js') {
      code = code.replace('fetchImpl = fetch', 'fetchImpl = demoWeather');
      code += `\nasync function demoWeather() {\n  const date = new Date();\n  const sunrise = new Date(date); sunrise.setHours(6, 0, 0, 0);\n  const sunset = new Date(date); sunset.setHours(18, 0, 0, 0);\n  return { ok: true, json: async () => ({ current: { weather_code: 2, cloud_cover: 25, temperature_2m: 22, time: Math.floor(date.getTime() / 1000) }, daily: { sunrise: [sunrise.getTime() / 1000], sunset: [sunset.getTime() / 1000] } }) };\n}\n`;
    }
    if (relative === 'styles.css') code += '\n' + badges;
    if (relative === 'room-panels.js') code = code.replace('new URL(memory.photoUrl)', 'new URL(memory.photoUrl, location.href)').replace("url.protocol === 'https:'", "url.protocol === 'https:' || url.origin === location.origin || url.protocol === 'data:' || url.protocol === 'blob:'");
    if (relative === 'index.html') {
      code = code.replace('https://couple-sync-seven.vercel.app/px4k-9vnq#today', './legacy/index.html#today');
      code = code.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" /><meta http-equiv="Content-Security-Policy" content="${demoCsp}"><meta name="robots" content="noindex,nofollow">`);
      code = code.replace('<body>', '<body>' + preferences + '<span class="portfolio-demo-badge" aria-hidden="true">DEMO</span>');
    }
    await writeFile(file, code);
  }
}
