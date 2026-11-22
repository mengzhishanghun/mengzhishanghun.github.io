---
title: Configure Root Assets and Protection
type: doc
slug: simple-asset-cleaner-protect-assets
draft: false
sitePublish: true
tags:
  - Asset Management
  - Reference Analysis
workIds:
  - simple-asset-cleaner
documentKind: product-manual
websiteRoute: /en/works/simple-asset-cleaner/docs/protect-assets/
lang: en
translationKey: doc:simple-asset-cleaner:protect-assets
sourceHash: 3cb4fc542958f47ffed2b2b9b8c38bac14f8e7545db15a6b26926dbc68fb6fd0
translationStatus: translated
generatedBodyHash: a2b37f4ffb62f1c24016c8508fdf9fde94ffbeca826a1cea9a1e7d089376a52e
docPage:
  work: simple-asset-cleaner
  group: protection
  slug: protect-assets
  order: 1
---

## Protect by Asset Class

Set root asset types in `Root Asset Classes`. The default is `UWorld` (`.umap` maps). Add `UBlueprint`, `UDataAsset`, or `UDataTable` as needed, for example when GameMode, PlayerController, or configuration data are central to the project. The setting also matches parent and derived classes.

## Protect Individual Assets

List individual assets not covered by class rules in `Custom Root Assets`, such as `/Game/Core/GameMode.GameMode`, `/Game/Core/MainGameMode`, or `/Game/Config/GlobalSettings`.

## Protect Assets by Path

List directories to protect in `Additional Root Paths`, such as `/Game/Core/`, `/Game/Config/`, `/Game/Managers/`, or `/Game/Essential/`. The plugin keeps all assets in those directories and their references.

## Trace References from Roots

Roots and any project assets they reference directly or indirectly are kept. In the example below, the map is a root, so the materials, texture, and Blueprint in its reference chain are kept. Plugin and engine assets, C++ files, and content outside the project’s `/Content/` are outside cleanup scope.

```
Map A (root asset)
  ├─ References material M1
  │   └─ References texture T1 ✅ Retain
  └─ References Blueprint BP1
      └─ References material M2 ✅ Retain

Material M3 ❌ Not referenced by any root → Clean up
```

## Team Settings and First Trial

Protect key maps, Blueprints, configuration data, and directories first, then add asset types as needed. Put shared settings in source control and revisit them as the project evolves. Try them on a test branch with verbose logging first, and make sure there is a recoverable commit before a full cleanup.
