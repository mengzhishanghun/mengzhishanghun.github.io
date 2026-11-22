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
sourceHash: ee8c7ac06984a8afcf80332dbf450e8614938158ecbdb22e07cf20cd1892adc5
translationStatus: translated
generatedBodyHash: e4136056913b00d3dd8f4643ccce6a472fec9d247339f725df2cca2b3d2445be
docPage:
  work: mcp-world-editor
  group: landscape
  slug: landscape-splines
  order: 3
---

## Inspect and patch spline topology

For Landscape-specific splines, inspect `GetLandscapeSplineTopology`, then use `PatchLandscapeSplineTopology` for `AddPoint`, `UpdatePoint`, `DeletePoint`, `AddSegment`, `UpdateSegment`, or `DeleteSegment`, with exact point/segment paths and local coordinates or tangents as appropriate. Preview first and apply with `ExpectedTopologyHash` and `ExpectedPlanHash`. This bounded topology editor requires a loaded non-partitioned Landscape without a reserved spline Edit Layer. `ApplyLandscapeSplines` separately previews terrain application to an explicit `EditLayerGuid` and applies with `ExpectedPlanHash`; when a reserved spline layer exists, use its GUID. The target must be available and unlocked. Neither operation saves the level or assets.
