---
title: Create and Modify User-Defined Structs
type: doc
slug: mcp-blueprint-user-defined-structs
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/user-defined-structs/
lang: en
translationKey: doc:mcp-blueprint:user-defined-structs
sourceHash: f29a2453a1bf304c9ae0903f7b9d45110a9a099cd6fbad8d2c5947d8f152f83c
translationStatus: translated
generatedBodyHash: b8ba3197a4d362b4ae5e882d036d8329b533405a768bde0655b83e21a70f840b
docPage:
  work: mcp-blueprint
  group: features
  slug: user-defined-structs
  order: 8
---

## Create, read, and edit fields

| Tool | Purpose | Notes |
| --- | --- | --- |
| `CreateUserDefinedStruct` | Creates a User Defined Struct under `/Game`. | Does not save automatically. |
| `GetUserDefinedStruct` | Shows Struct field definitions. | Read large Structs with pagination. |
| `ModifyUserDefinedStruct` | Adds, edits, or removes Struct fields. | Start with `bDryRun`; potential data loss requires explicit approval. |

For an existing Struct, read its fields first. Select the target by its field identifier, then use `bDryRun` to see which references may be affected. Give separate explicit approval for any edit that may lose data, then apply it. After creating or editing the Struct, save any changes you want to keep separately.
