# MyOutlet CMS data collections

The sixteen custom Wix CMS collections documented here have been created on the MyOutlet site. Collection names are case-sensitive. Direct collection permissions are set to `ADMIN` for read, insert, update and remove. Backend web-method permissions provide the narrower public, member and site-owner access rules. To reproduce the backend on another Wix site, create these collections with the schemas below.

## MediaItems

Fields:
- `title` — Text, required
- `description` — Text
- `mediaUrl` — Text, required; HTTPS external media URLs or private Wix video URLs created by the MyOutlet upload workflow
- `mediaUploadSessionId` — Text; associated MediaUploadSessions record ID when uploaded through MyOutlet
- `thumbnailUrl` — Text
- `contentType` — Text: `video`, `livestream` or `audio`
- `contentRating` — Text: `TV-Y`, `TV-Y7`, `TV-G`, `TV-PG`, `TV-14`, `TV-MA` or `Unrated`
- `category` — Text
- `tags` — Array of Text
- `language` — Language code
- `durationSeconds` — Number
- `rightsVerified` — Boolean; set only after owner verification of a matching RightsRecords item
- `rightsValidUntil` — Date; blank for no expiry, otherwise the final valid date (inclusive through 23:59:59 UTC)
- `rightsRecordId` — Text; associated RightsRecords item ID
- `creatorChannelId` — Text
- `creatorMemberId` — Text
- `status` — Text: `pending_review`, `published`, `rejected` or `removed`
- `submittedAt` — Date and time
- `publishedAt` — Date and time
- `moderationNote` — Text

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by the backend web methods.

## MediaUploadSessions

Fields:
- `ownerMemberId` — Text, required
- `fileName` — Text, required
- `mimeType` — Text, required
- `mediaType` — Text, required
- `status` — Text: `creating`, `uploading`, `uploaded`, `ready`, `submitted` or `failed`
- `fileUrl` — Text
- `sizeInBytes` — Number
- `createdAt` — Date and time
- `uploadedAt` — Date and time
- `readyAt` — Date and time
- `mediaItemId` — Text
- `failureMessage` — Text

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by the backend web methods. Upload URL creation and session reads are mediated by authenticated backend methods. Video files are private while awaiting moderation.

## ViewerPreferences

Fields:
- `memberId` — Text, required; site-member ID that owns the preference
- `maxContentRating` — Text: `TV-Y`, `TV-Y7`, `TV-G`, `TV-PG`, `TV-14` or `TV-MA`
- `hideUnrated` — Boolean
- `updatedAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by authenticated viewer methods. These are viewer-selected catalogue filters, not verified age controls.

## ContentReports

Fields:
- `mediaItemId` — Text, required
- `reporterMemberId` — Text, required
- `reason` — Text: `copyright`, `harassment`, `hate`, `sexual_content`, `violence`, `self_harm`, `misinformation`, `spam` or `other`
- `details` — Text
- `status` — Text: `open`, `resolved` or `dismissed`
- `createdAt` — Date and time
- `reviewedAt` — Date and time
- `reviewedBy` — Text
- `resolution` — Text
- `moderationNote` — Text

Permissions: `ADMIN` (site administrators) for direct collection access. Members can create reports and read their own reports through authenticated backend methods. Only site owners can review and resolve reports.

## RightsRecords

Fields:
- `mediaItemId` — Text, unique; associated MediaItems record ID
- `creatorMemberId` — Text, required
- `rightsBasis` — Text: `original_work`, `licensed`, `public_domain`, `commissioned` or `other`
- `rightsHolder` — Text, required
- `sourceDetails` — Text, required
- `territories` — Array of ISO 3166-1 alpha-2 country codes, or `WORLDWIDE`
- `validFrom` — Date
- `validUntil` — Date
- `evidenceUrl` — Text; optional HTTPS evidence reference
- `status` — Text: `pending_review`, `verified`, `rejected` or `revoked`
- `declaredAt` — Date and time
- `reviewedAt` — Date and time
- `reviewerMemberId` — Text
- `reviewNote` — Text

Permissions: `ADMIN` for direct read, insert, update and remove. Creators submit and read their own declarations through authenticated methods; only site owners can review declarations. A declaration is not itself a licence or legal determination.

## CreatorChannels

Fields:
- `name` — Text, required
- `handle` — Text, required
- `description` — Text
- `memberId` — Text, required
- `avatarUrl` — Text; HTTPS or Wix image URL
- `bannerUrl` — Text; HTTPS or Wix image URL
- `websiteUrl` — Text; HTTPS URL
- `socialLinks` — Array of HTTPS URLs
- `createdAt` — Date and time
- `updatedAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by the backend web methods. Channel creation and updates are mediated by the member-authenticated backend methods.

