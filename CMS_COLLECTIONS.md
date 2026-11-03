# MyOutlet CMS data collections

Create these Wix CMS collections before publishing the backend module. Collection names are case-sensitive. The module intentionally does not create collections or weaken collection-level permissions.

## MediaItems

Fields:
- `title` — Text, required
- `description` — Text
- `mediaUrl` — URL or Text, required; HTTPS only
- `thumbnailUrl` — URL or Text
- `contentType` — Text: `video`, `livestream` or `audio`
- `contentRating` — Text: `TV-Y`, `TV-Y7`, `TV-G`, `TV-PG`, `TV-14`, `TV-MA` or `Unrated`
- `creatorChannelId` — Text
- `creatorMemberId` — Text
- `status` — Text: `pending_review`, `published`, `rejected` or `removed`
- `submittedAt` — Date and time
- `publishedAt` — Date and time
- `moderationNote` — Text

Permissions: public read is not required because public reads run through the backend module; restrict direct collection access to the site owner.

## CreatorChannels

Fields:
- `name` — Text, required
- `handle` — Text, required
- `description` — Text
- `memberId` — Text

Permissions: site owner only. Channel creation and updates are mediated by the member-authenticated backend methods.

## SongRequests

Fields:
- `title` — Text, required
- `artist` — Text, required
- `creatorChannelId` — Text
- `requesterMemberId` — Text
- `status` — Text: `queued`, `played`, `skipped` or `cancelled`

Permissions: site owner only. Queue reads and member submissions are mediated by the backend module.

## Implemented backend operations

- Public catalogue browse, title/description search and per-channel catalogue reads, limited to published records.
- Member-owned creator channel creation and update.
- Member content submission into the moderation queue, plus private submission-status tracking.
- Owner-only pending-review queue, publish/reject/remove decisions and song-request queue status controls.
- Member song requests and a public read-only queue, ordered by submission time.

This is a metadata and workflow layer. It does not upload or transcode media, host video, provide adaptive-bitrate playback, run a live ingest server, process payments or verify music rights. Those require separate infrastructure and integrations. Do not mark an item published until the media URL, distribution rights, content rating and moderation decision have been checked.
