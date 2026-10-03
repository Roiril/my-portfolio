const DATABASE_PREFIX = 'portfolio-demo-backend-v2-';
const DATABASE_VERSION = 1;
const SEED_MARKER = 'seed-version:1';
const ROW_STORE = 'rows';
const META_STORE = 'metadata';
const BLOB_STORE = 'storage';
const IS_DELETED_DEFAULT_TABLES = new Set([
  'daily_schedules', 'date_infos', 'health_records', 'game_high_scores',
  'timetable_entries', 'date_memories', 'memo_lines',
  'ideas', 'themes', 'papers', 'readings',
  'shubie_posts', 'shubie_replies', 'shubie_buffer_notes',
  'othello_matches', 'island_objects',
]);

const clone = value => value == null ? value : structuredClone(value);
const success = (data = null, count = null) => ({ data, error: null, count });
const failure = message => ({ data: null, error: { message }, count: null });

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('IndexedDB request failed'));
  });
}

function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('IndexedDB transaction failed'));
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
  });
}

function openDatabase(name) {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('The local demo backend requires IndexedDB'));
      return;
    }
    const request = indexedDB.open(name, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(ROW_STORE)) database.createObjectStore(ROW_STORE, { keyPath: 'key' });
      if (!database.objectStoreNames.contains(META_STORE)) database.createObjectStore(META_STORE, { keyPath: 'key' });
      if (!database.objectStoreNames.contains(BLOB_STORE)) database.createObjectStore(BLOB_STORE, { keyPath: 'key' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open the local demo backend'));
  });
}

function primaryColumns(table, row, onConflict) {
  if (onConflict) return String(onConflict).split(',').map(value => value.trim()).filter(Boolean);
  if (table === 'island_project_items') return ['project_id', 'item_id'];
  if (table === 'island_dex') return ['item_id'];
  if (table === 'island_players') return ['user_id'];
  if (table === 'shubie_reads') return ['user_id', 'post_id'];
  if (Object.hasOwn(row, 'id')) return ['id'];
  return [];
}

function rowKey(table, row, onConflict) {
  const columns = primaryColumns(table, row, onConflict);
  if (!columns.length || columns.some(column => row[column] == null)) return null;
  return `${table}\u0000${columns.map(column => JSON.stringify(row[column])).join('\u0001')}`;
}

function rowsFromSeed(seedRows) {
  if (Array.isArray(seedRows)) {
    return seedRows.flatMap(entry => Array.isArray(entry) && entry.length === 2
      ? [{ table: entry[0], row: entry[1] }]
      : []);
  }
  return Object.entries(seedRows ?? {}).flatMap(([table, rows]) =>
    (Array.isArray(rows) ? rows : [rows]).filter(Boolean).map(row => ({ table, row })));
}

function filterMatches(row, filter) {
  const value = row[filter.column];
  switch (filter.operator) {
    case 'eq': return value === filter.value;
    case 'neq': return value !== filter.value;
    case 'in': return filter.value.some(candidate => candidate === value);
    case 'is': return value === filter.value;
    case 'gt': return value > filter.value;
    case 'gte': return value >= filter.value;
    case 'lt': return value < filter.value;
    case 'lte': return value <= filter.value;
    case 'match': return Object.entries(filter.value).every(([key, expected]) => row[key] === expected);
    default: throw new Error(`Unsupported filter operator: ${filter.operator}`);
  }
}

function matchesRealtimeFilter(row, expression) {
  if (!expression) return true;
  const match = /^([^=]+)=eq\.(.*)$/u.exec(expression);
  if (!match) return false;
  return String(row?.[match[1]]) === decodeURIComponent(match[2]);
}

function projectRow(row, columns) {
  if (!columns || columns.trim() === '*') return clone(row);
  const output = {};
  for (const part of columns.split(',')) {
    const column = part.trim();
    if (!column) continue;
    const aliasMatch = /^(\w+):([\w]+)$/u.exec(column);
    if (aliasMatch) output[aliasMatch[1]] = clone(row[aliasMatch[2]]);
    else output[column] = clone(row[column]);
  }
  return output;
}

function compareValues(left, right, ascending, nullsFirst) {
  if (left == null || right == null) {
    if (left == null && right == null) return 0;
    const first = nullsFirst ?? !ascending;
    return left == null ? (first ? -1 : 1) : (first ? 1 : -1);
  }
  if (left === right) return 0;
  const value = left < right ? -1 : 1;
  return ascending ? value : -value;
}

