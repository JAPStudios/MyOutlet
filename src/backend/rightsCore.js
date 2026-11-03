import wixData from 'wix-data';

const RIGHTS = 'RightsRecords';

function requiredText(value, field, max) {
  if (typeof value !== 'string') throw new Error(field + ' must be text.');
  const result = value.trim();
  if (!result || result.length > max) {
    throw new Error(field + ' is required and must be at most ' + max + ' characters.');
  }
  return result;
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
  if (record.validUntil && new Date(record.validUntil) < now) return null;
  return {
    mediaItemId: record.mediaItemId,
    rightsBasis: record.rightsBasis,
    territories: record.territories || [],
    validUntil: record.validUntil || null
  };
}
