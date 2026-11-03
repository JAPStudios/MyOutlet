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

## OBS Studio

In OBS, choose a custom streaming service. Paste the complete `ingestUrl` returned by `createLiveStream` into the Server field and leave the separate Stream Key field empty. The URL includes the per-session channel credential and must be treated as a secret. It is returned only by session creation; `getMyLiveStreams` never returns it.

Use an H.264 video encoder and AAC audio. MediaMTX repackages the incoming stream as HLS; this configuration does not perform transcoding or adaptive-bitrate ladder generation.

## Boundaries

Live sessions are not automatically archived as VOD. Ending a session removes its live media item from the catalogue. Recording, VOD import, adaptive-bitrate transcoding, CDN distribution, automatic disconnect detection and creator payment processing are not implemented in this service yet. The live service also requires a reachable stream host and valid TLS certificate; those host-specific values are intentionally not fabricated in source control.
