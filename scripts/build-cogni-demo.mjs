import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  access,
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const repoRoot = path.resolve(import.meta.dirname, '..');
const sourceRoot = path.join(os.homedir(), 'Projects', 'Web', 'cogni-storage');
const demoRoot = path.join(repoRoot, '.demo-src');
const templatesRoot = path.join(repoRoot, 'scripts', 'demo');
const destination = path.join(repoRoot, 'public', 'demos', 'cogni-storage');
const localBackend = path.join(templatesRoot, 'local-backend.mjs');
const fixtureModule = path.join(templatesRoot, 'cogni-fixtures.mjs');
const manifestPath = path.join(templatesRoot, 'cogni-manifest.json');
const expectedCommit = '504ed6300ba03cae375ec0404f7ca25687fcabe8';
const base = '/demos/cogni-storage/';
const privateUserLabel = '\u305f\u3044\u305b\u3044';

const copiedPublicFiles = [
  ['icon.svg'],
  ['fonts', 'Rakkas-Regular.ttf'],
  ['sounds', 'GadeTel.mp3'],
  ['sounds', 'TitleTouch.mp3'],
];

const appliedTransforms = [
  'Supabase client replaced with the local demo client and fictional seed rows',
  'IndexedDB namespace isolated as cogni-portfolio-demo-v2',
  'research workspace imports replaced with fictional projects and references',
  'praise requests handled by the existing local praise generator',
  'personal labels and fixed conversation identifiers anonymized',
  'PWA registration and update UI disabled',
  'font and sound URLs rebased to the portfolio demo path',
  'remote font links removed and restrictive noindex CSP added',
  'public assets restricted to the files used by the current interface',
  'narrow-screen search and navigation kept within the viewport',
  'previously installed demo workers retired without affecting other scopes',
];

function normalize(value) {
  return value.split(path.sep).join('/');
}

function replaceExactly(source, search, replacement, file) {
  const matches = source.split(search).length - 1;
  if (matches !== 1) throw new Error(`${file}: expected one transform target, found ${matches}`);
  return source.replace(search, replacement);
}

function assertWithin(target, parent, label) {
  const relative = path.relative(path.resolve(parent), path.resolve(target));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`Refusing ${label} outside its expected parent: ${target}`);
  }
}

async function requireFile(file, label) {
  try {
    if (!(await stat(file)).isFile()) throw new Error('not a file');
  } catch {
    throw new Error(`${label} is missing: ${file}`);
  }
}

async function requireDirectory(directory, label) {
  try {
    if (!(await stat(directory)).isDirectory()) throw new Error('not a directory');
  } catch {
    throw new Error(`${label} is missing: ${directory}`);
  }
}

async function importSourceDependency(packageName, entryParts) {
  const entry = path.join(sourceRoot, 'node_modules', packageName, ...entryParts);
  try {
    await access(entry);
  } catch {
    throw new Error(`${packageName} is missing. Install the existing cogni-storage dependencies first: ${entry}`);
  }
  return import(pathToFileURL(entry).href);
}

function sourcePath(id) {
  const clean = id.split('?', 1)[0];
  const relative = path.relative(sourceRoot, clean);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
  return normalize(relative);
}

