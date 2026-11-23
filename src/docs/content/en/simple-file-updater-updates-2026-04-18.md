---
title: 2026-04-18
type: doc
slug: simple-file-updater-updates-2026-04-18
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - simple-file-updater
docPage:
  work: simple-file-updater
  group: changelog
  slug: updates-2026-04-18
  order: 79739582
documentKind: product-manual
websiteRoute: /en/works/simple-file-updater/docs/updates-2026-04-18/
lang: en
translationKey: doc:simple-file-updater:updates-2026-04-18
sourceHash: 7626e3cc307bff156d7d9c0ef679da955c8e00ef039ec93068f4daf18c070593
translationStatus: translated
generatedBodyHash: aba2c6c9262158edbdcb21f0328add9282f7569e904f7efd501c74fccdaa80e4
---

## v1.0.1

Fixed a crash when the Windows Chinese console printed symbols such as `✔` and `❌`. The default GBK code page could not encode them, which could interrupt syncing after the first download. This release uses UTF-8 for standard output and standard error.

Published on [GitHub Release](https://github.com/MZSH-Tools/SimpleFileUpdater/releases/tag/v1.0.1).
