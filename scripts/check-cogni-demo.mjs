import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const repoRoot = path.resolve(import.meta.dirname, '..');
const require = createRequire(import.meta.url);
const runtimeModules = path.join(
  os.homedir(),
  '.cache',
  'codex-runtimes',
  'codex-primary-runtime',
  'dependencies',
  'node',
  'node_modules',
);
const { chromium } = require(require.resolve('playwright', { paths: [runtimeModules] }));
const base = process.env.COGNI_DEMO_BASE ?? 'http://127.0.0.1:3100';
const demoUrl = `${base}/demos/cogni-storage/index.html`;
const evidenceRoot = path.join(repoRoot, '.codex', 'couple-demo-check');
const evidencePath = path.join(evidenceRoot, 'cogni-verification.json');
const galleryRoot = path.join(repoRoot, 'public', 'images', 'works', 'cogni-storage');
const expectedOrigin = new URL(base).origin;

await mkdir(evidenceRoot, { recursive: true });
await mkdir(galleryRoot, { recursive: true });

const report = {
  status: 'RUNNING',
  demoUrl,
  viewports: [],
  persistence: null,
  requests: [],
  webSockets: [],
  responses: [],
  requestFailures: [],
  failedResources: [],
  pageErrors: [],
  consoleErrors: [],
  screenshots: [],
  csp: null,
  layoutFailures: [],
};

function attachObservers(page, viewportName) {
  page.on('pageerror', error => report.pageErrors.push({ viewport: viewportName, message: error.message }));
  page.on('console', message => {
    if (message.type() === 'error') report.consoleErrors.push({ viewport: viewportName, message: message.text() });
  });
  page.on('request', request => {
    report.requests.push({
      viewport: viewportName,
      method: request.method(),
      resourceType: request.resourceType(),
      url: request.url(),
    });
  });
  page.on('response', response => {
    const request = response.request();
    const entry = {
      viewport: viewportName,
      status: response.status(),
      resourceType: request.resourceType(),
      url: response.url(),
    };
    report.responses.push(entry);
    if (response.status() >= 400) report.failedResources.push(entry);
  });
  page.on('requestfailed', request => {
    report.requestFailures.push({
      viewport: viewportName,
      resourceType: request.resourceType(),
      url: request.url(),
      error: request.failure()?.errorText ?? 'unknown',
    });
  });
  page.on('websocket', socket => report.webSockets.push({ viewport: viewportName, url: socket.url() }));
}

async function settle(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter(image => image.getBoundingClientRect().width > 0)
        .map(image => image.decode()),
    );
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function waitForSeed(page, kind) {
  const fixtures = {
    ideas: ['机の上の物を並べ替える動作を、考えの整理に使えないか。', '昨日の記録から一つだけ問いを返す仕組みを試す。'],
    themes: ['身近な道具との対話', '振り返りを支える学習記録'],
    papers: ['触れて考えるインタフェースの試作', '短い問いによる学習記録の再訪支援'],
    readings: ['日常の振り返りを支えるタンジブル・インタラクション', '個人の学習記録を再訪するための問いかけ'],
  };
  for (const text of fixtures[kind]) await page.getByText(text, { exact: true }).waitFor();
  return fixtures[kind].length;
}

async function switchView(page, label) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await page.waitForFunction(
    expected => document.querySelector(`button[aria-label="${expected}"]`)?.getAttribute('aria-current') === 'page',
    label,
  );
}

async function assertControlInViewport(page, name, locator) {
  const target = locator.first();
  await target.waitFor({ state: 'visible' });
  await target.scrollIntoViewIfNeeded();
  const box = await target.boundingBox();
  assert.ok(box, `${name}: missing control bounds`);
  const viewport = page.viewportSize();
  assert.ok(viewport, `${name}: missing viewport`);
  if (box.x < -1 || box.x + box.width > viewport.width + 1) {
    report.layoutFailures.push({ name, issue: 'control outside horizontal viewport', box, viewport });
  }
  if (box.y < -1 || box.y + box.height > viewport.height + 1) {
    report.layoutFailures.push({ name, issue: 'control outside vertical viewport', box, viewport });
  }
  return box;
}

async function measure(page, viewportName, view, controls) {
  await settle(page);
  const layout = await page.evaluate(() => ({
    width: innerWidth,
    height: innerHeight,
    documentScrollWidth: document.documentElement.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    imageFailures: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).length,
    overflowElements: [...document.body.querySelectorAll('*')]
      .map(element => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === 'string' ? element.className : '',
          ariaLabel: element.getAttribute('aria-label'),
          text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
          left: rect.left,
          right: rect.right,
          width: rect.width,
        };
      })
      .filter(element => element.left < -1 || element.right > innerWidth + 1)
      .slice(0, 20),
  }));
  if (layout.documentScrollWidth > layout.width + 1 || layout.bodyScrollWidth > layout.width + 1) {
    report.layoutFailures.push({
      name: `${viewportName}/${view}`,
      issue: 'horizontal overflow',
      viewportWidth: layout.width,
      documentScrollWidth: layout.documentScrollWidth,
      bodyScrollWidth: layout.bodyScrollWidth,
      overflowElements: layout.overflowElements,
    });
  }
  if (layout.imageFailures > 0) {
    report.layoutFailures.push({ name: `${viewportName}/${view}`, issue: 'image failed to load', count: layout.imageFailures });
  }

  const boxes = {};
  for (const [name, locator] of controls) boxes[name] = await assertControlInViewport(page, `${viewportName}/${view}/${name}`, locator);
  report.viewports.push({ viewport: viewportName, view, ...layout, controls: boxes });
}

