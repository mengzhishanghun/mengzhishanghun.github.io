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
sourceHash: ddb0d586d8495faf970b406ed9d55c418afd5184567e8e4ab4f448427b0dfba1
translationStatus: translated
generatedBodyHash: ce04e82fc6fedbc4467bda26725587bdab14ddcfc9e427e1e200fa39f668bd0c
docPage:
  work: mcp-dev-tools
  group: data
  slug: curve-tables
  order: 4
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| CurveTable | `GetCurveTable`, `CreateCurveTable`, `PatchCurveTableRows` | Read Simple or Rich rows by page; specify `Mode` when creating; use `Mode`, `Changes`, and complete old rows in `ExpectedValues` for Add, Replace, and Remove. Does not convert between Simple and Rich modes. |

Standard lists and paged reads return 20 items by default, with at most 100 per page. Continue using `bHasMore` and `NextOffset`.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
