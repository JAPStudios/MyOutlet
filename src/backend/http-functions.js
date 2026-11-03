import wixData from 'wix-data';
import { createHash, timingSafeEqual } from 'crypto';
import { ok, forbidden, badRequest, serverError } from 'wix-http-functions';
import { isMediaRightsCurrent } from 'backend/rightsCore';

const LIVE = 'LiveStreams';
const MEDIA = 'MediaItems';

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
      const now = new Date();
      await wixData.update(LIVE, {
        ...stream,
        status: 'live',
        startedAt: stream.startedAt || now,
        lastPublisherAt: now,
        updatedAt: now
      }, { suppressAuth: true });
      return ok();
    }

    if (stream.status !== 'live') return forbidden();
    return ok();
  } catch (error) {
    console.error('MyOutlet live-stream authentication failed.', error);
    return serverError();
  }
}
