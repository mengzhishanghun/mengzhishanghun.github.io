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
sourceHash: 174ed1d3ac2d551d0903d96655e956748d865baa5780517c5fc89c56b034d5c1
translationStatus: translated
generatedBodyHash: cbcb1524e0007c6478c8122a00afc5f46098311e1bdce03857a5bee30a5ca711
docPage:
  work: simple-asset-cleaner
  group: features
  slug: protect-assets
  order: 2
---

## Protect by Asset Class

Set root asset types in `Root Asset Classes`. The default is `UWorld` (`.umap` maps). Add `UBlueprint`, `UDataAsset`, or `UDataTable` as needed, for example when GameMode, PlayerController, or configuration data are central to the project. The setting also matches parent and derived classes.

## Protect Individual Assets

Use this setting for individual assets that need protection. Use the class setting to keep an entire asset class or the path setting to keep a directory. When reviewing cleanup candidates, check both the roots and the important project assets they reference.

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

Protect key maps, Blueprints, configuration data, and directories first, then add asset types as needed. Track shared settings in source control and review them after project changes to make sure they still cover key assets. Try them on a test branch with verbose logging first, and make sure there is a recoverable commit before a full cleanup.
