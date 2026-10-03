import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const runtime = process.env.CODEX_ARTWORK_MODULES ?? path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const { chromium } = require(require.resolve('playwright', { paths: [runtime] }));
const base = process.env.PORTFOLIO_DEMO_BASE ?? 'http://127.0.0.1:3100';
const evidence = path.resolve(import.meta.dirname, '../.codex/couple-demo-check');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];
const layouts = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => failures.push(error.message));
  page.on('response', response => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
  await page.goto(`${base}/works/couple-sync`);
  // Calibrate the overflow measurement against an intentional overflow.
  const calibration = await page.evaluate(() => {
    const probe = document.createElement('div');
    probe.id = 'layout-probe';
    probe.style.width = '10000px';
    probe.style.height = '1px';
    document.body.append(probe);
    const overflow = document.documentElement.scrollWidth > innerWidth;
    probe.remove();
    return { overflow, normal: document.documentElement.scrollWidth <= innerWidth + 1 };
  });
  assert.ok(calibration.overflow);
  assert.ok(calibration.normal);

  for (const width of [320, 390, 640, 768, 1024, 1440, 2560]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 1000 });
    await page.goto(`${base}/works/couple-sync`);
    await page.getByRole('heading', { name: 'couple-sync', exact: true }).waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode(); }));
    });
    const measured = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, imageCount: document.querySelectorAll('main img').length }));
    assert.equal(measured.width, width);
    assert.ok(measured.scrollWidth <= width + 1, `Overflow at ${width}: ${measured.scrollWidth}`);
    assert.equal(await page.locator('h1').count(), 1);
    const summary = page.locator('.couple-more-screens summary');
    await summary.focus();
    assert.notEqual(await summary.evaluate(element => getComputedStyle(element).outlineStyle), 'none');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.couple-more-screens').evaluate(element => element.open), true);
    assert.equal(await page.locator('.couple-screen-grid .couple-phone:visible').count(), 3);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('.couple-more-screens').evaluate(element => element.open), false);
    for (const href of await page.locator('.couple-chapters a').evaluateAll(links => links.map(link => link.getAttribute('href')))) {
      assert.equal(await page.locator(href).count(), 1);
    }
    const heroLink = page.locator('.couple-hero .couple-demo-link');
    const linkBounds = await heroLink.boundingBox();
    assert.ok(linkBounds.height >= 44);
    assert.ok(linkBounds.width >= 44);
    for (const selector of ['.couple-hero-copy', '.couple-scenes', '.couple-play-copy', '.couple-engineering', '.couple-try']) {
      assert.ok(await page.locator(selector).evaluate(element => element.scrollWidth <= element.clientWidth + 1), `Clipped text: ${selector} at ${width}`);
    }
    layouts.push(measured);
    if ([390, 1440].includes(width)) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.addStyleTag({ content: 'nextjs-portal { display: none; }' });
      await page.screenshot({ path: path.join(evidence, `couple-detail-${width}.png`), fullPage: true });
      await page.screenshot({ path: path.join(evidence, `couple-detail-hero-${width}.png`) });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/works/couple-sync`);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForURL('**/works/couple-sync#couple-content');
  assert.equal(new URL(page.url()).hash, '#couple-content');
  for (const selector of ['.couple-hero .couple-demo-link', '.couple-try .couple-demo-link']) {
    const popup = page.waitForEvent('popup');
    await page.locator(selector).click();
    const demo = await popup;
    await demo.getByRole('button', { name: 'ガチャガチャを開く', exact: true }).waitFor();
    await demo.close();
  }
  // Confirm that the shared detail template still renders another work.
  await page.goto(`${base}/works/cogni-storage`);
  assert.equal(await page.locator('.work-detail h1').textContent().then(value => value.trim()), 'cogni-storage');
  assert.equal(await page.locator('.couple-case').count(), 0);
  assert.deepEqual(failures, []);
  await writeFile(path.join(evidence, 'couple-detail-verification.json'), JSON.stringify({ layouts, keyboard: 'pass', demoLinks: 2, pageErrors: failures }, null, 2));
  console.log(`PASS: ${layouts.length} widths (320–2560px); images decoded; keyboard gallery and skip link; both demo links; shared template`);
} finally {
  await browser.close();
}
