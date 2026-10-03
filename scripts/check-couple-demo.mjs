import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const modulePaths = [process.env.CODEX_ARTWORK_MODULES, path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')].filter(Boolean);
const { chromium } = require(require.resolve('playwright', { paths: modulePaths }));
const sharp = require(require.resolve('sharp', { paths: modulePaths }));
const base = process.env.COUPLE_DEMO_BASE ?? 'http://127.0.0.1:3100';
const demo = `${base}/demos/couple-sync/index.html`;
const gallery = path.join(root, 'public/images/works/couple-sync');
const evidence = path.join(root, '.codex/couple-demo-check');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
const privateRequests = [];
const failedLocalResources = [];
const metrics = [];

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].filter(image => image.getBoundingClientRect().width > 0).map(image => image.decode()));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function measure(page, view) {
  const result = await page.evaluate(() => {
    const rect = document.querySelector('dialog[open] .paper-close')?.getBoundingClientRect();
    return {
      width: innerWidth, height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight,
      close: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
      imageFailures: [...document.images].filter(image => image.getBoundingClientRect().width > 0 && (!image.complete || !image.naturalWidth)).length,
    };
  });
  assert.ok(result.scrollWidth <= result.width + 1, `${view}: horizontal overflow`);
  assert.ok(result.scrollHeight <= result.height + 1, `${view}: outer vertical overflow`);
  assert.equal(result.imageFailures, 0, `${view}: missing image`);
  if (result.close) {
    const close = result.close;
    assert.ok(close.x >= 0 && close.y >= 0 && close.x + close.width <= result.width + 1 && close.y + close.height <= result.height + 1, `${view}: close outside viewport`);
    assert.ok(close.width >= 44 && close.height >= 44, `${view}: close target smaller than 44px`);
  }
  metrics.push({ view, ...result });
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, timezoneId: 'Asia/Tokyo', reducedMotion: 'reduce' });
  context.on('page', page => {
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (/supabase\.co|couple-sync-seven|\/api\/shubie/.test(request.url())) privateRequests.push(request.url());
    });
    page.on('response', response => {
      if (response.url().startsWith(base) && response.status() >= 400) failedLocalResources.push({ url: response.url(), status: response.status() });
    });
  });
  const page = await context.newPage();
  await page.clock.install({ time: new Date('2026-10-03T11:30:00+09:00') });
  await page.goto(demo);
  await page.locator('.app').waitFor();
  await page.locator('.room-gacha').waitFor();
  await page.locator('.room-fish:not(:disabled)').waitFor();
  await page.clock.runFor(4500);
  await page.locator('.fish-reward').waitFor({ state: 'hidden' });
  await settle(page);
  await measure(page, 'room');
  await page.screenshot({ path: path.join(gallery, '00-room.png') });

  const screens = [
    ['calendar', '01-calendar.png', '.calendar-records'],
    ['notes', '02-notes.png', '.note-line-input'],
    ['health', '04-health.png', '.health-form'],
    ['memories', '05-memories.png', '.memory-print'],
    ['games', '06-games.png', '.toy-choice'],
  ];
  for (const [view, file] of screens) {
    await page.goto(`${demo}#${view}`);
    await page.locator('dialog[open]').waitFor();
    // Records are loaded asynchronously after the paper is opened.
    if (view === 'notes') await page.locator('.note-line-input').first().waitFor();
    if (view === 'memories') await page.locator('.memory-photo').first().waitFor();
    await settle(page);
    await measure(page, view);
    await page.screenshot({ path: path.join(gallery, file) });
  }

  const gameLinks = await page.locator('.toy-choice').evaluateAll(links => links.map(link => ({ text: link.textContent, href: link.href })));
  assert.ok(gameLinks.length > 0);
  for (const game of gameLinks) assert.ok(game.href.startsWith(`${base}/demos/couple-sync/legacy/`), `${game.text}: outside demo`);
  const popupPromise = context.waitForEvent('page');
  await page.locator('.toy-choice').last().click();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  await popup.locator('#root').waitFor();
  await settle(popup);
  await popup.locator('[class*="_board_"]').first().waitFor();
  await popup.close();

  await page.goto(`${demo}#calendar`);
  await page.locator('dialog[open]').getByRole('link', { name: '旧デザインへ切り替える', exact: true }).click();
  await page.waitForURL('**/legacy/index.html#calendar');
  await page.locator('#root button').first().waitFor();
  await page.locator('#splash').waitFor({ state: 'hidden' });
  await settle(page);
  await page.screenshot({ path: path.join(gallery, '07-legacy.png') });
  await page.getByRole('link', { name: '新デザインへ切り替える', exact: true }).click();
  await page.waitForURL('**/couple-sync/index.html#calendar');
  await page.locator('dialog[open]').waitFor();

  await page.goto(`${demo}#notes`);
  await page.locator('.note-line-input').first().waitFor();
  const note = 'デモの保存確認';
  await page.getByRole('textbox', { name: '新しく書きとめること', exact: true }).fill(note);
  await page.getByRole('button', { name: 'ノートに追加', exact: true }).click();
  await page.waitForFunction(value => [...document.querySelectorAll('.note-line-input')].some(input => input.value === value), note);
  await page.reload();
  await page.waitForFunction(value => [...document.querySelectorAll('.note-line-input')].some(input => input.value === value), note);
  const seededRows = await page.locator('.note-line-input').count();
  await page.reload();
  await page.waitForFunction(value => [...document.querySelectorAll('.note-line-input')].some(input => input.value === value), note);
  assert.equal(await page.locator('.note-line-input').count(), seededRows, 'reload duplicated samples');

  for (const viewport of [{ width: 320, height: 568 }, { width: 375, height: 667 }, { width: 390, height: 460 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    for (const [view] of [[''], ...screens]) {
      await page.goto(`${demo}${view ? `#${view}` : ''}`);
      await settle(page);
      await measure(page, `${view || 'room'}-${viewport.width}x${viewport.height}`);
    }
  }

  const panels = [];
  for (const [file, label] of [['00-room.png', '部屋'], ...screens.map(([view, file]) => [file, view]), ['07-legacy.png', '旧版']]) {
    const bytes = await sharp(path.join(gallery, file)).resize(195, 422).png().toBuffer();
    panels.push({ input: bytes, left: panels.length * 205, top: 0 });
    console.log(`Captured ${label}: ${file}`);
  }
  await sharp({ create: { width: panels.length * 205, height: 422, channels: 3, background: '#eee8dc' } }).composite(panels).png().toFile(path.join(evidence, 'gallery-contact-sheet.png'));
  assert.deepEqual(privateRequests, [], 'private/backend request');
  assert.deepEqual(failedLocalResources, [], 'local resource failed');
  assert.deepEqual(errors, [], 'browser runtime error');
  await writeFile(path.join(evidence, 'verification.json'), `${JSON.stringify({ metrics, gameLinks, persistence: true, privateRequests, failedLocalResources, errors }, null, 2)}\n`);
  console.log(`PASS: ${metrics.length} layouts, design round trip, local game, note persistence, no private requests`);
  await context.close();
} finally {
  await browser.close();
}
