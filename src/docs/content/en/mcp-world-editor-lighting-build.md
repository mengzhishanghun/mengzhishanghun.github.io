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
sourceHash: fe874788c8e5f5a2b1fee9e49fda9b2b3f810ffc3aebd7a7076a725bdff63c7a
translationStatus: translated
generatedBodyHash: 7865b6661bf0e2cdab1d921091747ab7765abb8607d34fb27a110eb97165c8a8
docPage:
  work: mcp-world-editor
  group: features
  slug: lighting-build
  order: 4
---

## Preview and build status

`BuildLighting` previews the build by default. To run it, return the preview’s `PlanHash` and set `DryRun=false`.

Lighting builds use Preview quality. Keep the returned `OperationId` and use `GetBuildStatus` until it reports a final state. Receiving an ID gives you a build to track. A lighting build succeeds only after all active lighting scenarios have applied their results. The tool does not report a progress percentage or save the map. Switching or unloading the map invalidates running operation IDs.
