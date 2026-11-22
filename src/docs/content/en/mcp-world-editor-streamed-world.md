---
title: Manage World Partition Data Layers
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
sourceHash: 2c1e3d3bde2d82195131c588d36438a1556a44c9fd7b51e346514b6598118a56
translationStatus: translated
generatedBodyHash: ffac2b8d630e29165594bbbce0990b37ca6297e5926c88637571254f6059aa12
docPage:
  work: mcp-world-editor
  group: world-partition
  slug: streamed-world
  order: 2
---

## Create Data Layers and assign actors

In a World Partition level, use `GetWorldPartitionInfo` to find Data Layers, `CreateDataLayer` to create one, and `SetDataLayer` to add/remove actors. UE 5.2 requires an existing `DataLayerAssetPath` when creating; later versions create a private layer. Batch `SetDataLayer` calls with `ActorNames` default to a preview and require the fresh `ExpectedHash` to apply. `ManageDataLayer` takes exact `DataLayerName` and `Action=Query|Rename|SetParent|SetVisible|SetLoaded|SetInitialRuntimeState|Delete`. `SetParent` uses `ParentName` (empty clears the parent); visibility/loading use `bValue`; initial runtime state is `Unloaded`, `Loaded`, or `Activated`. Preview `Delete` and pass its `StateHash` as `ExpectedHash` with `bDryRun=false`. Asset-backed layers cannot be renamed independently.
