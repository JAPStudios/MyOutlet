import wixData from 'wix-data';

const COLLECTION = 'Notifications';

function text(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function createNotification(input = {}) {
  const recipientMemberId = text(input.recipientMemberId, 100);
  const sourceId = text(input.sourceId, 100);
  const type = text(input.type, 40);
  if (!recipientMemberId || !sourceId || !type) return null;

  const notificationKey = [type, sourceId, recipientMemberId].join(':');
  const existing = await wixData.query(COLLECTION)
    .eq('notificationKey', notificationKey)
    .limit(1)
    .find({ suppressAuth: true });
  if (existing.items.length) return existing.items[0]._id;

  const record = {
    notificationKey,
    recipientMemberId,
    actorMemberId: text(input.actorMemberId, 100),
    type,
    mediaItemId: text(input.mediaItemId, 100),
    creatorChannelId: text(input.creatorChannelId, 100),
    sourceId,
    message: text(input.message, 240),
    readAt: null,
    createdAt: new Date()
  };
  try {
    const created = await wixData.insert(COLLECTION, record, { suppressAuth: true });
    return created._id;
  } catch (error) {
    const duplicate = await wixData.query(COLLECTION)
      .eq('notificationKey', notificationKey)
      .limit(1)
      .find({ suppressAuth: true });
    if (duplicate.items.length) return duplicate.items[0]._id;
    throw error;
  }
}
