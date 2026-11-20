#!/bin/sh
set -eu

# The service previously received MediaMTX settings through Railway MTX_*
# variables. The repository-owned configuration is now authoritative.
for variable in \
  MTX_API \
  MTX_AUTHHTTPADDRESS \
  MTX_AUTHMETHOD \
  MTX_HLS \
  MTX_HLSADDRESS \
  MTX_HLSALLOWORIGINS \
  MTX_HLSENCRYPTION \
  MTX_HLSSEGMENTCOUNT \
  MTX_HLSSEGMENTDURATION \
  MTX_HLSVARIANT \
  MTX_LOGLEVEL \
  MTX_METRICS \
  MTX_MOQ \
  MTX_PLAYBACK \
  MTX_PPROF \
  MTX_RTMP \
  MTX_RTSP \
  MTX_SRT \
  MTX_WEBRTC \
  MTX_RTMPENCRYPTION \
  MTX_RTMPSADDRESS \
  MTX_RTMPSERVERKEY \
  MTX_RTMPSERVERCERT
do
  unset "$variable" || true
done

if [ -n "${MYOUTLET_RTMPS_CERT_PEM:-}" ] && [ -n "${MYOUTLET_RTMPS_KEY_PEM:-}" ]; then
  install -d -m 0700 /run/mediamtx/certs
  umask 077
  printf '%s\n' "$MYOUTLET_RTMPS_KEY_PEM" > /run/mediamtx/certs/privkey.pem
  printf '%s\n' "$MYOUTLET_RTMPS_CERT_PEM" > /run/mediamtx/certs/fullchain.pem
  echo "Starting MyOutlet MediaMTX with authenticated RTMPS on TCP 1936 and HLS on TCP 8888."
  exec /usr/local/bin/mediamtx /etc/mediamtx/mediamtx.railway.yml
fi

echo "Starting MyOutlet MediaMTX with HLS on TCP 8888. RTMPS remains disabled until a publicly trusted TLS certificate and private key are configured."
exec /usr/local/bin/mediamtx /etc/mediamtx/mediamtx.railway.hls-only.yml
