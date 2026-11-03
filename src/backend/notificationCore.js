import wixData from 'wix-data';

const COLLECTION = 'Notifications';
const TYPES = new Set(['new_follower', 'song_request', 'new_comment']);

function requiredText(value, field, maximum) {
  if (typeof value !== 'string') {
    throw new Error(field + ' is required.');
  }
  const result = value.trim();
  if (!result || result.length > maximum) {
    throw new Error(field + ' must contain between 1 and ' + maximum + ' characters.');
  }
  return result;
}

export async function createNotification(input = {}) {
  const recipientMemberId = requiredText(input.recipientMemberId, 'Recipient member ID', 100);
  const actorMemberId = requiredText(input.actorMemberId, 'Actor member ID', 100);
  const type = requiredText(input.type, 'Notification type', 40);
  const sourceId = requiredText(input.sourceId, 'Notification source ID', 100);
  const message = requiredText(input.message, 'Notification message', 500);

  if (!TYPES.has(type)) {
    throw new Error('Unsupported notification type.');
  }

  const item = {
    notificationKey: [type, recipientMemberId, sourceId].join(':'),
    recipientMemberId,
    actorMemberId,
    type,
    mediaItemId: typeof input.mediaItemId === 'string' ? input.mediaItemId.slice(0, 100) : '',
    creatorChannelId: typeof input.creatorChannelId === 'string' ? input.creatorChannelId.slice(0, 100) : '',
    sourceId,
    message,
    createdAt: new Date()
  };

  const existing = await wixData.query(COLLECTION)
    .eq('notificationKey', item.notificationKey)
    .limit(1)
    .find({ suppressAuth: true });

  if (existing.items.length) {
    return { notificationId: existing.items[0]._id, created: false };
  }

  const created = await wixData.insert(COLLECTION, item, { suppressAuth: true });
  return { notificationId: created._id, created: true };
}
