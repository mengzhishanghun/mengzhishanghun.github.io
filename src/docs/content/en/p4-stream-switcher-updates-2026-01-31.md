---
title: 2026-01-31
type: doc
slug: p4-stream-switcher-updates-2026-01-31
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: changelog
  slug: updates-2026-01-31
  order: 79739869
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/updates-2026-01-31/
lang: en
translationKey: doc:p4-stream-switcher:updates-2026-01-31
sourceHash: 647a3c7b5f652f0c8aca123f9dcbd0d64790645909404aa8d68ef81b8b72e1c0
translationStatus: translated
generatedBodyHash: 8c7dc66930e4b48896c672f4aa742cf33f4a1e40e6a786a5476fe549f9b7fcea
---

## v1.4.1

With “Create P4CONFIG” checked, each switch updates `.p4config` whether the workspace is new or already exists.

Published on [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.4.1).

## v1.4.0

The tool now stores its cache in `config.json`. Changes to `auto_rmdir` apply to all local workspaces.

When switching streams, the tool first reads an existing workspace’s `Root` from the P4 server, even if there is no local cache. Next it checks `stream_cache`. The tool generates a default path only if neither source has one.

Published on [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.4.0).
