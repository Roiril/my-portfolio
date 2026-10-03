import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const modulePath = path.join(import.meta.dirname, 'local-backend.mjs');

function findPlaywright() {
  try {
    require.resolve('fake-indexeddb');
    return null;
  } catch {
    // The project deliberately has no test-only dependency. Use the bundled browser runtime.
  }

  const roots = [
    path.join(os.homedir(), '.cache', 'codex-runtimes', 'codex-primary-runtime', 'dependencies', 'node', 'node_modules', 'playwright-core'),
  ];
  const cuaRoot = path.join(os.homedir(), 'AppData', 'Local', 'OpenAI', 'Codex', 'runtimes', 'cua_node');
  if (existsSync(cuaRoot)) {
    for (const version of readdirSync(cuaRoot)) roots.push(path.join(cuaRoot, version, 'bin', 'node_modules', 'playwright-core'));
  }
  const found = roots.find(candidate => existsSync(path.join(candidate, 'package.json')));
  if (!found) throw new Error('Bundled playwright-core was not found');
  return require(found);
}

function findChrome() {
  const candidates = [
    path.join(process.env.ProgramFiles ?? 'C:\\Program Files', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(process.env['ProgramFiles(x86)'] ?? 'C:\\Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe'),
    path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  ];
  const found = candidates.find(existsSync);
  if (!found) throw new Error('Chrome was not found');
  return found;
}

const server = createServer((request, response) => {
  if (request.url === '/local-backend.mjs') {
    response.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' });
    response.end(readFileSync(modulePath));
    return;
  }
  response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  response.end('<!doctype html><meta charset="utf-8"><title>local backend test</title>');
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

const playwright = findPlaywright();
const browser = await playwright.chromium.launch({ executablePath: findChrome(), headless: true });

try {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  const report = await page.evaluate(async token => {
    const { createDemoClient } = await import('/local-backend.mjs');
    const namespace = `test-${token}`;
    const seed = { notes: [{ id: 'seed', body: 'original', created_at: 10, updated_at: 10, field_meta: { body: 10 } }] };
    const first = createDemoClient(namespace, seed);
    await first.ready;

    const seeded = await first.from('notes').select('*').single();
    if (seeded.error || seeded.data.body !== 'original' || seeded.data.server_version !== 1) throw new Error('seed failed');

    const inserted = await first.from('notes').insert({ id: 'two', body: 'second', created_at: 20, updated_at: 20 }).select().single();
    if (inserted.error || inserted.data.server_version <= seeded.data.server_version) throw new Error('insert/version failed');

    await first.from('shubie_replies').insert({ id: 'default-insert', content: 'visible insert' });
    await first.from('shubie_replies').upsert({ id: 'default-upsert', content: 'visible upsert' });
    const visibleDefaults = await first.from('shubie_replies').select('id').in('id', ['default-insert', 'default-upsert']).eq('is_deleted', false);
    if (visibleDefaults.error || visibleDefaults.data.length !== 2) throw new Error('is_deleted write default failed');
    await first.from('shubie_replies').update({ is_deleted: true }).eq('id', 'default-upsert');
    await first.from('shubie_replies').upsert({ id: 'default-upsert', content: 'still deleted' });
    const stayedDeleted = await first.from('shubie_replies').select('is_deleted').eq('id', 'default-upsert').single();
    const incorrectlyRevived = await first.from('shubie_replies').select('id').eq('id', 'default-upsert').eq('is_deleted', false);
    if (stayedDeleted.error || stayedDeleted.data.is_deleted !== true || incorrectlyRevived.data.length !== 0) throw new Error('is_deleted existing value was replaced by default');

    const updated = await first.from('notes').update({ body: 'changed' }).eq('id', 'seed').select('id, body, created_at, updated_at, field_meta, server_version').single();
    if (updated.error || updated.data.created_at !== 10 || updated.data.updated_at !== 10 || updated.data.field_meta.body !== 10) throw new Error('update preservation failed');

    const filtered = await first.from('notes').select('id, body', { count: 'exact' }).in('id', ['seed', 'two']).neq('body', 'missing').gte('created_at', 10).order('created_at', { ascending: false }).range(0, 0);
    if (filtered.error || filtered.count !== 2 || filtered.data.length !== 1 || filtered.data[0].id !== 'two') throw new Error('filter/order/range failed');

    await first.from('notes').delete().eq('id', 'seed');
    const reopened = createDemoClient(namespace, seed);
    await reopened.ready;
    const removedSeed = await reopened.from('notes').select('*').eq('id', 'seed');
    if (removedSeed.data.length !== 0) throw new Error('seed resurrection detected');
    const shared = await reopened.from('notes').select('*').eq('id', 'two').maybeSingle();
    if (shared.error || shared.data.body !== 'second') throw new Error('shared namespace failed');

    const isolated = createDemoClient(`${namespace}-isolated`, { notes: [{ id: 'other', body: 'isolated' }] });
    await isolated.ready;
    const isolatedRows = await isolated.from('notes').select('*');
    if (isolatedRows.data.length !== 1 || isolatedRows.data[0].id !== 'other') throw new Error('namespace isolation failed');

    const realtime = [];
    const channel = reopened.channel('notes-test').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notes', filter: 'id=eq.live' }, payload => realtime.push(payload.new.body)).subscribe();
    await new Promise(resolve => setTimeout(resolve, 0));
    await first.from('notes').insert({ id: 'live', body: 'event' });
    await new Promise(resolve => setTimeout(resolve, 25));
    if (realtime.join(',') !== 'event') throw new Error('realtime failed');
    await reopened.removeChannel(channel);

    const positions = [];
    const liveA = first.channel('island_live', { config: { broadcast: { self: false }, presence: { key: 'tai' } } })
      .on('broadcast', { event: 'pos' }, ({ payload }) => positions.push(payload.x))
      .on('presence', { event: 'sync' }, () => {})
      .subscribe();
    const liveB = reopened.channel('island_live', { config: { broadcast: { self: false }, presence: { key: 'hina' } } })
      .on('broadcast', { event: 'pos' }, ({ payload }) => positions.push(payload.x))
      .on('presence', { event: 'sync' }, () => {})
      .subscribe();
    await liveA.track({ user: 'tai', at: 1 });
    await liveB.track({ user: 'hina', at: 2 });
    await new Promise(resolve => setTimeout(resolve, 25));
    await liveA.send({ type: 'broadcast', event: 'pos', payload: { x: 7 } });
    await new Promise(resolve => setTimeout(resolve, 25));
    const presence = liveA.presenceState();
    if (!presence.tai?.length || !presence.hina?.length || positions.join(',') !== '7') throw new Error('broadcast/presence failed');
    await first.removeChannel(liveA);
    await reopened.removeChannel(liveB);

    const player = { user_id: 'tai', bells: 400, pocket: [], x: 1, y: 2, state: { day: 1 }, updated_at: 100 };
    const savedPlayer = await first.rpc('island_save_player', { p: player });
    const olderPlayer = await first.rpc('island_save_player', { p: { ...player, bells: 1, updated_at: 50 } });
    if (savedPlayer.error || olderPlayer.data.row.bells !== 400) throw new Error('player LWW failed');

    const objects = await first.rpc('island_upsert_objects', { p: [
      { id: 'tree', kind: 'tree', x: 1, y: 1, variant: '', is_deleted: false, updated_at: 100 },
      { id: 'tree', kind: 'tree', x: 9, y: 9, variant: '', is_deleted: false, updated_at: 90 },
    ] });
    if (objects.error || objects.data.rows[0].x !== 1) throw new Error('object LWW failed');

    await Promise.all([
      first.rpc('island_contribute', { p_project: 'bridge', p_items: { wood: 2 }, p_bells: 10 }),
      reopened.rpc('island_contribute', { p_project: 'bridge', p_items: { wood: 3 }, p_bells: 15 }),
    ]);
    const projectRows = await first.from('island_projects').select('*').eq('id', 'bridge').single();
    const itemRows = await first.from('island_project_items').select('*').match({ project_id: 'bridge', item_id: 'wood' }).single();
    if (projectRows.data.bells !== 25 || itemRows.data.count !== 5) throw new Error('atomic contribution failed');

    const completion = await first.rpc('island_complete_project', { p_project: 'bridge', p_user: 'tai' });
    const completionAgain = await reopened.rpc('island_complete_project', { p_project: 'bridge', p_user: 'hina' });
    if (!completion.data.won || completionAgain.data.won || completionAgain.data.project.completed_by !== 'tai') throw new Error('project completion failed');

    const dex = await first.rpc('island_dex_add', { p_items: ['wood', 'wood', 'fish'], p_user: 'tai' });
    const dexAgain = await reopened.rpc('island_dex_add', { p_items: ['wood'], p_user: 'hina' });
    if (dex.data.first.length !== 2 || dexAgain.data.first.length !== 0) throw new Error('dex failed');

    const bootstrap = await reopened.rpc('island_bootstrap', { p_user: 'tai' });
    if (bootstrap.error || bootstrap.data.player.bells !== 400 || bootstrap.data.objects.length !== 1 || bootstrap.data.projects.length !== 1) throw new Error('bootstrap failed');

    const upload = await first.storage.from('memory-photos').upload('test.txt', new Blob(['hello'], { type: 'text/plain' }), { upsert: true });
    if (upload.error) throw new Error('storage upload failed');
    const storageReload = createDemoClient(namespace);
    await storageReload.ready;
    const publicUrl = storageReload.storage.from('memory-photos').getPublicUrl('test.txt').data.publicUrl;
    if (publicUrl !== 'data:text/plain;base64,aGVsbG8=') throw new Error('storage reload failed');
    await storageReload.storage.from('memory-photos').remove(['test.txt']);

    return { versions: [seeded.data.server_version, inserted.data.server_version, updated.data.server_version], rpc: 'ok', storage: 'ok' };
  }, `${Date.now()}-${Math.random()}`);

  assert.deepEqual(report.rpc, 'ok');
  assert.deepEqual(report.storage, 'ok');
  assert.ok(report.versions[0] < report.versions[1] && report.versions[1] < report.versions[2]);
  console.log(`local-backend: PASS ${JSON.stringify(report)}`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
