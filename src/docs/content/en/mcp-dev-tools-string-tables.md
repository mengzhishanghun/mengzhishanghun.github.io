---
title: Create String Tables and Edit Entries
type: doc
slug: mcp-dev-tools-string-tables
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/string-tables/
lang: en
translationKey: doc:mcp-dev-tools:string-tables
sourceHash: e65328e09fd914c9b6617b0223c9a2c512c728e64e4c9a7213c9f4a61180a0e3
translationStatus: translated
generatedBodyHash: 2e974ad23e82ddf48193d5e1d16f85d49f8fd7bee3093ee3d0e3fe6d7448aada
docPage:
  work: mcp-dev-tools
  group: features
  slug: string-tables
  order: 8
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| StringTable | `GetStringTable`, `CreateStringTable`, `PatchStringTable` | Read keys, source text, and metadata by page; specify a fixed `Namespace` when creating; edit with `Namespace`, `TableId`, `Changes`, and complete old entries in `ExpectedValues`. Supports Add, Update, and Remove. |

To change the source text for one key, find the entry by key first. Use the full entry as the old value. Keep the table’s current `Namespace` and `TableId`. Lists and paged reads return 20 items by default, up to 100 per page. Use `bHasMore` and `NextOffset` to continue when another page is available.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
