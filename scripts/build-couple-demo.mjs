import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, rename, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { anonymizeLegacy, anonymizeRoom } from './demo/couple-anonymize.mjs';

const root = path.resolve(import.meta.dirname, '..');
const legacyRoot = path.resolve(root, '../couple-sync');
const roomRoot = path.resolve(root, '../couple-app-v2');
const destination = path.join(root, 'public/demos/couple-sync');
const require = createRequire(import.meta.url);
const runtime = process.env.CODEX_ARTWORK_MODULES ?? path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const sharp = require(require.resolve('sharp', { paths: [runtime] }));
const head = directory => execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sources = { legacy: head(legacyRoot), room: head(roomRoot) };
const scratchRoot = path.join(root, '.demo-src');
await mkdir(scratchRoot, { recursive: true });
const stage = await mkdtemp(path.join(scratchRoot, 'current-couple-'));
const legacy = path.join(stage, 'legacy');
const room = path.join(stage, 'room');
const out = path.join(stage, 'out');

async function files(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (item.name === 'node_modules') continue;
    const file = path.join(directory, item.name);
    if (item.isDirectory()) result.push(...await files(file));
    else result.push(file);
  }
  return result;
}

function within(target, parent) {
  const relative = path.relative(parent, target);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) throw new Error(`Unsafe output path: ${target}`);
}

async function copy(source, target) {
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target);
}

try {
  await mkdir(legacy, { recursive: true });
  await cp(path.join(legacyRoot, 'src'), path.join(legacy, 'src'), {
    recursive: true,
    filter: source => path.relative(path.join(legacyRoot, 'src'), source).split(path.sep)[0] !== 'assets',
  });
  await copy(path.join(legacyRoot, 'index.html'), path.join(legacy, 'index.html'));
  for (const asset of ['favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icons.svg', 'js/ref-patterns.js', 'js/kanji-canvas.min.js']) {
    await copy(path.join(legacyRoot, 'public', asset), path.join(legacy, 'public', asset));
  }
  const exporter = await readFile(path.join(roomRoot, 'scripts/export-room.mjs'), 'utf8');
  const list = exporter.match(/const files = \[([\s\S]*?)\n\];/)?.[1];
  if (!list) throw new Error('Current room export allowlist not found');
  const roomFiles = [...list.matchAll(/'([^']+)'/g)].map(match => match[1]);
  for (const file of roomFiles) await copy(path.join(roomRoot, file), path.join(room, file));

  const sourceHashes = {};
  for (const [label, directory] of [['legacy', legacy], ['room', room]]) {
    for (const file of await files(directory)) {
      if (!/\.(tsx?|js|css|html)$/.test(file)) continue;
      sourceHashes[`${label}/${path.relative(directory, file).split(path.sep).join('/')}`] = hash(await readFile(file));
    }
  }
  await anonymizeLegacy(legacy, legacyRoot);
  await anonymizeRoom(room);
  const fontRoot = path.join(root, 'scripts/demo/fonts');
  await mkdir(fontRoot, { recursive: true });
  const fonts = [['ZenOldMincho-Regular.ttf', 'Zen Old Mincho'], ['DotGothic16-Regular.ttf', 'DotGothic16'], ['Lobster-Regular.ttf', 'Lobster']];
  let fontCss = '';
  for (const [file, family] of fonts) {
    try { await readFile(path.join(fontRoot, file)); }
    catch { await copy(path.join(root, '.demo-src/couple-sync/public/fonts', file), path.join(fontRoot, file)); }
    await copy(path.join(fontRoot, file), path.join(legacy, 'public/fonts', file));
    fontCss += `\n@font-face{font-family:'${family}';src:url('/demos/couple-sync/legacy/fonts/${file}') format('truetype');font-display:swap}`;
  }
  const cssPath = path.join(legacy, 'src/index.css');
  await writeFile(cssPath, await readFile(cssPath, 'utf8') + fontCss);
  await symlink(path.join(legacyRoot, 'node_modules'), path.join(legacy, 'node_modules'), 'junction');
  await symlink(path.join(roomRoot, 'node_modules'), path.join(room, 'node_modules'), 'junction');
  const { build } = await import(pathToFileURL(path.join(legacyRoot, 'node_modules/vite/dist/node/index.js')).href);
  const { default: react } = await import(pathToFileURL(path.join(legacyRoot, 'node_modules/@vitejs/plugin-react/dist/index.js')).href);
  const alias = { '@supabase/supabase-js': path.join(root, 'scripts/demo/couple-client.mjs') };
  const define = { 'import.meta.env.VITE_SUPABASE_URL': JSON.stringify('local-demo'), 'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify('local-demo') };
  await build({ root: legacy, configFile: false, envDir: false, base: '/demos/couple-sync/legacy/', plugins: [react()], resolve: { alias }, define, build: { outDir: path.join(out, 'legacy'), emptyOutDir: true } });
  await build({ root: room, configFile: false, envDir: false, publicDir: false, base: './', resolve: { alias }, define, build: { outDir: out, emptyOutDir: false } });
  await copy(path.join(root, 'scripts/demo/assets/demo-memory.jpg'), path.join(out, 'demo-memory.jpg'));

  const replacements = [];
  for (const file of await files(path.join(out, 'assets'))) {
    if (!file.endsWith('.png')) continue;
    const newFile = file.slice(0, -4) + '.webp';
    await sharp(file).webp({ quality: 90 }).toFile(newFile);
    replacements.push([path.basename(file), path.basename(newFile)]);
    await rm(file);
  }
  for (const file of await files(out)) {
    if (!/\.(js|css|html)$/.test(file)) continue;
    let code = await readFile(file, 'utf8');
    for (const [before, after] of replacements) code = code.replaceAll(before, after);
    if (/eyJ[A-Za-z0-9_-]{30,}|supabase\.co|couple-sync-seven\.vercel\.app|\/px4k-9vnq|serviceWorker\.register|たいせい|ひな/.test(code)) throw new Error(`Private connection or label remains: ${path.relative(out, file)}`);
    await writeFile(file, code);
  }
  const generatedAssets = {};
  for (const file of await files(out)) generatedAssets[path.relative(out, file).split(path.sep).join('/')] = hash(await readFile(file));
  await writeFile(path.join(out, 'demo-manifest.json'), JSON.stringify({ sources, sourceHashes, generatedAssets, transforms: ['anonymous display labels and fictional timetable, dates, photos and messages', 'local IndexedDB backend shared between both current designs', 'local AI responses and weather placeholder', 'no Supabase, external API, PWA or remote fonts', 'current UI, all games and responsive styles retained'], roomFiles }, null, 2) + '\n');
  if (head(legacyRoot) !== sources.legacy || head(roomRoot) !== sources.room) throw new Error('Source changed during build. Rebuild from the new revision.');
  within(destination, path.join(root, 'public/demos'));
  const backup = path.join(stage, 'previous-demo');
  try { await rename(destination, backup); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  await mkdir(path.dirname(destination), { recursive: true });
  try { await rename(out, destination); } catch (error) { await rename(backup, destination); throw error; }
  console.log(`Current couple demo built: legacy=${sources.legacy.slice(0, 8)} room=${sources.room.slice(0, 8)}; ${Object.keys(sourceHashes).length} source files; ${replacements.length} optimized illustrations`);
} finally {
  within(stage, scratchRoot);
  await rm(stage, { recursive: true, force: true });
}
