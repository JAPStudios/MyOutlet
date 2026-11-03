# Upstream components

This file records pinned upstream repositories referenced by MyOutlet. Git submodules preserve each upstream repository and its commit history; they do not copy the code into MyOutlet's own application tree or make the functionality integrated. Initialize them with:

```sh
git submodule update --init --recursive
```

## Previously recorded media and archival references

| Local path | Upstream | Pinned commit | Use and limitations |
|---|---|---|---|
| `upstream/disney-plus-clone` | Amplejohnny/disney_plus_clone | `9524500eb2495886d036063af46e3dfc3d5f1a21` | Interface reference only. No repository licence file was identified in the earlier inspection; obtain permission before copying or redistributing code, artwork, branding or assets. |
| `upstream/youtube-data-project` | Mohanapriyar5/DS_Python_youtubedata_project | `0398108cdc76c4134a564af83f7542eca8f37075` | Data/analytics reference. No repository licence file was identified in the earlier inspection; obtain permission before reuse. Do not bypass platform API terms. |
| `upstream/heritrix3` | internetarchive/heritrix3 | `0f46340d266ab2609e16e474bedfa12008a4e323` | Web crawler. Apache-2.0 repository licence with additional component/dependency licences to review. Crawl only permitted targets. |
| `upstream/moviepy` | internetarchive/moviepy | `1f4cfc504cfd7d00bac4ffda9986248544f659c3` | Video editing/processing library, not a streaming server or CDN. MIT licence; retain notices. |
| `upstream/video-archiving-insights` | internetarchive/video_archiving_insights | `80cd72dfecd4ad2f31860abb059a73ca218af76f` | Archival metadata/dashboard reference, not a rights-clearance service. AGPL-3.0 obligations require review before modification or network deployment. |

## OBS Project repositories

