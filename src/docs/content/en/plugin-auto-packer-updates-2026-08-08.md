---
title: 2026-08-08
type: doc
slug: plugin-auto-packer-updates-2026-08-08
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2026-08-08
  order: 79739192
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/updates-2026-08-08/
lang: en
translationKey: doc:plugin-auto-packer:updates-2026-08-08
sourceHash: f54c7ab1553b6c91b803b2696e12fd3700cb88dba7ecd075b3160035a59da0a2
translationStatus: translated
generatedBodyHash: 177ca7916b3e08fcb9f804c126d3351aedcadda2ce37696fc735f41b4b98867b
---

## v1.2.2

Fixed the loss of Chinese characters, Unicode dashes, arrows, and other valid UTF-8 characters in `Source` after packaging. The packer now decodes UTF-8 strictly, with or without a BOM, and preserves line endings. It no longer silently discards characters it cannot decode. Replacing a copyright header now leaves standalone comments, trailing code, and unclosed block comments intact.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.2.2).