async function blobToDataUrl(blob) {
  if (!(blob instanceof Blob)) throw new TypeError('Storage upload expects a Blob or File');
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return `data:${blob.type || 'application/octet-stream'};base64,${btoa(binary)}`;
}

class QueryBuilder {
  constructor(backend, table) {
    this.backend = backend;
    this.table = table;
    this.operation = 'select';
    this.values = null;
    this.filters = [];
    this.orders = [];
    this.columns = '*';
    this.returning = false;
    this.countMode = null;
    this.head = false;
    this.maxRows = null;
    this.rangeValue = null;
    this.singleMode = null;
    this.onConflict = null;
    this.signal = null;
  }

  select(columns = '*', options = {}) {
    this.columns = columns || '*';
    this.countMode = options.count ?? this.countMode;
    this.head = options.head ?? this.head;
    if (this.operation !== 'select') this.returning = true;
    return this;
  }

  insert(values, options = {}) { this.operation = 'insert'; this.values = values; this.countMode = options.count ?? null; return this; }
  upsert(values, options = {}) { this.operation = 'upsert'; this.values = values; this.onConflict = options.onConflict ?? null; this.countMode = options.count ?? null; return this; }
  update(values, options = {}) { this.operation = 'update'; this.values = values; this.countMode = options.count ?? null; return this; }
  delete(options = {}) { this.operation = 'delete'; this.countMode = options.count ?? null; return this; }
  eq(column, value) { this.filters.push({ operator: 'eq', column, value }); return this; }
  neq(column, value) { this.filters.push({ operator: 'neq', column, value }); return this; }
  in(column, value) { this.filters.push({ operator: 'in', column, value: [...value] }); return this; }
  is(column, value) { this.filters.push({ operator: 'is', column, value }); return this; }
  gt(column, value) { this.filters.push({ operator: 'gt', column, value }); return this; }
  gte(column, value) { this.filters.push({ operator: 'gte', column, value }); return this; }
  lt(column, value) { this.filters.push({ operator: 'lt', column, value }); return this; }
  lte(column, value) { this.filters.push({ operator: 'lte', column, value }); return this; }
  match(values) { this.filters.push({ operator: 'match', value: values }); return this; }
  order(column, options = {}) { this.orders.push({ column, ascending: options.ascending !== false, nullsFirst: options.nullsFirst }); return this; }
  limit(value) { this.maxRows = Math.max(0, Number(value)); return this; }
  range(from, to) { this.rangeValue = [Math.max(0, Number(from)), Math.max(0, Number(to))]; return this; }
  maybeSingle() { this.singleMode = 'maybe'; return this; }
  single() { this.singleMode = 'single'; return this; }
  abortSignal(signal) { this.signal = signal; return this; }
  then(resolve, reject) { return this.execute().then(resolve, reject); }
  catch(reject) { return this.execute().catch(reject); }
  finally(callback) { return this.execute().finally(callback); }

  async execute() {
    try {
      await this.backend.ready;
      if (this.signal?.aborted) return failure('The query was aborted');
      const result = this.operation === 'select'
        ? await this.backend.select(this)
        : await this.backend.mutate(this);
      if (this.singleMode) {
        const list = Array.isArray(result.data) ? result.data : [];
        if (list.length > 1 || (this.singleMode === 'single' && list.length !== 1)) {
          return failure('JSON object requested, multiple (or no) rows returned');
        }
        return { ...result, data: list[0] ?? null };
      }
      return result;
    } catch (error) {
      return failure(error instanceof Error ? error.message : String(error));
    }
  }
}

class DemoChannel {
  constructor(backend, topic, options) {
    this.backend = backend;
    this.topic = topic;
    this.options = options ?? {};
    this.listeners = [];
    this.tracked = null;
    this.closed = false;
  }

  on(type, filter, callback) { this.listeners.push({ type, filter: filter ?? {}, callback }); return this; }

  subscribe(callback) {
    this.backend.channels.add(this);
    queueMicrotask(() => {
      if (this.closed) return;
      callback?.('SUBSCRIBED');
      this.emitPresence('sync');
      this.backend.publish({ kind: 'presence-hello', topic: this.topic });
    });
    return this;
  }

  async send(message) {
    if (this.closed || message?.type !== 'broadcast') return 'error';
    const event = { kind: 'broadcast', topic: this.topic, event: message.event, payload: clone(message.payload), sender: this.backend.instanceId };
    this.backend.dispatch(event, this.options?.config?.broadcast?.self !== false);
    this.backend.publish(event);
    return 'ok';
  }

