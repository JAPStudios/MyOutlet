const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const http = fs.readFileSync(path.join(root, 'src', 'backend', 'http-functions.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src', 'public', 'myoutlet-app.js'), 'utf8');
const homePage = fs.readFileSync(path.join(root, 'src', 'pages', 'Home.c1dmp.js'), 'utf8');

for (const name of ['get_publicCatalog', 'get_publicLiveStreams', 'get_publicCreators', 'post_publicPlayback']) {
  assert.match(http, new RegExp('export async function ' + name + '\\('),
    'The public HTTP API must expose ' + name + '.');
}

assert.match(http, /media\.status !== 'published'/,
  'Public media responses must require published media.');
assert.match(http, /isMediaRightsCurrent\(media\)/,
  'Public media and playback responses must enforce current verified rights.');
assert.match(http, /stream\.status !== 'live'/,
  'The public live listing must only return active streams.');
assert.match(http, /creatorMemberId|memberId/,
  'The private creator member identity must be used only for internal authorization.');
assert.match(http, /\.skip\(offset\)/,
  'The public catalogue must support offset pagination.');
assert.match(http, /nextOffset, hasMore/,
  'The public catalogue must report its pagination cursor.');

assert.match(http, /mediaManager\.getVideoPlaybackUrl/,
  'Wix-hosted uploaded videos must use Wix playback URL generation.');

for (const required of [
  'mo-discover', 'mo-live', 'mo-creators', 'mo-search',
  'mo-type', 'mo-rating', 'mo-load-more', 'loadMoreCatalog', '/_functions/publicCatalog',
  '/_functions/publicLiveStreams', '/_functions/publicCreators',
  '/_functions/publicPlayback'
]) {
  assert.ok(app.includes(required), 'The homepage application must include ' + required + '.');
}

for (const forbidden of [
  'mo-productions', 'PB&J', 'O.M.G. / Oh My Gawd',
  'Creespyracies', 'Tales of Grimwald', 'The Shakespearience'
]) {
  assert.ok(!app.includes(forbidden),
    'The MyOutlet homepage must not include the unrequested production slate: ' + forbidden);
}

assert.ok(homePage.includes('from "backend/catalog.jsw"'),
  'The homepage Velo page code must import the catalogue and creator web module.');
assert.ok(homePage.includes('from "backend/liveStreams.jsw"'),
  'The homepage Velo page code must import the live-stream web module.');
assert.ok(homePage.includes('from "backend/media.jsw"'),
  'The homepage Velo page code must import the media playback web module.');
assert.ok(homePage.includes('from "backend/liveChat.jsw"'),
  'The homepage Velo page code must import the live-chat web module.');
