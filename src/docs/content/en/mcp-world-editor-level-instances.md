---
title: Create and Edit Level Instances
type: doc
slug: mcp-world-editor-level-instances
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/level-instances/
lang: en
translationKey: doc:mcp-world-editor:level-instances
sourceHash: f24e892f53cd1bff4f0581be91854f6e4f7a580498c60fb116c8f0028734b8e4
translationStatus: translated
generatedBodyHash: d113611a9fe9bb9ac1952e855d1ba66a1aaf20336c7e30470cce9423f95b8c6b
docPage:
  work: mcp-world-editor
  group: features
  slug: level-instances
  order: 15
---

## Creation and edit sessions

`ManageLevelInstance` uses `Action=Query` to list instances. `Create` takes `ActorNames` and a new `/Game/...` `LevelPackagePath`; preview first and apply with `ExpectedHash`. Creation saves the new target level before creating the instance, but the source level remains dirty: `SourceSaved=false` and `PendingSavePackages` identify the remaining save. Before removing source actors, the tool checks known loaded hard references; unloaded and soft references are not scanned. Review `SoftReferenceRisk`, set `bAcknowledgeUnscannedSoftReferences=true` in the preview and execution, and use the hash produced with that acknowledgement. Save the reported source package separately. A failed create may leave a target map or partial source changes, so inspect the reported state before retrying.

Use `EnterEdit` on an exact `InstanceActor`; its `OperationId` owns the session and is required for `MoveActors`, `Commit`, or `Discard`. `MoveActors` previews an actor batch and needs a fresh `ExpectedHash` to apply. `Break` expands an instance back into actors. `PackBlueprint` creates or updates a Packed Level Actor Blueprint at exact `/Game/...` `BlueprintPath`; `bPendingSave=true` means the Blueprint still needs saving. These actions do not imply that the source level or every resulting asset has been saved.

Before creation, confirm the actor batch and the new level path. Even if the destination level is saved, use the pending-save list to check the source level. Once you enter an instance edit session, keep its operation ID until you use it to commit or discard the changes.

## Packed Blueprint saving and Undo

Packed Blueprint creation runs without an asset dialog and does not save automatically. In UE 5.3 and later, the engine packing stage resets the global editor Undo history. Undo any edits you want to revert before packing. `PendingSavePackages` lists potentially affected packages, including loaded instances. A failed creation may retain the new in-memory asset; the error reports the stage and packages to inspect.
