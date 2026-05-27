// 1. Define your path mapping rules (Old Path -> New Path)
const pathRoutes = {
  '/tetr-api/': '/games/sd/tetr-api/',
  '/cloudfunctions/': '/games/sd/cloudfunctions/',
  '/games/sd/onlineHtml/assets/': '/games/sd/onlineHtml/deathbyai.gg/assets/'
};

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  const currentPath = requestUrl.pathname;

  // 2. Find if the current path matches any of your rules
  const matchedRule = Object.keys(pathRoutes).find(oldPath => currentPath.startsWith(oldPath));

  if (matchedRule) {
    // 3. Swap out the old path for the new path
    const newPath = currentPath.replace(matchedRule, pathRoutes[matchedRule]);
    const newUrl = `${requestUrl.origin}${newPath}${requestUrl.search}`;
    const cleanHeaders = new Headers(event.request.headers);

    // 2. Clear or soften strict negotiation headers to bypass the 406 block
    if (cleanHeaders.has('Accept')) {
      // Force it to allow any response type standard to the web
      cleanHeaders.set('Accept', '*/*'); 
    }
    // 4. Construct the proxied request and execute
    const proxyRequest = new Request(newUrl, event.request);
    event.respondWith(fetch(proxyRequest));
  }
});