for (const route of ['publicCatalog', 'publicLiveStreams', 'publicCreators', 'publicPlayback', 'liveChatMessages', 'sendLiveChatMessage', 'reportLiveChatMessage', 'myChannel', 'saveMyChannel', 'submitContent', 'mySubmissions', 'createVideoUpload', 'myVideoUploads', 'myCreatorAnalytics', 'createLiveStream', 'myLiveStreams', 'endLiveStream', 'songQueue', 'setSongRequestStatus', 'followCreator', 'unfollowCreator', 'addToWatchlist', 'removeFromWatchlist', 'myWatchlist', 'continueWatching', 'myFollowing', 'followingFeed', 'recordPlaybackProgress', 'myViewingPreferences', 'setMyViewingPreferences', 'promptLogin', 'listPendingContent', 'moderateContent', 'listPendingRights', 'reviewRightsDeclaration', 'listLiveChatReports', 'resolveLiveChatReport', 'mediaEngagement', 'mediaComments', 'likeMedia', 'unlikeMedia', 'addComment', 'reportContent', 'listContentReports', 'resolveContentReport', 'listPendingComments', 'listMyPendingComments', 'moderateComment', 'moderateMyChannelComment', 'myPlaylists', 'createPlaylist', 'playlist', 'addMediaToPlaylist', 'removeMediaFromPlaylist', 'updatePlaylist', 'deletePlaylist', 'myNotifications', 'markNotificationRead', 'markAllNotificationsRead']) {
  assert.ok(homePage.includes(route), 'The Velo bridge must handle ' + route + '.');
}
assert.match(homePage, /window\.addEventListener\(REQUEST_EVENT/,
  'The Velo page code must receive homepage requests.');
assert.match(homePage, /window\.dispatchEvent\(new CustomEvent\(RESPONSE_EVENT/,
  'The Velo page code must return request results to the homepage.');
assert.match(app, /waitForVeloBridge\(\)/,
  'The homepage must wait for the Velo bridge before requesting data.');
assert.match(app, /myoutlet:request/,
  'The homepage must send API requests through the Velo bridge.');
assert.match(app, /myoutlet:response/,
  'The homepage must receive API responses from the Velo bridge.');
assert.match(app, /mo-chat-messages/,
  'The live player must render live-chat messages.');
assert.match(app, /sendLiveChatMessage/,
  'Signed-in viewers must be able to submit live-chat messages.');
assert.match(app, /reportLiveChatMessage/,
  'Viewers must be able to report live-chat messages.');
assert.match(app, /id="mo-creator-studio"/,
  'The homepage must include the creator studio.');
assert.match(app, /id="mo-channel-form"/,
  'Creators must be able to create or update their channel profile.');
assert.match(app, /id="mo-media-form"/,
  'Creators must be able to submit audiovisual media for review.');
assert.match(app, /uploadMp4\(file, ticket\)/,
  'The creator studio must upload MP4 files through the signed Wix upload URL.');
assert.match(app, /mediaUploadSessionId = pendingUploadSessionId/,
  'The creator studio must submit uploaded videos only after Wix reports them ready.');
assert.match(app, /myCreatorAnalytics/,
  'The creator studio must display the signed-in creator analytics.');
assert.match(app, /id="mo-live-form"/, 'Creators must be able to request a live-stream session.');
assert.match(app, /id="mo-song-queue"/, 'Creators must be able to review their live song queue.');
assert.match(app, /endLiveStream/, 'Creators must be able to end their own live-stream sessions.');
assert.match(app, /setSongRequestStatus/, 'Creators must be able to mark queued songs played or skipped.');
assert.ok(app.includes('id="mo-library"'), 'Members must have a personal media library.');
assert.ok(app.includes('Save to watchlist'), 'Published media must be saveable to the member watchlist.');
assert.ok(app.includes('followCreator'), 'Members must be able to follow creator channels.');
assert.ok(app.includes('recordPlaybackProgress'), 'On-demand playback must record member progress.');
assert.ok(app.includes('setMyViewingPreferences'), 'Member content-rating preferences must persist through the backend.');
assert.ok(app.includes('mo-sign-in'), 'Visitors must have a sign-in action for member-only features.');
assert.ok(homePage.includes('wix-members-frontend'), 'The Velo page must use Wix Members authentication.');
assert.ok(homePage.includes('authentication.promptLogin'), 'The Velo page must invoke the supported Wix sign-in prompt.');
assert.ok(app.includes('id=\"mo-moderation\"'), 'The homepage must include a site-owner moderation area.');
assert.ok(app.includes('reviewRightsDeclaration'), 'Site owners must be able to review distribution-rights declarations.');
assert.ok(app.includes('moderateContent'), 'Site owners must be able to approve or reject media submissions.');
assert.ok(app.includes('resolveLiveChatReport'), 'Site owners must be able to resolve live-chat reports.');
assert.ok(app.includes('mo-engagement'), 'The media player must expose engagement controls.');
assert.ok(app.includes('likeMedia'), 'Members must be able to like and unlike media.');
assert.ok(app.includes('addComment'), 'Members must be able to comment on media.');
assert.ok(app.includes('reportContent'), 'Members must be able to report media.');
assert.ok(app.includes('mo-content-reports'), 'Site owners must be able to review content reports.');
assert.ok(app.includes('resolveContentReport'), 'Site owners must be able to resolve content reports.');
assert.ok(app.includes('mo-pending-comments'), 'Site owners must be able to moderate pending comments.');
assert.ok(app.includes('mo-my-pending-comments'), 'Creators must be able to moderate comments on their channels.');
assert.ok(app.includes('id=\"mo-playlists\"'), 'Members must be able to manage playlists.');
assert.ok(app.includes('addMediaToPlaylist'), 'Members must be able to add media to their playlists.');
assert.ok(app.includes('markAllNotificationsRead'), 'Members must be able to manage notifications.');
assert.match(app, /setInterval\(\(\) => loadLiveChat\(false\), 5000\)/,
  'Live chat must refresh while a live stream is open.');
assert.match(app, /function ensureHls\(\)/,
  'The player must wait for HLS.js before attempting HLS playback.');
assert.match(app, /HLS playback is unavailable because the player library could not be loaded/,
  'The player must report an unavailable HLS playback engine.');
assert.match(app, /ratingOrder\.indexOf\(itemRating\) <= maximumRating/,
  'The maximum-rating selector must include items at or below the selected rating.');
assert.match(app, /Ratings are creator-supplied content classifications/,
  'The interface must distinguish creator ratings from verified age checks.');
assert.match(app, /No published videos or audio are available yet/,
  'The empty catalogue state must be explicit and must not fabricate media.');
assert.match(app, /document\.getElementById\("myoutlet-app"\)/,
  'The Wix page-navigation guard must prevent duplicate application mounts.');

console.log('MyOutlet public application validation passed: catalogue, creator, live and playback routes are present.');
