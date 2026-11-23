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
sourceHash: 40ff5cd7ad42993acce3d479f84973cfb5c37e2065b2e29efa6c0ee793a4e5de
translationStatus: translated
generatedBodyHash: ced1decfa18f89f3686369ce7c0b519c7a30586fa61d54a4361b44193497702f
docPage:
  work: mcp-material
  group: features
  slug: material-compilation
  order: 5
---

## Compilation results

`CompileMaterial` accepts a Material or MaterialInstanceConstant in `AssetPath`. Inspect `CompileStatus` (`Success` or `Error`) and the `Errors` array before saving.

| Result field | Meaning |
| --- | --- |
| `AssetPath` | The requested path, preserved as supplied. |
| `AssetType` | `Material` or `MaterialInstanceConstant`, identifying the requested asset. |
| `ResourceOwnerPath` | The actual compiled resource owner's full object path, such as `/Game/Materials/MI_Example.MI_Example`. |

An instance with a static permutation compiles its own resource. An instance without one uses its effective parent resource, which can belong to a parent material or an ancestor instance; `ResourceOwnerPath` reports that owner. Close both the requested asset's editor and its resource owner's editor before compiling. A missing resource returns `CompileStatus: "Error"`, a nonempty `Errors` array, and an empty `ResourceOwnerPath`. An instance without a complete shader map also reports an error.

If compilation fails, start with the error array. When compiling an instance, also check whether the resource owner path points to a parent asset. Address the errors and compile again before following the [material asset saving guide](/en/works/mcp-material/docs/material-assets/).
