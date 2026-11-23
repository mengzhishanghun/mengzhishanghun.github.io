---
title: 2026-06-19
type: doc
slug: plugin-auto-packer-updates-2026-06-19
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2026-06-19
  order: 79739381
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/updates-2026-06-19/
lang: en
translationKey: doc:plugin-auto-packer:updates-2026-06-19
sourceHash: dbaaae69cd1cdda7804e4bca52cd68c26ef176d9a9edf0736c12854e9784a192
translationStatus: translated
generatedBodyHash: 0e7fc178ef2c55cc516b1f001082e0fa537496e25a9efebd4b800403e288d353
---

## v1.2.1

The CLI `build` command now accepts `--keep-binaries`. It overrides the setting that deletes `Binaries` and keeps the compiled DLLs for use in `Engine/Plugins/Marketplace/` on an installed engine. Without the flag, the command produces a source package for Fab. An installed engine needs to rebuild the modules to load it. The GUI continues to handle `Binaries` according to the configured Fab option.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.2.1).
