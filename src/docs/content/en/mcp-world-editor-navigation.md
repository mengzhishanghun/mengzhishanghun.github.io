---
title: Build Navigation and Find Paths
type: doc
slug: mcp-world-editor-navigation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/navigation/
lang: en
translationKey: doc:mcp-world-editor:navigation
sourceHash: 9a695091a4b9739b3b69257948bb4184485fd8bc1ec04857a6359f126e1a89a2
translationStatus: translated
generatedBodyHash: 595709fc145a81ad33ca6aef9f98e10537531539869ad13073670c6482ba93b3
docPage:
  work: mcp-world-editor
  group: levels
  slug: navigation
  order: 3
---

## Build scope and preview

`BuildNavigation` previews the build by default. To run it, return the preview’s `PlanHash` and set `DryRun=false`.

In regular and World Partition maps, navigation uses the engine's public synchronous `UNavigationSystemV1::Build` for registered, loaded visible editor levels (`Scope=LoadedVisibleEditorWorld`). Loaded hidden and unloaded levels are excluded; the preview lists loaded hidden paths in `ExcludedLoadedHiddenLevelPaths`. Changing level visibility invalidates the preview hash, and a level in a visibility transition must settle before preview or execution. Navigation preserves editor Undo and does not implicitly run `MapCheck` or save packages. In World Partition it may discard loaded navigation chunks; `bCompleteWorldPartitionBuild=false` and `bSaved=false` do not claim a full offline partitioned-world build.

## Find a path

`FindNavigationPath` takes world-space `Start` and `End` positions and synchronously queries the currently loaded default navigation data. It returns whether a path was found, whether it is partial, its length, and a bounded list of points without starting a build. `MaxPoints` accepts 2–1000; longer paths set `bTruncated=true`.