  async track(payload) {
    if (this.closed) return 'error';
    const key = this.options?.config?.presence?.key ?? this.backend.instanceId;
    this.tracked = { key, payload: clone(payload), instance: this.backend.instanceId };
    this.backend.setPresence(this.topic, this.tracked);
    this.backend.publish({ kind: 'presence-track', topic: this.topic, ...this.tracked });
    return 'ok';
  }

  async untrack() {
    if (!this.tracked) return 'ok';
    const tracked = this.tracked;
    this.tracked = null;
    this.backend.deletePresence(this.topic, tracked.instance);
    this.backend.publish({ kind: 'presence-untrack', topic: this.topic, instance: tracked.instance });
    return 'ok';
  }

  presenceState() { return this.backend.presenceState(this.topic); }

  emitPresence(event) {
    for (const listener of this.listeners) {
      if (listener.type === 'presence' && (listener.filter.event === event || listener.filter.event === '*')) {
        listener.callback({ event, key: this.tracked?.key });
      }
    }
  }
}

class DemoBackend {
  constructor(namespace, seedRows) {
    this.name = `${DATABASE_PREFIX}${namespace}`;
    this.instanceId = crypto.randomUUID();
    this.channels = new Set();
    this.presence = new Map();
    this.storageUrls = new Map();
    this.bus = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(`${this.name}:events`);
    if (this.bus) this.bus.onmessage = event => this.dispatch(event.data, false);
    this.ready = this.initialize(seedRows);
  }

  async initialize(seedRows) {
    this.database = await openDatabase(this.name);
    const transaction = this.database.transaction([ROW_STORE, META_STORE], 'readwrite');
    const rows = transaction.objectStore(ROW_STORE);
    const metadata = transaction.objectStore(META_STORE);
    const seeded = await requestResult(metadata.get(SEED_MARKER));
    if (!seeded) {
      let versionEntry = await requestResult(metadata.get('server-version'));
      let version = Number(versionEntry?.value) || 0;
      for (const entry of rowsFromSeed(seedRows)) {
        const source = clone(entry.row);
        let key = rowKey(entry.table, source);
        if (!key) {
          source.id = source.id ?? `${Date.now()}-${++version}`;
          key = rowKey(entry.table, source);
        }
        if (!await requestResult(rows.get(key))) {
          source.server_version = ++version;
          if (source.field_meta === undefined && source.fieldMeta !== undefined) source.field_meta = clone(source.fieldMeta);
          await requestResult(rows.put({ key, table: entry.table, row: source }));
        }
      }
      await requestResult(metadata.put({ key: 'server-version', value: version }));
      await requestResult(metadata.put({ key: SEED_MARKER, value: true }));
    }
    await transactionDone(transaction);

    const storageTransaction = this.database.transaction(BLOB_STORE, 'readonly');
    const stored = await requestResult(storageTransaction.objectStore(BLOB_STORE).getAll());
    await transactionDone(storageTransaction);
    for (const item of stored) this.storageUrls.set(item.key, item.dataUrl);
  }

  publish(event) { this.bus?.postMessage(event); }

  dispatch(event, includeSender) {
    if (!event || (!includeSender && event.sender === this.instanceId)) return;
    if (event.kind === 'postgres') {
      for (const channel of this.channels) {
        for (const listener of channel.listeners) {
          if (listener.type !== 'postgres_changes') continue;
          if (listener.filter.table !== event.table) continue;
          if (listener.filter.event !== '*' && listener.filter.event !== event.eventType) continue;
          if (!matchesRealtimeFilter(event.new ?? event.old, listener.filter.filter)) continue;
          listener.callback(clone(event));
        }
      }
      return;
    }
    if (event.kind === 'broadcast') {
      for (const channel of this.channels) {
        if (channel.topic !== event.topic) continue;
        for (const listener of channel.listeners) {
          if (listener.type === 'broadcast' && listener.filter.event === event.event) listener.callback({ payload: clone(event.payload) });
        }
      }
      return;
    }
    if (event.kind === 'presence-hello') {
      for (const channel of this.channels) {
        if (channel.topic === event.topic && channel.tracked) {
          this.publish({ kind: 'presence-track', topic: channel.topic, ...channel.tracked });
        }
      }
      return;
    }
    if (event.kind === 'presence-track') {
      this.setPresence(event.topic, { key: event.key, payload: event.payload, instance: event.instance });
      return;
    }
    if (event.kind === 'presence-untrack') this.deletePresence(event.topic, event.instance);
  }

