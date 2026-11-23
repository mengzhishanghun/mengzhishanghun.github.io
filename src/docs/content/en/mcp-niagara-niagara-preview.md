---
title: Export a Cached Niagara Thumbnail
type: doc
slug: mcp-niagara-niagara-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
documentKind: product-manual
websiteRoute: /en/works/mcp-niagara/docs/niagara-preview/
lang: en
translationKey: doc:mcp-niagara:niagara-preview
sourceHash: a60cd3e1b25eb9934a553e725576bd0f0fc2fccfb1b1aa933293f20e17b3d540
translationStatus: translated
generatedBodyHash: 271df1de1ac6f781e8797d5198a73433e00744a7cdf3d385540afa23606da996
docPage:
  work: mcp-niagara
  group: features
  slug: niagara-preview
  order: 3
---

## Thumbnail source and output limits

`CapturePreview` reads only a thumbnail already cached in memory or stored in a saved package; it neither renders a new view nor changes the thumbnail cache. The tool returns one PNG, limited to 1024×1024 pixels, 16 MiB of raw data, and 8 MiB of compressed data. Open the target system to inspect a recent edit, since the cached image cannot confirm that the edit is visible.
