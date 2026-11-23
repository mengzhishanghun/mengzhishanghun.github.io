---
title: Inspect Packaging Output
type: doc
slug: plugin-auto-packer-output
draft: false
sitePublish: true
tags:
  - UnrealEngine
  - Plugins
  - Packaging
workIds:
  - plugin-auto-packer
documentKind: product-manual
websiteRoute: /en/works/plugin-auto-packer/docs/output/
lang: en
translationKey: doc:plugin-auto-packer:output
sourceHash: 0b7da024a187a7fc5b733a12da9d3662446e1ddde0e54f14ceb48dbd1c6086e2
translationStatus: translated
generatedBodyHash: 2fb09bc4ba8806b88b555c89d7c9d6094b70f28cf6a1a7a6e8adefc509e71949
docPage:
  work: plugin-auto-packer
  group: features
  slug: output
  order: 2
---

## Output Paths and Error Logs

- Find the package by plugin and engine name under `PackagedPlugins/插件名/引擎名/`.
- If you enabled post-processing, check the files and generated configuration against the requirements for this release.
- If packaging fails for an engine version, open `Failed.log` in that version’s output directory to read the error.

## Logs and Engine Status

Each engine icon shows whether its build is waiting, running, successful, failed, or canceled. Logs update during the build; click an engine to view its log.
