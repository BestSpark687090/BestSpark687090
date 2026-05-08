import games from './sd/cards-data.js';
import zones from "https://cdn.jsdelivr.net/gh/freebuisness/assets@latest/zones.json" with { type: "json" };
// Stub parent APIs that some gn-math games expect on window.parent
window.maeExportApis_ = () => ({});
const hostname = location.hostname.split(".").slice(-2).join(".");
const isnotProxy = window.hostnamesThatarentTheProxy?.includes(hostname);
if(isnotProxy){
  alert("Sorry, but unVPS'd websites cannot use the games section.")
  location.pathname="/"
}
// 

const COVER_URL = "/games/gn/covers";
const HTML_URL = "https://cdn.jsdelivr.net/gh/freebuisness/html@main";

// --- Path helpers (SD games) ---

function getBaseURLForPage(page) {
  if (!page || page === 1) return "/";
  return `/${page}/`;
}

function adjustHrefPath(path, page) {
  path = path.replace(/^\.\//, "").replace(/^\//, "");
  const base = getBaseURLForPage(page);
  return base.endsWith("/") ? base + path : base + "/" + path;
}

async function fileExists(url) {
  try { return (await fetch(url, { method: "HEAD" })).ok; }
  catch { return false; }
}

async function getEmbedPath(adjustedHref, originalHref, page) {
  const absHref = new URL(adjustedHref, location.href).href;
  let clean = absHref
    .replace(/index\.html$/, "").replace(/base\.html$/, "").replace(/\.html$/, "");
  if (!clean.endsWith("/")) clean += "/";

  try {
    const res = await fetch(absHref, { method: "GET" });
    if (res.ok) {
      const text = await res.text();
      const match = text.match(/embedGame\((['"])(.*?)\1,\s*(['"])(.*?)\3\)/);
      if (match) {
        const resolved = new URL(match[2], absHref).href;
        if (await fileExists(resolved)) return resolved;
      }
    }
  } catch (e) {
    console.warn("Failed to parse embed path", e);
  }

  for (const path of [
    clean + "game/index.html", clean + "game/base.html",
    clean + "gamereal/index.html", clean + "gamereal/base.html",
    clean + "index.html", clean + "base.html",
  ]) {
    if (await fileExists(path)) return path;
  }

  return adjustHrefPath(originalHref, page);
}

// --- Modal ---

function showModal(name) {
  document.getElementById("modal-title").textContent = name;
  document.getElementById("game-modal").classList.add("open");
  document.title = name + " - BestSpark Games";
}

async function openGNGame(name, url) {
  // Only open in new tab for non-jsDelivr external URLs (e.g. YouTube games)
  if (url.startsWith('http') && !url.startsWith('https://cdn.jsdelivr.net')) {
    window.open(url, '_blank');
    return;
  }
  showModal(name);
  const frame = document.getElementById("game-frame");

  const res = await fetch(url + "?t=" + Date.now());
  if (!res.ok) {
    frame.contentDocument.open();
    frame.contentDocument.write(`<body style="color:#fff;font-family:sans-serif;padding:2rem">Game not found (${res.status})</body>`);
    frame.contentDocument.close();
    return;
  }
  const html = await res.text();
  if (html.includes('ytgame.js')) {
    frame.contentDocument.open();
    frame.contentDocument.write(`<body style="color:#fff;font-family:sans-serif;padding:2rem;background:#111">This game only runs on YouTube.</body>`);
    frame.contentDocument.close();
    return;
  }

  frame.removeAttribute("srcdoc");
  frame.src = "about:blank";
  frame.contentDocument.open();
  frame.contentDocument.write(html);
  frame.contentDocument.close();

  try {
    const style = frame.contentDocument.createElement("style");
    style.textContent = `canvas { max-width: 100% !important; max-height: 100% !important; object-fit: contain; }`;
    frame.contentDocument.head.appendChild(style);
    Object.defineProperty(frame.contentWindow.document, "hidden", { get: () => false });
    Object.defineProperty(frame.contentWindow.document, "visibilityState", { get: () => "visible" });
  } catch {}
}

async function openSDGame(name, url) {
  showModal(name);
  const frame = document.getElementById("game-frame");
  const embedUrl = await getEmbedPath(url, url, null);
  frame.removeAttribute("srcdoc");
  frame.src = embedUrl;
}

function closeModal() {
  const frame = document.getElementById("game-frame");
  frame.removeAttribute("srcdoc");
  frame.src = "about:blank";
  document.getElementById("game-modal").classList.remove("open");
  document.title = "Games?";
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

function rot13(str) {
  return str.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

// --- Cards ---

function makeCard({ imgSrc, name, source, href, page, url }) {
  let imgbox = document.createElement("div");
  imgbox.classList.add("image_box");
  let img = document.createElement("img");
  img.src = imgSrc;
  img.loading = "lazy";
  let p = document.createElement("p");
  p.innerHTML = `<rot13ns>${rot13(name)}</rot13ns>`;
  imgbox.appendChild(img);
  imgbox.appendChild(p);
  let wrapper = document.createElement("div");
  wrapper.classList.add("image_box_wrapper", source);
  wrapper.dataset.name = name;
  wrapper.dataset.source = source;
  if (href != null) wrapper.dataset.href = href;
  if (page != null) wrapper.dataset.page = page;
  if (url != null) wrapper.dataset.url = url;
  wrapper.appendChild(imgbox);
  return wrapper;
}

// --- Load & render ---

async function loadGames() {
  const gamesEl = document.querySelector(".games");
  const loadingEl = document.getElementById("games-loading");
  let searchIndex = [];
  let allEntries = [];
  const filters = { sd: true, gn: true };

  function applyFilters(q = "") {
    for (const { card, name, source } of searchIndex) {
      card.style.display = filters[source] && name.includes(q) ? "" : "none";
    }
  }

  function render(entries) {
    allEntries = entries;
    const seen = new Set();
    const deduped = entries.filter(({ name }) => {
      const key = name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    deduped.sort((a, b) => a.name.localeCompare(b.name));
    const fragment = document.createDocumentFragment();
    searchIndex = [];
    for (const entry of deduped) {
      const card = makeCard(entry);
      searchIndex.push({ card, name: entry.name.toLowerCase(), source: entry.source });
      fragment.appendChild(card);
    }
    if (loadingEl) loadingEl.remove();
    gamesEl.innerHTML = "";
    gamesEl.appendChild(fragment);
    applyFilters(document.getElementById("search").value.toLowerCase().trim());
  }

  const sdEntries = games.map(game => ({
    name: game.name,
    imgSrc: `/games/sd/${game.page != 1 && game.page != undefined ? game.page + "/" : ""}img/` + game.imgSrc,
    source: 'sd',
    href: game.href,
    page: game.page,
  }));

  const gnEntries = zones
    .filter(z => z.id >= 0 && z.id !== 596)
    .map(z => ({
      name: z.name,
      imgSrc: z.cover.replace("{COVER_URL}", COVER_URL),
      source: 'gn',
      url: z.url.replace("{HTML_URL}", HTML_URL),
    }));

  render([...sdEntries, ...gnEntries]);

  // Filter buttons
  for (const btn of document.querySelectorAll(".filter-btn")) {
    btn.addEventListener("click", () => {
      const source = btn.dataset.source;
      filters[source] = !filters[source];
      btn.classList.toggle("active", filters[source]);
      applyFilters(document.getElementById("search").value.toLowerCase().trim());
    });
  }

  // Search
  document.getElementById("search").addEventListener("input", e => {
    applyFilters(e.target.value.toLowerCase().trim());
  });

  // Click to open
  gamesEl.addEventListener("click", async e => {
    const wrapper = e.target.closest(".image_box_wrapper");
    if (!wrapper) return;
    const { name, source, href, page, url } = wrapper.dataset;
    if (source === 'gn') {
      await openGNGame(name, url);
    } else {
      const adjusted = adjustHrefPath(href, page ? parseInt(page) : undefined);
      await openSDGame(name, "/games/sd" + adjusted);
    }
  });
}

loadGames();
