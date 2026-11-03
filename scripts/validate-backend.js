const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const parse = file => JSON.parse(read(file));
const permissions = parse('src/backend/permissions.json')['web-methods'];
const cms = read('CMS_COLLECTIONS.md');
const site = parse('wix.config.json');

assert.equal(
  site.siteId,
  '34798e4b-3c1a-45ff-a023-4ea4b83cc9f8',
  'wix.config.json must target the MyOutlet site'
);

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
  'backend/media.jsw:getPublishedVideoPlayback'
]);

const memberMethods = new Set([
  'backend/catalog.jsw:getMyChannel',
  'backend/catalog.jsw:saveMyChannel',
  'backend/catalog.jsw:submitContent',
  'backend/catalog.jsw:enqueueSong',
  'backend/catalog.jsw:getMySubmissions',
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
  'backend/media.jsw:createVideoUpload',
  'backend/media.jsw:getMyVideoUploads'
]);

const ownerMethods = new Set([
  'backend/catalog.jsw:moderateContent',
  'backend/catalog.jsw:listPendingContent',
  'backend/catalog.jsw:setSongRequestStatus'
]);

const modules = ['catalog.jsw', 'viewer.jsw', 'media.jsw'];
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
for (const file of modules) {
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
assert.match(events, /export\s+async\s+function\s+wixMediaManager_onFileUploaded/);
assert.match(events, /export\s+async\s+function\s+wixMediaManager_onVideoTranscoded/);

const media = read('src/backend/media.jsw');
assert.match(media, /isPrivate:\s*true/,
  'Creator uploads must remain private before moderation');
assert.match(media, /getVideoPlaybackUrl/,
  'Published uploaded videos must have a playback URL path');

const uploader = read('src/public/mediaUpload.js');
assert.match(uploader, /export\s+async\s+function\s+uploadVideoFile/);
assert.match(uploader, /request\.upload\.onprogress/,
  'The browser uploader must expose upload progress');

const catalog = read('src/backend/catalog.jsw');
assert.match(catalog, /session\.status\s*!==\s*'ready'/,
  'Content submission must wait for successful transcoding');

console.log('MyOutlet source validation passed: ' + methodCount +
  ' web methods, ' + collectionNames.size + ' documented collections.');
