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
sourceHash: b437473a002b3df80057657e63e6a7f156d5b5b65379afd5fc8769821929609c
translationStatus: translated
generatedBodyHash: 98133d88d55f40754c16d5e8ef60a2b3211075c70b664313764e171308d12a91
docPage:
  work: plugin-auto-packer
  group: packaging
  slug: output
  order: 2
---

## Output Paths and Error Logs

- Plugins are packaged under `PackagedPlugins/插件名/引擎名/`
- With automatic organization enabled, the plugin includes cleaned files and generated configuration
- Packaging failures produce `Failed.log` in the corresponding directory

## Logs and Engine Status

Each engine icon shows whether its build is waiting, running, successful, failed, or canceled. Logs update during the build; click an engine to view its log.
