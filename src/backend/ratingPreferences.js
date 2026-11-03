import wixData from 'wix-data';

const COLLECTION = 'ViewerPreferences';
const RATING_ORDER = ['TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'];

export async function getViewerRatingPreference(memberId) {
  if (!memberId) throw new Error('A member ID is required.');
  const result = await wixData.query(COLLECTION)
    .eq('memberId', memberId)
    .limit(1)
    .find({ suppressAuth: true });
  if (!result.items.length) {
    return { maxContentRating: 'TV-MA', hideUnrated: false };
  }
  return {
    maxContentRating: result.items[0].maxContentRating || 'TV-MA',
    hideUnrated: result.items[0].hideUnrated === true,
    updatedAt: result.items[0].updatedAt
  };
}

export async function saveViewerRatingPreference(memberId, input = {}) {
  if (!memberId) throw new Error('A signed-in site member is required.');
  const maxContentRating = input.maxContentRating;
  if (!RATING_ORDER.includes(maxContentRating)) {
    throw new Error('Maximum content rating must be TV-Y, TV-Y7, TV-G, TV-PG, TV-14 or TV-MA.');
  }
  const hideUnrated = input.hideUnrated === undefined ? false : input.hideUnrated;
  if (typeof hideUnrated !== 'boolean') {
    throw new Error('Hide unrated content must be true or false.');
  }

  const existing = await wixData.query(COLLECTION)
    .eq('memberId', memberId)
    .limit(1)
    .find({ suppressAuth: true });
  const record = {
    memberId,
    maxContentRating,
    hideUnrated,
    updatedAt: new Date()
  };
  const saved = existing.items.length
    ? await wixData.update(COLLECTION, { ...existing.items[0], ...record }, { suppressAuth: true })
    : await wixData.insert(COLLECTION, record, { suppressAuth: true });

  return {
    maxContentRating: saved.maxContentRating,
    hideUnrated: saved.hideUnrated,
    updatedAt: saved.updatedAt
  };
}

export async function applyViewerRatingPreference(query, memberId) {
  if (!memberId) return query;
  const preference = await getViewerRatingPreference(memberId);
  const maximum = RATING_ORDER.indexOf(preference.maxContentRating);
  const allowed = RATING_ORDER.slice(0, maximum + 1);
  if (!preference.hideUnrated) allowed.push('Unrated');
  return query.hasSome('contentRating', allowed);
}

export async function isContentRatingAllowed(contentRating, memberId) {
  if (!memberId) return true;
  const preference = await getViewerRatingPreference(memberId);
  if (contentRating === 'Unrated') return !preference.hideUnrated;
  const ratingIndex = RATING_ORDER.indexOf(contentRating);
  const maximum = RATING_ORDER.indexOf(preference.maxContentRating);
  return ratingIndex >= 0 && ratingIndex <= maximum;
}
