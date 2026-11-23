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
sourceHash: 276d11d38a006f7b0fa1c915b90757ad96a7f73234aa4f41152151a52091314a
translationStatus: translated
generatedBodyHash: 242bdba7bfb56fb2326adc3bc34bc389ebd53761477f0a693d4cbc585b6b6447
docPage:
  work: mcp-material
  group: features
  slug: material-assets
  order: 1
---

## Find and create assets

Use `ListMaterials` to find materials and material instances. The plugin can create both asset types. New assets start in editor memory.

## Resolve editor changes and save

If the target is open in an asset editor, save or resolve changes there before using `CloseAsset`.

Write, compile, and save tools reject targets that are still open in an asset editor. This prevents the Material Editor's transient preview and the backing asset from diverging, and prevents a later editor Apply operation from overwriting completed MCP changes.

Newly created assets remain dirty in memory until `SaveAsset` is called explicitly; an underlying save failure returns an MCP error terminal state instead of a warning inside a successful result.

Writes use transactions and mark the package dirty. Use `CompileMaterial` to check compilation before saving. You can save first and then use `OpenAsset` to inspect the result. If you open it before saving, close the asset editor again before you save.
