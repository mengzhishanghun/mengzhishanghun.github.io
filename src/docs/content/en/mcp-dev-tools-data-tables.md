---
title: Create Data Tables and Edit Rows
type: doc
slug: mcp-dev-tools-data-tables
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/data-tables/
lang: en
translationKey: doc:mcp-dev-tools:data-tables
sourceHash: d4da4f01798ee9579a03530d995dcfedb80884f3e043823e4b90cd425e3e5849
translationStatus: translated
generatedBodyHash: b4718137820424be7f072232c6b9c2fa15db042fe50410fe301c718b2ae9e053
docPage:
  work: mcp-dev-tools
  group: data
  slug: data-tables
  order: 2
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| DataTable | `GetDataTable`, `CreateDataTable`, `PatchDataTableRows` | Read complete rows by page; specify an existing `RowStructPath` when creating; edit with the current `RowStructPath`, `Changes`, and complete old rows in `ExpectedValues`. Supports Add, Update, and Remove. Does not generate or convert row structures. |

Standard lists and paged reads return 20 items by default, with at most 100 per page. Continue using `bHasMore` and `NextOffset`.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
