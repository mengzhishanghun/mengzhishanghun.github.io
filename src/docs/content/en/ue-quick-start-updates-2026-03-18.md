---
title: 2026-03-18
type: doc
slug: ue-quick-start-updates-2026-03-18
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - ue-quick-start
docPage:
  work: ue-quick-start
  group: changelog
  slug: updates-2026-03-18
  order: 79739682
documentKind: product-manual
websiteRoute: /en/works/ue-quick-start/docs/updates-2026-03-18/
lang: en
translationKey: doc:ue-quick-start:updates-2026-03-18
sourceHash: 392f90fe019da99b2a3b395fbc0341b349b2353899c77897c796e613e5f8dec3
translationStatus: translated
generatedBodyHash: 8b12cd024d7fd5aad463cc55d1ab943ca7cd85f3b38e1ad1bfac9645ddb9a6d5
---

## v1.1.0

Before compiling, the tool converts LF or CR line endings to CRLF in `.h`, `.c`, `.cpp`, `.cs`, and `.inl` files. It scans the project’s `Source/` and `ThirdParty/` directories and the `Source/` and `ThirdParty/` directories under `Plugins/`. It handles read-only files and skips those already using CRLF. If a file cannot be processed, the tool continues with the others.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEQuickStart/releases/tag/v1.1.0).
