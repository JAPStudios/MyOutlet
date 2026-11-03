# MyOutlet upstream source inventory

This inventory pins the five upstream repositories requested for MyOutlet. Each upstream is preserved as a Git submodule at a specific commit so its original history and repository boundary remain intact. A submodule reference is a source import, not a claim that its features have been integrated into MyOutlet's application.

## Imported source repositories

| Component | Pinned source | Intended technical use | License status |
|---|---|---|---|
| Disney+ clone | https://github.com/Amplejohnny/disney_plus_clone/tree/9524500eb2495886d036063af46e3dfc3d5f1a21 | Reference implementation for a React streaming catalogue and playback-oriented interface. The upstream README describes a Create React App project with React/Redux and Firebase/Firestore. | No LICENSE/COPYING/NOTICE file was present in the inspected repository tree. Treat the source as all-rights-reserved unless the author grants permission. Do not copy or redistribute its code, artwork, branding or assets into MyOutlet. |
| YouTube data project | https://github.com/Mohanapriyar5/DS_Python_youtubedata_project/tree/0398108cdc76c4134a564af83f7542eca8f37075 | Reference for channel/video metadata retrieval and analytics using the YouTube Data API, Streamlit, MongoDB and SQL. | No LICENSE/COPYING/NOTICE file was present in the inspected repository tree. Treat the source as all-rights-reserved unless the author grants permission. |
| Heritrix 3 | https://github.com/internetarchive/heritrix3/tree/0f46340d266ab2609e16e474bedfa12008a4e323 | Candidate archival web-crawling component for crawling only permitted targets and respecting robots.txt, site policies and rate limits. Not a video-streaming engine. | Apache License 2.0 at repository level. The upstream README warns that some source files and bundled dependencies carry separate licenses; review those notices before redistribution. |
| MoviePy | https://github.com/internetarchive/moviepy/tree/1f4cfc504cfd7d00bac4ffda9986248544f659c3 | Candidate server-side media processing for trimming, concatenation, titling, compositing and audio/video transformations. | MIT License is declared by the repository metadata. Retain the upstream license and notices when redistributing covered code. |
| Video Archiving Insights | https://github.com/internetarchive/video_archiving_insights/tree/80cd72dfecd4ad2f31860abb059a73ca218af76f | Reference dashboard for metadata-based video archive insights and operational visualisation. | GNU Affero General Public License v3.0. Review source distribution, modification and network-use obligations before integrating or offering a modified network service. |

## Integration boundaries

- These submodules pin upstream source at the commits above. They do not copy upstream files into MyOutlet's first-party source tree.
- No upstream component is represented as integrated, tested or deployed by this commit.
- The two repositories without an identified licence are included only as source references. Their presence as submodule pointers does not grant MyOutlet permission to copy, modify or redistribute their contents.
- Heritrix is a crawler, not a general-purpose media downloader. Any future archival use must be restricted to material MyOutlet is authorised to crawl and preserve.
- MoviePy is a media-processing library, not a live-streaming server, transcoding fleet, CDN or broadcast playout system.
- Video Archiving Insights is a metadata dashboard, not a rights-clearance system or media catalogue API.
- The Disney+ clone is an interface reference only. MyOutlet must use its own name, branding, artwork, catalogue metadata and playback implementation. Do not reuse Disney-owned marks or protected media.
- The YouTube-data project is a reference for analytics, not an authorisation to scrape YouTube or bypass API terms, quotas, privacy rules or creator permissions.

## MyOutlet implementation still required

A functional MyOutlet service still needs first-party implementation and testing for identity and access control, creator/channel management, media ingest, transcoding and adaptive-bitrate packaging, live contribution and playback, VOD storage and delivery, metadata/catalogue/search, moderation and age-rating enforcement, rights and takedown workflows, creator analytics, payout accounting, song-request queue integration with NoiseGround, security, accessibility, observability and disaster recovery.

The current MyOutlet repository is a Wix Velo project. The upstream imports in this commit do not convert that project into a production streaming service.
