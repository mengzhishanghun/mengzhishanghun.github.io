---
title: Edit Landscape Splines
type: doc
slug: mcp-world-editor-landscape-splines
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/landscape-splines/
lang: en
translationKey: doc:mcp-world-editor:landscape-splines
sourceHash: 6b02a2186f9ac63626cc3355cf263d9950ed2750f99d8da8b0ee8ad1bb9fe315
translationStatus: translated
generatedBodyHash: b8e5caf4f0ed2edbae060c2a38ff8f45ae3889ad8350861cd69414930b1baa96
docPage:
  work: mcp-world-editor
  group: features
  slug: landscape-splines
  order: 18
---

## Inspect and patch spline topology

For Landscape-specific splines, inspect `GetLandscapeSplineTopology`, then use `PatchLandscapeSplineTopology` for `AddPoint`, `UpdatePoint`, `DeletePoint`, `AddSegment`, `UpdateSegment`, or `DeleteSegment`, with exact point/segment paths and local coordinates or tangents as appropriate. Preview first and apply with `ExpectedTopologyHash` and `ExpectedPlanHash`. This bounded topology editor requires a loaded non-partitioned Landscape without a reserved spline Edit Layer. `ApplyLandscapeSplines` separately previews terrain application to an explicit `EditLayerGuid` and applies with `ExpectedPlanHash`; when a reserved spline layer exists, use its GUID. The target must be available and unlocked. Neither operation saves the level or assets.

Decide whether you need to change the points and segments or apply the existing spline to the target layer. Read the topology back after editing it to check the connections. After terrain application, inspect the result on the target layer before saving separately.
