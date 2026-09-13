self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Chrome requires a fetch handler to show the "Install" prompt
});
