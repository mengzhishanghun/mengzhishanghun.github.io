---
title: Edit Blueprint Nodes, Connections, and Layout
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
sourceHash: 27e971627a75eedcfcfec1941e30805de1070489ef582a019311a3e14f9afc40
translationStatus: translated
generatedBodyHash: 831a7b7e6cd2e478773763236efd13c0d1ca73b2f59f9401fd062f79f2dd6751
docPage:
  work: mcp-blueprint
  group: assets-graphs
  slug: graphs
  order: 2
---

## Read the graph and find node actions

| Tool | Purpose | Notes |
| --- | --- | --- |
| `GetGraphDetail` | Shows nodes, pins, links, and layout in the selected graph. | Use `GraphName` to select a graph. |
| `SearchGraphNodes` | Finds creatable nodes by English action name. | Create nodes only with returned `SpawnerId` values. |

Use the asset path returned by the plugin and page through large graphs. `GetGraphDetail` also returns pin defaults. Search for nodes by their English Unreal action names, such as `Branch`, `For Loop`, `For Each Loop`, `Switch on Int`, `Switch on Name`, `Switch on String`, `Add`, `Subtract`, `Multiply`, or `Divide`.

## Preview, apply, and save a graph patch

For writes that change structure or data:

1. Locate the target asset, graph, pin, member, or component.
2. Search with `SearchGraphNodes` to obtain a valid `SpawnerId`.
3. Preview with `bDryRun=true` where supported. Check affected assets, normalized operations, restrictions, and blockers.
4. Apply using returned identifiers. Do not invent a `SpawnerId`.
5. Call `SaveAsset` only when you want to keep the changes.

Dry-run cannot display every generated pin, type promotion, or final layout. This preview limitation does not mean the tool writes automatically. Use a `SpawnerId` from the current search results before writing.

## What ApplyGraphPatch can change

`ApplyGraphPatch` supports:

- `Nodes` with temporary IDs and Action Registry `SpawnerId` values.
- `Connections` and `Disconnections`.
- `RemoveNodes` addressed by node identifiers.
- `MoveNodes` addressed by node identifiers and graph coordinates.
- Optional `PinDefaults`, `PromotedType`, layout scope, and layout style.

The entire patch uses one transaction and attempts automatic rollback on failure. If the tool reports recovery failure, stop editing and reopen the asset to inspect its current state before proceeding.

- **Write rejected:** read every blocker and approval-parameter requirement, then read the target again before retrying.
- **Unexpected graph result:** compare `GetGraphDetail` before and after; use Undo where applicable.
- Blueprint Actions that cannot be handled safely cause the operation to be rejected.

## Set defaults for unconnected input pins

Obtain the target node identifier from `GetGraphDetail` and provide a nonempty `PinDefaults` map, for example `{"Duration": "2.0", "InString": "Hello"}`. Object/Class pins require full object paths. This tool does not change nodes, connections, or graph structure. A connected input ignores its default at runtime. Use `ApplyGraphPatch` for structural changes.

## Edit variable pin counts and lay out the graph

| Tool | Purpose | Notes |
| --- | --- | --- |
| `AddNodePin` | Adds a pin to a node that supports variable pin counts. | Obtain the target node identifier from graph details first. |
| `RemoveNodePin` | Removes an editable user pin from a node. | Locate the exact target pin. |
| `FormatGraph` | Organizes graph layout using `Balanced`, `Straight`, or `Compact`. | Select a graph or a layout scope. |
| `AddCommentBox` | Adds a native Comment Box. | Specify text and bounds or target nodes. |

`Balanced`, `Straight`, and `Compact` are deterministic layout styles. Local and full-graph layouts preserve native Comment Box containment. Use single-step Undo where Unreal supports it.

## Example: create a calculation function

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

## Examples: edit order settlement rules

These examples use the [`EvaluateOrderBatchV2` order settlement graph](/en/works/mcp-blueprint/docs/graph-screenshots/) to show how changes to nodes, links, and defaults affect the graph.

### Free shipping for first orders in Region 1

Before the change, Region 1 always sets `ShippingCents = 1000`.

![Region 1 before](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A1)

After the change, a `FirstOrder` branch sets shipping to `0` for first orders and keeps `1000` for other orders.

![Region 1 after](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A2)

### Exclude shipping from points

Before the change: `PointsEarned = TotalCents / 100`.

![Points before](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A3)

After the change: `PointsEarned = (TotalCents - ShippingCents) / 100`. A new Subtract node excludes shipping.

![Points after](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A4)

### Change the first-order discount to 5% of subtotal

Before the change, the graph calculates `SubtotalCents × 0` and then adds `500`, always returning a fixed discount of `500`.

![Discount before](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A5)

After the change, `SubtotalCents / 20` produces a 5% discount.

![Discount after](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A6)

Before changing logic, use dry-run where supported to understand its impact. Explicitly approve reference updates or potential data loss when the tool requires it. Use `SaveAsset` to keep changes.
