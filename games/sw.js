const pathRoutes = {
  '/tetr-api/': '/games/sd/tetr-api/',
  '/cloudfunctions/': '/games/sd/cloudfunctions/',
  '/games/sd/onlineHtml/assets/': '/games/sd/onlineHtml/deathbyai.gg/assets/'
};
const routes = Object.entries(pathRoutes).sort((a,b)=>b[0].length-a[0].length);

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const match = routes.find(([from]) => url.pathname.startsWith(from));
  if (!match) return;
  const [from, to] = match;
  const newUrl = new URL(req.url);
  newUrl.pathname = to + url.pathname.slice(from.length);

  // Use the original request's headers object directly.
  const forwardInit = {
    method: req.method,
    headers: req.headers,        // forward all headers exposed by the browser
    credentials: req.credentials,
    redirect: 'follow'
  };

  if (req.method === 'GET' || req.method === 'HEAD') {
    event.respondWith(fetch(newUrl.toString(), forwardInit).catch(err =>
      new Response(err.message || 'Proxy fetch failed', { status: 502 })
    ));
    return;
  }

  // For requests with bodies, forward the body by cloning.
  event.respondWith(
    req.clone().arrayBuffer()
      .then(body => fetch(newUrl.toString(), { ...forwardInit, body }))
      .catch(err => new Response(err.message || 'Proxy fetch failed', { status: 502 }))
  );
});

