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
sourceHash: f9c155416cae58089532f6a9878afb2b5a72f92cdb497c54460a0b306be53fea
translationStatus: translated
generatedBodyHash: 1f94125bc5dab5aa215dfaedf5f891c1e211cd5e748631c51b515d7c13b208d0
docPage:
  work: mcp-dev-tools
  group: features
  slug: curves
  order: 6
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| Curve | `GetCurve`, `CreateCurve`, `SetCurve` | Read or create Float, Vector, and LinearColor curves; replace selected channels using `Channels` and the corresponding complete old channels in `ExpectedValues`. Unspecified channels retain their values. |

To edit one channel in a Vector curve, read the full channel first. Send the complete replacement and the complete old channel. Leave out any channel you want to keep. Preview the change before applying it. Then read the curve again to check the edited channel and confirm the others are unchanged. Then save separately; see the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
