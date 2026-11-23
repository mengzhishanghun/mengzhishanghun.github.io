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
sourceHash: c72081689ed35f79835de8b374936cf5530a6688d4f88783f3270b3bbb3881ad
translationStatus: translated
generatedBodyHash: 106a3c0175fa4fc66d93d265cd27336db7648ee529e0b3305f5b572c3ead24cf
docPage:
  work: mcp-blueprint
  group: features
  slug: user-defined-enums
  order: 9
---

## Create, read, and edit entries

| Tool | Purpose | Notes |
| --- | --- | --- |
| `CreateUserDefinedEnum` | Creates a User Defined Enum under `/Game`. | Does not save automatically. |
| `GetUserDefinedEnum` | Shows Enum entries, values, and display names. | Read large Enums with pagination. |
| `ModifyUserDefinedEnum` | Adds, edits, or removes Enum entries. | Start with `bDryRun`; changing serialized meaning requires explicit approval. |

Read the entries, values, and display names first. Select the entry by its identifier and use `bDryRun` to check the impact on references. Give separate explicit approval for any edit that may change the meaning of existing serialized values. After creating or editing the Enum, save any changes you want to keep separately.
