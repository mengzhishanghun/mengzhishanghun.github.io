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
sourceHash: fb690efaa7a08f463c9e6ffe9ca076a879acfb14399ee52184b2852aed98d6e4
translationStatus: translated
generatedBodyHash: e29786bbeedfcc616019c01f212113e828b30a27ba5b5609082efd02aab98b26
docPage:
  work: mcp-world-editor
  group: landscape
  slug: landscape-paint-layers
  order: 2
---

## Create and bind paint layers

`GetLandscapeLayerInfo` lists the main Landscape's paint-layer bindings. `CreateLandscapeLayerInfo` previews a new `/Game/...` asset with `PackagePath`, `LayerName`, and `bWeightBlended`, then creates it with `bDryRun=false` and `ExpectedPlanHash`; the asset remains unsaved until saved separately. `BindLandscapeLayerInfo` previews binding an existing `LayerInfoPath` to `LayerName` on a loaded non-partitioned main Landscape, or unbinding with `bUnbind=true`. Apply with its fresh `ExpectedPlanHash`; unbinding refuses painted allocations and never deletes the asset.

## Read and write weights

`GetLandscapeWeightData` reads an inclusive vertex region (up to 65,536 row-major `uint8` weights) from an exact bound `LayerInfoPath`; specify `EditLayerGuid` when Edit Layers are enabled. `SetLandscapeWeightData` accepts either exact `WeightData` or brush fields (`BrushCenterX/Y`, `BrushRadius`, `BrushTargetWeight`, `BrushStrength`). It requires a loaded non-partitioned main Landscape and an existing target allocation on every affected component. Preview the bounded region, then apply with both `ExpectedCurrentDataHash` and `ExpectedProposedDataHash`; weight-blended layers can normalize other paint weights. `GetLandscapeEditLayers` lists Edit Layer GUIDs; `EditLandscapeLayer` previews `Create`, `Delete`, `Reorder`, `Rename`, visibility, lock, alpha, or blend-mode changes and requires its fresh current and plan hashes to apply. Deletion requires `bAllowDataLoss=true`; UE 5.8 does not expose the requested edit-layer blend-mode setter.
