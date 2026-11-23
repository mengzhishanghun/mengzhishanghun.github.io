---
title: Create Blend Spaces and Edit Samples
type: doc
slug: mcp-animation-animation-blend-spaces
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
documentKind: product-manual
websiteRoute: /en/works/mcp-animation/docs/animation-blend-spaces/
lang: en
translationKey: doc:mcp-animation:animation-blend-spaces
sourceHash: 89340509b3de87c641b132e8dd8a85b8056714f8eb8d1c59903324c5e32310d4
translationStatus: translated
generatedBodyHash: df6bec22370c0258351ed9ed3855c879526209ee1a17c016ad7842fc55b16b83
docPage:
  work: mcp-animation
  group: features
  slug: animation-blend-spaces
  order: 5
---

## Find, create, and edit blend spaces

| Tool | Purpose |
|---|---|
| `ListBlendSpaces` / `GetBlendSpaceDetail` | Discover BlendSpaces and read axes and samples. |

| Tool | Purpose |
|---|---|
| `CreateBlendSpace` | Create a BlendSpace when its axis ranges are valid. |
| `SetBlendSpaceSamples` | Transactionally replace up to 256 validated samples and roll back on failure. |

For an existing asset, read the axis ranges and current samples first. `SetBlendSpaceSamples` replaces the entire set. Even if you change only one point, include every point you want to keep. Read the details again to check the axes and samples after the edit.

For paths, transactions, and saving, see how to [open and save animation assets](/en/works/mcp-animation/docs/find-assets/).
