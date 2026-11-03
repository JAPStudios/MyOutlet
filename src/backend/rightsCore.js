import wixData from 'wix-data';

const RIGHTS = 'RightsRecords';
const MEDIA = 'MediaItems';

function requiredText(value, field, max) {
  if (typeof value !== 'string') throw new Error(field + ' must be text.');
  const result = value.trim();
  if (!result || result.length > max) {
    throw new Error(field + ' is required and must be at most ' + max + ' characters.');
  }
  return result;
}

export function isMediaRightsCurrent(media) {
  if (!media || media.rightsVerified !== true) return false;
  if (!media.rightsValidUntil) return true;
  const expiry = new Date(media.rightsValidUntil);
  if (!Number.isFinite(expiry.getTime())) return false;
  expiry.setUTCHours(23, 59, 59, 999);
  return expiry.getTime() >= Date.now();
}

export function applyVerifiedRightsFilter(query) {
  const now = new Date();
  now.setUTCHours(0, 0, 0, 0);
  const noExpiry = wixData.query(MEDIA).isEmpty('rightsValidUntil');
  const currentExpiry = wixData.query(MEDIA).ge('rightsValidUntil', now);
  return query.eq('rightsVerified', true).and(noExpiry.or(currentExpiry));
}

export async function getVerifiedRightsForMedia(mediaItemId) {
  const id = requiredText(mediaItemId, 'Media item ID', 100);
  const result = await wixData.query(RIGHTS)
    .eq('mediaItemId', id)
    .eq('status', 'verified')
    .limit(1)
    .find({ suppressAuth: true });
  if (!result.items.length) return null;
  const record = result.items[0];
  const now = new Date();
  if (record.validFrom && new Date(record.validFrom) > now) return null;
  if (record.validUntil) {
    const expiry = new Date(record.validUntil);
    expiry.setUTCHours(23, 59, 59, 999);
    if (expiry < now) return null;
  }
  return {
    mediaItemId: record.mediaItemId,
    rightsBasis: record.rightsBasis,
    territories: record.territories || [],
    validUntil: record.validUntil || null
  };
}
