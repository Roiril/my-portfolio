import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
async function files(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) result.push(...await files(file)); else result.push(file);
  }
  return result;
}
const published = [...await files(path.join(root, 'public/demos/couple-sync')), ...await files(path.join(root, 'public/demos/cogni-storage'))];
const forbidden = /eyJ[A-Za-z0-9_-]{30,}|supabase\.co|\/px4k-9vnq|couple-sync-seven\.vercel\.app|workspace\/research\/|serviceWorker\.register|fonts\.googleapis\.com|たいせい|ひな|['"`]たい(?=['"`]|\s|と|は|に|の|が)|2024-12-30/;
const hashes = new Set();
let textCount = 0, privateCount = 0;
for (const file of published) {
  const bytes = await readFile(file);
  hashes.add(sha(bytes));
  if (/\.(?:js|css|html|svg|json)$/.test(file)) {
    assert.ok(!forbidden.test(bytes.toString('utf8')), `Private marker in ${path.relative(root, file)}`);
    textCount++;
  }
}
// Compare hashes rather than opening or publishing any original personal photo.
for (const file of await files(path.resolve(root, '../couple-sync/src/assets'))) {
  const relative = path.relative(path.resolve(root, '../couple-sync/src/assets'), file).split(path.sep).join('/');
  if (relative === 'avatar_ai.png' || relative.startsWith('games/')) continue;
  if (!/\.(?:png|jpe?g|mp3)$/.test(file)) continue;
  assert.ok(!hashes.has(sha(await readFile(file))), 'Original personal asset remains in a published demo');
  privateCount++;
}
const manifest = JSON.parse(await readFile(path.join(root, 'public/demos/couple-sync/demo-manifest.json'), 'utf8'));
for (const [relative, expected] of Object.entries(manifest.generatedAssets)) assert.equal(sha(await readFile(path.join(root, 'public/demos/couple-sync', relative))), expected, `Generated asset changed: ${relative}`);
const backend = await readFile(path.join(root, 'scripts/demo/local-backend.mjs'), 'utf8');
assert.ok(!/\b(?:fetch|WebSocket|XMLHttpRequest)\s*\(/.test(backend), 'Local backend contains a network transport');
console.log(`PASS: ${textCount} public text files checked; ${privateCount} original private asset hashes excluded; generated files match manifest; local backend has no network transport`);