async function screenshot(page, filename) {
  const output = path.join(evidenceRoot, filename);
  await page.screenshot({ path: output, fullPage: false });
  report.screenshots.push(output);
}

async function galleryScreenshot(page, filename) {
  const output = path.join(galleryRoot, filename);
  await page.screenshot({ path: output, fullPage: false });
  report.screenshots.push(output);
}

async function walkthrough(browser, viewport, { persistence = false, screenshots = false } = {}) {
  const viewportName = `${viewport.width}x${viewport.height}`;
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: viewport.width <= 390 ? 2 : 1,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  attachObservers(page, viewportName);

  try {
    await page.goto(demoUrl, { waitUntil: 'domcontentloaded' });
    await page.getByText('TOUCH TO START', { exact: true }).waitFor();
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
    assert.ok(csp?.includes("connect-src 'none'"), `${viewportName}: CSP does not disable connections`);
    report.csp ??= csp;
    await measure(page, viewportName, 'home', [
      ['start', page.getByText('TOUCH TO START', { exact: true })],
      ['ideas jump', page.getByRole('button', { name: 'ideas', exact: true })],
      ['research jump', page.getByRole('button', { name: '研究の庭', exact: true })],
    ]);
    if (screenshots) await screenshot(page, `cogni-${viewport.width}-home.png`);
    if (viewport.width === 390) await galleryScreenshot(page, '01-home.png');

    await page.getByRole('button', { name: 'ideas', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('button[aria-label="Ideas"]')?.getAttribute('aria-current') === 'page');
    const ideaSeeds = await waitForSeed(page, 'ideas');
    assert.ok(await page.getByRole('button', { name: /^Open thought:/ }).count() >= 2, `${viewportName}: fewer than two idea cards`);
    await measure(page, viewportName, 'ideas', [
      ['search', page.getByRole('textbox', { name: 'Search', exact: true })],
      ['themes nav', page.getByRole('button', { name: 'Themes', exact: true })],
      ['new idea', page.getByRole('button', { name: '+ Idea', exact: true })],
    ]);
    if (screenshots) await screenshot(page, `cogni-${viewport.width}-ideas.png`);
    if (viewport.width === 390) await galleryScreenshot(page, '02-ideas.png');

    await switchView(page, 'Themes');
    const themeSeeds = await waitForSeed(page, 'themes');
    assert.ok(await page.getByRole('button', { name: /^Open theme:/ }).count() >= 2, `${viewportName}: fewer than two theme cards`);
    await measure(page, viewportName, 'themes', [
      ['papers nav', page.getByRole('button', { name: 'Papers', exact: true })],
      ['new theme', page.getByRole('button', { name: '+ Theme', exact: true })],
    ]);
    if (viewport.width === 390) await galleryScreenshot(page, '03-themes.png');

    await switchView(page, 'Papers');
    const paperSeeds = await waitForSeed(page, 'papers');
    assert.ok(await page.getByRole('button', { name: /^Open paper:/ }).count() >= 2, `${viewportName}: fewer than two paper cards`);
    await measure(page, viewportName, 'papers', [
      ['readings nav', page.getByRole('button', { name: 'Readings', exact: true })],
      ['new paper', page.getByRole('button', { name: '+ Paper', exact: true })],
    ]);
    if (viewport.width === 390) await galleryScreenshot(page, '04-papers.png');

    await switchView(page, 'Readings');
    const readingSeeds = await waitForSeed(page, 'readings');
    assert.ok(await page.getByRole('button', { name: /^Open reading:/ }).count() >= 2, `${viewportName}: fewer than two reading cards`);
    await measure(page, viewportName, 'readings', [
      ['garden', page.getByRole('button', { name: '研究の庭へ', exact: true })],
      ['new reading', page.getByRole('button', { name: '+ Reading', exact: true })],
    ]);
    if (viewport.width === 390) await galleryScreenshot(page, '05-readings.png');

    await page.getByRole('button', { name: '研究の庭へ', exact: true }).click();
    await page.getByRole('heading', { name: '研究の庭', exact: true }).waitFor();
    await page.getByText('触れて整理するノート', { exact: true }).first().waitFor();
    await measure(page, viewportName, 'research', [
      ['cogni', page.getByRole('button', { name: 'COGNI →', exact: true })],
      ['project', page.getByRole('button', { name: /触れて整理するノート/ }).first()],
    ]);

    await page.getByRole('button', { name: /触れて整理するノート/ }).first().click();
    await page.getByText('観察メモの観点', { exact: true }).waitFor();
    await measure(page, viewportName, 'research project', [
      ['back to garden', page.getByRole('button', { name: '← 庭へ', exact: true })],
      ['reference', page.getByRole('button', { name: '観察メモの観点', exact: true })],
    ]);
    await page.getByRole('button', { name: '観察メモの観点', exact: true }).click();
    await page.getByRole('heading', { name: '観察メモの観点', exact: true }).waitFor();
    await measure(page, viewportName, 'research reference', [
      ['back to project', page.getByRole('button', { name: '← 戻る', exact: true })],
    ]);
    if (screenshots) await screenshot(page, `cogni-${viewport.width}-research.png`);

    await page.getByRole('button', { name: '← 戻る', exact: true }).click();
    await page.getByRole('button', { name: '← 庭へ', exact: true }).click();
    await page.getByRole('button', { name: 'COGNI →', exact: true }).click();
    await waitForSeed(page, 'ideas');

    if (persistence) {
      const savedText = `デモ保存確認 ${Date.now()}`;
      await page.getByRole('button', { name: '+ Idea', exact: true }).click();
      const editor = page.getByRole('textbox', { name: 'Thought content', exact: true });
      await editor.waitFor();
      await editor.fill(savedText);
      await editor.blur();
      await page.waitForTimeout(1600);
      const expandedEditor = editor.locator('xpath=ancestor::div[.//button[contains(normalize-space(.), "Back")]][1]');
      await expandedEditor.getByRole('button', { name: /Back/ }).click();
      await page.getByText(savedText, { exact: true }).waitFor();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.getByText(savedText, { exact: true }).waitFor();
      const savedCount = await page.getByText(savedText, { exact: true }).count();
      assert.equal(savedCount, 1, `${viewportName}: saved idea was duplicated after reload`);
      const reloadedCards = await page.getByRole('button', { name: /^Open thought:/ }).count();
      assert.ok(reloadedCards >= ideaSeeds + 1, `${viewportName}: saved idea missing after reload`);
      report.persistence = { viewport: viewportName, savedText, savedCount, reloadedCards, passed: true };
    }

    return { viewport: viewportName, seeds: { ideas: ideaSeeds, themes: themeSeeds, papers: paperSeeds, readings: readingSeeds } };
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
let failure;

try {
  report.walkthroughs = [];
  report.walkthroughs.push(await walkthrough(browser, { width: 390, height: 844 }, { persistence: true, screenshots: true }));
  report.walkthroughs.push(await walkthrough(browser, { width: 320, height: 568 }, { screenshots: true }));
  report.walkthroughs.push(await walkthrough(browser, { width: 1440, height: 900 }, { screenshots: true }));

  const externalRequests = report.requests.filter(entry => {
    const url = new URL(entry.url);
    return (url.protocol === 'http:' || url.protocol === 'https:') && url.origin !== expectedOrigin;
  });
  const externalSockets = report.webSockets.filter(entry => {
    const url = new URL(entry.url);
    return url.host !== new URL(base).host;
  });
  assert.deepEqual(externalRequests, [], 'external HTTP request detected');
  assert.deepEqual(externalSockets, [], 'external WebSocket detected');
  assert.deepEqual(report.failedResources, [], 'HTTP resource returned 4xx/5xx');
  assert.deepEqual(report.pageErrors, [], 'browser pageerror detected');

  const successfulUrls = new Set(report.responses.filter(entry => entry.status < 400).map(entry => entry.url));
  for (const asset of [
    '/demos/cogni-storage/fonts/Rakkas-Regular.ttf',
    '/demos/cogni-storage/sounds/GadeTel.mp3',
    '/demos/cogni-storage/sounds/TitleTouch.mp3',
  ]) {
    assert.ok([...successfulUrls].some(url => url.startsWith(`${base}${asset}`)), `asset was not loaded successfully: ${asset}`);
  }
  assert.equal(report.persistence?.passed, true, 'reload persistence was not verified');
  if (report.layoutFailures.length > 0) {
    const summary = report.layoutFailures
      .map(entry => `${entry.name}: body ${entry.bodyScrollWidth ?? 'n/a'}px / viewport ${entry.viewportWidth ?? 'n/a'}px`)
      .join('; ');
    throw new Error(`layout verification failed: ${summary}`);
  }
  report.status = 'PASS';
} catch (error) {
  failure = error;
  report.status = 'FAIL';
  report.failure = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : String(error);
} finally {
  await browser.close();
  await writeFile(evidencePath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

if (failure) throw failure;
console.log(`PASS: ${report.viewports.length} layouts, 3 viewport walkthroughs, seed rendering, reload persistence, zero external HTTP/WS requests`);
console.log(`Evidence: ${evidencePath}`);
