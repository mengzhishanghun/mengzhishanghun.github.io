---
title: Edit Landscape Paint Layers and Weights
type: doc
slug: mcp-world-editor-landscape-paint-layers
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/landscape-paint-layers/
lang: en
translationKey: doc:mcp-world-editor:landscape-paint-layers
sourceHash: fc040f81fa84c49041473603e74f1bccdc95f0d3656c4dcbe6183c649e6dc4a7
translationStatus: translated
generatedBodyHash: 649138aa01c73f5ad354363e73fc59caf1ee53016ce90e84c5ea22323248620a
docPage:
  work: mcp-world-editor
  group: features
  slug: landscape-paint-layers
  order: 17
---

## Create and bind paint layers

`GetLandscapeLayerInfo` lists the main Landscape's paint-layer bindings. `CreateLandscapeLayerInfo` previews a new `/Game/...` asset with `PackagePath`, `LayerName`, and `bWeightBlended`, then creates it with `bDryRun=false` and `ExpectedPlanHash`; the asset remains unsaved until saved separately. `BindLandscapeLayerInfo` previews binding an existing `LayerInfoPath` to `LayerName` on a loaded non-partitioned main Landscape, or unbinding with `bUnbind=true`. Apply with its fresh `ExpectedPlanHash`; unbinding refuses painted allocations and never deletes the asset.

Check the current bindings first. If you need a new asset, create and save it separately, then preview the binding with its path. If you already have the asset, go straight to the binding step.

## Read and write weights

`GetLandscapeWeightData` reads an inclusive vertex region (up to 65,536 row-major `uint8` weights) from an exact bound `LayerInfoPath`; specify `EditLayerGuid` when Edit Layers are enabled. `SetLandscapeWeightData` accepts either exact `WeightData` or brush fields (`BrushCenterX/Y`, `BrushRadius`, `BrushTargetWeight`, `BrushStrength`). It requires a loaded non-partitioned main Landscape and an existing target allocation on every affected component. Preview the bounded region, then apply with both `ExpectedCurrentDataHash` and `ExpectedProposedDataHash`; weight-blended layers can normalize other paint weights. `GetLandscapeEditLayers` lists Edit Layer GUIDs; `EditLandscapeLayer` previews `Create`, `Delete`, `Reorder`, `Rename`, visibility, lock, alpha, or blend-mode changes and requires its fresh current and plan hashes to apply. Deletion requires `bAllowDataLoss=true`; The operation cannot change the edit layer’s blend mode in UE 5.8 because the engine does not expose a public setter.

Read the weights in the same region before writing. Supply the full array to set known per-vertex values, or use brush parameters for a local adjustment. Read the region back afterward. If you edited a weight-blended layer, also check the weights of the other paint layers there.
