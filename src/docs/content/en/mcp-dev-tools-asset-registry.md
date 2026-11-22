---
title: Query Assets, References, and Types
type: doc
slug: mcp-dev-tools-asset-registry
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/asset-registry/
lang: en
translationKey: doc:mcp-dev-tools:asset-registry
sourceHash: a35d5ed7074dbb688de18a0ee1138e89ebeab74d76a048d9123ad9afb858572b
translationStatus: translated
generatedBodyHash: 8f08c474ebcbcadf4bb48be5850196af5ab00a680845b1708e9a1654ac576e15
docPage:
  work: mcp-dev-tools
  group: assets
  slug: asset-registry
  order: 1
---

## Asset registry information and references

| Type | Tools | Purpose and main parameters |
|---|---|---|
| General queries | `ListAssets`, `GetAssetInfo`, `GetAssetReferences`, `GetAssetTypeSchema` | Page through standalone assets in mounted content directories; read registration information, dependencies, or referencers using `AssetPath`; query the types, tools, and restrictions supported by the current engine, plus fields, enums, and defaults for an optional `ClassPath`. Reference edges do not prove that an asset is safe to delete. |

`AssetPath` is a package path such as `/Game/Data/DA_Example`, not a short name, object path, or subobject path. `ClassPath` is a full class object path, such as `/Script/Engine.DataAsset` or a compiled Blueprint class path like `/Game/Data/BP_Example.BP_Example_C`.

Standard lists and paged reads return 20 items by default, with at most 100 per page. Continue using `bHasMore` and `NextOffset`.

Other platforms and native Manage/SearchableName dependency edges remain unverified.
