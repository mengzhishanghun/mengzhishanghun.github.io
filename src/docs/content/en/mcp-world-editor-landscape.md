---
title: Edit Landscape, Paint Layers, and Splines
type: doc
slug: mcp-world-editor-landscape
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/landscape/
lang: en
translationKey: doc:mcp-world-editor:landscape
sourceHash: 172eb7f74a25ca214d9aa6c59e9ee9c929fe35b884987984d239f27c19b5420b
translationStatus: translated
generatedBodyHash: 6ca0dc0f53bdf9fad83a5c04f8491e188211bd050b477338bb81889acfa5d8d5
docPage:
  work: mcp-world-editor
  group: workflows
  slug: landscape
  order: 4
---

### Landscape paint layers and Landscape splines

`GetLandscapeLayerInfo` lists the main Landscape's paint-layer bindings. `CreateLandscapeLayerInfo` previews a new `/Game/...` asset with `PackagePath`, `LayerName`, and `bWeightBlended`, then creates it with `bDryRun=false` and `ExpectedPlanHash`; the asset remains unsaved until saved separately. `BindLandscapeLayerInfo` previews binding an existing `LayerInfoPath` to `LayerName` on a loaded non-partitioned main Landscape, or unbinding with `bUnbind=true`. Apply with its fresh `ExpectedPlanHash`; unbinding refuses painted allocations and never deletes the asset.

`GetLandscapeWeightData` reads an inclusive vertex region (up to 65,536 row-major `uint8` weights) from an exact bound `LayerInfoPath`; specify `EditLayerGuid` when Edit Layers are enabled. `SetLandscapeWeightData` accepts either exact `WeightData` or brush fields (`BrushCenterX/Y`, `BrushRadius`, `BrushTargetWeight`, `BrushStrength`). It requires a loaded non-partitioned main Landscape and an existing target allocation on every affected component. Preview the bounded region, then apply with both `ExpectedCurrentDataHash` and `ExpectedProposedDataHash`; weight-blended layers can normalize other paint weights. `GetLandscapeEditLayers` lists Edit Layer GUIDs; `EditLandscapeLayer` previews `Create`, `Delete`, `Reorder`, `Rename`, visibility, lock, alpha, or blend-mode changes and requires its fresh current and plan hashes to apply. Deletion requires `bAllowDataLoss=true`; UE 5.8 does not expose the requested edit-layer blend-mode setter.

For Landscape-specific splines, inspect `GetLandscapeSplineTopology`, then use `PatchLandscapeSplineTopology` for `AddPoint`, `UpdatePoint`, `DeletePoint`, `AddSegment`, `UpdateSegment`, or `DeleteSegment`, with exact point/segment paths and local coordinates or tangents as appropriate. Preview first and apply with `ExpectedTopologyHash` and `ExpectedPlanHash`. This bounded topology editor requires a loaded non-partitioned Landscape without a reserved spline Edit Layer. `ApplyLandscapeSplines` separately previews terrain application to an explicit `EditLayerGuid` and applies with `ExpectedPlanHash`; when a reserved spline layer exists, use its GUID. The target must be available and unlocked. Neither operation saves the level or assets.

### Landscape height data safety

`GetLandscapeHeightData` and `SetLandscapeHeightData` exchange row-major `uint16` height samples directly in JSON; they never probe or read caller-selected files. Regions use inclusive Landscape vertex coordinates and are limited to 65,536 samples per call. The target must be the main `ALandscape` actor, and the complete region must be loaded and owned by that actor. UE 5.8 and newer require an exact GUID for a standard `EditLayerGuid`; procedural and spline layers are rejected, and `SetLandscapeHeightData` also rejects locked layers while the read tool may inspect them. UE 5.2-5.7 reject landscapes that contain Edit Layers because those versions need a separate layer-aware contract.

`SetLandscapeHeightData` defaults to `bDryRun=true`. Preflight returns `CurrentDataHash` and `ProposedDataHash` without changing editor state. Applying requires `bDryRun=false`, the exact fresh `ExpectedCurrentDataHash`, and the matching `ExpectedProposedDataHash`; stale state or changed proposed samples are rejected before the transaction. A write is read back and verified. If verification fails, the original samples are restored and verified before the transaction is cancelled; an unverified rollback is reported as potentially state-changing. The atomic boundary is one region call, not a multi-call whole-landscape import, and neither tool saves the level or assets.

`RemoveStreamingLevel` is not itself undoable. It requests that Unreal Engine preserve the existing Undo buffer, but stale references may still cause the engine to reset that buffer, so Undo-history preservation is not guaranteed. The tool removes Actor, Component, Object, and BSP selections that belong to the target level. It snapshots and verifies restoration of selected Actors, Components, and Objects outside that level; BSP selections in other levels are left untouched rather than cleared globally. If removal fails, the tool also attempts to restore the target-level selection and reports whether restoration was verified.

`MoveActorsToLevel` attempts to restore and verify the pre-call Actor, Component, Object, and BSP selection, and returns an error when complete restoration cannot be verified. It rejects the request before moving actors when Selection Lock is enabled or actor identity cannot be mapped uniquely. If the batch result is inconsistent, the tool does not issue an automatic Undo because it cannot prove that the top transaction belongs to this call; inspect both actor locations and selection state before continuing.
