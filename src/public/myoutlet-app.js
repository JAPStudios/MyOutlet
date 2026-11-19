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
      #myoutlet-app .mo-rating-note{font-size:12px;color:var(--mo-muted);margin-top:10px}\n      #myoutlet-app .mo-chat{display:none;border-top:1px solid var(--mo-line);padding:16px 18px}\n      #myoutlet-app .mo-chat.open{display:block}\n      #myoutlet-app .mo-chat h3{font-size:16px;margin:0 0 10px}\n      #myoutlet-app .mo-chat-messages{max-height:220px;overflow:auto;display:flex;flex-direction:column;gap:9px;padding:10px;border:1px solid var(--mo-line);border-radius:9px;background:#0c1420}\n      #myoutlet-app .mo-chat-message{font-size:13px;overflow-wrap:anywhere}\n      #myoutlet-app .mo-chat-message strong{color:var(--mo-accent)}\n      #myoutlet-app .mo-chat-message button{margin-left:8px;border:0;background:transparent;color:var(--mo-muted);font-size:11px;text-decoration:underline;cursor:pointer}\n      #myoutlet-app .mo-chat-form{display:flex;gap:8px;margin-top:10px}\n      #myoutlet-app .mo-chat-input{flex:1;min-width:0;border:1px solid var(--mo-line);border-radius:8px;background:#111a27;color:var(--mo-text);padding:10px}\n      #myoutlet-app .mo-chat-status{font-size:12px;color:var(--mo-muted);min-height:18px;margin:8px 0 0}\n      #myoutlet-app .mo-studio-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}\n      #myoutlet-app .mo-studio-card{border:1px solid var(--mo-line);border-radius:14px;background:var(--mo-panel);padding:18px;min-width:0}\n      #myoutlet-app .mo-studio-card h3{font-size:18px;margin:0 0 12px}\n      #myoutlet-app .mo-studio-form{display:grid;gap:9px}\n      #myoutlet-app .mo-studio-form label{font-size:12px;color:var(--mo-muted);display:grid;gap:4px}\n      #myoutlet-app .mo-studio-form input,#myoutlet-app .mo-studio-form textarea,#myoutlet-app .mo-studio-form select{width:100%;min-height:40px;border:1px solid var(--mo-line);border-radius:8px;background:#111a27;color:var(--mo-text);padding:9px}\n      #myoutlet-app .mo-studio-form textarea{min-height:82px;resize:vertical}\n      #myoutlet-app .mo-studio-status{font-size:12px;color:var(--mo-muted);min-height:18px;margin:10px 0}\n      #myoutlet-app .mo-studio-list{display:grid;gap:8px;margin-top:12px}\n      #myoutlet-app .mo-studio-row{padding:10px;border:1px solid var(--mo-line);border-radius:8px;font-size:13px;display:flex;justify-content:space-between;gap:10px}\n      #myoutlet-app .mo-studio-row span:last-child{color:var(--mo-muted)}\n      #myoutlet-app .mo-studio-metrics{display:flex;gap:20px;flex-wrap:wrap;color:var(--mo-muted);font-size:13px}\n      @media(max-width:700px){#myoutlet-app .mo-studio-grid{grid-template-columns:1fr}}
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
    <section class="mo-section" id="mo-creator-studio">
      <div class="mo-wrap">
        <div class="mo-section-head"><div><h2>Creator studio</h2><p class="mo-sub">Manage a creator channel, submit media and review performance.</p></div></div>
        <p class="mo-studio-status" id="mo-studio-status" role="status">Sign in to manage a creator channel.</p>
        <div class="mo-studio-grid">
          <section class="mo-studio-card">
            <h3>Channel profile</h3>
            <form class="mo-studio-form" id="mo-channel-form">
              <label>Channel name<input id="mo-channel-name" maxlength="80" required></label>
              <label>Channel handle<input id="mo-channel-handle" maxlength="30" placeholder="channel_handle" required></label>
              <label>Description<textarea id="mo-channel-description" maxlength="500"></textarea></label>
              <label>Website URL<input id="mo-channel-website" type="url" placeholder="https://"></label>
              <label>Avatar image URL<input id="mo-channel-avatar" type="url" placeholder="https://"></label>
              <label>Banner image URL<input id="mo-channel-banner" type="url" placeholder="https://"></label>
              <label>Social links, one HTTPS URL per line<textarea id="mo-channel-social" placeholder="https://"></textarea></label>
              <button class="mo-btn primary" type="submit">Save channel</button>
            </form>
            <p class="mo-studio-status" id="mo-channel-status" role="status"></p>
          </section>
          <section class="mo-studio-card">
            <h3>Submit media</h3>
            <form class="mo-studio-form" id="mo-media-form">
              <label>Title<input id="mo-media-title" maxlength="120" required></label>
              <label>Description<textarea id="mo-media-description" maxlength="2000"></textarea></label>
              <label>Format<select id="mo-media-type"><option value="video">Video</option><option value="audio">Audio</option></select></label>
              <label>Content rating<select id="mo-media-rating"><option>TV-Y</option><option>TV-Y7</option><option>TV-G</option><option>TV-PG</option><option>TV-14</option><option>TV-MA</option><option>Unrated</option></select></label>
              <label>Category<input id="mo-media-category" maxlength="50" value="Other"></label>
              <label>Tags, separated by commas<input id="mo-media-tags" maxlength="300"></label>
              <label>Language code<input id="mo-media-language" maxlength="5" placeholder="en"></label>
              <label>Duration in seconds<input id="mo-media-duration" type="number" min="0" max="86400" value="0"></label>
              <label>Thumbnail HTTPS URL<input id="mo-media-thumbnail" type="url" placeholder="https://"></label>
              <label>External media HTTPS URL<input id="mo-media-url" type="url" placeholder="Use this or upload an MP4"></label>
              <label>MP4 video file<input id="mo-media-file" type="file" accept="video/mp4,.mp4"></label>
              <button class="mo-btn" id="mo-upload-video" type="button">Upload MP4</button>
              <button class="mo-btn" id="mo-check-upload" type="button">Check upload processing</button>
              <button class="mo-btn primary" type="submit">Submit for review</button>
            </form>
            <p class="mo-studio-status" id="mo-media-status" role="status"></p>
            <div class="mo-studio-list" id="mo-upload-list"></div>
          </section>
          <section class="mo-studio-card">
            <h3>My submissions</h3>
            <div class="mo-studio-status" id="mo-submissions-status" role="status"></div>
            <div class="mo-studio-list" id="mo-submissions-list"></div>
          </section>
          <section class="mo-studio-card">
            <h3>Creator analytics</h3>
            <div class="mo-studio-metrics" id="mo-analytics"></div>
            <p class="mo-studio-status">Playback starts, client-reported watch time and completions are estimates, not audited audience measurements.</p>
          </section>
          <section class="mo-studio-card">
            <h3>Live broadcast</h3>
            <form class="mo-studio-form" id="mo-live-form">
              <label>Stream title<input id="mo-live-title" maxlength="120" required></label>
              <label>Description<textarea id="mo-live-description" maxlength="2000"></textarea></label>
              <label>Content rating<select id="mo-live-rating"><option>TV-Y</option><option>TV-Y7</option><option>TV-G</option><option>TV-PG</option><option>TV-14</option><option>TV-MA</option><option>Unrated</option></select></label>
              <label>Category<input id="mo-live-category" maxlength="50" value="Live"></label>
              <label>Thumbnail HTTPS URL<input id="mo-live-thumbnail" type="url" placeholder="https://"></label>
              <button class="mo-btn primary" type="submit">Create live stream</button>
            </form>
            <p class="mo-studio-status" id="mo-live-status" role="status"></p>
            <label class="mo-studio-form">RTMPS ingest address<textarea id="mo-ingest-url" readonly></textarea></label>
            <div class="mo-studio-list" id="mo-my-live-streams"></div>
          </section>
          <section class="mo-studio-card">
            <h3>Live song queue</h3>
            <button class="mo-btn" id="mo-refresh-queue" type="button">Refresh queue</button>
            <p class="mo-studio-status" id="mo-queue-status" role="status"></p>
            <div class="mo-studio-list" id="mo-song-queue"></div>
          </section>
        </div>
      </div>
    </section>
    <section class="mo-section" id="mo-library">
      <div class="mo-wrap">
        <div class="mo-section-head"><div><h2>Your library</h2><p class="mo-sub">Saved media, continue watching and followed-channel updates.</p></div><button class="mo-btn" id="mo-refresh-library" type="button">Refresh library</button></div>
        <p class="mo-studio-status" id="mo-library-status" role="status">Sign in to view your library.</p>
        <h3>Continue watching</h3><div class="mo-grid" id="mo-continue-watching"></div>
        <h3>Watchlist</h3><div class="mo-grid" id="mo-watchlist"></div>
        <h3>Following feed</h3><div class="mo-grid" id="mo-following-feed"></div>
      </div>
    </section>
    <footer class="mo-footer"><div class="mo-wrap">MyOutlet · Audiovisual publishing, streaming and creator channels</div></footer>
    <div class="mo-modal" id="mo-modal" role="dialog" aria-modal="true" aria-label="Media player">
      <div class="mo-player"><video id="mo-video" controls playsinline></video><div class="mo-player-info"><strong id="mo-player-title">Now playing</strong><button class="mo-close" id="mo-close" type="button">Close</button></div><section class="mo-chat" id="mo-chat" aria-label="Live chat"><h3>Live chat</h3><div class="mo-chat-messages" id="mo-chat-messages" aria-live="polite"></div><form class="mo-chat-form" id="mo-chat-form"><input class="mo-chat-input" id="mo-chat-input" type="text" maxlength="500" placeholder="Sign in to join the conversation" aria-label="Live chat message"><button class="mo-btn" type="submit">Send</button></form><p class="mo-chat-status" id="mo-chat-status" role="status"></p></section></div>
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
  const chatPanel = $("#mo-chat");
  const chatMessagesNode = $("#mo-chat-messages");
  const chatForm = $("#mo-chat-form");
  const chatInput = $("#mo-chat-input");
  const chatStatus = $("#mo-chat-status");
  const studioStatus = $("#mo-studio-status");
  const channelForm = $("#mo-channel-form");
  const channelStatus = $("#mo-channel-status");
  const mediaForm = $("#mo-media-form");
  const mediaStatus = $("#mo-media-status");
  const uploadList = $("#mo-upload-list");
  const submissionsList = $("#mo-submissions-list");
  const submissionsStatus = $("#mo-submissions-status");
  const analyticsNode = $("#mo-analytics");
  const libraryStatus = $("#mo-library-status");
  const continueWatchingNode = $("#mo-continue-watching");
  const watchlistNode = $("#mo-watchlist");
  const followingFeedNode = $("#mo-following-feed");
  const liveForm = $("#mo-live-form");
  const creatorLiveStatus = $("#mo-live-status");
  const ingestUrlNode = $("#mo-ingest-url");
  const myLiveStreamsNode = $("#mo-my-live-streams");
  const queueStatus = $("#mo-queue-status");
  const songQueueNode = $("#mo-song-queue");
  let creatorChannel = null;
  let pendingUploadSessionId = "";
  let pendingUploadStatus = "";
  let activeLiveStreamId = "";
  let activeMediaItem = null;
  let lastProgressPosition = 0;
  let liveChatCursor = null;
  let liveChatTimer = null;
  let liveChatLoading = false;
  let catalog = [];
  let catalogOffset = 0;
  let catalogTotal = 0;
  let catalogHasMore = false;
  let catalogLoading = false;
  let creators = [];
  let hlsInstance = null;
  let hlsLoadPromise = null;

  function unwrap(payload) {
    return payload && payload.result ? payload.result : payload;
  }

  let bridgeSequence = 0;

  function waitForVeloBridge() {
    if (window.__myOutletVeloReady === true) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        window.removeEventListener("myoutlet:bridge-ready", ready);
        reject(new Error("The MyOutlet page connection is unavailable."));
      }, 10000);
      function ready() {
        window.clearTimeout(timeout);
        resolve();
      }
      window.addEventListener("myoutlet:bridge-ready", ready, { once: true });
      if (window.__myOutletVeloReady === true) ready();
    });
  }

  async function getJson(path, options) {
    await waitForVeloBridge();
    const url = new URL(path, window.location.origin);
    const route = url.pathname.split("/").pop();
    const method = options && options.method ? options.method.toUpperCase() : "GET";
    let body = {};
    if (options && typeof options.body === "string" && options.body) {
      try { body = JSON.parse(options.body); } catch (_) {
        throw new Error("The MyOutlet request body is invalid.");
      }
    }
    const query = Object.fromEntries(url.searchParams.entries());
    const id = "myoutlet-" + Date.now() + "-" + (++bridgeSequence);
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        window.removeEventListener("myoutlet:response", receive);
        reject(new Error("The MyOutlet service did not respond."));
      }, 20000);
      function receive(event) {
        const response = event.detail;
        if (!response || response.id !== id) return;
        window.clearTimeout(timeout);
        window.removeEventListener("myoutlet:response", receive);
        if (response.ok) resolve(response.data);
        else reject(new Error(response.error || "The MyOutlet request could not be completed."));
      }
      window.addEventListener("myoutlet:response", receive);
      window.dispatchEvent(new CustomEvent("myoutlet:request", {
        detail: { id, route, method, query, body }
      }));
    });
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
    if (!live) {
      const save = document.createElement("button");
      save.className = "mo-btn";
      save.type = "button";
      save.textContent = "Save to watchlist";
      save.addEventListener("click", async () => {
        save.disabled = true;
        try {
          await getJson(siteBase + "/_functions/addToWatchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mediaItemId: item._id })
          });
          save.textContent = "Saved";
          await loadViewerLibrary();
        } catch (error) {
          save.textContent = "Sign in to save";
          save.disabled = false;
        }
      });
      body.appendChild(save);
    }
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

  function ensureHls() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (hlsLoadPromise) return hlsLoadPromise;
    hlsLoadPromise = new Promise(resolve => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js";
      script.async = true;
      script.onload = () => resolve(window.Hls || null);
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
    return hlsLoadPromise;
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
    const isHls = /\.m3u8(?:$|\?)/i.test(source);
    if (isHls && !window.Hls && !video.canPlayType("application/vnd.apple.mpegurl")) {
      await ensureHls();
    }
    if (isHls && !window.Hls && !video.canPlayType("application/vnd.apple.mpegurl")) {
      catalogStatus.textContent = "HLS playback is unavailable because the player library could not be loaded.";
      return;
    }
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (isHls && window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls();
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    playerTitle.textContent = text(item.title) || "Now playing";
    activeMediaItem = isLive ? null : item;
    lastProgressPosition = 0;
    modal.classList.add("open");
    if (isLive) {
      activeLiveStreamId = item._id;
      liveChatCursor = null;
      chatMessagesNode.replaceChildren();
      chatPanel.classList.add("open");
      chatStatus.textContent = "Loading live chat…";
      await loadLiveChat(true);
      if (liveChatTimer) window.clearInterval(liveChatTimer);
      liveChatTimer = window.setInterval(() => loadLiveChat(false), 5000);
    } else {
      activeLiveStreamId = "";
      chatPanel.classList.remove("open");
      if (liveChatTimer) {
        window.clearInterval(liveChatTimer);
        liveChatTimer = null;
      }
    }
    try { await video.play(); } catch (_) {}
  }

  function closePlayer() {
    if (liveChatTimer) {
      window.clearInterval(liveChatTimer);
      liveChatTimer = null;
    }
    activeLiveStreamId = "";
    activeMediaItem = null;
    lastProgressPosition = 0;
    liveChatCursor = null;
    chatPanel.classList.remove("open");
    video.pause();
    video.removeAttribute("src");
    video.load();
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    modal.classList.remove("open");
  }

  function appendChatMessage(message) {
    const line = document.createElement("div");
    line.className = "mo-chat-message";
    const author = document.createElement("strong");
    author.textContent = text(message.senderName) || "Viewer";
    const body = document.createElement("span");
    body.textContent = ": " + text(message.body);
    line.append(author, body);
    if (!message.isCreator) {
      const report = document.createElement("button");
      report.type = "button";
      report.textContent = "Report";
      report.dataset.messageId = message._id;
      line.appendChild(report);
    }
    chatMessagesNode.appendChild(line);
    chatMessagesNode.scrollTop = chatMessagesNode.scrollHeight;
  }

  async function loadLiveChat(reset) {
    if (!activeLiveStreamId || liveChatLoading) return;
    liveChatLoading = true;
    try {
      const query = new URLSearchParams({ streamId: activeLiveStreamId, limit: "50" });
      if (!reset && liveChatCursor) query.set("after", liveChatCursor instanceof Date ? liveChatCursor.toISOString() : String(liveChatCursor));
      const result = await getJson(siteBase + "/_functions/liveChatMessages?" + query.toString());
      if (reset) chatMessagesNode.replaceChildren();
      const messages = Array.isArray(result.items) ? result.items : [];
      messages.forEach(appendChatMessage);
      liveChatCursor = result.nextAfter || liveChatCursor;
      chatStatus.textContent = "Live chat is available to signed-in members. Messages are refreshed automatically.";
    } catch (error) {
      chatStatus.textContent = error.message || "Live chat is temporarily unavailable.";
    } finally {
      liveChatLoading = false;
    }
  }

  chatForm.addEventListener("submit", async event => {
    event.preventDefault();
    const body = chatInput.value.trim();
    if (!activeLiveStreamId || !body) return;
    const submit = chatForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    try {
      const message = await getJson(siteBase + "/_functions/sendLiveChatMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ streamId: activeLiveStreamId, body })
      });
      appendChatMessage(message);
      liveChatCursor = message.createdAt || liveChatCursor;
      chatInput.value = "";
      chatStatus.textContent = "Message sent.";
    } catch (error) {
      chatStatus.textContent = error.message || "The message could not be sent. Sign in to participate.";
    } finally {
      submit.disabled = false;
    }
  });

  chatMessagesNode.addEventListener("click", async event => {
    const button = event.target.closest("button[data-message-id]");
    if (!button) return;
    button.disabled = true;
    try {
      await getJson(siteBase + "/_functions/reportLiveChatMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: button.dataset.messageId, reason: "other" })
      });
      chatStatus.textContent = "Message reported for review.";
    } catch (error) {
      chatStatus.textContent = error.message || "The message could not be reported.";
      button.disabled = false;
    }
  });

  video.addEventListener("timeupdate", () => {
    if (!activeMediaItem || activeLiveStreamId) return;
    const durationSeconds = video.duration;
    const positionSeconds = video.currentTime;
    if (!Number.isFinite(durationSeconds) || durationSeconds < 1 ||
        !Number.isFinite(positionSeconds) || positionSeconds - lastProgressPosition < 15) return;
    lastProgressPosition = positionSeconds;
    getJson(siteBase + "/_functions/recordPlaybackProgress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaItemId: activeMediaItem._id,
        durationSeconds,
        positionSeconds
      })
    }).catch(() => {});
  });

  $("#mo-load-more").addEventListener("click", loadMoreCatalog);
  $("#mo-search").addEventListener("input", renderCatalog);
  $("#mo-type").addEventListener("change", renderCatalog);
  $("#mo-rating").addEventListener("change", renderCatalog);
  $("#mo-close").addEventListener("click", closePlayer);
  modal.addEventListener("click", event => { if (event.target === modal) closePlayer(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closePlayer(); });

  function renderStudioRows(node, items, emptyText, getLeft, getRight) {
    node.replaceChildren();
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "mo-empty";
      empty.textContent = emptyText;
      node.appendChild(empty);
      return;
    }
    items.forEach(item => {
      const row = document.createElement("div");
      row.className = "mo-studio-row";
      const left = document.createElement("span");
      left.textContent = getLeft(item);
      const right = document.createElement("span");
      right.textContent = getRight(item);
      row.append(left, right);
      node.appendChild(row);
    });
  }

  async function loadViewerLibrary() {
    const results = await Promise.allSettled([
      getJson(siteBase + "/_functions/myWatchlist?limit=50"),
      getJson(siteBase + "/_functions/continueWatching?limit=30"),
      getJson(siteBase + "/_functions/followingFeed?limit=30")
    ]);
    const successful = results.filter(result => result.status === "fulfilled").length;
    if (!successful) {
      libraryStatus.textContent = "Sign in to view saved media, continue watching and followed-channel updates.";
      return;
    }
    libraryStatus.textContent = "Your member library.";
    const watchlist = results[0].status === "fulfilled" && Array.isArray(results[0].value.items)
      ? results[0].value.items : [];
    const continuing = results[1].status === "fulfilled" && Array.isArray(results[1].value.items)
      ? results[1].value.items : [];
    const feed = results[2].status === "fulfilled" && Array.isArray(results[2].value.items)
      ? results[2].value.items : [];
    continueWatchingNode.replaceChildren();
    watchlistNode.replaceChildren();
    followingFeedNode.replaceChildren();
    if (continuing.length) continuing.forEach(item => continueWatchingNode.appendChild(card(item, false)));
    else continueWatchingNode.innerHTML = '<div class="mo-empty">Nothing to continue watching.</div>';
    if (watchlist.length) watchlist.forEach(item => watchlistNode.appendChild(card(item, false)));
    else watchlistNode.innerHTML = '<div class="mo-empty">Your watchlist is empty.</div>';
    if (feed.length) feed.forEach(item => followingFeedNode.appendChild(card(item, false)));
    else followingFeedNode.innerHTML = '<div class="mo-empty">No new media from followed channels.</div>';
  }

  $("#mo-refresh-library").addEventListener("click", loadViewerLibrary);

  async function loadCreatorStudio() {
    try {
      creatorChannel = await getJson(siteBase + "/_functions/myChannel");
      studioStatus.textContent = creatorChannel
        ? "Signed in. Creator channel: @" + creatorChannel.handle
        : "Signed in. Create a channel profile to begin publishing.";
      if (creatorChannel) {
        $("#mo-channel-name").value = creatorChannel.name || "";
        $("#mo-channel-handle").value = creatorChannel.handle || "";
        $("#mo-channel-description").value = creatorChannel.description || "";
        $("#mo-channel-website").value = creatorChannel.websiteUrl || "";
        $("#mo-channel-avatar").value = creatorChannel.avatarUrl || "";
        $("#mo-channel-banner").value = creatorChannel.bannerUrl || "";
        $("#mo-channel-social").value = Array.isArray(creatorChannel.socialLinks) ? creatorChannel.socialLinks.join("\n") : "";
      }
      const results = await Promise.allSettled([
        getJson(siteBase + "/_functions/mySubmissions?limit=50"),
        getJson(siteBase + "/_functions/myVideoUploads?limit=50"),
        getJson(siteBase + "/_functions/myCreatorAnalytics?limit=500")
      ]);
      if (results[0].status === "fulfilled") {
        const items = Array.isArray(results[0].value.items) ? results[0].value.items : [];
        submissionsStatus.textContent = items.length + " submission" + (items.length === 1 ? "" : "s");
        renderStudioRows(submissionsList, items, "No media submissions yet.", item => item.title || "Untitled media", item => item.status || "Unknown");
      } else {
        submissionsStatus.textContent = "Submissions could not be loaded.";
      }
      if (results[1].status === "fulfilled") renderUploadHistory(results[1].value.items || []);
      if (results[2].status === "fulfilled") {
        const totals = results[2].value.totals || {};
        analyticsNode.textContent = "Playback starts: " + (totals.playbackStarts || 0) +
          " · Watch time: " + Math.round((totals.watchTimeSeconds || 0) / 60) + " min" +
          " · Completions: " + (totals.completions || 0);
      }
    } catch (error) {
      studioStatus.textContent = error.message || "Sign in to manage a creator channel.";
    }
  }

  function renderUploadHistory(items) {
    renderStudioRows(uploadList, items, "No MP4 uploads yet.", item => item.fileName || "Video upload", item => item.status || "Unknown");
    if (pendingUploadSessionId) {
      const pending = items.find(item => item._id === pendingUploadSessionId);
      if (pending) {
        pendingUploadStatus = pending.status;
        if (pending.status === "ready") {
          mediaStatus.textContent = "The MP4 is ready for submission.";
        } else if (pending.status === "failed") {
          mediaStatus.textContent = pending.failureMessage || "The MP4 upload failed.";
        } else {
          mediaStatus.textContent = "Wix video processing status: " + pending.status + ".";
        }
      }
    }
  }

  async function refreshUploadHistory() {
    const result = await getJson(siteBase + "/_functions/myVideoUploads?limit=50");
    renderUploadHistory(Array.isArray(result.items) ? result.items : []);
  }

  function uploadMp4(file, ticket) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append(ticket.multipartFieldName || "file", file, file.name);
      const request = new XMLHttpRequest();
      request.open(ticket.method || "POST", ticket.uploadUrl, true);
      request.upload.onprogress = event => {
        if (event.lengthComputable) {
          mediaStatus.textContent = "Uploading MP4: " + Math.round(event.loaded / event.total * 100) + "%";
        }
      };
      request.onload = () => {
        if (request.status >= 200 && request.status < 300) resolve();
        else reject(new Error("The MP4 upload failed with HTTP status " + request.status + "."));
      };
      request.onerror = () => reject(new Error("The MP4 upload could not complete because of a network error."));
      request.onabort = () => reject(new Error("The MP4 upload was cancelled."));
      request.send(formData);
    });
  }

  $("#mo-upload-video").addEventListener("click", async () => {
    const file = $("#mo-media-file").files[0];
    if (!file) {
      mediaStatus.textContent = "Select an MP4 video file first.";
      return;
    }
    if (!creatorChannel) {
      mediaStatus.textContent = "Create or sign in to a creator channel before uploading.";
      return;
    }
    const button = $("#mo-upload-video");
    button.disabled = true;
    try {
      const ticket = await getJson(siteBase + "/_functions/createVideoUpload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name })
      });
      await uploadMp4(file, ticket);
      pendingUploadSessionId = ticket.uploadSessionId;
      pendingUploadStatus = "uploading";
      mediaStatus.textContent = "Upload received. Wix is processing the video; check its status before submitting.";
      await refreshUploadHistory();
    } catch (error) {
      mediaStatus.textContent = error.message || "The MP4 upload could not be started.";
    } finally {
      button.disabled = false;
    }
  });

  $("#mo-check-upload").addEventListener("click", async () => {
    try {
      await refreshUploadHistory();
      if (!pendingUploadSessionId) mediaStatus.textContent = "Select and upload an MP4 before checking its processing status.";
    } catch (error) {
      mediaStatus.textContent = error.message || "Upload status could not be checked.";
    }
  });

  channelForm.addEventListener("submit", async event => {
    event.preventDefault();
    const button = channelForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      creatorChannel = await getJson(siteBase + "/_functions/saveMyChannel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: $("#mo-channel-name").value,
          handle: $("#mo-channel-handle").value,
          description: $("#mo-channel-description").value,
          websiteUrl: $("#mo-channel-website").value,
          avatarUrl: $("#mo-channel-avatar").value,
          bannerUrl: $("#mo-channel-banner").value,
          socialLinks: $("#mo-channel-social").value.split("\n").map(value => value.trim()).filter(Boolean)
        })
      });
      studioStatus.textContent = "Channel saved: @" + creatorChannel.handle;
      channelStatus.textContent = "Channel profile updated.";
    } catch (error) {
      channelStatus.textContent = error.message || "The channel profile could not be saved.";
    } finally {
      button.disabled = false;
    }
  });

  mediaForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!creatorChannel) {
      mediaStatus.textContent = "Create a creator channel before submitting media.";
      return;
    }
    const file = $("#mo-media-file").files[0];
    const mediaUrl = $("#mo-media-url").value.trim();
    if (file && (!pendingUploadSessionId || pendingUploadStatus !== "ready")) {
      mediaStatus.textContent = "Upload the MP4 and wait until Wix reports that it is ready before submitting.";
      return;
    }
    if (!file && !mediaUrl) {
      mediaStatus.textContent = "Provide an external HTTPS media URL or upload an MP4 video.";
      return;
    }
    const button = mediaForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const payload = {
        creatorChannelId: creatorChannel._id,
        title: $("#mo-media-title").value,
        description: $("#mo-media-description").value,
        contentType: $("#mo-media-type").value,
        contentRating: $("#mo-media-rating").value,
        category: $("#mo-media-category").value,
        tags: $("#mo-media-tags").value.split(",").map(value => value.trim()).filter(Boolean),
        language: $("#mo-media-language").value,
        durationSeconds: $("#mo-media-duration").value,
        thumbnailUrl: $("#mo-media-thumbnail").value
      };
      if (file) payload.mediaUploadSessionId = pendingUploadSessionId;
      else payload.mediaUrl = mediaUrl;
      const result = await getJson(siteBase + "/_functions/submitContent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      mediaStatus.textContent = "Submitted for review: " + result.title + ".";
      mediaForm.reset();
      pendingUploadSessionId = "";
      pendingUploadStatus = "";
      await loadCreatorStudio();
    } catch (error) {
      mediaStatus.textContent = error.message || "The media submission could not be completed.";
    } finally {
      button.disabled = false;
    }
  });

  async function loadMyLiveStreams() {
    if (!creatorChannel) return;
    const result = await getJson(siteBase + "/_functions/myLiveStreams?limit=50");
    myLiveStreamsNode.replaceChildren();
    const items = Array.isArray(result.items) ? result.items : [];
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "mo-empty";
      empty.textContent = "No live-stream sessions yet.";
      myLiveStreamsNode.appendChild(empty);
      return;
    }
    items.forEach(stream => {
      const row = document.createElement("div");
      row.className = "mo-studio-row";
      const label = document.createElement("span");
      label.textContent = (stream.title || "Untitled stream") + " · " + stream.status;
      row.appendChild(label);
      if (!["ended", "cancelled"].includes(stream.status)) {
        const end = document.createElement("button");
        end.className = "mo-btn";
        end.type = "button";
        end.textContent = "End";
        end.addEventListener("click", async () => {
          end.disabled = true;
          try {
            await getJson(siteBase + "/_functions/endLiveStream", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ streamId: stream._id })
            });
            creatorLiveStatus.textContent = "The live-stream session has ended.";
            await loadMyLiveStreams();
            await refreshSongQueue();
          } catch (error) {
            creatorLiveStatus.textContent = error.message || "The stream could not be ended.";
            end.disabled = false;
          }
        });
        row.appendChild(end);
      }
      myLiveStreamsNode.appendChild(row);
    });
  }

  async function refreshSongQueue() {
    if (!creatorChannel) return;
    try {
      const result = await getJson(siteBase + "/_functions/songQueue?creatorChannelId=" + encodeURIComponent(creatorChannel._id));
      songQueueNode.replaceChildren();
      const items = Array.isArray(result.items) ? result.items : [];
      if (!result.live) {
        queueStatus.textContent = "Song requests appear here while this channel is live.";
      } else {
        queueStatus.textContent = items.length + " queued song" + (items.length === 1 ? "" : "s");
      }
      if (!items.length) {
        const empty = document.createElement("div");
        empty.className = "mo-empty";
        empty.textContent = "The live song queue is empty.";
        songQueueNode.appendChild(empty);
        return;
      }
      items.forEach(song => {
        const row = document.createElement("div");
        row.className = "mo-studio-row";
        const label = document.createElement("span");
        label.textContent = song.title + " — " + song.artist;
        row.appendChild(label);
        ["played", "skipped"].forEach(status => {
          const button = document.createElement("button");
          button.className = "mo-btn";
          button.type = "button";
          button.textContent = status === "played" ? "Played" : "Skip";
          button.addEventListener("click", async () => {
            button.disabled = true;
            try {
              await getJson(siteBase + "/_functions/setSongRequestStatus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: song._id, status })
              });
              await refreshSongQueue();
            } catch (error) {
              queueStatus.textContent = error.message || "The song request could not be updated.";
              button.disabled = false;
            }
          });
          row.appendChild(button);
        });
        songQueueNode.appendChild(row);
      });
    } catch (error) {
      queueStatus.textContent = error.message || "The live song queue could not be loaded.";
    }
  }

  liveForm.addEventListener("submit", async event => {
    event.preventDefault();
    if (!creatorChannel) {
      creatorLiveStatus.textContent = "Create a creator channel before starting a live stream.";
      return;
    }
    const button = liveForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const result = await getJson(siteBase + "/_functions/createLiveStream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorChannelId: creatorChannel._id,
          title: $("#mo-live-title").value,
          description: $("#mo-live-description").value,
          contentRating: $("#mo-live-rating").value,
          category: $("#mo-live-category").value,
          thumbnailUrl: $("#mo-live-thumbnail").value
        })
      });
      ingestUrlNode.value = result.ingestUrl || "";
      creatorLiveStatus.textContent = "Live-stream session created with status: " + result.status + ". Complete rights review and moderation before broadcasting.";
      await loadMyLiveStreams();
    } catch (error) {
      creatorLiveStatus.textContent = error.message || "The live-stream session could not be created.";
    } finally {
      button.disabled = false;
    }
  });

  $("#mo-refresh-queue").addEventListener("click", refreshSongQueue);

  async function init() {
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
        const follow = document.createElement("button");
        follow.className = "mo-btn";
        follow.type = "button";
        follow.textContent = "Follow";
        follow.addEventListener("click", async () => {
          follow.disabled = true;
          try {
            await getJson(siteBase + "/_functions/followCreator", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ creatorChannelId: creator._id })
            });
            follow.textContent = "Following";
            await loadViewerLibrary();
          } catch (error) {
            follow.textContent = "Sign in to follow";
            follow.disabled = false;
          }
        });
        item.appendChild(follow);
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