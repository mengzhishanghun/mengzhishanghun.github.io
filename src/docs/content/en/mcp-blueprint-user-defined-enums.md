---
title: Create and Modify User-Defined Enums
type: doc
slug: mcp-blueprint-user-defined-enums
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/user-defined-enums/
lang: en
translationKey: doc:mcp-blueprint:user-defined-enums
sourceHash: 17f44b616aa754c27f1f2426eaca70ed9a3c0dee1d7a4447cf1453a769a0f4f0
translationStatus: translated
generatedBodyHash: 8313eb992966921a0672122bf1eec77b04693bba5eb17fb38cb7cc8071e2a32e
docPage:
  work: mcp-blueprint
  group: members-types
  slug: user-defined-enums
  order: 6
---

## Create, read, and edit entries

| Tool | Purpose | Notes |
| --- | --- | --- |
| `CreateUserDefinedEnum` | Creates a User Defined Enum under `/Game`. | Does not save automatically. |
| `GetUserDefinedEnum` | Shows Enum entries, values, and display names. | Read large Enums with pagination. |
| `ModifyUserDefinedEnum` | Adds, edits, or removes Enum entries. | Start with `bDryRun`; changing serialized meaning requires explicit approval. |

Use entry identifiers to select targets and check the reference impact with `bDryRun`. Give separate explicit approval for edits that may change what existing serialized values mean.
