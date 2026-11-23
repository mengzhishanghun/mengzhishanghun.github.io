---
title: 2026-01-30
type: doc
slug: p4-stream-switcher-updates-2026-01-30
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - p4-stream-switcher
docPage:
  work: p4-stream-switcher
  group: changelog
  slug: updates-2026-01-30
  order: 79739870
documentKind: product-manual
websiteRoute: /en/works/p4-stream-switcher/docs/updates-2026-01-30/
lang: en
translationKey: doc:p4-stream-switcher:updates-2026-01-30
sourceHash: 579f97196f5e2cfa568208b8c0f9f431271c61b9095e59d34c0608a3b38f3bcc
translationStatus: translated
generatedBodyHash: 76724a3a7fe454b3ba4823dcf30b7bac755d7bf1e5878e7e3218aeddf03e4f28
---

## v1.3.2

At startup, the app checks for another running instance to prevent duplicate launches.

Published on [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.3.2).

## v1.3.1

Fixed default workspace path calculation for paths with forward slashes or backslashes. Fixed a popup issue that occurred when cleanup could not delete a PyInstaller temporary directory.

Published on [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.3.1).

## v1.3.0

Logs now include `[HH:MM:SS]` timestamps. Info appears in black, warnings in orange, and errors in red. If sync fails during workspace creation, the tool retries on the next switch. It also displays an error message when `P4Exception.errors` is empty.

Published on [GitHub Release](https://github.com/MZSH-Tools/P4StreamSwitcher/releases/tag/v1.3.0).
