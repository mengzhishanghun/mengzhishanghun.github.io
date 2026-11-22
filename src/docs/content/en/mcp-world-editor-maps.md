---
title: Check a Map
type: doc
slug: mcp-world-editor-maps
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/maps/
lang: en
translationKey: doc:mcp-world-editor:maps
sourceHash: 302207fb3a37e5fcd110c88478b30eb2bbfb392173dd4118c5ab96b760704d82
translationStatus: translated
generatedBodyHash: 7ef626db0b1dd2d03abeb3e65c4899a03ed32ae0a1f85a63cc57ce43a9f74661
docPage:
  work: mcp-world-editor
  group: levels
  slug: maps
  order: 1
---

## Run a map check

`MapCheck` runs the engine map check and returns error and warning counts, visible messages with tokens, and `Complete`. If the Message Log UI filter hides messages or `MaxMessages` truncates them, `Complete=false`, so the result cannot be reported as passing. The check creates a new page for the current map while retaining older pages and the user's UI filter.

To save or build a map, see [Save Level Packages](/en/works/mcp-world-editor/docs/save-level-packages/), [Build Navigation and Find Paths](/en/works/mcp-world-editor/docs/navigation/), or [Build Level Lighting](/en/works/mcp-world-editor/docs/lighting-build/).
