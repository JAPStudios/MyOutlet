import wixData from 'wix-data';
import { createHash, timingSafeEqual } from 'crypto';
import { ok, forbidden, badRequest, serverError } from 'wix-http-functions';
import { isMediaRightsCurrent } from 'backend/rightsCore';

const LIVE = 'LiveStreams';
const MEDIA = 'MediaItems';
const CHAT = 'LiveChatMessages';
const FOLLOWS = 'CreatorFollows';
const NOTIFICATIONS = 'Notifications';

function normalizePath(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^\/+|\/+$/g, '').replace(/\/index\.m3u8$/i, '');
}

function matchesStreamKey(candidate, storedHash) {
  if (typeof candidate !== 'string' || !candidate || typeof storedHash !== 'string') return false;
  const candidateHash = createHash('sha256').update(candidate).digest();
  let stored;
  try { stored = Buffer.from(storedHash, 'hex'); } catch (_) { return false; }
  return stored.length === candidateHash.length && timingSafeEqual(stored, candidateHash);
}

export async function post_streamAuth(request) {
  let payload;
  try {
    payload = await request.body.json();
  } catch (_) {
    return badRequest();
  }

  const action = typeof payload.action === 'string' ? payload.action : '';
  const streamPath = normalizePath(payload.path);
  if (!streamPath || !['publish', 'read', 'playback'].includes(action)) {
    return badRequest();
  }

  try {
    const result = await wixData.query(LIVE)
      .eq('streamPath', streamPath)
      .limit(1)
      .find({ suppressAuth: true });
    if (!result.items.length) return forbidden();

    const stream = result.items[0];
    const media = await wixData.get(MEDIA, stream.mediaItemId, { suppressAuth: true });
    if (!media || media.status !== 'published' || !isMediaRightsCurrent(media)) {
      return forbidden();
    }

    if (action === 'publish') {
      if (stream.status !== 'ready' && stream.status !== 'live') return forbidden();
      if (payload.user !== stream.creatorChannelId ||
          !matchesStreamKey(payload.password, stream.streamKeyHash)) {
        return forbidden();
      }
      const starting = stream.status !== 'live';
      const now = new Date();
      await wixData.update(LIVE, {
        ...stream,
        status: 'live',
        startedAt: stream.startedAt || now,
        lastPublisherAt: now,
        updatedAt: now
      }, { suppressAuth: true });
      if (starting) {
        try {
          let offset = 0;
          const seenRecipients = new Set();
          while (true) {
            const followers = await wixData.query(FOLLOWS)
              .eq('creatorChannelId', stream.creatorChannelId)
              .ascending('_createdDate')
              .skip(offset)
              .limit(1000)
              .find({ suppressAuth: true });
            if (!followers.items.length) break;

            const recipients = followers.items
              .map(follow => follow.memberId)
              .filter(memberId => typeof memberId === 'string' && memberId && !seenRecipients.has(memberId));
            recipients.forEach(memberId => seenRecipients.add(memberId));
            const notificationTime = new Date();
            const notifications = recipients.map(memberId => ({
              notificationKey: ['new_live_stream', stream._id, memberId].join(':'),
              recipientMemberId: memberId,
              actorMemberId: stream.creatorMemberId,
              type: 'new_live_stream',
              creatorChannelId: stream.creatorChannelId,
              mediaItemId: media._id,
              sourceId: stream._id,
              message: (media.title || 'A creator you follow') + ' is live now.',
              readAt: null,
              createdAt: notificationTime
            }));
            if (notifications.length) {
              const inserted = await wixData.bulkInsert(NOTIFICATIONS, notifications, { suppressAuth: true });
              if (inserted.errors && inserted.errors.length) {
                console.error('MyOutlet live notification batch had errors.', inserted.errors);
              }
            }
            offset += followers.items.length;
            if (followers.items.length < 1000) break;
          }
        } catch (error) {
          console.error('MyOutlet live notification fan-out failed.', error);
        }
      }
      return ok();
    }

    if (stream.status !== 'live') return forbidden();
    return ok();
  } catch (error) {
    console.error('MyOutlet live-stream authentication failed.', error);
    return serverError();
  }
}

