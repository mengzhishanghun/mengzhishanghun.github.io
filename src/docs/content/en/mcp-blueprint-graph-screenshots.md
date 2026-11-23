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
sourceHash: ce63cd4089ded018df06e73227e8be2507dbc1291b10bec091ec50d0c678ff9b
translationStatus: translated
generatedBodyHash: 23cf06eded0f6e88222276c9d0f6f56c5469127f8af43af79d1f019ad7c3915c
docPage:
  work: mcp-blueprint
  group: features
  slug: graph-screenshots
  order: 3
---

## Open and capture the graph

Open the Blueprint with `OpenAsset`. Open the graph you want, then call `CaptureGraphScreenshot`. Capture the full graph to show its structure, focus on a node to show its connections, or reuse a specified viewport. Check that titles, pins, and links are readable before sharing.

The screenshot tool requires an initialized Blueprint graph editor widget. It rejects requests when the graph editor is closed or its widget has zero size.

## Calculation function screenshot

Read `CalculateScore` from left to right: Add combines `BaseScore` and `Bonus`, Multiply scales the sum by `Multiplier`, and the return node is at the far right.

![CalculateScore graph](/media-occurrence/doc%3Amcp-blueprint%3Agraph-screenshots%3Amedia%3A1)

## Complete order settlement graph screenshot

`EvaluateOrderBatchV2` keeps order totals, discounts, shipping, tax, points, risk scoring, and the final result in one graph. Use the colored comment boxes to find each part of the calculation before zooming in on nodes and connections.

![Order settlement graph](/media-occurrence/doc%3Amcp-blueprint%3Agraph-screenshots%3Amedia%3A2)
