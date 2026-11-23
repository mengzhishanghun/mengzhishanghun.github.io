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
sourceHash: 8491a90ef56d3e38995362fe0d7bf6d9c6efaf8116ac19606e4e7e307303d719
translationStatus: translated
generatedBodyHash: 311b86c80df439f2c1cf6f4fccacae9d8b288834794ef96992c1219d84c4889f
docPage:
  work: mcp-dev-tools
  group: features
  slug: data-tables
  order: 5
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| DataTable | `GetDataTable`, `CreateDataTable`, `PatchDataTableRows` | Read complete rows by page; specify an existing `RowStructPath` when creating; edit with the current `RowStructPath`, `Changes`, and complete old rows in `ExpectedValues`. Supports Add, Update, and Remove. Does not generate or convert row structures. |

To change one column in an existing row, read the target row first. Put the entire old row in `ExpectedValues` and specify an Update in `Changes`. Keep the full old row even when changing a single column. If the row is not on the current page, check `bHasMore` and continue at `NextOffset`. Lists and paged reads return 20 items by default, up to 100 per page.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
