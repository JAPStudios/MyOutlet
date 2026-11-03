# MyOutlet

MyOutlet is the audiovisual publishing, streaming and creator platform being developed by JAPStudios. Its scope includes creator channels, on-demand and live media, search, moderation, content ratings, creator tools and audience song requests.

## Current repository structure

The Wix Velo site source is under `src/`. The browser extension files at the repository root are a separate legacy companion and are not the streaming service. The `upstream/` paths are pinned Git submodule entries; they are not imported application source.

## Backend catalogue and creator workflows

The backend service layer includes `src/backend/catalog.jsw` for creator discovery, published catalogue browsing/search with category, tag, rating, type and language filters, creator profiles with avatars, banners and social links, channel management, submissions, moderation and channel-scoped song requests; `src/backend/viewer.jsw` for watchlists, playback progress, creator follows, a followed-creator feed, member-selected content-rating preferences and creator playback analytics; and `src/backend/media.jsw` for private MP4 uploads and published-video playback URLs; `src/backend/reports.jsw` handles member reports and owner-only moderation; `src/backend/engagement.jsw` handles media likes, comments and comment moderation; `src/backend/playlists.jsw` handles creator-owned playlists and ordered media items; `src/backend/notifications.jsw` provides private notification inboxes for new follows, comments and song requests; `src/backend/rights.jsw` manages creator rights declarations, owner review, expiry checks and publication/playback gating; and `src/backend/ratingPreferences.js` applies member-selected rating filters. `src/backend/events.js` records upload completion and video-transcoding readiness. The reusable front-end uploader in `src/public/mediaUpload.js` sends MP4 files to the signed upload URL and reports byte-level progress; the returned upload-session ID can then be passed to `submitContent` after the session reaches `ready`. See [CMS_COLLECTIONS.md](CMS_COLLECTIONS.md) for the required Wix CMS collection fields and access controls.

Current MyOutlet site state:
1. The sixteen CMS collections in `CMS_COLLECTIONS.md` have been created on the MyOutlet site.
2. Their direct collection permissions are set to `ADMIN`; application-level public, member and site-owner access is controlled by `src/backend/permissions.json`.
3. The repository's Wix site binding now targets MyOutlet.
4. The automated source-contract check is available as `npm test`; live Velo runtime behavior still requires execution against the site.

## Functional boundaries

The current media workflow accepts private MP4 uploads into the Wix Media Manager, waits for Wix's video-transcoding event, and returns HLS or DASH playback URLs for published uploaded videos. Published external HTTPS video, audio and live-stream sources can also be returned through the media playback method. It does not yet provide live ingest, a custom CDN, external transcoding, verified age checks, payment processing or operational monitoring. Content-rating preferences are viewer-selected filters, not age verification. Creator analytics report playback starts, bounded client-reported watch time and completions; they are not audited audience measurements.

No payment is collected by the current backend. Song requests are queued as metadata only; they do not charge viewers. No third-party media is licensed by the presence of a URL or catalogue record.

## Upstream code

See [UPSTREAM_COMPONENTS.md](UPSTREAM_COMPONENTS.md) for the upstream repository inventory and license notes. A Git submodule entry records a pinned commit; it does not copy source files into the MyOutlet application.

## Source validation

Run `node scripts/validate-backend.js` (or `npm test`) to check that all exported backend web methods have explicit permissions, private collections are documented, and the MyOutlet site binding, media event/uploader wiring and feature modules remain consistent. GitHub Actions syntax-checks every Velo JavaScript source file and validates all 58 exported web methods across the 16 documented collections on relevant pushes and pull requests.
