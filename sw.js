var CACHE = 'v1';
var URLS = [
  '/', '/index.html', '/pos.html', '/items.html', '/stock.html', '/transactions.html', '/login.html',
  '/static/js/config.js', '/static/js/api.js', '/static/js/auth.js', '/static/js/cart.js',
  '/partials/navbar.html', '/partials/sidebar.html',
  '/manifest.json', '/static/icons/icon-192.png', '/static/icons/icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(URLS); }));
});

self.addEventListener('fetch', function(e) {
  var u = new URL(e.request.url);
  // passthrough GAS API calls
  if (u.hostname.endsWith('.google.com') || u.hostname.endsWith('.googleusercontent.com')) return;
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});
