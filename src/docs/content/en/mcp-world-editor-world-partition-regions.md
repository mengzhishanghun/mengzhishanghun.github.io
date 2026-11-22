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
sourceHash: 9f83134b5488087f7ba0975663cd6a5bd86d0a486a0c87760c9f334550992190
translationStatus: translated
generatedBodyHash: 8a76c7825ef6fa68cffd2b13016043f8638dbfdcf154e0e0cb065a6e46338164
docPage:
  work: mcp-world-editor
  group: world-partition
  slug: world-partition-regions
  order: 3
---

## World Partition region loading

`LoadRegion` creates and loads a persistent editor region through Unreal Engine's public World Partition loader API. `BoundsMin` and `BoundsMax` must each contain finite numeric `X`, `Y`, and `Z` fields, and every minimum coordinate must be strictly less than its matching maximum coordinate. Invalid bounds are rejected before a loader is created.

## World Partition region lifecycle

Each axis is limited to 1,000,000 Unreal units, total volume to 1e17 cubic units, and no more than 16 MCP-created regions may remain active. A successful call returns an opaque `RegionHandle`; pass it to `UnloadRegion` to unload and release the corresponding official Editor Loader Adapter. Handles are never guessed or reused from bounds. World cleanup/map replacement and plugin module shutdown automatically release regions still owned by the plugin, after which their old handles expire.
