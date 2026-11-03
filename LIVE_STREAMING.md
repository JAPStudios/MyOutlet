# MyOutlet live-stream service

MyOutlet live sessions use OBS Studio for contribution, MediaMTX for RTMPS ingest and HLS packaging, and the Wix backend for creator ownership, rights review, moderation and stream authentication.

## Connection flow

1. A signed-in creator calls `createLiveStream` for a channel they own. The backend creates a `MediaItems` record in `pending_review` and a private `LiveStreams` record. It returns an RTMPS ingest URL containing a newly generated stream key. Only the SHA-256 hash is stored.
2. The creator submits a rights declaration for the returned `mediaItemId`. A site owner reviews the declaration and publishes the media item only after rights verification.
3. Publishing the media item changes the associated live session to `ready`. MediaMTX accepts an OBS publisher only when the stream path, channel ID, stream-key hash, published media item and current rights state all match.
4. MediaMTX serves the active stream over HTTPS HLS. Its HTTP authentication callback checks that the session remains live and that the associated media item remains published with current verified rights.
5. Visitors discover active sessions through `browseLiveStreams` or retrieve one by ID through `getLiveStream`. Both methods expose only live sessions whose media remains published, rights-verified and within the viewer's rating preference.
6. The creator ends the session with `endLiveStream`. The session becomes `ended` and its live media item is removed from the public catalogue.

## Wix Secrets Manager

Create these two secrets on the MyOutlet site. Values must match the public host and ports exposed by the MediaMTX service.

- `MYOUTLET_RTMPS_BASE_URL`: the RTMPS base URL, for example `rtmps://stream.example.com:1936`.
- `MYOUTLET_HLS_BASE_URL`: the HTTPS HLS base URL, for example `https://stream.example.com:8888`.

The live-stream backend refuses to create a session if either secret is missing or has the wrong URL scheme. Do not store the stream key or TLS private key in Wix CMS.

## TLS certificates and service

Place a certificate and matching private key for the stream host in `live-streaming/certs/fullchain.pem` and `live-streaming/certs/privkey.pem`. The directory is ignored by Git.

Run the service from the `live-streaming` directory with Docker Compose:

```sh
docker compose -f compose.yaml up -d
```

The RTMPS listener is exposed on TCP 1936 and HTTPS HLS on TCP 8888. Plain RTMP, RTSP, WebRTC, SRT, MoQ, the MediaMTX control API, metrics and profiling endpoints are disabled. Both RTMPS and HLS use the supplied TLS certificate. MediaMTX delegates every publish/read/playback authorization decision to the MyOutlet Wix HTTP function.

## Live chat backend

The live-chat service is implemented in `src/backend/liveChat.jsw` and uses the `LiveChatMessages` CMS collection. `getLiveChatMessages` returns the latest messages or messages after a timestamp cursor; `sendLiveChatMessage` accepts authenticated member messages up to 500 characters; `moderateMyChannelChatMessage` lets a creator moderate their own channel's chat; and `moderateChatMessage` is restricted to site owners. Sender names are resolved from the Wix public-member profile collection rather than accepted from client input.

Chat reads and writes require the stream to remain live and its media to remain published with current verified worldwide rights. The current best-effort rate limit is five messages per member per stream per ten seconds. Removed messages remain part of the rate-limit count. The two composite CMS indexes for stream/status/time and stream/member/time were created on November 3, 2026; both reached `ACTIVE` during verification on November 3, 2026, so the documented indexed chat queries are ready for use.

The backend and CMS schema are present, but this repository change does not create or wire a visible chat panel into the Wix Editor page. The page-level chat interface still needs to be connected to these web methods.

## Ordered song-request queue

The catalogue backend exposes `enqueueSong` for one track and `enqueueSongs` for an ordered batch of one to five tracks. The batch method checks the active stream and verified media rights, enforces the 50-item stream queue and five-pending-requests-per-member limits, inserts the selected tracks sequentially in the submitted order, and marks already inserted items cancelled if a later insert fails. The creator receives one notification for the batch.

This is queue functionality only. It does not yet search NoiseGround, charge the viewer, or transfer the requested amount to the creator. Those integrations remain explicitly unimplemented.

## OBS Studio

In OBS, choose a custom streaming service. Paste the complete `ingestUrl` returned by `createLiveStream` into the Server field and leave the separate Stream Key field empty. The URL includes the per-session channel credential and must be treated as a secret. It is returned only by session creation; `getMyLiveStreams` never returns it.

Use an H.264 video encoder and AAC audio. MediaMTX repackages the incoming stream as HLS; this configuration does not perform transcoding or adaptive-bitrate ladder generation.

## Boundaries

Live sessions are not automatically archived as VOD. Ending a session removes its live media item from the catalogue. Recording, VOD import, adaptive-bitrate transcoding, CDN distribution, automatic disconnect detection, NoiseGround catalogue integration, paid song-request checkout and creator payment processing are not implemented in this service yet. The song queue backend accepts ordered batches of up to five requests per viewer, but those requests are not charged. The live service also requires a reachable stream host and valid TLS certificate; those host-specific values are intentionally not fabricated in source control.
