---
title: Build Level Lighting
type: doc
slug: mcp-world-editor-lighting-build
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/lighting-build/
lang: en
translationKey: doc:mcp-world-editor:lighting-build
sourceHash: f1726984f86933eabb289632bf7f3d8c67f3a9e6fd5c8ab709ffc3811f993b4a
translationStatus: translated
generatedBodyHash: 9cc1509683592e13cdf34ae1e75a79e7c133933e406969e3aa9cb029e76d3a47
docPage:
  work: mcp-world-editor
  group: levels
  slug: lighting-build
  order: 4
---

## Preview and build status

`BuildLighting` previews the build by default. To run it, return the preview’s `PlanHash` and set `DryRun=false`.

Lighting uses Preview quality and returns an `OperationId`; query `GetBuildStatus` for its terminal state. A lighting build succeeds only after all active lighting scenarios have applied their results. The tool does not report a progress percentage or save the map. Switching or unloading the map invalidates running operation IDs.
