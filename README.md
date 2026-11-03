# MyOutlet

MyOutlet is the audiovisual publishing, streaming and creator platform being developed by JAPStudios. Its scope includes creator channels, on-demand and live media, search, moderation, content ratings, creator tools and audience song requests.

## Current repository structure

The Wix Velo site source is under `src/`. The browser extension files at the repository root are a separate legacy companion and are not the streaming service. The `upstream/` paths are pinned Git submodule entries; they are not imported application source.

## Backend catalogue and creator workflows

The first backend service layer is in `src/backend/catalog.jsw`. It provides published catalogue browsing and search, member-owned channels, content submission for moderation, owner-only moderation decisions and member song requests. See [CMS_COLLECTIONS.md](CMS_COLLECTIONS.md) for the exact Wix CMS collection fields and required access controls.

Before publishing:
1. Create the three CMS collections described in `CMS_COLLECTIONS.md`.
2. Set each collection's direct permissions to site-owner only.
3. Sync the Wix site with the repository and publish the Velo backend module.
4. Exercise anonymous catalogue reads, member-only channel and submission operations and owner-only moderation with separate test accounts.

## Functional boundaries

The catalogue stores metadata and workflow state. It does not itself store media bytes or deliver live streams. A production service still requires authenticated media ingest, object storage, transcoding, adaptive-bitrate packaging, CDN delivery, playback, live streaming infrastructure, content-rights records, age/rating enforcement, creator analytics, payment processing and operational monitoring.

No payment is collected by the current backend. Song requests are queued as metadata only; they do not charge viewers. No third-party media is licensed by the presence of a URL or catalogue record.

## Upstream code

See [UPSTREAM_COMPONENTS.md](UPSTREAM_COMPONENTS.md) for the upstream repository inventory and license notes. A Git submodule entry records a pinned commit; it does not copy source files into the MyOutlet application.