  setPresence(topic, tracked) {
    const state = this.presence.get(topic) ?? new Map();
    const existed = state.has(tracked.instance);
    state.set(tracked.instance, clone(tracked));
    this.presence.set(topic, state);
    for (const channel of this.channels) if (channel.topic === topic) channel.emitPresence(existed ? 'sync' : 'join');
  }

  deletePresence(topic, instance) {
    const state = this.presence.get(topic);
    if (!state?.delete(instance)) return;
    for (const channel of this.channels) if (channel.topic === topic) channel.emitPresence('leave');
  }

  presenceState(topic) {
    const output = {};
    for (const tracked of this.presence.get(topic)?.values() ?? []) {
      (output[tracked.key] ??= []).push(clone(tracked.payload));
    }
    return output;
  }

  async allRows(table, transaction = null) {
    const own = transaction ?? this.database.transaction(ROW_STORE, 'readonly');
    const records = await requestResult(own.objectStore(ROW_STORE).getAll());
    if (!transaction) await transactionDone(own);
    return records.filter(record => record.table === table);
  }

  filtered(records, query) {
    let selected = records.filter(record => query.filters.every(filter => filterMatches(record.row, filter)));
    if (query.orders.length) {
      selected.sort((left, right) => {
        for (const order of query.orders) {
          const compared = compareValues(left.row[order.column], right.row[order.column], order.ascending, order.nullsFirst);
          if (compared) return compared;
        }
        return 0;
      });
    }
    return selected;
  }

  async select(query) {
    let records = this.filtered(await this.allRows(query.table), query);
    const count = query.countMode ? records.length : null;
    if (query.rangeValue) records = records.slice(query.rangeValue[0], query.rangeValue[1] + 1);
    if (query.maxRows != null) records = records.slice(0, query.maxRows);
    const data = query.head ? null : records.map(record => projectRow(record.row, query.columns));
    return success(data, count);
  }

  async nextVersion(metadata) {
    const entry = await requestResult(metadata.get('server-version'));
    const version = (Number(entry?.value) || 0) + 1;
    await requestResult(metadata.put({ key: 'server-version', value: version }));
    return version;
  }

  async mutate(query) {
    const transaction = this.database.transaction([ROW_STORE, META_STORE], 'readwrite');
    const rowStore = transaction.objectStore(ROW_STORE);
    const metadata = transaction.objectStore(META_STORE);
    const records = this.filtered(await this.allRows(query.table, transaction), query);
    const changes = [];

    if (query.operation === 'insert' || query.operation === 'upsert') {
      const inputs = Array.isArray(query.values) ? query.values : [query.values];
      for (const raw of inputs) {
        const incoming = clone(raw ?? {});
        let key = rowKey(query.table, incoming, query.onConflict);
        if (!key && query.table === 'chalk_drawings') {
          const nextId = (await this.nextVersion(metadata));
          incoming.id = nextId;
          key = rowKey(query.table, incoming);
        }
        if (!key) throw new Error(`Cannot determine a primary key for ${query.table}`);
        const previous = await requestResult(rowStore.get(key));
        if (query.operation === 'insert' && previous) throw new Error('duplicate key value violates unique constraint');
        const row = previous ? { ...previous.row, ...incoming } : incoming;
        if (!previous && incoming.is_deleted === undefined && IS_DELETED_DEFAULT_TABLES.has(query.table)) {
          row.is_deleted = false;
        }
        if (previous && incoming.created_at === undefined) row.created_at = previous.row.created_at;
        if (previous && incoming.updated_at === undefined) row.updated_at = previous.row.updated_at;
        if (incoming.field_meta === undefined && previous?.row.field_meta !== undefined) row.field_meta = clone(previous.row.field_meta);
        row.server_version = await this.nextVersion(metadata);
        await requestResult(rowStore.put({ key, table: query.table, row }));
        changes.push({ eventType: 'INSERT', new: clone(row), old: previous ? clone(previous.row) : {} });
        if (previous) changes[changes.length - 1].eventType = 'UPDATE';
      }
    } else if (query.operation === 'update') {
      for (const record of records) {
        const row = { ...record.row, ...clone(query.values ?? {}) };
        if (query.values?.created_at === undefined) row.created_at = record.row.created_at;
        if (query.values?.updated_at === undefined) row.updated_at = record.row.updated_at;
        if (query.values?.field_meta === undefined && record.row.field_meta !== undefined) row.field_meta = clone(record.row.field_meta);
        row.server_version = await this.nextVersion(metadata);
        await requestResult(rowStore.put({ ...record, row }));
        changes.push({ eventType: 'UPDATE', new: clone(row), old: clone(record.row) });
      }
    } else if (query.operation === 'delete') {
      for (const record of records) {
        await requestResult(rowStore.delete(record.key));
        await this.nextVersion(metadata);
        changes.push({ eventType: 'DELETE', new: {}, old: clone(record.row) });
      }
    } else {
      throw new Error(`Unsupported mutation: ${query.operation}`);
    }

    await transactionDone(transaction);
    for (const change of changes) this.emitMutation(query.table, change);
    const count = query.countMode ? changes.length : null;
    const changedRows = changes.map(change => change.eventType === 'DELETE' ? change.old : change.new);
    const data = query.returning ? changedRows.map(row => projectRow(row, query.columns)) : null;
    return success(data, count);
  }

