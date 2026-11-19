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

assert.equal(site.siteId, '60a568ee-e9cb-4a45-8f02-e6343427552c',
  'wix.config.json must target the live MyOutlet Wix site');

assert.match(reportedRemoval, /wixData\.query\(LIVE\)/);
assert.match(reportedRemoval, /status: 'cancelled'/);

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
const httpFunctions = read('src/backend/http-functions.js');
assert.match(httpFunctions, /post_streamAuth/);
assert.match(httpFunctions, /timingSafeEqual/);
assert.match(httpFunctions, /isMediaRightsCurrent/);
assert.match(httpFunctions, /new_live_stream/);
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

const readme = read('README.md');
assert.match(readme, /The 20 custom CMS collections/);
console.log('MyOutlet source validation passed: ' + methodCount +
  ' web methods, ' + collectionNames.size + ' documented collections.');

const notificationCore = read('src/backend/notificationCore.js');
assert.match(notificationCore, /export async function createNotification/);
for (const file of ['catalog.jsw', 'viewer.jsw', 'engagement.jsw']) {
  const source = read('src/backend/' + file);
  assert.match(source, /from 'backend\/notificationCore'/,
    file + ' must use the internal notification helper');
  assert.doesNotMatch(source, /from 'backend\/notifications'/,
    file + ' must not import the member-facing notification web module as an internal helper');
}

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
