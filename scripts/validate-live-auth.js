const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const source = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'backend', 'http-functions.js'),
  'utf8'
);

const fanoutStart = source.indexOf('const notifications = recipients.map');
const fanoutEnd = source.indexOf('if (notifications.length)', fanoutStart);
assert.ok(fanoutStart >= 0 && fanoutEnd > fanoutStart,
  'Live-start notification fan-out must map each recipient to a notification.');

const fanout = source.slice(fanoutStart, fanoutEnd);
assert.match(fanout, /notificationKey:\s*\[['"]new_live_stream['"],\s*stream\._id,\s*memberId\]\.join\(['"]:['"]\)/,
  'Each live-start notification key must use the current recipient ID.');
assert.match(fanout, /recipientMemberId:\s*memberId/,
  'Each notification must target the current recipient.');
assert.doesNotMatch(fanout, /follow\.memberId/,
  'The notification mapper must not reference the out-of-scope follower variable.');
assert.match(source, /seenRecipients\.has\(memberId\)/,
  'Follower fan-out must deduplicate recipient IDs across pages.');
assert.match(source, /wixData\.bulkInsert\(NOTIFICATIONS, notifications/,
  'Notifications must be written in batches.');

console.log('MyOutlet live-auth validation passed: per-recipient live notifications are scoped and deduplicated.');
