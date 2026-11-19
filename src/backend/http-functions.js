import wixData from 'wix-data';
import { mediaManager } from 'wix-media-backend';
import { createHash, timingSafeEqual } from 'crypto';
import { ok, forbidden, badRequest, serverError } from 'wix-http-functions';
import { isMediaRightsCurrent } from 'backend/rightsCore';

const LIVE = 'LiveStreams';
const MEDIA = 'MediaItems';
const CHANNELS = 'CreatorChannels';
const FOLLOWS = 'CreatorFollows';
const NOTIFICATIONS = 'Notifications';

function normalizePath(value) {
  if (typeof value !== 'string') return '';
  return value.trim().replace(/^\\/+|\\/+$/g, '').replace(/\\/index\\.m3u8$/i, '');
}

function matchesStreamKey(candidate, storedHash) {
  if (typeof candidate !== 'string' || !candidate || typeof storedHash !== 'string') return false;
  const candidateHash = createHash('sha256').update(candidate).digest();
  let stored;
  try { stored = Buffer.from(storedHash, 'hex'); } catch (_) { return false; }
  return stored.length === candidateHash.length && timingSafeEqual(stored, candidateHash);
}

function publicMedia(item) {
  return {
    _id: item._id,
    title: item.title || '',
    description: item.description || '',
    mediaUrl: item.mediaUrl || '',
    thumbnailUrl: item.thumbnailUrl || '',
    contentType: item.contentType || '',
    contentRating: item.contentRating || 'Unrated',
    category: item.category || 'Other',
    tags: Array.isArray(item.tags) ? item.tags : [],
    language: item.language || '',
    durationSeconds: Number(item.durationSeconds) || 0,
    creatorChannelId: item.creatorChannelId || '',
    publishedAt: item.publishedAt || item._createdDate || null
  };
}

export async function get_publicCatalog() {
  try {
    const result = await wixData.query(MEDIA)
      .eq('status', 'published')
      .descending('publishedAt')
      .limit(50)
      .find({ suppressAuth: true, returnTotalCount: true });
    const items = result.items
      .filter(item => isMediaRightsCurrent(item) && ['video', 'audio'].includes(item.contentType))
      .map(publicMedia);
    return ok({ items, total: result.totalCount });
  } catch (error) {
    console.error('MyOutlet public catalogue request failed.', error);
    return serverError();
  }
}

export async function get_publicLiveStreams() {
  try {
    const result = await wixData.query(LIVE)
      .eq('status', 'live')
      .descending('startedAt')
      .limit(50)
      .find({ suppressAuth: true, returnTotalCount: true });
    const items = await Promise.all(result.items.map(async stream => {
      const media = await wixData.get(MEDIA, stream.mediaItemId, { suppressAuth: true });
      if (!media || media.status !== 'published' || media.contentType !== 'livestream' ||
          !isMediaRightsCurrent(media) || typeof media.mediaUrl !== 'string' ||
          !/^https:\\/\\//i.test(media.mediaUrl)) return null;
      return {
        _id: stream._id,
        mediaItemId: media._id,
        creatorChannelId: stream.creatorChannelId,
        status: stream.status,
        title: media.title || '',
        description: media.description || '',
        thumbnailUrl: media.thumbnailUrl || '',
        contentRating: media.contentRating || 'Unrated',
        category: media.category || 'Live',
        startedAt: stream.startedAt || null,
        playbackUrl: media.mediaUrl
      };
    }));
    const visible = items.filter(Boolean);
    return ok({ items: visible, total: visible.length });
  } catch (error) {
    console.error('MyOutlet public live-stream request failed.', error);
    return serverError();
  }
}

export async function get_publicCreators() {
  try {
    const result = await wixData.query(CHANNELS)
      .ascending('name')
      .limit(50)
      .find({ suppressAuth: true, returnTotalCount: true });
    const items = result.items.map(channel => ({
      _id: channel._id,
      name: channel.name || '',
      handle: channel.handle || '',
      description: channel.description || '',
      avatarUrl: channel.avatarUrl || '',
      bannerUrl: channel.bannerUrl || '',
      websiteUrl: channel.websiteUrl || '',
      socialLinks: Array.isArray(channel.socialLinks) ? channel.socialLinks : [],
      createdAt: channel.createdAt || null
    }));
    return ok({ items, total: result.totalCount });
  } catch (error) {
    console.error('MyOutlet public creator directory request failed.', error);
    return serverError();
  }
}

export async function post_publicPlayback(request) {
  let payload;
  try {
    payload = await request.body.json();
  } catch (_) {
    return badRequest();
  }
  const mediaItemId = typeof payload.mediaItemId === 'string' ? payload.mediaItemId.trim() : '';
  if (!mediaItemId || mediaItemId.length > 100) return badRequest();

  try {
    const media = await wixData.get(MEDIA, mediaItemId, { suppressAuth: true });
    if (!media || media.status !== 'published' || !isMediaRightsCurrent(media) ||
        !['video', 'audio', 'livestream'].includes(media.contentType)) {
      return forbidden();
    }
    if (typeof media.mediaUrl !== 'string' || !media.mediaUrl) return forbidden();

    let playbackUrl = media.mediaUrl;
    let format = 'external';
    if (media.contentType === 'video' && media.mediaUrl.startsWith('wix:video://')) {
      const requestedFormat = typeof payload.format === 'string' ? payload.format.toLowerCase() : 'hls';
      if (!['hls', 'dash'].includes(requestedFormat)) return badRequest();
      const playback = await mediaManager.getVideoPlaybackUrl(media.mediaUrl, requestedFormat);
      playbackUrl = typeof playback === 'string' ? playback : playback;
      format = requestedFormat;
    } else if (!/^https:\\/\\//i.test(media.mediaUrl)) {
      return forbidden();
    }
    return ok({
      mediaItemId: media._id,
      title: media.title || '',
      contentType: media.contentType,
      contentRating: media.contentRating || 'Unrated',
      format,
      url: playbackUrl
    });
  } catch (error) {
    console.error('MyOutlet public playback request failed.', error);
    return serverError();
  }
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