async function demoPlugin() {
  const researchFixture = await readFile(path.join(templatesRoot, 'cogni-research.ts.txt'), 'utf8');
  const llmFixture = await readFile(path.join(templatesRoot, 'cogni-llm.ts.txt'), 'utf8');

  return {
    name: 'portfolio-cogni-demo',
    enforce: 'pre',
    resolveId(id) {
      if (id === 'virtual:cogni-demo-backend') return localBackend;
      if (id === 'virtual:cogni-demo-fixtures') return fixtureModule;
      return null;
    },
    transform(code, id) {
      const file = sourcePath(id);
      if (!file || file.startsWith('node_modules/')) return null;
      let next = code.replaceAll('\r\n', '\n');
      if (file === 'src/components/IdeaMode.module.css') {
        next += '\n.searchWrapper,.searchInput{min-width:0}.searchInput{width:100%}\n@media(max-width:360px){.navSpacer{width:64px}.navGroupButtons{gap:4px}.navButton,.navButtonActive{min-width:52px;padding-inline:4px}}\n';
      }

      if (file === 'src/supabase.ts') {
        next = [
          "import { createDemoClient } from 'virtual:cogni-demo-backend';",
          "import { cogniSeedRows } from 'virtual:cogni-demo-fixtures';",
          '',
          "export const supabase = createDemoClient('cogni-storage', cogniSeedRows);",
          'await supabase.ready;',
          '',
        ].join('\n');
      }
      if (file === 'src/components/SWUpdater.tsx') {
        next = 'export function SWUpdater() { return null; }\n';
      }
      if (file === 'src/data/research.ts') next = researchFixture;
      if (file === 'src/llm.ts') next = llmFixture;
      if (file === 'src/data/cache.ts') {
        next = replaceExactly(next, "openDB<CogniDB>('cogni-storage', 9", "openDB<CogniDB>('cogni-portfolio-demo-v2', 9", file);
      }
      if (file === 'src/components/HomeScreen.tsx') {
        next = replaceExactly(next, "new Audio('/sounds/TitleTouch.mp3')", "new Audio(`${import.meta.env.BASE_URL}sounds/TitleTouch.mp3`)", file);
        next = replaceExactly(next, 'src="/sounds/GadeTel.mp3"', 'src={`${import.meta.env.BASE_URL}sounds/GadeTel.mp3`}', file);
      }
      if (file === 'src/index.css') {
        next = replaceExactly(next, "url('/fonts/Rakkas-Regular.ttf')", `url('${base}fonts/Rakkas-Regular.ttf')`, file);
      }
      if (file === 'src/local-praise.ts' || file === 'src/praise-context.ts') {
        next = replaceExactly(next, `const userName = '${privateUserLabel}';`, "const userName = '利用者';", file);
      }
      if (file === 'src/components/AiCharacter.tsx') {
        next = replaceExactly(next, `"お待ちしておりましたよ。${privateUserLabel}様。"`, '"お待ちしていました。"', file);
      }
      if (file === 'src/components/IdeaMode.tsx') next = next.replaceAll('トム', 'アシスタント');
      if (file === 'src/components/MascotMini.tsx') next = next.replaceAll('トム', 'アシスタント');
      if (file === 'src/components/ResearchMode.tsx') {
        next = replaceExactly(next, "e.source === 'agent' ? 'シュビー' : '自分'", "e.source === 'agent' ? 'アシスタント' : '利用者'", file);
        next = replaceExactly(
          next,
          '軌跡は workspace/research/&lt;名前&gt;.md に溜まる（シュビーが対話の中で書く）。',
          '架空の研究プロジェクトを表示しています。',
          file,
        );
      }

      return next === code ? null : { code: next, map: null };
    },
    transformIndexHtml(html) {
      let next = html.replaceAll('\r\n', '\n');
      next = replaceExactly(next, '<html lang="en">', '<html lang="ja">', 'index.html');
      next = replaceExactly(next, 'href="/icon.svg"', `href="${base}icon.svg"`, 'index.html');
      next = replaceExactly(next, '  <link rel="preconnect" href="https://fonts.googleapis.com">\n', '', 'index.html');
      next = replaceExactly(next, '  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n', '', 'index.html');
      next = replaceExactly(next, '  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">\n', '', 'index.html');
      const csp = "  <meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'self'; connect-src 'none'; img-src 'self' data: blob:; font-src 'self'; media-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; worker-src 'none'; object-src 'none'; base-uri 'none'; form-action 'self'\" />\n";
      next = replaceExactly(next, '  <meta name="robots" content="noindex, nofollow" />\n', `  <meta name="robots" content="noindex, nofollow, noarchive" />\n${csp}`, 'index.html');
      return next;
    },
  };
}

async function collectFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await collectFiles(absolute));
    else result.push(absolute);
  }
  return result;
}

async function computeSourceHash() {
  const inputs = [
    path.join(sourceRoot, 'index.html'),
    path.join(sourceRoot, 'package.json'),
    ...await collectFiles(path.join(sourceRoot, 'src')),
    ...copiedPublicFiles.map(parts => path.join(sourceRoot, 'public', ...parts)),
  ].sort((a, b) => normalize(a).localeCompare(normalize(b)));
  const hash = createHash('sha256');
  for (const file of inputs) {
    const relative = normalize(path.relative(sourceRoot, file));
    hash.update(`${relative}\0`);
    hash.update(await readFile(file));
    hash.update('\0');
  }
  return hash.digest('hex');
}

async function copyAllowedPublicFiles(outputRoot) {
  for (const parts of copiedPublicFiles) {
    const source = path.join(sourceRoot, 'public', ...parts);
    const target = path.join(outputRoot, ...parts);
    await mkdir(path.dirname(target), { recursive: true });
    await copyFile(source, target);
  }
}

