---
title: Create Curve Tables and Edit Rows
type: doc
slug: mcp-dev-tools-curve-tables
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/curve-tables/
lang: en
translationKey: doc:mcp-dev-tools:curve-tables
sourceHash: 1f8b2e68aa08d7c5c69141027aecbfceb8125118486ef50de7f44817d579e332
translationStatus: translated
generatedBodyHash: d537c05c0e0a28a88b20b1189c3761f0da51dcdd8a299b768f64dff0beff0f14
docPage:
  work: mcp-dev-tools
  group: features
  slug: curve-tables
  order: 7
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| CurveTable | `GetCurveTable`, `CreateCurveTable`, `PatchCurveTableRows` | Read Simple or Rich rows by page; specify `Mode` when creating; use `Mode`, `Changes`, and complete old rows in `ExpectedValues` for Add, Replace, and Remove. Does not convert between Simple and Rich modes. |

Before replacing an existing row, read the table to check its mode and find the row. Keep that mode in the request and submit the complete old row and its replacement. Lists and paged reads return 20 items by default, up to 100 per page. If the row is not on the current page, check `bHasMore` and continue at `NextOffset`.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
