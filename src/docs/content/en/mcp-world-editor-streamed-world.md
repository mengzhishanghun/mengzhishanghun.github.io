---
title: Load Regions and Manage World Layers
type: doc
slug: mcp-world-editor-streamed-world
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/streamed-world/
lang: en
translationKey: doc:mcp-world-editor:streamed-world
sourceHash: 8cf1367b6ee9cb3a0ef1f85d24c5131043c46bf027b5c2c4554393c1b6a43333
translationStatus: translated
generatedBodyHash: faf0206a1cd2ebe53cd8a3293057a040776831959692c7e2c493ed5bbd074d7e
docPage:
  work: mcp-world-editor
  group: workflows
  slug: streamed-world
  order: 3
---

### World Partition Data Layers and Level Instances

In a World Partition level, use `GetWorldPartitionInfo` to find Data Layers, `CreateDataLayer` to create one, and `SetDataLayer` to add/remove actors. UE 5.2 requires an existing `DataLayerAssetPath` when creating; later versions create a private layer. Batch `SetDataLayer` calls with `ActorNames` default to a preview and require the fresh `ExpectedHash` to apply. `ManageDataLayer` takes exact `DataLayerName` and `Action=Query|Rename|SetParent|SetVisible|SetLoaded|SetInitialRuntimeState|Delete`. `SetParent` uses `ParentName` (empty clears the parent); visibility/loading use `bValue`; initial runtime state is `Unloaded`, `Loaded`, or `Activated`. Preview `Delete` and pass its `StateHash` as `ExpectedHash` with `bDryRun=false`. Asset-backed layers cannot be renamed independently.

`ManageLevelInstance` uses `Action=Query` to list instances. `Create` takes `ActorNames` and a new `/Game/...` `LevelPackagePath`; preview first and apply with `ExpectedHash`. Creation saves the new target level before creating the instance, but the source level remains dirty: `SourceSaved=false` and `PendingSavePackages` identify the remaining save. Before removing source actors, the tool checks known loaded hard references; unloaded and soft references are not scanned. Review `SoftReferenceRisk`, set `bAcknowledgeUnscannedSoftReferences=true` in the preview and execution, and use the hash produced with that acknowledgement. Save the reported source package separately. A failed create may leave a target map or partial source changes, so inspect the reported state before retrying.

Use `EnterEdit` on an exact `InstanceActor`; its `OperationId` owns the session and is required for `MoveActors`, `Commit`, or `Discard`. `MoveActors` previews an actor batch and needs a fresh `ExpectedHash` to apply. `Break` expands an instance back into actors. `PackBlueprint` creates or updates a Packed Level Actor Blueprint at exact `/Game/...` `BlueprintPath`; `bPendingSave=true` means the Blueprint still needs saving. These actions do not imply that the source level or every resulting asset has been saved.

Packed Blueprint creation runs without an asset dialog and does not save automatically. In UE 5.3 and later, the engine packing stage resets the global editor Undo history. Undo any edits you want to revert before packing. `PendingSavePackages` lists potentially affected packages, including loaded instances. A failed creation may retain the new in-memory asset; the error reports the stage and packages to inspect.

## World Partition region loading

`LoadRegion` creates and loads a persistent editor region through Unreal Engine's public World Partition loader API. `BoundsMin` and `BoundsMax` must each contain finite numeric `X`, `Y`, and `Z` fields, and every minimum coordinate must be strictly less than its matching maximum coordinate. Invalid bounds are rejected before a loader is created.

## World Partition region lifecycle

`LoadRegion` accepts only finite, strictly increasing bounds. Each axis is limited to 1,000,000 Unreal units, total volume to 1e17 cubic units, and no more than 16 MCP-created regions may remain active. A successful call returns an opaque `RegionHandle`; pass it to `UnloadRegion` to unload and release the corresponding official Editor Loader Adapter. Handles are never guessed or reused from bounds. World cleanup/map replacement and plugin module shutdown automatically release regions still owned by the plugin, after which their old handles expire.
