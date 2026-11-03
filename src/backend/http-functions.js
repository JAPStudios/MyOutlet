import wixData from 'wix-data';
import { createHash, timingSafeEqual } from 'crypto';
import { ok, forbidden, badRequest, serverError } from 'wix-http-functions';
import { isMediaRightsCurrent } from 'backend/rightsCore';

const LIVE = 'LiveStreams';
const MEDIA = 'MediaItems';
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
          while (true) {
            const followers = await wixData.query(FOLLOWS)
              .eq('creatorChannelId', stream.creatorChannelId)
              .ascending('_createdDate')
              .skip(offset)
              .limit(1000)
              .find({ suppressAuth: true });
            if (!followers.items.length) break;

            const now = new Date();
            const notifications = followers.items.map(follow => ({
                notificationKey: ['new_live_stream', stream._id, follow.memberId].join(':'),
                recipientMemberId: follow.memberId,
                actorMemberId: stream.creatorMemberId,
                type: 'new_live_stream',
                creatorChannelId: stream.creatorChannelId,
                mediaItemId: media._id,
                sourceId: stream._id,
                message: (media.title || 'A creator you follow') + ' is live now.',
                readAt: null,
                createdAt: now
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
