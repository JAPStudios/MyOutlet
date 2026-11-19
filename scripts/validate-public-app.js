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
for (const route of ['publicCatalog', 'publicLiveStreams', 'publicCreators', 'publicPlayback', 'liveChatMessages', 'sendLiveChatMessage', 'reportLiveChatMessage']) {
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
