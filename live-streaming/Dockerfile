FROM bluenviron/mediamtx:1.21.3 AS mediamtx

FROM alpine:3.22

RUN apk add --no-cache ca-certificates

COPY --from=mediamtx /mediamtx /usr/local/bin/mediamtx
COPY mediamtx.railway.yml /etc/mediamtx/mediamtx.railway.yml
COPY mediamtx.railway.hls-only.yml /etc/mediamtx/mediamtx.railway.hls-only.yml
COPY entrypoint.sh /entrypoint.sh

RUN chmod 0555 /entrypoint.sh

EXPOSE 1936/tcp 8888/tcp

ENTRYPOINT ["/entrypoint.sh"]
