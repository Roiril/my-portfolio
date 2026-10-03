import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')] }));
const base = process.env.PORTFOLIO_DEMO_BASE ?? 'http://127.0.0.1:3100';
const evidence = path.resolve(import.meta.dirname, '../.codex/couple-demo-check');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const failures = [];
  page.on('pageerror', error => failures.push(error.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(base);
    const thumbnail = page.locator('img[src*="couple-sync-v2"]').first();
    await thumbnail.scrollIntoViewIfNeeded();
    await thumbnail.evaluate(image => image.decode());
    await thumbnail.screenshot({ path: path.join(evidence, `portfolio-thumbnail-${width}.png`) });
    await page.goto(`${base}/works/couple-sync`);
    await page.getByRole('heading', { name: 'couple-sync', exact: true }).waitFor();
    await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].filter(image => image.getBoundingClientRect().y < innerHeight).map(image => image.decode())); });
    await page.screenshot({ path: path.join(evidence, `portfolio-couple-${width}.png`) });
    const couplePopup = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'アプリのデモを見る', exact: true }).click();
    const couple = await couplePopup;
    await couple.waitForURL('**/demos/couple-sync/index.html');
    await couple.getByRole('button', { name: 'ガチャガチャを開く', exact: true }).waitFor();
    await couple.close();
    await page.goto(`${base}/works/cogni-storage`);
    const cogniPopup = page.waitForEvent('popup');
    await page.getByRole('link', { name: 'UIデモ', exact: true }).click();
    const cogni = await cogniPopup;
    await cogni.waitForURL('**/demos/cogni-storage/index.html');
    await cogni.getByText('TOUCH TO START', { exact: true }).waitFor();
    await cogni.close();
  }
  assert.deepEqual(failures, []);
  console.log('PASS: portfolio links open current demos at mobile and desktop widths; current thumbnail decodes');
} finally { await browser.close(); }
