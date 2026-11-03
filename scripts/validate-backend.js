const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const parse = file => JSON.parse(read(file));
const permissions = parse('src/backend/permissions.json')['web-methods'];
const cms = read('CMS_COLLECTIONS.md');
const site = parse('wix.config.json');
const tick = String.fromCharCode(96);

assert.equal(site.siteId, '34798e4b-3c1a-45ff-a023-4ea4b83cc9f8',
  'wix.config.json must target the MyOutlet site');
assert.equal(permissions['*']['*'].siteMember.invoke, false,
  'Unlisted web methods must not be callable by site members');
assert.equal(permissions['*']['*'].anonymous.invoke, false,
  'Unlisted web methods must not be callable anonymously');

const publicMethods = new Set([
  'backend/catalog.jsw:browseCreators',
  'backend/catalog.jsw:searchCreators',
  'backend/catalog.jsw:getCreatorProfile',
  'backend/catalog.jsw:browseCatalog',
  'backend/catalog.jsw:searchCatalog',
  'backend/catalog.jsw:getSongQueue',
  'backend/catalog.jsw:getCreatorCatalog',
  'backend/liveStreams.jsw:browseLiveStreams',
  'backend/liveStreams.jsw:getLiveStream',
  'backend/media.jsw:getPublishedVideoPlayback',
  'backend/media.jsw:getPublishedMediaPlayback',
  'backend/engagement.jsw:getMediaEngagement',
  'backend/engagement.jsw:listComments',
  'backend/playlists.jsw:getPlaylist'
]);

const memberMethods = new Set([
  'backend/catalog.jsw:getMyChannel',
  'backend/catalog.jsw:saveMyChannel',
  'backend/catalog.jsw:submitContent',
  'backend/catalog.jsw:enqueueSong',
  'backend/catalog.jsw:getMySubmissions',
  'backend/catalog.jsw:setSongRequestStatus',
  'backend/viewer.jsw:addToWatchlist',
  'backend/viewer.jsw:removeFromWatchlist',
  'backend/viewer.jsw:getMyWatchlist',
  'backend/viewer.jsw:recordPlaybackProgress',
  'backend/viewer.jsw:getContinueWatching',
  'backend/viewer.jsw:clearPlaybackProgress',
  'backend/viewer.jsw:followCreator',
  'backend/viewer.jsw:unfollowCreator',
  'backend/viewer.jsw:getMyFollowing',
  'backend/viewer.jsw:getFollowingFeed',
  'backend/viewer.jsw:getMyViewingPreferences',
  'backend/viewer.jsw:setMyViewingPreferences',
  'backend/viewer.jsw:getMyCreatorAnalytics',
  'backend/media.jsw:createVideoUpload',
  'backend/media.jsw:getMyVideoUploads',
  'backend/reports.jsw:reportContent',
  'backend/reports.jsw:getMyContentReports',
  'backend/engagement.jsw:likeMedia',
  'backend/engagement.jsw:unlikeMedia',
  'backend/engagement.jsw:addComment',
  'backend/engagement.jsw:editComment',
  'backend/engagement.jsw:deleteComment',
  'backend/engagement.jsw:listMyPendingComments',
  'backend/engagement.jsw:moderateMyChannelComment',
  'backend/playlists.jsw:createPlaylist',
  'backend/playlists.jsw:updatePlaylist',
  'backend/playlists.jsw:deletePlaylist',
  'backend/playlists.jsw:addMediaToPlaylist',
  'backend/playlists.jsw:removeMediaFromPlaylist',
  'backend/playlists.jsw:reorderPlaylistItems',
  'backend/playlists.jsw:getMyPlaylists',
  'backend/notifications.jsw:getMyNotifications',
  'backend/notifications.jsw:markNotificationRead',
  'backend/notifications.jsw:markAllNotificationsRead',
  'backend/liveStreams.jsw:createLiveStream',
  'backend/liveStreams.jsw:getMyLiveStreams',
  'backend/liveStreams.jsw:endLiveStream',
  'backend/rights.jsw:submitRightsDeclaration',
  'backend/rights.jsw:getMyRightsRecords'
]);

