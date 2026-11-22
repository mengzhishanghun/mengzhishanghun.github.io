---
title: Save Level Packages
type: doc
slug: mcp-world-editor-save-level-packages
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/save-level-packages/
lang: en
translationKey: doc:mcp-world-editor:save-level-packages
sourceHash: 97857230fb537e2023ba21dd2965e4bfd5031ea7565db5979a4e8d279cd8e5a8
translationStatus: translated
generatedBodyHash: 702d12dfba61bda539c3be42d1227baabf11d037da297c7624693e7c53a983a9
docPage:
  work: mcp-world-editor
  group: levels
  slug: save-level-packages
  order: 2
---

## Select and save packages

`GetDirtyPackages` lists loaded dirty packages in `CurrentLevel` or `AllLoaded` scope. `CurrentLevel` includes loaded external object packages and a dirty separate Map BuiltData package for the current level. `SavePackages` takes exact `PackageNames` and defaults to `DryRun=true`: preview the selection, then pass its `PlanHash` with `DryRun=false`. Saving an empty package may delete its existing file, so it requires `AllowDeleteEmptyPackages`. A local-only save rejects actual writes while a source-control provider is enabled. Results report each package and any remaining dirty packages. The parameterless `SaveLevel` still saves the current level and the external object packages included by the engine, and now reports the actual level package path and remaining dirty packages. Disk saves are outside editor Undo.
