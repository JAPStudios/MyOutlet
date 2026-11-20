# MyOutlet live-stream service

MyOutlet live sessions use RTMPS contribution, MediaMTX for ingest and HLS packaging, and the Wix backend for creator ownership, rights review, moderation and stream authentication.

## Connection flow

1. A signed-in creator calls `createLiveStream` for a channel they own. The backend creates a `MediaItems` record in `pending_review` and a private `LiveStreams` record. It returns an RTMPS ingest URL containing a newly generated stream key. Only the SHA-256 hash is stored.
2. The creator submits a rights declaration for the returned `mediaItemId`. A site owner reviews the declaration and publishes the media item only after rights verification.
3. Publishing the media item changes the associated live session to `ready`. MediaMTX accepts a publisher only when the stream path, channel ID, stream-key hash, published media item and current rights state all match.
4. MediaMTX serves the active stream over HTTPS HLS. Its HTTP authentication callback checks that the session remains live and that the associated media item remains published with current verified rights.
5. Visitors discover active sessions through `browseLiveStreams` or retrieve one by ID through `getLiveStream`. Both methods expose only live sessions whose media remains published, rights-verified and within the viewer's rating preference.
6. The creator ends the session with `endLiveStream`. The session becomes `ended` and its live media item is removed from the public catalogue.

## Current Railway deployment

The existing Railway MediaMTX service now builds from this repository: `JAPStudios/MyOutlet`, branch `main`, root directory `live-streaming`, Dockerfile `live-streaming/Dockerfile`. Wix hosts the website, GitHub stores the source, and Railway runs the separate MediaMTX service. Render is not part of MyOutlet's hosting path.

- Public RTMPS TCP proxy: `shortline.proxy.rlwy.net:26266`, forwarding to container port `1936`.
- Public HTTPS domain: `https://mediamtx-production-61fdcd13.up.railway.app`, routed by Railway to container port `8888`.
- The public HLS base URL is the HTTPS domain above. Do not append `:8888`; that is the container's internal listener port.
- The Railway build uses the repository-owned Dockerfile and configuration files. Its entrypoint removes the old `MTX_*` overrides so the committed configuration controls the service.
- The current deployment starts `mediamtx.railway.hls-only.yml`. Railway deployment `ca34e73b-0d4c-45f1-b97f-f513c9418387` completed successfully, and its runtime log confirms the HLS listener on `:8888`.
- RTMPS is deliberately disabled until both `MYOUTLET_RTMPS_CERT_PEM` and `MYOUTLET_RTMPS_KEY_PEM` contain a matching, publicly trusted certificate chain and private key for the RTMPS hostname. When both are present, the entrypoint selects `mediamtx.railway.yml`, which enables strict RTMPS on TCP `1936` while retaining HLS on TCP `8888`.
- The TCP proxy exists, but `rtmps://shortline.proxy.rlwy.net:26266` is not an operational ingest URL until the trusted certificate is installed and the TLS handshake is verified.
- Railway terminates HTTPS for the generated HLS domain. MediaMTX therefore serves HLS over internal HTTP on port `8888`, while visitors use the public HTTPS URL. The local Compose configuration remains a separate arrangement that enables MediaMTX TLS directly.

## Wix repository publishing connection

The `wix.config.json` site ID matches the existing MyOutlet Wix site. That value is a project binding, not proof of an active Wix Editor GitHub Integration connection. The Velo GitHub App's repository access and the site's GitHub Integration panel have not been independently verified through the available site APIs.

The GitHub Actions workflow uses Wix's documented Wix CLI for Sites sequence: authenticate with `WIX_CLI_API_KEY`, then run `wix publish`. Wix requires the site to be integrated with GitHub before this workflow can publish. The API key must be generated in Wix's API Keys Manager with the **Wix CLI for Sites - Git Integration** permission and stored as the repository Actions secret `WIX_CLI_API_KEY`. The last workflow attempt stopped before checkout, CLI setup or publishing because that secret was empty.

