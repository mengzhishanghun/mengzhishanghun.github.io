---
title: 2026-06-13
type: doc
slug: ue-quick-start-updates-2026-06-13
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - ue-quick-start
docPage:
  work: ue-quick-start
  group: changelog
  slug: updates-2026-06-13
  order: 79739387
documentKind: product-manual
websiteRoute: /en/works/ue-quick-start/docs/updates-2026-06-13/
lang: en
translationKey: doc:ue-quick-start:updates-2026-06-13
sourceHash: 49222995ad0c1e66bc33d6d0a3d3a9887f835aeebcc5b9bd6732a7f6f5ff4524
translationStatus: translated
generatedBodyHash: a2ff8d282fe37986722a322b68fffee656829e386b43ee1eaee1eb5902addb5c
---

## v1.2.0

The new `--test` option compiles the project without opening the editor or the GUI. Passing arguments runs the CLI without loading Tkinter. Starting without arguments still opens the GUI.

The CLI locates the project from the current working directory, so you can call the EXE from another location. It keeps console output visible and uses UTF-8 for standard output, fixing a crash caused by Windows GBK encoding. The console is hidden only in GUI mode.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEQuickStart/releases/tag/v1.2.0).