  emitMutation(table, change) {
    const event = {
      kind: 'postgres', schema: 'public', table, commit_timestamp: new Date().toISOString(),
      eventType: change.eventType, new: change.new, old: change.old, sender: this.instanceId,
    };
    this.dispatch(event, true);
    this.publish(event);
  }

  async islandRpc(name, parameters) {
    await this.ready;
    const now = Date.now();
    if (name === 'island_bootstrap') {
      const transaction = this.database.transaction(ROW_STORE, 'readonly');
      const records = await requestResult(transaction.objectStore(ROW_STORE).getAll());
      await transactionDone(transaction);
      const table = name => records.filter(record => record.table === name).map(record => clone(record.row));
      const players = table('island_players');
      return success({
        server_now: now,
        objects: table('island_objects'),
        player: players.find(row => row.user_id === parameters.p_user) ?? null,
        partner: players.find(row => row.user_id !== parameters.p_user) ?? null,
        projects: table('island_projects'),
        project_items: table('island_project_items'),
        dex: table('island_dex'),
        log: table('island_log').sort((a, b) => b.at - a.at).slice(0, 60),
        inbox: table('island_mail').filter(row => row.to_user === parameters.p_user && row.read_at == null),
      });
    }

    const transaction = this.database.transaction([ROW_STORE, META_STORE], 'readwrite');
    const rows = transaction.objectStore(ROW_STORE);
    const metadata = transaction.objectStore(META_STORE);
    const changes = [];
    let data;

    const put = async (table, row, conflict) => {
      const key = rowKey(table, row, conflict);
      const previous = await requestResult(rows.get(key));
      const stored = { ...row, server_version: await this.nextVersion(metadata) };
      await requestResult(rows.put({ key, table, row: stored }));
      changes.push({ table, eventType: previous ? 'UPDATE' : 'INSERT', new: clone(stored), old: clone(previous?.row ?? {}) });
      return stored;
    };

    if (name === 'island_upsert_objects') {
      const newest = new Map();
      for (const row of parameters.p ?? []) {
        const old = newest.get(row.id);
        if (!old || Number(row.updated_at) > Number(old.updated_at)) newest.set(row.id, clone(row));
      }
      const output = [];
      for (const row of newest.values()) {
        const key = rowKey('island_objects', row);
        const previous = await requestResult(rows.get(key));
        if (!previous || Number(row.updated_at) > Number(previous.row.updated_at)) output.push(await put('island_objects', row));
        else output.push(clone(previous.row));
      }
      data = { server_now: now, rows: output };
    } else if (name === 'island_save_player') {
      const row = clone(parameters.p ?? {});
      const key = rowKey('island_players', row);
      const previous = await requestResult(rows.get(key));
      const stored = !previous || Number(row.updated_at) > Number(previous.row.updated_at)
        ? await put('island_players', row)
        : clone(previous.row);
      data = { server_now: now, row: stored };
    } else if (name === 'island_contribute') {
      const projectId = parameters.p_project;
      const projectKey = rowKey('island_projects', { id: projectId });
      const previous = await requestResult(rows.get(projectKey));
      const project = await put('island_projects', {
        ...(previous?.row ?? { id: projectId, completed_at: null, completed_by: null }),
        bells: Number(previous?.row.bells ?? 0) + Math.max(0, Math.round(Number(parameters.p_bells) || 0)),
        updated_at: now,
      });
      const counts = {};
      for (const [itemId, rawCount] of Object.entries(parameters.p_items ?? {})) {
        if (!/^\d+$/u.test(String(rawCount))) continue;
        const key = rowKey('island_project_items', { project_id: projectId, item_id: itemId });
        const old = await requestResult(rows.get(key));
        await put('island_project_items', {
          project_id: projectId, item_id: itemId,
          count: Number(old?.row.count ?? 0) + Math.max(0, Number(rawCount)),
        });
      }
      for (const record of await requestResult(rows.getAll())) {
        if (record.table === 'island_project_items' && record.row.project_id === projectId) counts[record.row.item_id] = record.row.count;
      }
      data = { server_now: now, project, items: counts };
    } else if (name === 'island_complete_project') {
      const key = rowKey('island_projects', { id: parameters.p_project });
      const previous = await requestResult(rows.get(key));
      let won = false;
      let project = previous?.row;
      if (!project || project.completed_at == null) {
        won = true;
        project = await put('island_projects', {
          ...(project ?? { id: parameters.p_project, bells: 0 }),
          completed_at: now, completed_by: parameters.p_user, updated_at: now,
        });
      }
      data = { server_now: now, project: clone(project), won };
    } else if (name === 'island_dex_add') {
      const first = [];
      for (const itemId of new Set(parameters.p_items ?? [])) {
        const row = { item_id: itemId, first_by: parameters.p_user, first_at: now };
        if (!await requestResult(rows.get(rowKey('island_dex', row)))) {
          await put('island_dex', row);
          first.push(itemId);
        }
      }
      data = { server_now: now, first };
    } else {
      transaction.abort();
      return failure(`Unsupported local RPC: ${name}`);
    }

    await transactionDone(transaction);
    for (const change of changes) this.emitMutation(change.table, change);
    return success(data);
  }

