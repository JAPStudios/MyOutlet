const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

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
  'backend/liveChat.jsw:getLiveChatMessages',
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
  'backend/catalog.jsw:enqueueSongs',
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
  'backend/liveStreams.jsw:getMyLiveChatOverlay',
  'backend/liveStreams.jsw:endLiveStream',
  'backend/liveChat.jsw:sendLiveChatMessage',
  'backend/liveChat.jsw:reportLiveChatMessage',
  'backend/liveChat.jsw:getMyLiveChatReports',
  'backend/liveChat.jsw:banLiveChatMember',
  'backend/liveChat.jsw:unbanLiveChatMember',
  'backend/liveChat.jsw:getMyLiveChatBans',
  'backend/liveChat.jsw:moderateMyChannelChatMessage',
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
  'backend/rights.jsw:reviewRightsDeclaration',
  'backend/liveChat.jsw:moderateChatMessage',
  'backend/liveChat.jsw:listLiveChatReports',
  'backend/liveChat.jsw:resolveLiveChatReport'
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
  'liveStreams.jsw',
  'liveChat.jsw'
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
assert.match(catalog, /enqueueSongs/);
assert.match(catalog, /for \(const song of songs\)/);
assert.match(catalog, /created\.map\(item => wixData\.update\(SONGS/);
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
const publicCommentList = engagement.slice(engagement.indexOf('export async function listComments'), engagement.indexOf('export async function listPendingComments'));
assert.doesNotMatch(publicCommentList, /memberId: comment\.memberId/);
assert.match(engagement, /channel.memberId !== ownerId/);

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
assert.match(rightsCore, /rightsTerritories/);
assert.match(rightsCore, /WORLDWIDE/);
assert.match(rightsCore, /applyVerifiedRightsFilter/);
assert.match(rights, /rightsVerified: true/);
assert.match(rights, /worldwide distribution rights only/);
assert.match(rights, /worldwide distribution declarations only/);
assert.match(rights, /rightsVerified: false/);
assert.match(rights, /Distribution rights verification was revoked/);
assert.match(rights, /status: 'cancelled'/);
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
const liveChat = read('src/backend/liveChat.jsw');
assert.match(liveChat, /getLiveChatMessages/);
assert.match(liveChat, /sendLiveChatMessage/);
assert.match(liveChat, /moderateMyChannelChatMessage/);
assert.match(liveChat, /moderateChatMessage/);
assert.match(liveChat, /reportLiveChatMessage/);
assert.match(liveChat, /getMyLiveChatReports/);
const reporterHistoryStart = liveChat.indexOf('export async function getMyLiveChatReports');
const ownerReportListStart = liveChat.indexOf('export async function listLiveChatReports');
assert.ok(!liveChat.slice(reporterHistoryStart, ownerReportListStart).includes('reviewNote:'),
  'Internal site-owner review notes must not be returned to reporters');
assert.match(liveChat, /listLiveChatReports/);
assert.match(liveChat, /resolveLiveChatReport/);
assert.match(liveChat, /banLiveChatMember/);
assert.match(liveChat, /unbanLiveChatMember/);
assert.match(liveChat, /getMyLiveChatBans/);
assert.match(liveChat, /assertNotBannedFromChannel/);
assert.ok(liveChat.includes('new Date(current.expiresAt).getTime() <= Date.now()'));
assert.match(liveChat, /43,200 minutes/);
assert.match(liveChat, /ten reports per 24 hours/);
assert.match(liveChat, /remove_message/);
assert.match(liveChat, /five messages per ten seconds/);
assert.match(liveChat, /isMediaRightsCurrent/);
assert.match(liveChat, /isContentRatingAllowed/);
assert.match(liveChat, /Members\/PublicData/);
assert.match(liveChat, /senderName/);
assert.match(liveChat, /stream\.status !== 'live'/);
assert.match(liveChat, /media\.status !== 'published' \|\| !isMediaRightsCurrent\(media\)/);
assert.match(liveChat, /Members\/PublicData/);
assert.match(liveChat, /senderName,/);
assert.match(liveChat, /channel\.memberId !== moderatorMemberId/);
assert.match(liveChat, /rate limit is five messages per ten seconds/);
assert.match(liveChat, /moderateChatMessage/);
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
assert.match(liveStreams, /chatOverlayTokenHash/);
assert.match(liveStreams, /getMyLiveChatOverlay/);
const httpFunctions = read('src/backend/http-functions.js');
assert.match(httpFunctions, /get_chatOverlay/);
assert.match(httpFunctions, /get_chatOverlayMessages/);
assert.match(httpFunctions, /textContent/);
assert.ok(httpFunctions.includes('matchesStreamKey(token, stream.chatOverlayTokenHash)'));
assert.match(httpFunctions, /post_streamAuth/);
assert.match(httpFunctions, /timingSafeEqual/);
assert.match(httpFunctions, /isMediaRightsCurrent/);
assert.match(httpFunctions, /new_live_stream/);
const mediamtx = read('live-streaming/mediamtx.yml');
const compose = read('live-streaming/compose.yaml');
assert.match(mediamtx, /record: true/);
assert.match(mediamtx, /recordFormat: fmp4/);
assert.match(mediamtx, /recordSegmentDuration: 1h/);
assert.match(mediamtx, /recordDeleteAfter: 7d/);
assert.ok(compose.includes('./recordings:/recordings'));
assert.match(httpFunctions, /bulkInsert\(NOTIFICATIONS/);
assert.match(httpFunctions, /const starting = stream.status !== 'live'/);

for (const file of [
  'catalog.jsw',
  'viewer.jsw',
  'engagement.jsw',
  'playlists.jsw',
  'notifications.jsw',
  'rights.jsw',
  'liveStreams.jsw'
]) {
  const source = read('src/backend/' + file);
  if (source.includes('.totalCount')) {
    assert.match(source, /returnTotalCount:\s*true/,
      file + ' must explicitly request Wix Data total counts');
  }
}

const notifications = read('src/backend/notifications.jsw');
assert.match(notifications, /getMyNotifications/);
assert.match(notifications, /markAllNotificationsRead/);
const notificationWriter = read('src/backend/notifications.js');
assert.match(notificationWriter, /createNotification/);

const readme = read('README.md');
assert.match(readme, /The twenty CMS collections/);
assert.match(readme, /OBS Browser Source chat overlays/);
console.log('MyOutlet source validation passed: ' + methodCount +
  ' web methods, ' + collectionNames.size + ' documented collections.');

const gitmodules = read('.gitmodules');
const upstreamComponents = read('UPSTREAM_COMPONENTS.md');
const chatterinoSubmoduleCount = gitmodules.split('[submodule "upstream/chatterino/').length - 1;
const chatterinoTableRowCount = upstreamComponents.split('| `upstream/chatterino/').length - 1;
assert.equal(chatterinoSubmoduleCount, 26,
  'Every public Chatterino organization repository must be pinned as a submodule');
assert.equal(chatterinoTableRowCount, 26,
  'Every pinned Chatterino repository must have an upstream integration record');
assert.ok(gitmodules.includes('path = upstream/chatterino/chatterino2'));
assert.ok(gitmodules.includes('url = https://github.com/Chatterino/chatterino2.git'));
assert.ok(upstreamComponents.includes('Chatterino organization repositories'));
const obsSubmoduleCount = gitmodules.split('[submodule "upstream/obsproject/').length - 1;
const otherSubmoduleCount = gitmodules.split('[submodule "upstream/').length - 1 -
  chatterinoSubmoduleCount - obsSubmoduleCount;
assert.equal(obsSubmoduleCount, 21, 'All 21 pinned OBS Project repositories must be configured');
assert.equal(otherSubmoduleCount, 5, 'All five media and archival sources must be configured');
assert.equal(gitmodules.split('[submodule "').length - 1, 52,
  'The upstream configuration must contain all 52 source repositories');
const gitTree = execFileSync('git', ['ls-tree', '-r', 'HEAD'], {
  cwd: root,
  encoding: 'utf8'
});
const gitlinkCount = gitTree.split('\n').filter(line => line.startsWith('160000 commit ')).length;
assert.equal(gitlinkCount, 52,
  'Every configured upstream repository must have a committed Git submodule pointer');
