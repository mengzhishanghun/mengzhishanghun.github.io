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
sourceHash: 8f3c1818b0de4bf354f2888df67f09f40d037bd3ea423f7e9f7e49396175da0b
translationStatus: translated
generatedBodyHash: 8c4814f573c89384fe70169238d83b0d3c3d4a778fd2ad642f2c8549563829ab
docPage:
  work: mcp-niagara
  group: systems
  slug: niagara-preview
  order: 3
---

## Thumbnail source and output limits

`CapturePreview` reads only a thumbnail already cached in memory or stored in a saved package; it does not render or replace the thumbnail cache. Exactly one PNG is returned, bounded to 1024×1024 pixels, 16 MiB raw data, and 8 MiB compressed data.
