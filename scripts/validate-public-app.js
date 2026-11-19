const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const http = fs.readFileSync(path.join(root, 'src', 'backend', 'http-functions.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'src', 'public', 'myoutlet-app.js'), 'utf8');

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
assert.match(http, /mediaManager\.getVideoPlaybackUrl/,
  'Wix-hosted uploaded videos must use Wix playback URL generation.');

for (const required of [
  'mo-discover', 'mo-live', 'mo-creators', 'mo-search',
  'mo-type', 'mo-rating', '/_functions/publicCatalog',
  '/_functions/publicLiveStreams', '/_functions/publicCreators',
  '/_functions/publicPlayback'
]) {
  assert.ok(app.includes(required), 'The homepage application must include ' + required + '.');
}

assert.ok(app.includes('const siteBase = "/myoutlet";'),
  'Public HTTP requests must include the MyOutlet Wix site path.');
assert.match(app, /Ratings are creator-supplied content classifications/,
  'The interface must distinguish creator ratings from verified age checks.');
assert.match(app, /No published videos or audio are available yet/,
  'The empty catalogue state must be explicit and must not fabricate media.');
assert.match(app, /document\.getElementById\("myoutlet-app"\)/,
  'The Wix page-navigation guard must prevent duplicate application mounts.');

console.log('MyOutlet public application validation passed: catalogue, creator, live and playback routes are present.');
