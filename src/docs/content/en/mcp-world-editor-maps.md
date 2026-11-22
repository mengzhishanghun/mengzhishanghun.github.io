---
title: Inspect, Save, and Build Maps
type: doc
slug: mcp-world-editor-maps
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/maps/
lang: en
translationKey: doc:mcp-world-editor:maps
sourceHash: b9589735983eef792bb77bc307f357c5b42cf23284697cc029b19cf6800e042d
translationStatus: translated
generatedBodyHash: 5153683df3b61b8673e788c82e1748cc57e58863b42857bc005ed03441452944
docPage:
  work: mcp-world-editor
  group: workflows
  slug: maps
  order: 1
---

### Saving, map checks, and builds

`GetDirtyPackages` lists loaded dirty packages in `CurrentLevel` or `AllLoaded` scope. `CurrentLevel` includes loaded external object packages and a dirty separate Map BuiltData package for the current level. `SavePackages` takes exact `PackageNames` and defaults to `DryRun=true`: preview the selection, then pass its `PlanHash` with `DryRun=false`. Saving an empty package may delete its existing file, so it requires `AllowDeleteEmptyPackages`. A local-only save rejects actual writes while a source-control provider is enabled. Results report each package and any remaining dirty packages. The parameterless `SaveLevel` still saves the current level and the external object packages included by the engine, and now reports the actual level package path and remaining dirty packages. Disk saves are outside editor Undo.

`MapCheck` runs the engine map check and returns error and warning counts, visible messages with tokens, and `Complete`. If the Message Log UI filter hides messages or `MaxMessages` truncates them, `Complete=false`, so the result cannot be reported as passing. The check creates a new page for the current map while retaining older pages and the user's UI filter.

`BuildNavigation` and `BuildLighting` default to previews; execution requires the corresponding `PlanHash` and `DryRun=false`. In regular and World Partition maps, navigation uses the engine's public synchronous `UNavigationSystemV1::Build` for registered, loaded visible editor levels (`Scope=LoadedVisibleEditorWorld`). Loaded hidden and unloaded levels are excluded; the preview lists loaded hidden paths in `ExcludedLoadedHiddenLevelPaths`. Changing level visibility invalidates the preview hash, and a level in a visibility transition must settle before preview or execution. Navigation preserves editor Undo and does not implicitly run `MapCheck` or save packages. In World Partition it may discard loaded navigation chunks; `bCompleteWorldPartitionBuild=false` and `bSaved=false` do not claim a full offline partitioned-world build. Lighting uses Preview quality and returns an `OperationId`; query `GetBuildStatus` for its terminal state. A lighting build succeeds only after all active lighting scenarios have applied their results. Neither build invents a progress percentage or saves the map. Switching or unloading the map invalidates running operation IDs.

`FindNavigationPath` takes world-space `Start` and `End` positions and synchronously queries the currently loaded default navigation data. It returns whether a path was found, whether it is partial, its length, and a bounded list of points without starting a build. `MaxPoints` accepts 2–1000; longer paths set `bTruncated=true`.

Use MCP `tools/list` to discover the tools and their current input schemas; the available set can change with the plugin version.

## World Settings editing

`GetWorldSettings` returns exact names and UE text values for every property currently editable on the instance. It no longer hides default-valued properties or presents read-only BlueprintVisible fields as writable discovery results. `SetWorldSettings` requires exact case, rejects property flags or `CanEditChange` conditions that disable editing, and pairs `PreEditChange` with `PostEditChangeProperty` inside the transaction. An import failure first restores the old value; if restoration also fails, the error reports the transaction rollback result, and a failed rollback means editor state may have changed.

## Restricted console commands

`ExecuteConsoleCommand` accepts only the seven documented `stat` commands, routes them through `GEngine->Exec`, and checks whether the engine actually handled the request; an unhandled command returns an error. Unreal `stat` commands toggle their viewport statistic display, so repeating one may turn the display off; they are not side-effect-free measurements. `Handled=true` in a successful result only means that the current engine instance accepted the command, not that the display is necessarily enabled. Some commands produce no text output.