  channel(topic, options) { return new DemoChannel(this, topic, options); }

  async removeChannel(channel) {
    await channel.untrack();
    channel.closed = true;
    this.channels.delete(channel);
    return 'ok';
  }

  storageBucket(bucket) {
    return {
      upload: async (path, blob, options = {}) => {
        try {
          await this.ready;
          const key = `${bucket}/${path}`;
          if (!options.upsert && this.storageUrls.has(key)) return { data: null, error: { message: 'The resource already exists' } };
          const dataUrl = await blobToDataUrl(blob);
          const transaction = this.database.transaction(BLOB_STORE, 'readwrite');
          await requestResult(transaction.objectStore(BLOB_STORE).put({ key, bucket, path, dataUrl }));
          await transactionDone(transaction);
          this.storageUrls.set(key, dataUrl);
          return { data: { path, fullPath: key }, error: null };
        } catch (error) {
          return { data: null, error: { message: error instanceof Error ? error.message : String(error) } };
        }
      },
      getPublicUrl: path => ({ data: { publicUrl: this.storageUrls.get(`${bucket}/${path}`) ?? '' } }),
      remove: async paths => {
        await this.ready;
        const transaction = this.database.transaction(BLOB_STORE, 'readwrite');
        for (const path of paths) {
          const key = `${bucket}/${path}`;
          await requestResult(transaction.objectStore(BLOB_STORE).delete(key));
          this.storageUrls.delete(key);
        }
        await transactionDone(transaction);
        return { data: paths.map(name => ({ name })), error: null };
      },
    };
  }
}

export function createDemoClient(namespace, seedRows = {}) {
  if (!namespace || typeof namespace !== 'string') throw new TypeError('createDemoClient requires a namespace');
  const backend = new DemoBackend(namespace, seedRows);
  const anonymousUser = { id: `portfolio-demo-${namespace}`, role: 'anon', aud: 'authenticated' };
  return {
    ready: backend.ready,
    from: table => new QueryBuilder(backend, table),
    rpc: (name, parameters = {}) => backend.islandRpc(name, parameters),
    channel: (topic, options) => backend.channel(topic, options),
    removeChannel: channel => backend.removeChannel(channel),
    storage: { from: bucket => backend.storageBucket(bucket) },
    auth: {
      getUser: async () => ({ data: { user: anonymousUser }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: callback => {
        queueMicrotask(() => callback('INITIAL_SESSION', null));
        return { data: { subscription: { unsubscribe() {} } } };
      },
    },
  };
}
