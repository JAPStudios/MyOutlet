# MyOutlet

MyOutlet is the audiovisual publishing, streaming and creator platform being developed by JAPStudios. Its scope includes creator channels, on-demand and live media, search, moderation, content ratings, creator tools and audience song requests.

## Current repository structure

The Wix Velo site source is under `src/`. The browser extension files at the repository root are a separate legacy companion and are not the streaming service. The `upstream/` paths are pinned Git submodule entries; they are not imported application source.

## Backend catalogue and creator workflows

The backend service layer includes `src/backend/catalog.jsw` for creator discovery, published catalogue browsing/search, channel management, submissions, moderation and song requests; `src/backend/viewer.jsw` for watchlists, playback progress, creator follows and a followed-creator feed; and `src/backend/media.jsw` for private MP4 uploads and published-video playback URLs. `src/backend/events.js` records upload and video-transcoding completion. The reusable front-end uploader in `src/public/mediaUpload.js` sends MP4 files to the signed upload URL and reports byte-level progress; the returned upload-session ID can then be passed to `submitContent` after the session reaches `ready`. See [CMS_COLLECTIONS.md](CMS_COLLECTIONS.md) for the required Wix CMS collection fields and access controls.

Before publishing:
1. Create every CMS collection described in `CMS_COLLECTIONS.md`.
2. Set each collection's direct permissions to site-owner only.
3. Sync the Wix site with the repository and publish the Velo backend module.
4. Exercise anonymous catalogue reads, member-only channel and submission operations and owner-only moderation with separate test accounts.

## Functional boundaries

The current media workflow accepts private MP4 uploads into the Wix Media Manager, waits for Wix's video-transcoding event, and returns HLS or DASH playback URLs only for published uploaded videos. It does not yet provide live ingest, a custom CDN, external transcoding, content-rights records, age/rating enforcement, creator analytics, payment processing or operational monitoring.

No payment is collected by the current backend. Song requests are queued as metadata only; they do not charge viewers. No third-party media is licensed by the presence of a URL or catalogue record.

## Upstream code

See [UPSTREAM_COMPONENTS.md](UPSTREAM_COMPONENTS.md) for the upstream repository inventory and license notes. A Git submodule entry records a pinned commit; it does not copy source files into the MyOutlet application.

## Source validation

Run `node scripts/validate-backend.js` (or `npm test`) to check that exported backend web methods have explicit permissions, private collections are documented, and the MyOutlet site binding and media event/uploader wiring remain consistent. The same check runs in GitHub Actions on relevant pushes and pull requests.
