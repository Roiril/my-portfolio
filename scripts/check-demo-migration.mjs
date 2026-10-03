import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')] }));
const retiredWorker = await readFile(new URL('../public/demos/cogni-storage/sw.js', import.meta.url), 'utf8');
const scope = '/demos/cogni-storage/';
let retired = false;
const oldWorker = `self.addEventListener('install',e=>e.waitUntil((async()=>{await self.skipWaiting();const c=await caches.open('old-demo');await c.put('${scope}index.html',new Response('<h1>OLD DEMO</h1>',{headers:{'Content-Type':'text/html'}}));const u=await caches.open('unrelated');await u.put('/outside-demo',new Response('KEEP'));})()));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(new URL(e.request.url).pathname==='${scope}index.html')e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});`;
const server = createServer((request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  if (request.url === scope + 'sw.js') {
    response.setHeader('Content-Type', 'text/javascript');
    response.end(retired ? retiredWorker : oldWorker);
  } else {
    response.setHeader('Content-Type', 'text/html');
    response.end('<h1>CURRENT DEMO</h1>');
  }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${server.address().port}${scope}index.html`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);
  await page.evaluate(async () => {
    await navigator.serviceWorker.register('./sw.js');
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  assert.equal(await page.locator('h1').innerText(), 'OLD DEMO', 'calibration: old worker must serve its cached page');
  retired = true;
  await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration.update(); });
  await page.getByRole('heading', { name: 'CURRENT DEMO', exact: true }).waitFor();
  const state = await page.evaluate(async () => ({ registrations: (await navigator.serviceWorker.getRegistrations()).map(registration => registration.scope), keys: await caches.keys(), preserved: await (await caches.match('/outside-demo')).text() }));
  assert.deepEqual(state.registrations, []);
  assert.deepEqual(state.keys, ['unrelated']);
  assert.equal(state.preserved, 'KEEP');
  console.log('PASS: cached old demo replaced, worker unregistered, unrelated cache preserved');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
