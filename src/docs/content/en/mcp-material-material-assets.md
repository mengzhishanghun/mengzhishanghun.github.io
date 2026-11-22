---
title: Create, Open, and Save Material Assets
type: doc
slug: mcp-material-material-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
documentKind: product-manual
websiteRoute: /en/works/mcp-material/docs/material-assets/
lang: en
translationKey: doc:mcp-material:material-assets
sourceHash: ecdfb6a52e542d8505059de391fe34d5825fe48e14ca8bcfc3dcf764635e8805
translationStatus: translated
generatedBodyHash: 5e1de518a3423a8d78813f4303ff32934d176c7495457ae02d5b399f97233639
docPage:
  work: mcp-material
  group: assets
  slug: material-assets
  order: 1
---

## Find and create assets

Use `ListMaterials` to find materials and material instances. The plugin can create both asset types. New assets start in editor memory.

## Resolve editor changes and save

If the target is open in an asset editor, save or resolve changes there before using `CloseAsset`.

Write, compile, and save tools reject targets that are still open in an asset editor. This prevents the Material Editor's transient preview and the backing asset from diverging, and prevents a later editor Apply operation from overwriting completed MCP changes.

Newly created assets remain dirty in memory until `SaveAsset` is called explicitly; an underlying save failure returns an MCP error terminal state instead of a warning inside a successful result.

Write tools use transactions and mark the package dirty. You can validate with `CompileMaterial` before saving and use `OpenAsset` for manual inspection.
