// checking if its dynamic sw rn
const pathRoutes = {
  "/tetr-api/": "/games/sd/tetr-api/",
  "/cloudfunctions/": "/games/sd/cloudfunctions/",
  '/games/sd/onlineHtml/assets/': '/games/sd/onlineHtml/deathbyai.gg/assets/',
  "/user-content/": "/games/sd/tetr.io/user-content/",
  "/res/": "/games/sd/tetr.io/res/",
  "/games/sd/tetr.io/.../res/": "/games/sd/tetr.io/res/",
  "/api/metrics/": "/games/sd/zombsroyale.io/api/metrics/",
  "/narrow-maps-config": "/games/sd/narrow-maps-config",
  "/uv/": "/games/sd/uv/", // I lowk hope this doesnt mess up my ACTUAL uv config :sob:
  "/narrow-auth-guest-data": "/games/sd/narrow-auth-guest-data",
  "/zombs-io/": "/games/sd/zombs-io/",
  "/dbaireveal/": "/games/sd/dbaireveal/",
  "/krunker.io/": "/games/sd/krunker.io/",
  "/krunker":"/games/sd/krunker"
};
const routes = Object.entries(pathRoutes).sort(
  (a, b) => b[0].length - a[0].length,
);

self.addEventListener("fetch", async (event) => {
  //#region sd sw yoink
  const urlStr = event.request.url;

  if (
    urlStr.includes("assets.krunker.io") &&
    !urlStr.includes("user-assets.krunker.io")
  ) {
    event.respondWith(
      fetch(urlStr.replace(/https?:\/\/assets\.krunker\.io/, "/games/sd/krunker.io")),
    );
    return;
  } else if (urlStr.includes("user-assets.krunker.io")) {
    event.respondWith(
      fetch(
        urlStr.replace(
          /https?:\/\/user-assets\.krunker\.io/,
          "/games/sd/krunker-user-assets",
        ),
      ),
    );
    return;
  } else if (urlStr.includes("pelicanparty.games/auth/thirdParty")) {
    event.respondWith(
      fetch("/games/sd/pelican-auth-fetchSdk", {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body,
      }),
    );
    return;
  } else if (urlStr.includes("js.pelicanparty.games/v1.js")) {
    event.respondWith(
      fetch("/games/sd/narrow.one/v1.js", {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body,
      }),
    );
    return;
  } else if (urlStr.includes("narrow-one.com/config/maps/")) {
    event.respondWith(
      fetch(
        urlStr.replace(
          /https?:\/\/narrow-one\.com\/config\/maps/,
          "/games/sd/narrow-one-maps-config",
        ),
      ),
    );
    return;
  } else if (urlStr.includes("narrow-one.com/config/skins/")) {
    event.respondWith(
      fetch(
        urlStr.replace(
          /https?:\/\/narrow-one\.com\/config\/skins/,
          "/games/sd/narrow-one-skins-config",
        ),
      ),
    );
    return;
  } else if (
    urlStr.includes("narrow-one.com/api/auth/getIssuerConfig") &&
    urlStr.includes("issuer=https://accounts.google.com")
  ) {
    event.respondWith(fetch("/games/sd/narrow-issuer-config-google"));
    return;
  }

  if (event.request.mode === "navigate") {
    const url = new URL(event.request.url);
    const referer = event.request.referrer;
    if (url.pathname === "/" && referer.includes("/krunker.io/")) {
      event.respondWith(Response.redirect("/krunker.io/" + url.search, 302));
      return;
    }
  }
  //#endregion sd sw yoink
  //#region deny all bad
  // deny all these domains from catching me
  const listToDeny = [
    "adsrvr.org",
    "crwdcntrl.net",
    "criteo.com",
    "ad.gt",
    "id5-sync.com",
    "rubiconproject.com",
    "media.net",
    "sharethrough.com",
    "adnxs.com",
    "casalemedia.com",
    "yellowblue.io",
    "openx.net",
    "3lift.com",
    "pubmatic.com",
    "lngtd.com",
    "eus.rubiconproject.com",
    "ad-delivery.net",
    "btloader.com",
  ];
  if (listToDeny.some((keyword) => urlStr.includes(keyword))) {
    event.respondWith(new Response("no", { status: 418 })); // funny status code
  }
  //#endregion deny all bad
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
    redirect: "follow",
  };
  if (newUrl.href.includes("/zombs-io/api/config?")) {
    if (newUrl.href.includes("/zombs-io/api/config?")) {
      event.respondWith(
        (async () => {
          let res = await fetch(newUrl.toString(), forwardInit);
          let j = await res.json();
          j.extras ??= {};
          j.config.update_required = false
          if ("announcement" in j.extras) j.extras.announcement = null;
          const headers = new Headers(res.headers);
          return new Response(JSON.stringify(j), {
            status: res.status,
            headers,
          });
        })(),
      );
      return;
    }
  }
  if (req.method === "GET" || req.method === "HEAD") {
    event.respondWith(
      fetch(newUrl.toString(), forwardInit).catch(
        (err) =>
          new Response(err.message || "Proxy fetch failed", { status: 502 }),
      ),
    );
    return;
  }

  event.respondWith(
    req
      .clone()
      .arrayBuffer()
      .then((body) => fetch(newUrl.toString(), { ...forwardInit, body }))
      .catch(
        (err) =>
          new Response(err.message || "Proxy fetch failed", { status: 502 }),
      ),
  );
});
