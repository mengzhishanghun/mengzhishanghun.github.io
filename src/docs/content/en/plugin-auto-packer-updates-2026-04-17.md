---
title: 2026-04-17
type: doc
slug: plugin-auto-packer-updates-2026-04-17
draft: false
sitePublish: true
tags:
  - Changelog
workIds:
  - plugin-auto-packer
docPage:
  work: plugin-auto-packer
  group: changelog
  slug: updates-2026-04-17
  order: 79739583
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/updates-2026-04-17/
lang: en
translationKey: doc:plugin-auto-packer:updates-2026-04-17
sourceHash: ee74718af42a6252d4d67f5c9a91661a85637132666cfb66da012abaf59f065e
translationStatus: translated
generatedBodyHash: 88c745e20dcaa37690095e3788720bda2490adcfe6a62ef9be4cba8af29a9d4c
---

## v1.2.0

This release adds a CLI. Starting without arguments still opens the GUI. Use `build` to package a plugin, `engines` to list configured engines, or `plugins` to list project plugins. With `build`, use `--engines` to target selected engines, `--all` for all engines, `--output` to set the output directory, or `--no-post` to skip post-processing.

The CLI returns `0` for full success, `1` for partial failure, `2` for invalid arguments, and `130` for Ctrl+C. CLI output is visible in Command Prompt, and the GUI also opens a console window.

Published on [GitHub Release](https://github.com/MZSH-Tools/UEPluginAutoPacker/releases/tag/v1.2.0).
