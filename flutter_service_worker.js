/*
 * Kill switch for the service worker registered by the previous Flutter build.
 * Returning visitors' browsers fetch this file on their next visit, install it,
 * wipe the old Flutter caches, unregister, and reload into the new static site.
 * Safe to delete once old visitors have cycled through (a few months).
 */
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach((client) => client.navigate(client.url));
  })());
});
