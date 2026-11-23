---
title: 2025-06-18
type: doc
slug: plugin-auto-packer-updates-2025-06-18
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2025-06-18
  order: 79749382
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/updates-2025-06-18/
lang: en
translationKey: doc:plugin-auto-packer:updates-2025-06-18
sourceHash: 7ac88ab131256fa6a7d07d12b2568917fb85a8272284b82139d0a6cd4b6bdfea
translationStatus: translated
generatedBodyHash: 2b3586c66d1d7db52f3c7e7d20d056960ee1e3a6b26767212d5c56f3f4f7e31d
---

## v1.1.1

Fab post-processing can add copyright notices to `.h`, `.cpp`, and `.Build.cs` files after packaging, skipping `ThirdParty`. The generated `FilterPlugin.ini` excludes `Binaries`, `Intermediate`, `Resources`, `Source`, and `Config`.

The app saves Fab options in `%LOCALAPPDATA%/UEPluginPacker/Config.json` and restores them at startup. Without a saved configuration, the options start unchecked. Previously, all options appeared checked at startup.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.1.1).
