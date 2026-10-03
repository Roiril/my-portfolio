import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import path from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const runtime = process.env.CODEX_ARTWORK_MODULES ?? path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = require(require.resolve('playwright', { paths: [runtime] }));
const base = process.env.COUPLE_DEMO_BASE ?? 'http://127.0.0.1:3100';
const url = `${base}/demos/couple-sync/index.html`;
const legacy = `${base}/demos/couple-sync/legacy/index.html`;
const evidence = path.join(root, '.codex/couple-demo-check');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [], external = [], resourceFailures = [], layouts = [], games = [];
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: 'Asia/Tokyo', reducedMotion: 'reduce' });
context.on('page', page => {
  page.on('pageerror', error => failures.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url()) && !request.url().startsWith(base + '/')) external.push(request.url()); });
  page.on('response', response => { if (response.status() >= 400) resourceFailures.push({ url: response.url(), status: response.status() }); });
  page.on('websocket', socket => external.push(socket.url()));
});
const page = await context.newPage();
async function readyLegacy() {
  await page.locator('#root button').first().waitFor();
  await page.locator('#splash').waitFor({ state: 'hidden' });
  await page.evaluate(() => document.fonts.ready);
}
async function measure(label) {
  const measured = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, visibleImages: [...document.images].filter(image => image.getBoundingClientRect().width > 0).map(image => ({ complete: image.complete, width: image.naturalWidth })) }));
  assert.ok(measured.scrollWidth <= measured.width + 1, `${label}: horizontal overflow`);
  await page.evaluate(async () => Promise.all([...document.images].filter(image => image.getBoundingClientRect().width > 0).map(image => image.decode())));
  layouts.push({ label, ...measured });
}
try {
  await page.clock.install({ time: new Date('2026-10-03T11:30:00+09:00') });
  // Earn the gacha cost through the current daily reward flow.
  for (let day = 3; day <= 7; day++) {
    await page.clock.setSystemTime(new Date(`2026-10-0${day}T11:30:00+09:00`));
    await page.goto(url);
    await page.locator('.room-gacha').waitFor();
    await page.locator('.room-fish:not(:disabled)').waitFor();
    await page.locator('.cat').click();
    await page.waitForFunction(coins => document.querySelector('.room-wallet .play-coin-count')?.textContent === String(coins), 15 + day - 2);
  }
  await page.getByRole('button', { name: 'ガチャガチャを開く', exact: true }).click();
  await page.locator('dialog[open] .gacha-draw:not(:disabled)').waitFor();
  await measure('gacha');
  await page.screenshot({ path: path.join(root, 'public/images/works/couple-sync/03-gacha.png') });
  await page.locator('.gacha-draw').click();
  await page.locator('.gacha-capsule').waitFor();
  await page.locator('.gacha-capsule').click();
  await page.locator('.prize-name').waitFor();
  const prize = await page.locator('.prize-name').textContent();
  assert.ok(prize?.length > 0);
  await page.reload();
  await page.locator('.prize-name').waitFor();
  assert.equal(await page.locator('.prize-name').textContent(), prize, 'gacha result did not persist');
  await page.goto(url);
  await page.locator('.room-fish:not(:disabled)').waitFor();
  const fishBefore = Number(await page.locator('.fish-count').textContent());
  await page.locator('.room-fish').click();
  await page.waitForFunction(count => Number(document.querySelector('.fish-count')?.textContent) === count - 1, fishBefore);
  await page.locator('.room-gear').click();
  await page.getByRole('button', { name: '模様替え', exact: true }).click();
  await page.locator('dialog[open]').waitFor();
  await measure('decoration');
  await page.screenshot({ path: path.join(evidence, 'decoration.png') });

  // Edits must remain available when moving from the new UI to the current legacy UI.
  await page.goto(`${url}#notes`);
  await page.locator('.note-line-input').first().waitFor();
  const note = '両デザインで共有するデモの記録';
  await page.getByRole('textbox', { name: '新しく書きとめること', exact: true }).fill(note);
  await page.getByRole('button', { name: 'ノートに追加', exact: true }).click();
  await page.waitForFunction(value => [...document.querySelectorAll('.note-line-input')].some(input => input.value === value), note);
  await page.locator('dialog[open]').getByRole('link', { name: '旧デザインへ切り替える', exact: true }).click();
  await readyLegacy();
  await page.waitForFunction(value => [...document.querySelectorAll('input,textarea')].some(input => input.value === value), note);
  await page.getByRole('link', { name: '新デザインへ切り替える', exact: true }).click();
  await page.waitForFunction(value => [...document.querySelectorAll('.note-line-input')].some(input => input.value === value), note);

  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    for (const view of ['today', 'calendar', 'memo', 'health', 'memories', 'games', 'schedule', 'birthday', 'trajectory']) {
      await page.goto(`${legacy}#${view}`);
      await readyLegacy();
      await measure(`legacy-${view}-${width}`);
      if (width === 1440) await page.screenshot({ path: path.join(evidence, `legacy-${view}-desktop.png`) });
    }
  }
  await page.goto(`${legacy}#today`);
  await readyLegacy();
  await page.getByRole('button', { name: /^みんなのトークを開く/ }).click();
  await page.getByRole('textbox', { name: 'メッセージ', exact: true }).waitFor();
  await page.getByRole('textbox', { name: 'メッセージ', exact: true }).fill('公開デモのトーク保存を確認');
  await page.getByRole('button', { name: '送る', exact: true }).click();
  await page.getByText('公開デモのトーク保存を確認', { exact: true }).waitFor();
  await page.reload();
  await readyLegacy();
  await page.getByRole('button', { name: /^みんなのトークを開く/ }).click();
  await page.getByText('公開デモのトーク保存を確認', { exact: true }).waitFor();
  const source = await readFile(path.resolve(root, '../couple-sync/src/App.tsx'), 'utf8');
  const ids = [...source.match(/const GAME_IDS: MiniGame\[\] = \[([^\]]+)\]/)[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
  for (const id of ids) {
    await page.goto(`${legacy}#games?play=${id}`);
    await readyLegacy();
    await page.locator('#main-content button').first().waitFor();
    await measure(`game-${id}`);
    const rendered = await page.locator('#root').innerText();
    assert.ok(rendered.trim().length > 5, `${id}: empty game`);
    assert.ok(!/(?:^|\n)たい(?:\s|と|は|に|の|が)/.test(rendered), `${id}: original display name remains`);
    if (id === 'futari-island') {
      await page.locator('canvas').waitFor();
      await page.waitForFunction(() => document.querySelector('canvas')?.toDataURL().length > 10000);
      await page.screenshot({ path: path.join(evidence, 'futari-island.png') });
    }
    if (id === 'othello') await page.screenshot({ path: path.join(evidence, 'othello.png') });
    games.push(id);
    console.log(`Rendered game: ${id}`);
  }
  assert.deepEqual(external, [], 'external network request');
  assert.deepEqual(resourceFailures, [], 'resource failed');
  assert.deepEqual(failures, [], 'runtime error');
  await writeFile(path.join(evidence, 'current-verification.json'), JSON.stringify({ layouts, games, gachaPrize: prize, sharedNotes: true, external, resourceFailures, failures }, null, 2));
  console.log(`PASS: ${games.length} current games; ${layouts.length} layouts; gacha, feeding, decoration, cross-design records; no external requests`);
} catch (error) {
  await page.screenshot({ path: path.join(evidence, 'current-failure.png') });
  await writeFile(path.join(evidence, 'current-failure.json'), JSON.stringify({ url: page.url(), text: await page.locator('#root').innerText().catch(() => ''), failures, external, resourceFailures, layouts, games }, null, 2));
  throw error;
} finally { await browser.close(); }
