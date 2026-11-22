---
title: Capture Blueprint Graph Screenshots
type: doc
slug: mcp-blueprint-graph-screenshots
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/graph-screenshots/
lang: en
translationKey: doc:mcp-blueprint:graph-screenshots
sourceHash: dc6d18d2873374bf6469edacc0c451871295404b3780f1e4268bbd5ca57ee716
translationStatus: translated
generatedBodyHash: 8fb60086e13edc87f192ff0d4538c3923f7a78d38272bc3856605a845f8e4878
docPage:
  work: mcp-blueprint
  group: assets-graphs
  slug: graph-screenshots
  order: 3
---

## Open and capture the graph

Call `OpenAsset` before `CaptureGraphScreenshot`. Capture the full graph, focus on a node, or reuse a specified viewport. Check that titles, pins, and links are readable before sharing.

The screenshot tool requires an initialized Blueprint graph editor widget. It rejects requests when the graph editor is closed or its widget has zero size.

## Calculation function screenshot

`CalculateScore` adds `BaseScore` and `Bonus`, then multiplies the result by `Multiplier`.

![CalculateScore graph](/media-occurrence/doc%3Amcp-blueprint%3Agraph-screenshots%3Amedia%3A1)

## Complete order settlement graph screenshot

`EvaluateOrderBatchV2` keeps order totals, discounts, shipping, tax, points, risk scoring, and the final result in one connected function graph.

![Order settlement graph](/media-occurrence/doc%3Amcp-blueprint%3Agraph-screenshots%3Amedia%3A2)
