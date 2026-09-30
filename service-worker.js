const CACHE = 'flow-prompt-manager-v5';
const FILES = ['./','index.html','manifest.json','parser.js','default-prompts.js','icon-192.png','icon-512.png','lib/pdf.min.js','lib/pdf.worker.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isLib = req.url.includes('/lib/');
  if (isLib) {
    // Big files that never change: use the saved copy first.
    e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
    return;
  }
  // Everything else: try the internet first so updates show up, use the saved copy when offline.
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(hit => hit || caches.match('index.html')))
  );
});