The following public OBS Project repositories were pinned at their default-branch heads (or the repository's advertised default branch) when this import was prepared. The local paths are under `upstream/obsproject/`. These are source references, not yet merged into MyOutlet's application or built as MyOutlet features.

| Repository | Branch | Pinned commit | Intended relevance |
|---|---|---|---|
| [obsproject/obs-studio](https://github.com/obsproject/obs-studio) | `master` | `65c320b46e1af5c7a555161aea6182cdf7a8c524` | Desktop capture, scene composition, audio/video mixing and live production reference. |
| [obsproject/obs-websocket](https://github.com/obsproject/obs-websocket) | `master` | `e28f84975984340e84fc4879cfc05741cc0afde1` | Remote control and automation interface reference for production workflows. |
| [obsproject/obs-browser](https://github.com/obsproject/obs-browser) | `master` | `d4db73e7e5d5b51d853177c8cddc796715a8ac84` | Browser-source integration reference. |
| [obsproject/obs-plugintemplate](https://github.com/obsproject/obs-plugintemplate) | `master` | `3e7d7ac3b5342cd7d9b88890b9c70b472d1520fc` | Template for evaluating native production plug-in architecture. |
| [obsproject/obs-amd-encoder](https://github.com/obsproject/obs-amd-encoder) | `master` | `b30ea6b39999039d8c7038b586cf81c337e587d8` | Archived AMD hardware-encoding integration reference. |
| [obsproject/libdshowcapture](https://github.com/obsproject/libdshowcapture) | `master` | `c13d4b7b0c66979396ba0a9060c9aafc15bb7b22` | Windows DirectShow capture library reference. |
| [obsproject/obs-vst](https://github.com/obsproject/obs-vst) | `master` | `b28cdef1fb06ece14d6be023b0f08ec28bca972e` | Archived VST audio plug-in integration reference. |
| [obsproject/rfcs](https://github.com/obsproject/rfcs) | `master` | `da063de64d0fe8ed009128d896197bc918fb41e0` | Technical proposals and architecture decisions. |
| [obsproject/obs-deps](https://github.com/obsproject/obs-deps) | `master` | `cbf0a3d8a0a34c07e822bda22a5f8214f91801d7` | Build dependency definitions; inspect platform and licence constraints. |
| [obsproject/loganalyzer](https://github.com/obsproject/loganalyzer) | `master` | `8e2626a7a58f76b364560a34d6f9aa02f539a2f7` | OBS log analysis tooling reference. |
| [obsproject/obs-bot](https://github.com/obsproject/obs-bot) | `master` | `48f0f6505a7a3e5899735b7ba05fd2af8ca11796` | Community automation/bot reference. |
| [obsproject/cef](https://github.com/obsproject/cef) | `6533-fix-stutter-and-osr-extra-info` | `176b09c19dec2b37c74b7e8a666b33e3a014094b` | Chromium Embedded Framework fork used in OBS-related browser integration; large upstream dependency. |
| [obsproject/design](https://github.com/obsproject/design) | `main` | `6a7639840dc6d88546da127c18374541b3fadfa2` | OBS design resources and visual-system reference; review asset permissions. |
| [obsproject/bouf](https://github.com/obsproject/bouf) | `master` | `0c74f10c17e81ae9df5d459eb754e192d465aae9` | OBS-related build/dependency tooling; inspect before adoption. |
| [obsproject/obscommits](https://github.com/obsproject/obscommits) | `master` | `a4246ecdf9957c32c5d7d7a6a681e956f5e22bbe` | OBS commit/archive data reference. |
| [obsproject/obs-crowdin-sync](https://github.com/obsproject/obs-crowdin-sync) | `main` | `8110ce1d8e8640da5f9eef484808f603ab46ca0b` | Localization workflow automation reference. |
| [obsproject/.github](https://github.com/obsproject/.github) | `master` | `24419f25473295ddbe9d55bce6a3cd0bf9e1196d` | Organization-wide GitHub metadata and workflow templates. |
| [obsproject/FFmpeg](https://github.com/obsproject/FFmpeg) | `master` | `4ac869ca2a1caaa888ad65ebd9a9b1914bfaf9b8` | Media codec, muxing and transcoding foundation; review upstream licence configuration and enabled codecs. |
| [obsproject/homebrew-tools](https://github.com/obsproject/homebrew-tools) | `main` | `6e5f2d7ea0adcaff6d2f5b44799ed23b8f3f9e53` | macOS packaging/tooling reference. |
| [obsproject/obs-deps-buildstream](https://github.com/obsproject/obs-deps-buildstream) | `master` | `602653e345270cb2c388dbc8cc5bb50935e1b1b1` | BuildStream dependency/build definitions. |
| [obsproject/obs-oauth-cf](https://github.com/obsproject/obs-oauth-cf) | `master` | `039c64c4e9a097a7e536a714b2e92477e98723be` | OAuth-related Cloudflare worker/service reference. |

## Chatterino organization repositories

All 26 public repositories returned by the Chatterino organization repository search are pinned as Git submodules under `upstream/chatterino/`. Each entry records the exact default-branch commit selected on November 3, 2026. These are source checkouts, not merged into MyOutlet's Wix Velo runtime. The desktop Chatterino client is a native Qt application; its code is not directly executable as a browser chat panel. The primary relevant references are `chatterino2`, `api`, `libcommuni`, `twitch-eventsub-ws`, and `websocketpp`.

| Local path | Upstream | Branch | Pinned commit | Relevance |
|---|---|---|---|---|
| `upstream/chatterino/chatterino2` | [Chatterino/chatterino2](https://github.com/Chatterino/chatterino2) | `master` | `463ca077f4dc4b24d19ab501a9301cd124247cb3` | Primary native Twitch chat client reference; MIT licence. MyOutlet's live-chat backend remains a separate web implementation. |
| `upstream/chatterino/api` | [Chatterino/api](https://github.com/Chatterino/api) | `master` | `b2549741d1c9cec0e95ea3126980fac8269bf1d5` | Go URL-preview and API-cache service reference; separate deployment would be required. |
| `upstream/chatterino/chatterino-browser-ext` | [Chatterino/chatterino-browser-ext](https://github.com/Chatterino/chatterino-browser-ext) | `master` | `cc908f54feacd6afac9cefbac5d77a0679621dbc` | Browser-extension reference; not a MyOutlet browser extension. |
| `upstream/chatterino/wiki` | [Chatterino/wiki](https://github.com/Chatterino/wiki) | `master` | `1a570ec111339a4469fcea53f73acc747f702a88` | Chatterino product and developer documentation reference. |
| `upstream/chatterino/website` | [Chatterino/website](https://github.com/Chatterino/website) | `main` | `c05e86ffc78b824f27cb2d972c0e07295b1bf23e` | Rust/Minijinja website implementation reference. |
| `upstream/chatterino/qtkeychain` | [Chatterino/qtkeychain](https://github.com/Chatterino/qtkeychain) | `master` | `73c3772d6432280df83e1ab3299c2a8f1e4ea47f` | Qt keychain integration dependency reference. |
| `upstream/chatterino/libcommuni` | [Chatterino/libcommuni](https://github.com/Chatterino/libcommuni) | `chatterino-cmake` | `9dc0de7c91d362abc431f680dd94e81eadf41622` | IRC protocol library reference. |
| `upstream/chatterino/login` | [Chatterino/login](https://github.com/Chatterino/login) | `master` | `4883d98357f46e38ad88ff0c85edb6d37652df8b` | Archived login service reference. |
| `upstream/chatterino/crash-handler` | [Chatterino/crash-handler](https://github.com/Chatterino/crash-handler) | `main` | `d3270fa03668b5c6c208400196368f66f6883352` | Crash-reporting service reference. |
| `upstream/chatterino/appbase` | [Chatterino/appbase](https://github.com/Chatterino/appbase) | `master` | `d054925734cf26576346a1da856f7ab0d4b6c0a5` | Archived shared application framework reference. |
| `upstream/chatterino/command-list-api` | [Chatterino/command-list-api](https://github.com/Chatterino/command-list-api) | `main` | `73c784f12d36329405f2d87da45b83c9a0423226` | Command-list API reference. |
| `upstream/chatterino/msvc-dev-cmd` | [Chatterino/msvc-dev-cmd](https://github.com/Chatterino/msvc-dev-cmd) | `master` | `0a3f3854dc342f760a57bfa5b3936ed1bb7c2194` | Windows build-environment helper reference. |
| `upstream/chatterino/twitch-cli` | [Chatterino/twitch-cli](https://github.com/Chatterino/twitch-cli) | `main` | `a367becc25b3b3712509bde15021cd222d827923` | Twitch CLI tooling reference. |
| `upstream/chatterino/actions-comment-pull-request` | [Chatterino/actions-comment-pull-request](https://github.com/Chatterino/actions-comment-pull-request) | `main` | `e4a76dd2b0a3c2027c3fd84147a67c22ee4c90fa` | GitHub Actions pull-request automation reference. |
| `upstream/chatterino/webhook-receiver` | [Chatterino/webhook-receiver](https://github.com/Chatterino/webhook-receiver) | `main` | `9e52bb01736f25fa05e4432210a87e40165780cc` | Webhook receiver reference. |
| `upstream/chatterino/docker` | [Chatterino/docker](https://github.com/Chatterino/docker) | `master` | `4d8abb0fa67eb98f4b341d8f861c8b89692b750e` | Container build and deployment reference. |
| `upstream/chatterino/chatterino-updater-win` | [Chatterino/chatterino-updater-win](https://github.com/Chatterino/chatterino-updater-win) | `master` | `dabdad80656108c6bdaf214f1ce0599e91852637` | Windows updater reference. |
| `upstream/chatterino/certify` | [Chatterino/certify](https://github.com/Chatterino/certify) | `master` | `a448a3915ddac716ce76e4b8cbf0e7f4153ed1e2` | Certificate automation reference. |
| `upstream/chatterino/plugin-test` | [Chatterino/plugin-test](https://github.com/Chatterino/plugin-test) | `main` | `fd71b3d7b90532d4181f74f527113d170a7f2e5b` | Plugin test fixtures and examples. |
| `upstream/chatterino/meta` | [Chatterino/meta](https://github.com/Chatterino/meta) | `main` | `04656e25e23a900f7a6f676eba4ae1adec167e26` | Organization metadata and community reference. |
| `upstream/chatterino/httpbox` | [Chatterino/httpbox](https://github.com/Chatterino/httpbox) | `master` | `6f33826510fea2a18001a7268016ff1f613d1346` | HTTP test utility reference. |
| `upstream/chatterino/pkg` | [Chatterino/pkg](https://github.com/Chatterino/pkg) | `main` | `4c9c416ba5dfac4befc14ee7beee422460cd2237` | Packaging metadata and tooling reference. |
| `upstream/chatterino/websocketpp` | [Chatterino/websocketpp](https://github.com/Chatterino/websocketpp) | `chatterino` | `f1736a8e72b910810ff6869fe20f647a62f3bc35` | WebSocket++ dependency fork reference. |
| `upstream/chatterino/twitch-pubsub-server-test` | [Chatterino/twitch-pubsub-server-test](https://github.com/Chatterino/twitch-pubsub-server-test) | `master` | `58e80004fb5e88fec06b8278af9f06ae249bacd5` | Twitch PubSub test service reference. |
| `upstream/chatterino/clang-tidy-module` | [Chatterino/clang-tidy-module](https://github.com/Chatterino/clang-tidy-module) | `main` | `0759bf70373b8c083f9109997d568fc2177e7797` | C++ static-analysis tooling reference. |
| `upstream/chatterino/twitch-eventsub-ws` | [Chatterino/twitch-eventsub-ws](https://github.com/Chatterino/twitch-eventsub-ws) | `master` | `dc1007dd22e51c9ab8e59ad2119abd72d189a249` | Twitch EventSub WebSocket reference. |

## Integration and licensing boundary

- Submodule entries only pin upstream commit objects. They do not mean all upstream source files have been copied into MyOutlet or that the code is running.
- Review each repository's current licence, notices, bundled assets, dependencies and third-party terms before copying, modifying, distributing or deploying any component. A repository's existence under the OBS Project organization is not a blanket licence for every asset or dependency.
- OBS Studio is a desktop production application, not a turnkey browser-based streaming service. Its components may inform a creator production workflow, capture/encoding pipeline or remote-control integration, but MyOutlet still needs its own server-side ingest, transcoding, adaptive delivery, live/VOD storage, playback, creator identity, moderation, rights, payment and reliability systems.
- FFmpeg and OBS components have platform-specific build requirements and licence implications. No claim is made that these repositories have been compiled, tested or integrated.