async function getChatOverlaySession(request) {
  const query = request && request.query ? request.query : {};
  const streamId = typeof query.streamId === 'string' ? query.streamId.trim() : '';
  const token = typeof query.token === 'string' ? query.token.trim() : '';
  if (!streamId || streamId.length > 100 || !/^[a-f0-9]{64}$/.test(token)) return null;

  let stream;
  try {
    stream = await wixData.get(LIVE, streamId, { suppressAuth: true });
  } catch (_) {
    return null;
  }
  if (!stream || !matchesStreamKey(token, stream.chatOverlayTokenHash)) return null;

  let media = null;
  try {
    media = await wixData.get(MEDIA, stream.mediaItemId, { suppressAuth: true });
  } catch (_) {
    media = null;
  }
  const rightsValid = !!media && media.status === 'published' && isMediaRightsCurrent(media);
  return {
    stream,
    media,
    rightsValid,
    live: stream.status === 'live' && rightsValid
  };
}

const CHAT_OVERLAY_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MyOutlet Live Chat</title>
<style>
:root{color-scheme:dark;font-family:Inter,Arial,sans-serif}
*{box-sizing:border-box}
html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent;color:#fff}
#overlay{display:flex;flex-direction:column;justify-content:flex-end;width:100%;height:100%;padding:18px;gap:10px}
#status{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#d7d7d7;text-shadow:0 1px 4px #000}
#messages{display:flex;flex-direction:column;gap:8px;max-height:100%;overflow:hidden}
.message{width:fit-content;max-width:100%;padding:8px 12px;border-radius:10px;background:rgba(12,14,18,.78);font-size:20px;line-height:1.3;overflow-wrap:anywhere;text-shadow:0 1px 2px #000;box-shadow:0 2px 12px rgba(0,0,0,.25)}
.message strong{color:#fff;font-weight:800}
</style>
</head>
<body>
<main id="overlay" aria-live="polite">
<div id="status">Waiting for stream</div>
<div id="messages"></div>
</main>
<script>
(function(){
  var params = new URLSearchParams(window.location.search);
  var streamId = params.get('streamId') || '';
  var token = params.get('token') || '';
  var status = document.getElementById('status');
  var messages = document.getElementById('messages');
  var timer = null;
  var endpoint = '/_functions/chatOverlayMessages?streamId=' +
    encodeURIComponent(streamId) + '&token=' + encodeURIComponent(token);
  async function refresh(){
    try{
      var response = await fetch(endpoint, {cache:'no-store'});
      if(!response.ok) throw new Error('Chat overlay request failed');
      var data = await response.json();
      if(data.state === 'ended' || data.state === 'cancelled'){
        status.textContent = 'Stream ended';
        if(timer) clearInterval(timer);
        return;
      }
      if(!data.live){
        status.textContent = data.state === 'unavailable' ? 'Stream unavailable' : 'Waiting for stream';
        return;
      }
      status.textContent = 'Live chat';
      var fragment = document.createDocumentFragment();
      (data.items || []).forEach(function(item){
        var row = document.createElement('div');
        row.className = 'message';
        var name = document.createElement('strong');
        name.textContent = (item.senderName || 'Viewer') + ': ';
        var body = document.createElement('span');
        body.textContent = item.body || '';
        row.appendChild(name);
        row.appendChild(body);
        fragment.appendChild(row);
      });
      messages.replaceChildren(fragment);
    }catch(error){
      status.textContent = 'Chat temporarily unavailable';
    }
  }
  refresh();
  timer = setInterval(refresh, 2500);
})();
</script>
</body>
</html>`;

export async function get_chatOverlay(request) {
  try {
    const session = await getChatOverlaySession(request);
    if (!session) return forbidden();
    return ok({
      body: CHAT_OVERLAY_HTML,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('MyOutlet chat overlay page failed.', error);
    return serverError();
  }
}

export async function get_chatOverlayMessages(request) {
  try {
    const session = await getChatOverlaySession(request);
    if (!session) return forbidden();
    if (session.stream.status !== 'live') {
      return ok({
        body: { live: false, state: session.stream.status, items: [] },
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }
    if (!session.rightsValid) {
      return ok({
        body: { live: false, state: 'unavailable', items: [] },
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }

    const result = await wixData.query(CHAT)
      .eq('liveStreamId', session.stream._id)
      .eq('status', 'published')
      .descending('createdAt')
      .limit(30)
      .find({ suppressAuth: true });
    const items = result.items.reverse().map(item => ({
      senderName: item.senderName || 'Viewer',
      body: item.body,
      createdAt: item.createdAt
    }));
    return ok({
      body: { live: true, state: 'live', items },
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('MyOutlet chat overlay polling failed.', error);
    return serverError();
  }
}