const ownerMethods = new Set([
  'backend/catalog.jsw:moderateContent',
  'backend/catalog.jsw:listPendingContent',
  'backend/reports.jsw:listContentReports',
  'backend/reports.jsw:resolveContentReport',
  'backend/engagement.jsw:moderateComment',
  'backend/engagement.jsw:listPendingComments',
  'backend/rights.jsw:listPendingRights',
  'backend/rights.jsw:reviewRightsDeclaration'
]);

const modules = [
  'catalog.jsw',
  'viewer.jsw',
  'media.jsw',
  'reports.jsw',
  'engagement.jsw',
  'playlists.jsw',
  'notifications.jsw',
  'rights.jsw',
  'liveStreams.jsw'
];
let methodCount = 0;
for (const file of modules) {
  const key = 'backend/' + file;
  const source = read('src/backend/' + file);
  const exports = [...source.matchAll(/export\s+async\s+function\s+([A-Za-z0-9_]+)/g)]
    .map(match => match[1]);
  const configured = permissions[key] || {};
  assert.ok(exports.length > 0, key + ' must export web methods');
  for (const method of exports) {
    const identity = key + ':' + method;
    const rule = configured[method];
    assert.ok(rule, identity + ' is missing an explicit permission rule');
    assert.equal(rule.siteOwner && rule.siteOwner.invoke, true,
      identity + ' must allow site-owner invocation');
    if (publicMethods.has(identity)) {
      assert.equal(rule.siteMember && rule.siteMember.invoke, true,
        identity + ' must allow member invocation');
      assert.equal(rule.anonymous && rule.anonymous.invoke, true,
        identity + ' must allow anonymous invocation');
    } else if (memberMethods.has(identity)) {
      assert.equal(rule.siteMember && rule.siteMember.invoke, true,
        identity + ' must allow member invocation');
      assert.equal(rule.anonymous && rule.anonymous.invoke, false,
        identity + ' must reject anonymous invocation');
    } else if (ownerMethods.has(identity)) {
      assert.equal(rule.siteMember && rule.siteMember.invoke, false,
        identity + ' must reject member invocation');
      assert.equal(rule.anonymous && rule.anonymous.invoke, false,
        identity + ' must reject anonymous invocation');
    } else {
      assert.fail(identity + ' is not classified in the permission test');
    }
    methodCount += 1;
  }
}

