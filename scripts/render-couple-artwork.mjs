// Render the artwork source. Uses the desktop's bundled browser/image libraries.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { homedir } from 'node:os';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const root = fileURLToPath(new URL('..', import.meta.url));
const require = createRequire(import.meta.url);
const modulePaths = [process.env.CODEX_ARTWORK_MODULES, path.join(homedir(), '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules')].filter(Boolean);
const { chromium } = require(require.resolve('playwright', { paths: modulePaths }));
const sharp = require(require.resolve('sharp', { paths: modulePaths }));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, 'scripts/artwork/couple-sync.html')).href);
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(image => image.decode()));
  });
  const output = path.join(root, 'public/images/couple-sync-v2.png');
  const bitmap = await page.screenshot();
  await sharp(bitmap).png({ compressionLevel: 9, palette: true, quality: 95 }).toFile(output);
  const previewDirectory = path.join(root, '.codex/couple-demo-check');
  await mkdir(previewDirectory, { recursive: true });
  await sharp(bitmap).resize(480, 300).png().toFile(path.join(previewDirectory, 'thumbnail-small.png'));
  console.log(`Rendered ${output} (1600 x 1000)`);
} finally {
  await browser.close();
}