## SongRequests

Fields:
- `title` — Text, required
- `artist` — Text, required
- `creatorChannelId` — Text
- `requesterMemberId` — Text
- `status` — Text: `queued`, `played`, `skipped` or `cancelled`

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by the backend web methods. Queue reads and member submissions are mediated by the backend module.

## ViewerLibrary

Fields:
- `memberId` — Text, required; site-member ID that owns the saved item
- `mediaItemId` — Text, required; ID of a published MediaItems record
- `savedAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by the backend web methods. Watchlist operations are mediated by authenticated viewer methods.

## Notifications

Fields:
- `notificationKey` — Text, required; deterministic event/recipient key
- `recipientMemberId` — Text, required
- `actorMemberId` — Text
- `type` — Text: `new_follower`, `new_comment` or `song_request`
- `mediaItemId` — Text
- `creatorChannelId` — Text
- `sourceId` — Text, required
- `message` — Text
- `readAt` — Date and time
- `createdAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Members can read and mark only their own notifications through authenticated backend methods. Notifications are generated for new follows, comments and song requests.

## MediaPlaylists

Fields:
- `creatorChannelId` — Text, required
- `creatorMemberId` — Text, required
- `title` — Text, required
- `description` — Text
- `visibility` — Text: `public`, `unlisted` or `private`
- `thumbnailUrl` — Text
- `createdAt` — Date and time
- `updatedAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Members manage playlists belonging to their own creator channels. Public and unlisted playlists are readable by visitors; private playlists are owner-only.

## PlaylistItems

Fields:
- `playlistId` — Text, required
- `mediaItemId` — Text, required
- `itemKey` — Text, required; deterministic `playlistId:mediaItemId` key
- `position` — Number
- `addedAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Playlist items are managed through authenticated playlist methods.

## MediaLikes

Fields:
- `likeKey` — Text, required; deterministic `mediaItemId:memberId` key
- `mediaItemId` — Text, required
- `memberId` — Text, required
- `createdAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Likes are created and removed through authenticated member methods.

## MediaComments

Fields:
- `mediaItemId` — Text, required
- `memberId` — Text, required
- `body` — Text, required
- `status` — Text: `published`, `pending_review` or `removed`
- `createdAt` — Date and time
- `updatedAt` — Date and time
- `moderationNote` — Text

Permissions: `ADMIN` (site administrators) for direct collection access. Members can create, edit and delete their own comments. Edits return to `pending_review`; site owners can publish or remove comments.

## MediaMetrics

Fields:
- `mediaItemId` — Text, required; one aggregate record per media item
- `creatorChannelId` — Text, required
- `playbackStarts` — Number
- `watchTimeSeconds` — Number
- `completions` — Number
- `updatedAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Creator analytics are returned only through the authenticated creator analytics method. Playback starts and watch time are derived from client-reported progress and are approximate, not audited viewing measurements.

## CreatorFollows

Fields:
- `memberId` — Text, required; site-member ID that owns the follow
- `creatorChannelId` — Text, required; followed CreatorChannels record ID
- `followedAt` — Date and time

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by the backend web methods. Follow/unfollow and following-feed operations are mediated by authenticated viewer methods.

## PlaybackProgress

