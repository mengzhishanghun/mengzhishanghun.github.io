---
title: Compile Materials and Review Diagnostics
type: doc
slug: mcp-material-material-compilation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
documentKind: product-manual
websiteRoute: /en/works/mcp-material/docs/material-compilation/
lang: en
translationKey: doc:mcp-material:material-compilation
sourceHash: 5e26ff73b9e35d2ba44bf618237f1e15ecf523d801c442370ec1d041c2562ec3
translationStatus: translated
generatedBodyHash: f91a1913583f5d00848fe649acf5dc3c59187576ab4a9f2174446b64bc64edf6
docPage:
  work: mcp-material
  group: editing
  slug: material-compilation
  order: 3
---

## Compilation results

`CompileMaterial` accepts a Material or MaterialInstanceConstant in `AssetPath`. Inspect `CompileStatus` (`Success` or `Error`) and the `Errors` array before saving.

| Result field | Meaning |
| --- | --- |
| `AssetPath` | The requested path, preserved as supplied. |
| `AssetType` | `Material` or `MaterialInstanceConstant`, identifying the requested asset. |
| `ResourceOwnerPath` | The actual compiled resource owner's full object path, such as `/Game/Materials/MI_Example.MI_Example`. |

An instance with a static permutation compiles its own resource. An instance without one uses its effective parent resource, which can belong to a parent material or an ancestor instance; `ResourceOwnerPath` reports that owner. Close both the requested asset's editor and its resource owner's editor before compiling. A missing resource returns `CompileStatus: "Error"`, a nonempty `Errors` array, and an empty `ResourceOwnerPath`. An instance without a complete shader map also reports an error.

After checking the compile result, see the [material asset saving guide](/en/works/mcp-material/docs/material-assets/).
