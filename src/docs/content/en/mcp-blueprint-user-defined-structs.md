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
sourceHash: ce3742cbb5816c8e51ad47f5e5c0b59bda929e006915dc31edc50c597e6ddad8
translationStatus: translated
generatedBodyHash: b4cf9d4ab51849bf9a18d5f8d6abc4dfb65b65cd25bb984e612d18f6e49fef43
docPage:
  work: mcp-blueprint
  group: members-types
  slug: user-defined-structs
  order: 5
---

## Create, read, and edit fields

| Tool | Purpose | Notes |
| --- | --- | --- |
| `CreateUserDefinedStruct` | Creates a User Defined Struct under `/Game`. | Does not save automatically. |
| `GetUserDefinedStruct` | Shows Struct field definitions. | Read large Structs with pagination. |
| `ModifyUserDefinedStruct` | Adds, edits, or removes Struct fields. | Start with `bDryRun`; potential data loss requires explicit approval. |

Use field identifiers to select targets and check the reference impact with `bDryRun`. Give separate explicit approval for edits that may lose data.
