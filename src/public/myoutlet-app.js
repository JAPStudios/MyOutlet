(() => {
  "use strict";

  const rawPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const path = rawPath.replace(/^\/myoutlet(?=\/|$)/i, "") || "/";
  const siteBase = "/myoutlet";
  const existing = document.getElementById("myoutlet-app");
  if (path !== "/" && path !== "/home") {
    if (existing) existing.remove();
    return;
  }
  if (existing) return;

  const root = document.createElement("main");
  root.id = "myoutlet-app";
  root.setAttribute("aria-label", "MyOutlet");
  root.innerHTML = `
    <style>
      #myoutlet-app{--mo-bg:#0c111b;--mo-panel:#151e2c;--mo-panel2:#1c293a;--mo-text:#f4f7fb;--mo-muted:#a8b5c6;--mo-accent:#8bd3c7;--mo-line:#2b394c;color:var(--mo-text);background:var(--mo-bg);font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.5;width:100%;box-sizing:border-box}
      #myoutlet-app *{box-sizing:border-box}
      #myoutlet-app a{color:inherit;text-decoration:none}
      #myoutlet-app button,#myoutlet-app input,#myoutlet-app select{font:inherit}
      #myoutlet-app .mo-wrap{width:min(1180px,calc(100% - 40px));margin:0 auto}
      #myoutlet-app .mo-nav{border-bottom:1px solid var(--mo-line);background:#101824}
      #myoutlet-app .mo-nav-inner{min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:24px}
      #myoutlet-app .mo-brand{font-size:22px;font-weight:800;letter-spacing:-.04em}
      #myoutlet-app .mo-brand span{color:var(--mo-accent)}
      #myoutlet-app .mo-links{display:flex;gap:22px;flex-wrap:wrap;color:var(--mo-muted);font-size:14px}
      #myoutlet-app .mo-links a:hover{color:var(--mo-text)}
      #myoutlet-app .mo-hero{padding:64px 0 52px;background:radial-gradient(ellipse at 78% 12%,#23413f 0%,transparent 42%),linear-gradient(135deg,#101c2a,#0c111b 68%)}
      #myoutlet-app .mo-kicker{color:var(--mo-accent);font-size:12px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}
      #myoutlet-app h1{font-size:clamp(36px,6vw,66px);line-height:1.02;letter-spacing:-.055em;max-width:760px;margin:14px 0}
      #myoutlet-app .mo-lead{max-width:680px;color:#c1ccda;font-size:17px}
      #myoutlet-app .mo-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:26px}
      #myoutlet-app .mo-btn{border:1px solid var(--mo-line);border-radius:999px;padding:11px 18px;background:var(--mo-panel2);color:var(--mo-text);cursor:pointer;font-weight:700}
      #myoutlet-app .mo-btn.primary{background:var(--mo-accent);border-color:var(--mo-accent);color:#10201f}
      #myoutlet-app .mo-section{padding:38px 0}
      #myoutlet-app .mo-section-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:18px}
      #myoutlet-app h2{font-size:25px;letter-spacing:-.03em;margin:0}
      #myoutlet-app .mo-sub{color:var(--mo-muted);font-size:14px;margin:4px 0 0}
      #myoutlet-app .mo-tools{display:flex;gap:10px;flex-wrap:wrap;margin:22px 0}
      #myoutlet-app .mo-input,#myoutlet-app .mo-select{min-height:44px;border:1px solid var(--mo-line);border-radius:10px;background:#111a27;color:var(--mo-text);padding:9px 12px}
      #myoutlet-app .mo-input{flex:1;min-width:220px}
      #myoutlet-app .mo-select{min-width:150px}
      #myoutlet-app .mo-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
      #myoutlet-app .mo-card{overflow:hidden;border:1px solid var(--mo-line);border-radius:14px;background:var(--mo-panel);min-width:0}
      #myoutlet-app .mo-thumb{width:100%;aspect-ratio:16/9;background:linear-gradient(135deg,#253449,#162231);display:flex;align-items:center;justify-content:center;color:#9fb1c5;overflow:hidden}
      #myoutlet-app .mo-thumb img{width:100%;height:100%;object-fit:cover}
      #myoutlet-app .mo-play{font-size:28px}
      #myoutlet-app .mo-card-body{padding:14px}
      #myoutlet-app .mo-card-title{font-size:16px;font-weight:750;margin:0 0 5px;line-height:1.3}
      #myoutlet-app .mo-meta{font-size:12px;color:var(--mo-muted);display:flex;gap:8px;flex-wrap:wrap}
      #myoutlet-app .mo-desc{font-size:13px;color:#c0cbd8;margin:9px 0 0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
      #myoutlet-app .mo-card .mo-btn{margin-top:12px;width:100%;border-radius:9px}
      #myoutlet-app .mo-empty{padding:26px;border:1px dashed var(--mo-line);border-radius:12px;color:var(--mo-muted);text-align:center}
      #myoutlet-app .mo-footer{border-top:1px solid var(--mo-line);padding:24px 0 34px;color:var(--mo-muted);font-size:13px}
      #myoutlet-app .mo-status{font-size:13px;color:var(--mo-muted);min-height:22px;margin:8px 0}
      #myoutlet-app .mo-load-more{display:block;margin:22px auto 0;min-width:180px}
      #myoutlet-app .mo-modal{position:fixed;inset:0;z-index:999999;background:rgba(0,0,0,.88);display:none;align-items:center;justify-content:center;padding:20px}
      #myoutlet-app .mo-modal.open{display:flex}
      #myoutlet-app .mo-player{width:min(1000px,100%);background:#101824;border:1px solid #34445b;border-radius:14px;overflow:hidden}
      #myoutlet-app .mo-player video{display:block;width:100%;max-height:72vh;background:#000}
      #myoutlet-app .mo-player-info{padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px}
      #myoutlet-app .mo-close{border:1px solid #53647a;background:#1d2a3a;color:#fff;border-radius:8px;padding:8px 12px;cursor:pointer}
      #myoutlet-app .mo-rating-note{font-size:12px;color:var(--mo-muted);margin-top:10px}
      @media(max-width:850px){#myoutlet-app .mo-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#myoutlet-app .mo-hero{padding:48px 0 40px}}
      @media(max-width:560px){#myoutlet-app .mo-wrap{width:min(100% - 28px,1180px)}#myoutlet-app .mo-nav-inner{align-items:flex-start;flex-direction:column;padding:14px 0;gap:10px}#myoutlet-app .mo-links{gap:14px}#myoutlet-app .mo-grid{grid-template-columns:1fr}#myoutlet-app .mo-section-head{align-items:flex-start;flex-direction:column}}
    </style>
    <header class="mo-nav">
      <div class="mo-wrap mo-nav-inner">
        <a class="mo-brand" href="/myoutlet/home" aria-label="MyOutlet home">My<span>Outlet</span></a>
        <nav class="mo-links" aria-label="Main navigation">
          <a href="#mo-discover">Discover</a><a href="#mo-live">Live</a><a href="#mo-creators">Creators</a>
          <a href="/myoutlet/faq">FAQ</a>
        </nav>
      </div>
    </header>
    <section class="mo-hero">
      <div class="mo-wrap">
        <div class="mo-kicker">Watch · Listen · Create</div>
        <h1>A better place for audiovisual content.</h1>
        <p class="mo-lead">Discover videos, audio and live broadcasts in a creator-focused space built around stronger content standards, clear ratings and direct audience support.</p>
        <div class="mo-actions"><a class="mo-btn primary" href="#mo-discover">Explore content</a><a class="mo-btn" href="#mo-live">Watch live</a></div>
      </div>
    </section>
    <section class="mo-section" id="mo-discover">
      <div class="mo-wrap">
        <div class="mo-section-head"><div><h2>Discover</h2><p class="mo-sub">Published videos and audio from creator channels.</p></div></div>
        <div class="mo-tools">
          <input class="mo-input" id="mo-search" type="search" placeholder="Search titles, descriptions and categories" aria-label="Search content">
          <select class="mo-select" id="mo-type" aria-label="Content type"><option value="all">All formats</option><option value="video">Video</option><option value="audio">Audio</option></select>
          <select class="mo-select" id="mo-rating" aria-label="Maximum content rating"><option value="all">All ratings</option><option>TV-Y</option><option>TV-Y7</option><option>TV-G</option><option>TV-PG</option><option>TV-14</option><option>TV-MA</option><option>Unrated</option></select>
        </div>
        <p class="mo-rating-note">Ratings are creator-supplied content classifications. The selector filters displayed items; it does not verify a viewer's age.</p>
        <div class="mo-status" id="mo-catalog-status" role="status">Loading published content…</div>
        <div class="mo-grid" id="mo-catalog"></div>
        <button class="mo-btn mo-load-more" id="mo-load-more" type="button" hidden>Load more</button>
      </div>
    </section>
    <section class="mo-section" id="mo-live">
      <div class="mo-wrap">
        <div class="mo-section-head"><div><h2>Live now</h2><p class="mo-sub">Broadcasts currently available for playback.</p></div></div>
        <div class="mo-status" id="mo-live-status" role="status">Checking live broadcasts…</div>
        <div class="mo-grid" id="mo-live-grid"></div>
      </div>
    </section>
    <section class="mo-section" id="mo-creators">
      <div class="mo-wrap">
        <div class="mo-section-head"><div><h2>Creator channels</h2><p class="mo-sub">Explore the channels publishing on MyOutlet.</p></div></div>
        <div class="mo-status" id="mo-creators-status" role="status">Loading channels…</div>
        <div class="mo-grid" id="mo-creators-grid"></div>
      </div>
    </section>
    <footer class="mo-footer"><div class="mo-wrap">MyOutlet · Audiovisual publishing, streaming and creator channels</div></footer>
    <div class="mo-modal" id="mo-modal" role="dialog" aria-modal="true" aria-label="Media player">
      <div class="mo-player"><video id="mo-video" controls playsinline></video><div class="mo-player-info"><strong id="mo-player-title">Now playing</strong><button class="mo-close" id="mo-close" type="button">Close</button></div></div>
    </div>
  `;

  document.body.insertBefore(root, document.body.firstChild);

  const $ = selector => root.querySelector(selector);
  const catalogNode = $("#mo-catalog");
  const liveNode = $("#mo-live-grid");
  const creatorsNode = $("#mo-creators-grid");
  const catalogStatus = $("#mo-catalog-status");
  const liveStatus = $("#mo-live-status");
  const creatorsStatus = $("#mo-creators-status");
  const modal = $("#mo-modal");
  const video = $("#mo-video");
  const playerTitle = $("#mo-player-title");
  let catalog = [];
  let catalogOffset = 0;
  let catalogTotal = 0;
  let catalogHasMore = false;
  let catalogLoading = false;
  let creators = [];
  let hlsInstance = null;

  function unwrap(payload) {
    return payload && payload.result ? payload.result : payload;
  }

  async function getJson(path, options) {
    const response = await fetch(path, Object.assign({ credentials: "same-origin", cache: "no-store" }, options || {}));
    if (!response.ok) throw new Error("Request failed (" + response.status + ").");
    return unwrap(await response.json());
  }

  function text(value) {
    return typeof value === "string" ? value : "";
  }

  function creatorName(id) {
    const creator = creators.find(item => item._id === id);
    return creator ? creator.name : "MyOutlet creator";
  }

  function card(item, live) {
    const article = document.createElement("article");
    article.className = "mo-card";
    const thumb = document.createElement("div");
    thumb.className = "mo-thumb";
    if (item.thumbnailUrl) {
      const image = document.createElement("img");
      image.src = item.thumbnailUrl;
      image.alt = "";
      image.loading = "lazy";
      thumb.appendChild(image);
    } else {
      const play = document.createElement("span");
      play.className = "mo-play";
      play.textContent = live ? "LIVE" : "▶";
      thumb.appendChild(play);
    }
    const body = document.createElement("div");
    body.className = "mo-card-body";
    const title = document.createElement("h3");
    title.className = "mo-card-title";
    title.textContent = text(item.title) || "Untitled media";
    const meta = document.createElement("div");
    meta.className = "mo-meta";
    [creatorName(item.creatorChannelId), text(item.contentRating) || "Unrated", live ? "Live" : text(item.contentType)].filter(Boolean).forEach(value => {
      const span = document.createElement("span");
      span.textContent = value;
      meta.appendChild(span);
    });
    const description = document.createElement("p");
    description.className = "mo-desc";
    description.textContent = text(item.description);
    const button = document.createElement("button");
    button.className = "mo-btn";
    button.type = "button";
    button.textContent = live ? "Watch live" : "Play";
    button.addEventListener("click", () => playItem(item, live));
    body.append(title, meta);
    if (description.textContent) body.appendChild(description);
    body.appendChild(button);
    article.append(thumb, body);
    return article;
  }

  function updateCatalogStatus() {
    catalogStatus.textContent = catalogTotal > catalog.length
      ? "Showing " + catalog.length + " of " + catalogTotal + " published items"
      : catalog.length + " published item" + (catalog.length === 1 ? "" : "s");
    const more = $("#mo-load-more");
    more.hidden = !catalogHasMore;
    more.disabled = catalogLoading;
    more.textContent = catalogLoading ? "Loading…" : "Load more";
  }

  async function loadMoreCatalog() {
    if (catalogLoading || !catalogHasMore) return;
    catalogLoading = true;
    updateCatalogStatus();
    try {
      const payload = await getJson(siteBase + "/_functions/publicCatalog?offset=" + catalogOffset);
      const nextItems = Array.isArray(payload.items) ? payload.items : [];
      catalog = catalog.concat(nextItems);
      catalogOffset = Number.isInteger(payload.nextOffset) ? payload.nextOffset : catalogOffset + 50;
      catalogTotal = Number.isFinite(payload.total) ? payload.total : catalogTotal;
      catalogHasMore = payload.hasMore === true;
      renderCatalog();
    } catch (error) {
      catalogStatus.textContent = "More published content could not be loaded. Try again.";
    } finally {
      catalogLoading = false;
      updateCatalogStatus();
    }
  }

  function renderCatalog() {
    const term = $("#mo-search").value.trim().toLowerCase();
    const type = $("#mo-type").value;
    const rating = $("#mo-rating").value;
    const ratingOrder = ["TV-Y", "TV-Y7", "TV-G", "TV-PG", "TV-14", "TV-MA"];
    const maximumRating = ratingOrder.indexOf(rating);
    const filtered = catalog.filter(item => {
      const searchable = [item.title, item.description, item.category, ...(item.tags || [])].join(" ").toLowerCase();
      const itemRating = text(item.contentRating) || "Unrated";
      const ratingMatches = rating === "all" ||
        (rating === "Unrated" ? itemRating === "Unrated" :
          ratingOrder.indexOf(itemRating) !== -1 && ratingOrder.indexOf(itemRating) <= maximumRating);
      return (!term || searchable.includes(term)) &&
        (type === "all" || item.contentType === type) &&
        ratingMatches;
    });
    catalogNode.replaceChildren();
    if (!filtered.length) {
      const empty = document.createElement("div");
      empty.className = "mo-empty";
      empty.textContent = catalog.length ? "No published items match these filters." : "No published videos or audio are available yet.";
      catalogNode.appendChild(empty);
      return;
    }
    filtered.forEach(item => catalogNode.appendChild(card(item, false)));
  }

  async function playItem(item, isLive) {
    let source = item.mediaUrl || item.playbackUrl || "";
    if (!isLive && source.startsWith("wix:video://")) {
      try {
        const playback = await getJson(siteBase + "/_functions/publicPlayback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaItemId: item._id, format: "hls" })
        });
        source = typeof playback.url === "string" ? playback.url :
          (playback.url && (playback.url.url || playback.url.playbackUrl)) || "";
      } catch (error) {
        catalogStatus.textContent = "Playback could not be prepared: " + error.message;
        return;
      }
    }
    if (!source || !/^https:\/\//i.test(source)) {
      catalogStatus.textContent = "This item does not currently have a playable HTTPS source.";
      return;
    }
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (window.Hls && window.Hls.isSupported() && /\.m3u8(?:$|\?)/i.test(source)) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    playerTitle.textContent = text(item.title) || "Now playing";
    modal.classList.add("open");
    try { await video.play(); } catch (_) {}
  }

  function closePlayer() {
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    modal.classList.remove("open");
  }

  $("#mo-load-more").addEventListener("click", loadMoreCatalog);
  $("#mo-search").addEventListener("input", renderCatalog);
  $("#mo-type").addEventListener("change", renderCatalog);
  $("#mo-rating").addEventListener("change", renderCatalog);
  $("#mo-close").addEventListener("click", closePlayer);
  modal.addEventListener("click", event => { if (event.target === modal) closePlayer(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closePlayer(); });

  async function init() {
    if (!window.Hls) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js";
      script.async = true;
      document.head.appendChild(script);
    }
    const tasks = await Promise.allSettled([
      getJson(siteBase + "/_functions/publicCatalog?offset=0"),
      getJson(siteBase + "/_functions/publicLiveStreams"),
      getJson(siteBase + "/_functions/publicCreators")
    ]);
    if (tasks[0].status === "fulfilled") {
      catalog = Array.isArray(tasks[0].value.items) ? tasks[0].value.items : [];
      catalogOffset = Number.isInteger(tasks[0].value.nextOffset) ? tasks[0].value.nextOffset : catalog.length;
      catalogTotal = Number.isFinite(tasks[0].value.total) ? tasks[0].value.total : catalog.length;
      catalogHasMore = tasks[0].value.hasMore === true;
      updateCatalogStatus();
      renderCatalog();
    } else {
      catalogStatus.textContent = "Published content is temporarily unavailable.";
      catalogNode.innerHTML = '<div class="mo-empty">The content service has not returned a catalogue.</div>';
    }
    if (tasks[1].status === "fulfilled") {
      const items = Array.isArray(tasks[1].value.items) ? tasks[1].value.items : [];
      liveStatus.textContent = items.length ? items.length + " live broadcast" + (items.length === 1 ? "" : "s") : "No live broadcasts are currently available.";
      liveNode.replaceChildren();
      if (items.length) items.forEach(item => liveNode.appendChild(card(item, true)));
    } else {
      liveStatus.textContent = "Live broadcast listings are temporarily unavailable.";
    }
    if (tasks[2].status === "fulfilled") {
      creators = Array.isArray(tasks[2].value.items) ? tasks[2].value.items : [];
      creatorsStatus.textContent = creators.length + " creator channel" + (creators.length === 1 ? "" : "s");
      creatorsNode.replaceChildren();
      creators.forEach(creator => {
        const item = document.createElement("article");
        item.className = "mo-card mo-card-body";
        const title = document.createElement("h3");
        title.className = "mo-card-title";
        title.textContent = creator.name || "Creator";
        const handle = document.createElement("div");
        handle.className = "mo-meta";
        handle.textContent = creator.handle ? "@" + creator.handle : "";
        const description = document.createElement("p");
        description.className = "mo-desc";
        description.textContent = text(creator.description);
        item.append(title, handle);
        if (description.textContent) item.appendChild(description);
        creatorsNode.appendChild(item);
      });
      renderCatalog();
    } else {
      creatorsStatus.textContent = "Creator channels are temporarily unavailable.";
    }
  }

  init();
})();