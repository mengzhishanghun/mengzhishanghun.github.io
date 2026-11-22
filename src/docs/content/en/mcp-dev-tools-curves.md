---
title: Create Curves and Replace Channels
type: doc
slug: mcp-dev-tools-curves
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/curves/
lang: en
translationKey: doc:mcp-dev-tools:curves
sourceHash: 16988026fc6c0989884f00970d60dc3e98da1138e17df7b166f613d8471c98d8
translationStatus: translated
generatedBodyHash: 44899020bded5389ac542df0be3e8a839c035ee20269d282c9e52cb635147473
docPage:
  work: mcp-dev-tools
  group: data
  slug: curves
  order: 3
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| Curve | `GetCurve`, `CreateCurve`, `SetCurve` | Read or create Float, Vector, and LinearColor curves; replace selected channels using `Channels` and the corresponding complete old channels in `ExpectedValues`. Unspecified channels retain their values. |

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
