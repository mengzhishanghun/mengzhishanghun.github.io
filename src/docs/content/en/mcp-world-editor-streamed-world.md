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
sourceHash: 3fc39d85c02133e5cc30b9eb8a9a809afc1045ee8fd200e91f06b58652e9491f
translationStatus: translated
generatedBodyHash: 11a701fac45d19f57b62644e80d5e97093141b7ada03e51f04cd6e1cc33ffabd
docPage:
  work: mcp-world-editor
  group: features
  slug: streamed-world
  order: 13
---

## Create Data Layers and assign actors

In a World Partition level, use `GetWorldPartitionInfo` to find Data Layers, `CreateDataLayer` to create one, and `SetDataLayer` to add/remove actors. UE 5.2 requires an existing `DataLayerAssetPath` when creating; later versions create a private layer. Batch `SetDataLayer` calls with `ActorNames` default to a preview and require the fresh `ExpectedHash` to apply. `ManageDataLayer` takes exact `DataLayerName` and `Action=Query|Rename|SetParent|SetVisible|SetLoaded|SetInitialRuntimeState|Delete`. `SetParent` uses `ParentName` (empty clears the parent); visibility/loading use `bValue`; initial runtime state is `Unloaded`, `Loaded`, or `Activated`. Preview `Delete` and pass its `StateHash` as `ExpectedHash` with `bDryRun=false`. Asset-backed layers cannot be renamed independently.

Look up the target layer first. Create a layer only if you need a new one. After a batch assignment, query the target layer again and check whether the intended actors were added or removed. Choose the corresponding action to change visibility or loading in the editor; the initial runtime state is a separate setting.
