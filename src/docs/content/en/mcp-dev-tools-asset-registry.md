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
sourceHash: e914b5e1dbbf53eeb7b0461745dea18a94934589200f4dc84b36a952f7587e30
translationStatus: translated
generatedBodyHash: de5a1f45bdf88d0bb9c2c630d167a216cd90bb9f7bfa1e18b8f21863acbd5862
docPage:
  work: mcp-dev-tools
  group: features
  slug: asset-registry
  order: 2
---

## Asset registry information and references

| Type | Tools | Purpose and main parameters |
|---|---|---|
| General queries | `ListAssets`, `GetAssetInfo`, `GetAssetReferences`, `GetAssetTypeSchema` | Page through standalone assets in mounted content directories; read registration information, dependencies, or referencers using `AssetPath`; query the types, tools, and restrictions supported by the current engine, plus fields, enums, and defaults for an optional `ClassPath`. Reference edges do not prove that an asset is safe to delete. |

`AssetPath` is a package path such as `/Game/Data/DA_Example`, not a short name, object path, or subobject path. `ClassPath` is a full class object path, such as `/Script/Engine.DataAsset` or a compiled Blueprint class path like `/Game/Data/BP_Example.BP_Example_C`.

If you know the package path, read the asset details directly. If you only know the content folder, find the asset in the list first. When checking references, distinguish what the asset depends on from what refers to it. Lists and paged reads return 20 items by default, up to 100 per page. If `bHasMore` indicates another page, continue at `NextOffset`.

Other platforms and native Manage/SearchableName dependency edges remain unverified.
