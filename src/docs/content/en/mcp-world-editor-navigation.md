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
sourceHash: 13afba00724ef36861f057fec882c15de9eb50d546ff151b7d761c212d4ef44e
translationStatus: translated
generatedBodyHash: 16414c82cf5e660ee3480f5e5bff61f47e25a5bb90bd0b63622e420e7d402286
docPage:
  work: mcp-world-editor
  group: features
  slug: navigation
  order: 3
---

## Build scope and preview

Decide which levels should participate, then wait for their loading and visibility to settle before calling `BuildNavigation`. The call previews by default. If the scope matches what you intended, run the build with that preview’s `PlanHash` and `DryRun=false`.

In regular and World Partition maps, navigation uses the engine's public synchronous `UNavigationSystemV1::Build` for registered, loaded visible editor levels (`Scope=LoadedVisibleEditorWorld`). Loaded hidden and unloaded levels are excluded; the preview lists loaded hidden paths in `ExcludedLoadedHiddenLevelPaths`. Changing level visibility invalidates the preview hash, and a level in a visibility transition must settle before preview or execution. Navigation preserves editor Undo and does not implicitly run `MapCheck` or save packages. In World Partition it may discard loaded navigation chunks; `bCompleteWorldPartitionBuild=false` and `bSaved=false` do not claim a full offline partitioned-world build.

## Find a path

`FindNavigationPath` takes world-space `Start` and `End` positions and synchronously queries the currently loaded default navigation data. It returns whether a path was found, whether it is partial, its length, and a bounded list of points without starting a build. `MaxPoints` accepts 2–1000; longer paths set `bTruncated=true`.

To see whether two points are connected, query the current navigation data directly. Read the found and partial-path indicators together: a partial path is not enough if you need to reach the destination.