async function verifyOutput(outputRoot, sourceCommit, sourceHash) {
  const files = await collectFiles(outputRoot);
  const relativeFiles = files.map(file => normalize(path.relative(outputRoot, file))).sort();
  const allowed = [
    /^index\.html$/u,
    /^sw\.js$/u,
    /^icon\.svg$/u,
    /^fonts\/Rakkas-Regular\.ttf$/u,
    /^sounds\/(?:GadeTel|TitleTouch)\.mp3$/u,
    /^assets\/[\w.-]+\.(?:js|css)$/u,
  ];
  for (const file of relativeFiles) {
    if (!allowed.some(pattern => pattern.test(file))) {
      throw new Error(`Generated demo contains a file outside the publish allowlist: ${file}`);
    }
  }

  const textFiles = files.filter(file => /\.(?:html|css|js|svg)$/u.test(file));
  const text = (await Promise.all(textFiles.map(file => readFile(file, 'utf8')))).join('\n');
  const forbidden = [
    'supabase.co',
    'eyJhbGciOi',
    'VITE_SUPABASE',
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'virtual:pwa-register',
    'serviceWorker.register',
    'workspace/research/',
    'cogni-praise-',
    privateUserLabel,
    'シュビー',
    'トム',
  ];
  for (const value of forbidden) {
    if (text.includes(value)) throw new Error(`Published demo contains forbidden source or endpoint marker: ${value}`);
  }
  if (!text.includes("connect-src 'none'")) throw new Error('Published demo CSP does not disable network connections');
  if (!text.includes('noindex, nofollow, noarchive')) throw new Error('Published demo is missing noindex metadata');
  if (!text.includes(`${base}sounds/TitleTouch.mp3`) || !text.includes(`${base}sounds/GadeTel.mp3`)) {
    throw new Error('Published demo sound URLs were not rebased');
  }
  if (!text.includes(`${base}icon.svg`)) throw new Error('Published demo icon URL was not rebased');
  if (!text.includes('cogni-portfolio-demo-v2')) throw new Error('Published demo IndexedDB namespace was not isolated');
  if (!text.includes('demo-theme-tangible-dialogue') || !text.includes('demo-paper-tangible-reflection')) {
    throw new Error('Published demo seed relationships are missing');
  }
  if (!text.includes('demo-tangible-notes')) throw new Error('Published demo research fixture is missing');

  console.log(`Verified ${relativeFiles.length} generated files against the Cogni demo allowlist`);
  return {
    source: 'cogni-storage',
    sourceCommit,
    sourceHash: `sha256:${sourceHash}`,
    base,
    copiedPublicFiles: copiedPublicFiles.map(parts => parts.join('/')),
    appliedTransforms,
  };
}

await requireDirectory(sourceRoot, 'cogni-storage source');
await requireDirectory(templatesRoot, 'demo templates');
await requireFile(localBackend, 'shared local demo backend');
await requireFile(fixtureModule, 'Cogni seed fixture');

const sourceCommit = execFileSync('git', ['-C', sourceRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
if (sourceCommit !== expectedCommit) {
  throw new Error(`Unexpected cogni-storage commit: ${sourceCommit} (expected ${expectedCommit})`);
}
const sourceHash = await computeSourceHash();

await mkdir(demoRoot, { recursive: true });
const temporary = await mkdtemp(path.join(demoRoot, 'cogni-storage-build-'));
assertWithin(temporary, demoRoot, 'temporary build cleanup');

try {
  const output = path.join(temporary, 'dist');
  const vite = await importSourceDependency('vite', ['dist', 'node', 'index.js']);
  const reactModule = await importSourceDependency('@vitejs', ['plugin-react', 'dist', 'index.js']);
  const react = reactModule.default;

  await vite.build({
    configFile: false,
    root: sourceRoot,
    base,
    publicDir: false,
    envDir: false,
    plugins: [await demoPlugin(), react()],
    build: {
      outDir: output,
      emptyOutDir: true,
      sourcemap: false,
    },
  });

  await copyAllowedPublicFiles(output);
  await copyFile(path.join(templatesRoot, 'retire-cogni-worker.js'), path.join(output, 'sw.js'));
  const manifest = await verifyOutput(output, sourceCommit, sourceHash);

  const expectedDestination = path.join(repoRoot, 'public', 'demos', 'cogni-storage');
  if (path.resolve(destination) !== path.resolve(expectedDestination)) {
    throw new Error(`Refusing unexpected destination: ${destination}`);
  }
  assertWithin(destination, path.join(repoRoot, 'public', 'demos'), 'published demo replacement');
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await rename(output, destination);
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(`Built Cogni demo at ${destination}`);
  console.log(`Source ${sourceCommit} (${sourceHash})`);
} finally {
  assertWithin(temporary, demoRoot, 'temporary build cleanup');
  await rm(temporary, { recursive: true, force: true });
}
