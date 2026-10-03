// Replace the previously published demo worker without touching other scopes.
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const scope = self.registration.scope;
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      const requests = await cache.keys();
      if (requests.length && requests.every(request => request.url.startsWith(scope))) await caches.delete(name);
    }
    await self.registration.unregister();
    for (const client of await self.clients.matchAll({ type: 'window', includeUncontrolled: true })) {
      if (client.url.startsWith(scope)) await client.navigate(client.url);
    }
  })());
});
