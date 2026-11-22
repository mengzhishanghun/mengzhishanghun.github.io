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
sourceHash: dc9fe48c7d9ff91cd4a3184f1c72c97e290765621a08e1ce6c4c1c7660f87f11
translationStatus: translated
generatedBodyHash: 67fc6a182fecb459df5dd7bafb52e03b36386ea2347dfb27653c0153c04da973
docPage:
  work: mcp-dev-tools
  group: data
  slug: string-tables
  order: 5
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| StringTable | `GetStringTable`, `CreateStringTable`, `PatchStringTable` | Read keys, source text, and metadata by page; specify a fixed `Namespace` when creating; edit with `Namespace`, `TableId`, `Changes`, and complete old entries in `ExpectedValues`. Supports Add, Update, and Remove. |

Standard lists and paged reads return 20 items by default, with at most 100 per page. Continue using `bHasMore` and `NextOffset`.

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
