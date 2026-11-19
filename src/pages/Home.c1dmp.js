import { browseCatalog, browseCreators } from "backend/catalog.jsw";
import { browseLiveStreams } from "backend/liveStreams.jsw";
import { getPublishedMediaPlayback } from "backend/media.jsw";
import { getLiveChatMessages, sendLiveChatMessage, reportLiveChatMessage } from "backend/liveChat.jsw";

const REQUEST_EVENT = "myoutlet:request";
const RESPONSE_EVENT = "myoutlet:response";
const READY_EVENT = "myoutlet:bridge-ready";

function sendResponse(id, ok, value) {
  window.dispatchEvent(new CustomEvent(RESPONSE_EVENT, {
    detail: ok
      ? { id, ok: true, data: value }
      : { id, ok: false, error: value }
  }));
}

async function handleRequest(detail) {
  const id = detail && typeof detail.id === "string" ? detail.id : "";
  const route = detail && typeof detail.route === "string" ? detail.route : "";
  const method = detail && typeof detail.method === "string" ? detail.method.toUpperCase() : "GET";
  const query = detail && detail.query && typeof detail.query === "object" ? detail.query : {};
  const body = detail && detail.body && typeof detail.body === "object" ? detail.body : {};

  if (!id || id.length > 120) return;

  try {
    let result;
    if (method === "GET" && route === "publicCatalog") {
      const offset = Math.min(Math.max(Number(query.offset) || 0, 0), 10000);
      const page = await browseCatalog({ offset, limit: 50 });
      const nextOffset = offset + page.items.length;
      result = {
        ...page,
        nextOffset,
        hasMore: nextOffset < page.total
      };
    } else if (method === "GET" && route === "publicLiveStreams") {
      result = await browseLiveStreams({ limit: 50, offset: 0 });
    } else if (method === "GET" && route === "publicCreators") {
      result = await browseCreators({ limit: 50, offset: 0 });
    } else if (method === "POST" && route === "publicPlayback") {
      result = await getPublishedMediaPlayback(body);
    } else if (method === "GET" && route === "liveChatMessages") {
      result = await getLiveChatMessages(query);
    } else if (method === "POST" && route === "sendLiveChatMessage") {
      result = await sendLiveChatMessage(body);
    } else if (method === "POST" && route === "reportLiveChatMessage") {
      result = await reportLiveChatMessage(body);
    } else {
      throw new Error("Unsupported MyOutlet request.");
    }
    sendResponse(id, true, result);
  } catch (error) {
    const message = error && typeof error.message === "string"
      ? error.message
      : "The MyOutlet request could not be completed.";
    sendResponse(id, false, message);
  }
}

$w.onReady(function () {
  window.addEventListener(REQUEST_EVENT, event => {
    handleRequest(event.detail);
  });
  window.__myOutletVeloReady = true;
  window.dispatchEvent(new CustomEvent(READY_EVENT));
});
