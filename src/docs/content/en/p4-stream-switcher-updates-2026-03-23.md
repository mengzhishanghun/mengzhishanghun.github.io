---
title: 2026-03-23
type: doc
slug: p4-stream-switcher-updates-2026-03-23
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: changelog
  slug: updates-2026-03-23
  order: 79739677
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/updates-2026-03-23/
lang: en
translationKey: doc:p4-stream-switcher:updates-2026-03-23
sourceHash: 6d4c78e837773c5440c84b0fbda2e9e0b585c45b32269b193af985f27a6d71d5
translationStatus: translated
generatedBodyHash: fc906413e9c25d37272d2bbfe34b79b2061ac10fbd0be04cf72bbd273ba5c79b
---

## v1.5.0

- If there is no cache, the tool infers the most common root from existing workspaces on the same-named stream. The new Delete Workspace button removes the workspace from the server and clears its local cache.
- `sync -k` and `reconcile` show live counts of processed files. The general settings now include a line-ending option that defaults to `win`. At startup, the tool corrects the setting for all workspaces.
- Fixed detection of an empty stream and stopped `NeedSync` from retrying indefinitely after a failed sync. The tool also handles cases where `reconcile` finds no differences or `have` finds no files on the client. Switching to an existing workspace no longer overwrites a manually selected directory.

Published on [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.5.0).