const collectionNames = new Set();
for (const file of [...modules, 'ratingPreferences.js', 'notifications.js']) {
  const source = read('src/backend/' + file);
  for (const match of source.matchAll(/const\s+[A-Z_]+\s*=\s*['"]([A-Za-z0-9_-]+)['"]/g)) {
    collectionNames.add(match[1]);
  }
}
for (const collection of collectionNames) {
  assert.ok(cms.includes('## ' + collection),
    'CMS_COLLECTIONS.md must document ' + collection);
}

const events = read('src/backend/events.js');
assert.match(events, /wixMediaManager_onFileUploaded/);
assert.match(events, /wixMediaManager_onVideoTranscoded/);

const media = read('src/backend/media.jsw');
assert.match(media, /isPrivate:\s*true/,
  'Creator uploads must remain private before moderation');
assert.match(media, /getVideoPlaybackUrl/);
assert.match(media, /getPublishedMediaPlayback/);
assert.match(media, /isContentRatingAllowed/);
assert.match(media, /isMediaRightsCurrent/);

const uploader = read('src/public/mediaUpload.js');
assert.match(uploader, /uploadVideoFile/);
assert.match(uploader, /request\.upload\.onprogress/,
  'The browser uploader must expose upload progress');

const catalog = read('src/backend/catalog.jsw');
for (const field of ['category', 'tags', 'language', 'durationSeconds']) {
  assert.ok(catalog.includes(field), 'Catalogue must support ' + field);
  assert.ok(cms.includes(tick + field + tick), 'CMS schema must document ' + field);
}
assert.match(catalog, /socialLinks/);
assert.match(catalog, /bannerUrl/);
assert.match(catalog, /session\.status\s*!==\s*'ready'/,
  'Content submission must wait for successful transcoding');

const ratingPreferences = read('src/backend/ratingPreferences.js');
assert.match(ratingPreferences, /applyViewerRatingPreference/);
assert.match(ratingPreferences, /hideUnrated/);

const viewer = read('src/backend/viewer.jsw');
assert.match(viewer, /getMyCreatorAnalytics/);
assert.match(viewer, /watchTimeSeconds/);
assert.match(viewer, /previous\.completed === true && safePosition <= 5/);

const reports = read('src/backend/reports.jsw');
assert.match(reports, /reportContent/);
assert.match(reports, /resolveContentReport/);

const engagement = read('src/backend/engagement.jsw');
assert.match(engagement, /likeMedia/);
assert.match(engagement, /addComment/);
assert.match(engagement, /moderateComment/);
assert.match(engagement, /listPendingComments/);
assert.match(engagement, /listMyPendingComments/);
assert.match(engagement, /moderateMyChannelComment/);

const playlists = read('src/backend/playlists.jsw');
assert.match(playlists, /getPlaylist/);
assert.match(playlists, /reorderPlaylistItems/);
const rights = read('src/backend/rights.jsw');
assert.match(rights, /submitRightsDeclaration/);
assert.match(rights, /reviewRightsDeclaration/);
const rightsCore = read('src/backend/rightsCore.js');
assert.match(rightsCore, /getVerifiedRightsForMedia/);
assert.match(rightsCore, /applyVerifiedRightsFilter/);
assert.match(rightsCore, /isMediaRightsCurrent/);
assert.match(rightsCore, /applyVerifiedRightsFilter/);
assert.match(rights, /rightsVerified: true/);
assert.match(rights, /rightsVerified: false/);
assert.match(rights, /reviewHistory/);
assert.match(rights, /history\.slice\(-10\)/);
assert.match(rights, /Only pending or previously verified rights declarations can be verified/);
assert.match(catalog, /getVerifiedRightsForMedia/);
assert.match(catalog, /const LIVE = 'LiveStreams'/);
assert.match(catalog, /applyVerifiedRightsFilter/);
assert.match(viewer, /applyVerifiedRightsFilter/);
assert.match(viewer, /applyViewerRatingPreference/);
assert.match(viewer, /getMyViewingPreferences/);
assert.match(viewer, /setMyViewingPreferences/);
assert.match(viewer, /isMediaRightsCurrent/);
assert.match(engagement, /isMediaRightsCurrent/);
assert.match(playlists, /isMediaRightsCurrent/);
const liveStreams = read('src/backend/liveStreams.jsw');
assert.match(liveStreams, /browseLiveStreams/);
assert.match(liveStreams, /getLiveStream/);
assert.match(liveStreams, /getPublicLiveSession/);
assert.match(liveStreams, /isMediaRightsCurrent/);
assert.match(liveStreams, /isContentRatingAllowed/);
assert.match(liveStreams, /pendingSongs/);
assert.match(catalog, /liveStreamId/);
assert.match(catalog, /Song requests are available only while this creator is live/);
assert.match(catalog, /isMediaRightsCurrent/);
assert.match(catalog, /maximum of five queued song requests/);
assert.match(liveStreams, /createLiveStream/);
assert.match(liveStreams, /createLiveStream/);
assert.match(liveStreams, /getMyLiveStreams/);
assert.match(liveStreams, /endLiveStream/);
assert.match(liveStreams, /MYOUTLET_RTMPS_BASE_URL/);
assert.match(liveStreams, /MYOUTLET_HLS_BASE_URL/);
const httpFunctions = read('src/backend/http-functions.js');
assert.match(httpFunctions, /post_streamAuth/);
assert.match(httpFunctions, /timingSafeEqual/);
assert.match(httpFunctions, /isMediaRightsCurrent/);

const notifications = read('src/backend/notifications.jsw');
assert.match(notifications, /getMyNotifications/);
assert.match(notifications, /markAllNotificationsRead/);
const notificationWriter = read('src/backend/notifications.js');
assert.match(notificationWriter, /createNotification/);

console.log('MyOutlet source validation passed: ' + methodCount +
  ' web methods, ' + collectionNames.size + ' documented collections.');
