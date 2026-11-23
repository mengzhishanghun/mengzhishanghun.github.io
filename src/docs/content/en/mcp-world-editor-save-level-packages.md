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
sourceHash: 5b7ffea1c02634699d9a32f422e8467095579941d13be3e6bff710a781a00820
translationStatus: translated
generatedBodyHash: dbd6a48ceee12f0a9d0ab3e176a6edfb94cbe264d595253ff61481fc184ffaf0
docPage:
  work: mcp-world-editor
  group: features
  slug: save-level-packages
  order: 2
---

## Select and save packages

Start with `GetDirtyPackages` to find the packages to save. Choose `CurrentLevel` for the current level or `AllLoaded` to review dirty packages across all loaded levels. `CurrentLevel` includes loaded external object packages and a dirty separate Map BuiltData package for the current level. `SavePackages` takes exact `PackageNames` and defaults to `DryRun=true`: preview the selection, then pass its `PlanHash` with `DryRun=false`. Saving an empty package may delete its existing file, so it requires `AllowDeleteEmptyPackages`. This tool refuses to write locally while a source control provider is enabled. After the save, review the result for each package. If any packages are still dirty, check whether they belong to this change before starting another preview. The parameterless `SaveLevel` still saves the current level and the external object packages included by the engine, and now reports the actual level package path and remaining dirty packages. Disk saves are outside editor Undo.
