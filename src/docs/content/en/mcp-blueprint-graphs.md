---
title: Find, Edit, and Capture Blueprint Graphs
type: doc
slug: mcp-blueprint-graphs
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/graphs/
lang: en
translationKey: doc:mcp-blueprint:graphs
sourceHash: 6a25aa460e22355f07f7aed1ac22d6f5e5b5d3db118385bc2720b439b8cc2d96
translationStatus: translated
generatedBodyHash: 332f3661673558b9f118dac44db7be44c87e8d41632274ede0bf5d37df3ec010
docPage:
  work: mcp-blueprint
  group: workflows
  slug: graphs
  order: 1
---

### 3. `SetPinDefaults`: literals on unconnected input pins

Obtain the target node identifier from `GetGraphDetail` and provide a nonempty `PinDefaults` map, for example `{"Duration": "2.0", "InString": "Hello"}`. Object/Class pins require full object paths. This tool does not change nodes, connections, or graph structure. A connected input ignores its default at runtime. Use `ApplyGraphPatch` for structural changes.

## Tutorial: create a calculation function

This example creates:

```text
FinalScore = (BaseScore + Bonus) × Multiplier
```

1. Use `CreateBlueprint` to create an Actor Blueprint.
2. Use `CreateFunction` to add `CalculateScore` with three `double` inputs and one `double` output.
3. Use `GetGraphDetail` to find the new function's Entry and Result node identifiers.
4. Search this function graph for `Add` and `Multiply`, then use the returned `Operator:Add` and `Operator:Multiply` actions.
5. Preview an `ApplyGraphPatch` containing the two nodes and five data connections.
6. Apply the same patch with native `double` promotion and automatic `Balanced` layout.
7. Call `SaveAsset` if you want to keep the change.

The finished graph adds `BaseScore` and `Bonus`, then multiplies the result by `Multiplier` from left to right.

## Editor screenshots and business-rule changes

These Blueprint Editor examples show a calculation function, a complete business graph, and visible changes before and after rule edits. They illustrate how nodes, links, and defaults change.

### A standard graph example

`CalculateScore` adds `BaseScore` and `Bonus`, then multiplies the result by `Multiplier`.

![CalculateScore graph](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A1)

### A complete business workflow

`EvaluateOrderBatchV2` keeps order totals, discounts, shipping, tax, points, risk scoring, and the final result in one connected function graph.

![Order settlement graph](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A2)

### Change 1: free shipping for first orders in Region 1

Before the change, Region 1 always sets `ShippingCents = 1000`.

![Region 1 before](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A3)

After the change, a `FirstOrder` branch sets shipping to `0` for first orders and keeps `1000` for other orders.

![Region 1 after](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A4)

### Change 2: exclude shipping from points

Before the change: `PointsEarned = TotalCents / 100`.

![Points before](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A5)

After the change: `PointsEarned = (TotalCents - ShippingCents) / 100`. A new Subtract node excludes shipping.

![Points after](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A6)

### Change 3: replace a fixed first-order discount with 5% of subtotal

Before the change, the graph calculates `SubtotalCents × 0` and then adds `500`, always returning a fixed discount of `500`.

![Discount before](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A7)

After the change, `SubtotalCents / 20` produces a 5% discount.

![Discount after](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A8)

Before changing logic, use dry-run where supported to understand its impact. Explicitly approve reference updates or potential data loss when the tool requires it. Use `SaveAsset` to keep changes.

## Find assets and graphs

- Use `ListBlueprints` to find assets with pagination.
- Use `GetBlueprintOverview` to inspect graphs, variables, functions, components, interfaces, and the parent class.
- Use `ListBlueprintMembers` to inspect functions, Custom Events, Event Dispatchers, and local variables.
- Use `GetGraphDetail` to inspect nodes, pins, defaults, links, and layout.
- Use `GetCompileErrors` or `CompileBlueprint` to read editor diagnostics.

Use asset paths returned by the plugin. Page through large graphs to avoid returning too much content at once.

## Add graph logic safely

Search with Unreal's English action names, such as `Branch`, `For Loop`, `For Each Loop`, `Switch on Int`, `Switch on Name`, `Switch on String`, `Add`, `Subtract`, `Multiply`, or `Divide`.

`ApplyGraphPatch` supports:

- `Nodes` with temporary IDs and Action Registry `SpawnerId` values.
- `Connections` and `Disconnections`.
- `RemoveNodes` addressed by node identifiers.
- `MoveNodes` addressed by node identifiers and graph coordinates.
- Optional `PinDefaults`, `PromotedType`, layout scope, and layout style.

The entire patch uses one transaction and attempts automatic rollback on failure. If the tool reports recovery failure, stop editing and reopen the asset to inspect its current state before proceeding.

## Capture graphs

Call `OpenAsset` before `CaptureGraphScreenshot`. Capture the full graph, focus on a node, or reuse a specified viewport. Check that titles, pins, and links are readable before sharing.

The screenshot tool requires an initialized Blueprint graph editor widget. It rejects requests when the graph editor is closed or its widget has zero size.
