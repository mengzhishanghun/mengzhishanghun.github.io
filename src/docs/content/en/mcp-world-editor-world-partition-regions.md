---
title: Load and Unload World Partition Regions
type: doc
slug: mcp-world-editor-world-partition-regions
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/world-partition-regions/
lang: en
translationKey: doc:mcp-world-editor:world-partition-regions
sourceHash: f4cc5083468620c0618cb4ab281112c2312e68d4f36a691d02a9fcd26f3e0256
translationStatus: translated
generatedBodyHash: a3a5058875d4b860e99ff0c677a9ae33deb4a4e56199fa0f8494d535a3ae2c9f
docPage:
  work: mcp-world-editor
  group: features
  slug: world-partition-regions
  order: 14
---

## World Partition region loading

`LoadRegion` creates and loads a persistent editor region through Unreal Engine's public World Partition loader API. `BoundsMin` and `BoundsMax` must each contain finite numeric `X`, `Y`, and `Z` fields, and every minimum coordinate must be strictly less than its matching maximum coordinate. Invalid bounds are rejected before a loader is created.

Choose the area to load, then supply coordinates for two bounding corners. If you have only selected a footprint, specify a valid height interval as well.

## World Partition region lifecycle

Each axis is limited to 1,000,000 Unreal units, total volume to 1e17 cubic units, and no more than 16 MCP-created regions may remain active. A successful load returns an opaque `RegionHandle`. Pass it to `UnloadRegion` to unload the region and release its Editor Loader Adapter. Handles are never guessed or reused from bounds. World cleanup/map replacement and plugin module shutdown automatically release regions still owned by the plugin, after which their old handles expire.

Keep the `RegionHandle` returned by a successful load. Use it to unload the region when you finish editing there. If you load a region after switching maps, use the new handle.