Official Wix references:
- [Set Up Git Integration & Wix CLI for Sites](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/setting-up-git-integration-wix-cli-for-sites)
- [Set Up GitHub Actions to Work with the Wix CLI for Sites](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/set-up-git-hub-actions-to-work-with-the-wix-cli-for-sites)
- [Publish a Site with Git Integration & Wix CLI for Sites](https://dev.wix.com/docs/develop-websites/articles/workspace-tools/developer-tools/git-integration-wix-cli-for-sites/publishing-a-site-with-git-integration-wix-cli-for-sites)

## Wix streaming configuration

The Wix Members Area app has been installed on MyOutlet and verified through the site-scoped Apps Installer API. Wix requires Members Area before the Secrets API can create or manage site secrets.

- `MYOUTLET_HLS_BASE_URL` has been created with `https://mediamtx-production-61fdcd13.up.railway.app`.
- `MYOUTLET_RTMPS_BASE_URL` is intentionally not created yet. It will be set to the RTMPS endpoint only after the listener and trusted certificate are operational.

The HLS base URL must not include the internal container port. Do not store stream keys or TLS private keys in Wix CMS. The backend refuses to create a session if either URL secret is missing or uses the wrong scheme.

## TLS certificates and local service

For Railway, provide a publicly trusted certificate chain and matching private key for the exact RTMPS hostname as the service variables `MYOUTLET_RTMPS_CERT_PEM` and `MYOUTLET_RTMPS_KEY_PEM`. The entrypoint writes them to ephemeral runtime files with restrictive permissions. Self-signed certificates are not suitable for public OBS publishing.

The Wix account currently has no connected custom domains, so `japbstudios.com` cannot be managed through that Wix account's domain controls. No DNS records have been changed. The domain's current DNS provider must be identified before a DNS-based certificate validation can be completed.

For the local Docker Compose deployment, place a certificate and matching private key for the stream host in `live-streaming/certs/fullchain.pem` and `live-streaming/certs/privkey.pem`. The directory is ignored by Git.

Run the service from the `live-streaming` directory with Docker Compose:

```sh
docker compose -f compose.yaml up -d
```

The local Compose configuration exposes RTMPS on TCP 1936 and HTTPS HLS on TCP 8888. Plain RTMP, RTSP, WebRTC, SRT, MoQ, the MediaMTX control API, metrics and profiling endpoints are disabled. Both RTMPS and HLS use the supplied TLS certificate. MediaMTX delegates every publish/read/playback authorization decision to the MyOutlet Wix HTTP function.

## Live chat backend

The live-chat service is implemented in `src/backend/liveChat.jsw` and uses the `LiveChatMessages` CMS collection. `getLiveChatMessages` returns the latest messages or messages after a timestamp cursor; `sendLiveChatMessage` accepts authenticated member messages up to 500 characters; `moderateMyChannelChatMessage` lets a creator moderate their own channel's chat; and `moderateChatMessage` is restricted to site owners. Sender names are resolved from the Wix public-member profile collection rather than accepted from client input.

Chat reads and writes require the stream to remain live and its media to remain published with current verified worldwide rights. The current best-effort rate limit is five messages per member per stream per ten seconds. Removed messages remain part of the rate-limit count. The two composite CMS indexes for stream/status/time and stream/member/time were created on November 17, 2026; both reached `ACTIVE` during verification on November 17, 2026, so the documented indexed chat queries are ready for use.

The homepage application includes the live-chat panel, message reporting, creator-owned message removal, one-hour timeouts and permanent channel bans. Creator Studio lists active restrictions and lets the channel owner lift them. Sender member IDs are returned only when the signed-in viewer owns the channel; the backend independently checks channel ownership before every moderation or ban operation. Site-owner review of viewer reports remains available through the site moderation area.

## Ordered song-request queue

The catalogue backend exposes `enqueueSong` for one track and `enqueueSongs` for an ordered batch of one to five tracks. The batch method checks the active stream and verified media rights, enforces the 50-item stream queue and five-pending-requests-per-member limits, inserts the selected tracks sequentially in the submitted order, and marks already inserted items cancelled if a later insert fails. The creator receives one notification for the batch.

This is queue functionality only. It does not yet search NoiseGround, charge the viewer, or transfer the requested amount to the creator. Those integrations remain unimplemented.

## Remaining service work

Live-stream sessions are delivered as HLS while active. This configuration does not archive sessions as VOD. Live sessions are not automatically archived as VOD. Ending a session removes its live media item from the catalogue. Adaptive-bitrate transcoding, CDN distribution, automatic disconnect detection, NoiseGround catalogue integration, paid song-request checkout and creator payment processing are not implemented in this service yet. The scheduled Wix/CMS health check does not monitor the separate RTMPS/HLS streaming host. The song queue backend accepts ordered batches of up to five requests per viewer, but those requests are not charged. The live service requires a reachable stream host and a valid TLS certificate for RTMPS.


## Live Wix and CMS verification — November 20, 2026

Read-only calls against the selected MyOutlet Wix site confirmed:

- The enabled custom embed is named `MyOutlet Homepage Application`, ID `9f24fff7-b3c2-4820-b3f9-6f82b3114b67`, revision `3`, position `BODY_END`. It is configured to load `src/public/myoutlet-app.js` from the repository's `main` branch through jsDelivr, with the raw GitHub URL as a fallback. It displays a visible diagnostic if both downloads fail or if the application does not mount. The Wix API confirmed the saved embed configuration; browser execution and application rendering have not yet been verified.
- Wix reports 26 CMS collections: 20 native MyOutlet collections and 6 Wix-managed collections. The required creator, media, upload, rights, live-stream, song-request, chat, notification and moderation collections exist.
- All 20 native MyOutlet collections use ADMIN-only CMS read, insert, update and delete permissions. Backend web methods mediate public and member access.
- The configured indexes across all 20 native collections returned ACTIVE status, including unique creator handles, unique stream paths, unique rights records per media item and the live-chat, song-queue, upload, notification and catalogue query indexes.
- Members Area is installed. The site-scoped Apps Installer returned app definition ID `14cc59bc-f0b7-15b8-e1c7-89ce41d0e0c9`.
- Wix Secrets Manager contains `MYOUTLET_HLS_BASE_URL`. It does not yet contain `MYOUTLET_RTMPS_BASE_URL`.

The homepage embed is a configured frontend script reference, not a verified frontend runtime connection. It does not prove that the Velo backend and page-code files in this repository are synchronized with Wix through the Velo GitHub App. The GitHub Actions publishing workflow still requires a successful Velo Git integration and the `WIX_CLI_API_KEY` repository secret.

Railway's production MediaMTX service is live, connected to `JAPStudios/MyOutlet` on `main`, and has a successful deployment. Its generated HTTPS domain targets container port 8888, and its TCP proxy forwards public TCP port 26266 to container port 1936. The current Railway variable inventory contains no RTMPS certificate or private-key variables, so the TCP proxy exists but the RTMPS listener is not yet enabled or verified.
