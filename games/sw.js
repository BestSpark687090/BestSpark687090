const pathRoutes = {
  '/tetr-api/': '/games/sd/tetr-api/',
  '/cloudfunctions/': '/games/sd/cloudfunctions/',
  '/games/sd/onlineHtml/assets/': '/games/sd/onlineHtml/deathbyai.gg/assets/',
  '/user-content/': '/games/sd/tetr.io/user-content/',
  '/res/': '/games/sd/tetr.io/res/',
  '/games/sd/tetr.io/.../res/': "/games/sd/tetr.io/res/"

};
const routes = Object.entries(pathRoutes).sort((a, b) => b[0].length - a[0].length);

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const match = routes.find(([from]) => url.pathname.startsWith(from));
  if (!match) return;
  const [from, to] = match;
  const newUrl = new URL(req.url);
  newUrl.pathname = to + url.pathname.slice(from.length);

  // Clone headers to ensure all are forwarded
  const headers = new Headers();
  req.headers.forEach((value, key) => headers.append(key, value));

  const forwardInit = {
    method: req.method,
    headers,
    credentials: req.credentials,
    redirect: 'follow'
  };

  if (req.method === 'GET' || req.method === 'HEAD') {
    event.respondWith(fetch(newUrl.toString(), forwardInit).catch(err =>
      new Response(err.message || 'Proxy fetch failed', { status: 502 })
    ));
    return;
  }

  event.respondWith(
    req.clone().arrayBuffer()
      .then(body => fetch(newUrl.toString(), { ...forwardInit, body }))
      .catch(err => new Response(err.message || 'Proxy fetch failed', { status: 502 }))
  );
});
