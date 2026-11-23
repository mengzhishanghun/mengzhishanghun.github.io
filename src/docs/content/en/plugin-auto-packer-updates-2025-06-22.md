---
title: 2025-06-22
type: doc
slug: plugin-auto-packer-updates-2025-06-22
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2025-06-22
  order: 79749378
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/updates-2025-06-22/
lang: en
translationKey: doc:plugin-auto-packer:updates-2025-06-22
sourceHash: 18f0d72332cf1aa6028040191aea86d73eb4f799897007e10ec1a2ac777c5e58
translationStatus: translated
generatedBodyHash: e1fc60cc0356d7e5db83c7e935f1b0ad0cdc6c2c639cd9b16cf7edbaa5bc90c8
---

## v1.1.2

Fixed a bug that could insert a BOM on the second line when adding a copyright notice. This encoding error could cause `GENERATED_BODY` to be skipped. The packer checks for a BOM and preserves the source encoding. It skips `ThirdParty` when adding copyright notices.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.1.2).