Fields:
- `memberId` — Text, required; site-member ID that owns the progress record
- `mediaItemId` — Text, required; ID of a published MediaItems record
- `positionSeconds` — Number, required
- `durationSeconds` — Number, required
- `completed` — Boolean, required
- `lastPlayedAt` — Date and time, required
- `startedAt` — Date and time
- `watchTimeSeconds` — Number

Permissions: `ADMIN` (site administrators) for direct collection access. Application access is mediated by the backend web methods. Playback progress is mediated by authenticated viewer methods. The client must send progress only while the member is actually watching; progress values are user-reported and are not proof of viewing.

## Implemented backend operations

- Public creator directory, creator search and handle-based creator profiles, alongside published catalogue browse, title/description search and per-channel catalogue reads. Creator search/profile responses expose only public channel fields and published media.
- Member-owned creator channel creation and update.
- Member content submission into the moderation queue, plus private submission-status tracking.\n- Creator distribution-rights declarations, private owner review, expiry checks and a mandatory verified-rights record before publication and playback. Catalogue queries exclude media without a current verified-rights state.
- Private MP4 uploads to the Wix Media Manager, event-driven transcoding readiness, and published-video HLS/DASH playback URLs.
- Owner-only pending-review queue, publish/reject/remove decisions and song-request queue status controls.
- Member song requests and a public read-only queue scoped to a specific creator channel and ordered by submission time.
- Member watchlists, with published-media checks and private per-member records.
- Continue-watching history for on-demand video/audio, with bounded playback positions and completed-item exclusion.
- Creator follows, followed-channel lists and a published-media feed across followed channels.
- Creator analytics for playback starts, estimated watch time and completions.
- Member-selected content-rating preferences applied to catalogue, creator, watchlist, continue-watching, following-feed and playback reads.
- Member content reports, a private moderation queue, and owner-only report resolution with removal or rating correction.
- Member likes, comments, comment editing/deletion, and owner moderation of edited or reported comments.
- Creator-owned public, unlisted and private playlists with ordered items, reordering and owner controls.
- Private member notifications for new creator follows, comments and song requests, with unread counts and mark-read operations.

This layer uploads private MP4 files to the Wix Media Manager, records upload/transcoding events, and can request HLS or DASH playback URLs for published MyOutlet-uploaded videos. It does not provide live ingest, a custom CDN, external media transcoding, creator analytics, payment processing or rights verification. Do not publish an item until the media is ready, distribution rights and content rating have been checked, and moderation is complete. Wix backend media events do not run in site Preview.


## Wix data indexes

Indexes for the first nine collections were confirmed `ACTIVE` on the MyOutlet site. The two MediaMetrics indexes have also been confirmed `ACTIVE`.

- `MediaItems`: `media-status-published`, `media-channel-status-published`, `media-creator-submitted`. Rights-validity fields are additionally filtered in the backend; a dedicated composite index could not be created because the collection's index quota was already full.
- `CreatorChannels`: case-insensitive unique `creator-handle-unique`, plus `creator-member`
- `SongRequests`: `song-channel-status-created`
- `ViewerLibrary`: `viewer-library-member-saved`
- `PlaybackProgress`: `playback-member-completed-last`
- `CreatorFollows`: `follows-member-date`
- `MediaUploadSessions`: `uploads-owner-created`

- `ViewerPreferences`: unique `viewer-preferences-member-unique`
- `ContentReports`: `reports-status-created`, `reports-member-created`, `reports-media-status`
- `MediaMetrics`: unique `media-metrics-media-unique`, plus `media-metrics-channel`
- `MediaLikes`: unique `media-likes-key-unique`, plus `media-likes-media`
- `MediaComments`: `media-comments-status-created`, `media-comments-member-created`
- `MediaPlaylists`: `playlists-owner-updated`, `playlists-visibility-updated`
- `PlaylistItems`: unique `playlist-item-key-unique`, plus `playlist-items-position` and `playlist-items-media`
- `Notifications`: unique `notifications-key-unique`, plus `notifications-recipient-created` and `notifications-recipient-read`\n- `RightsRecords`: unique `rights-media-unique`, plus `rights-creator-created` and `rights-status-created`
