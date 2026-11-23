---
title: Edit and Scatter Foliage
type: doc
slug: mcp-world-editor-foliage
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/foliage/
lang: en
translationKey: doc:mcp-world-editor:foliage
sourceHash: 7e4cadedce3c51d4f43c4e82659aaddaa1d05a9631b951052ac44fc2807e9af0
translationStatus: translated
generatedBodyHash: 3efa24334d335b60a291ee0a916852f8c8f64ff46950c0699ea4d9780253cc7c
docPage:
  work: mcp-world-editor
  group: features
  slug: foliage
  order: 7
---

## Find and edit foliage instances

Use `ListFoliageTypes` to find loaded foliage types and their exact paths. `AddFoliageInstances` adds a static mesh with `MeshPath` and either world-space `Transforms` or legacy `Locations` (identity rotation and scale). For existing loaded foliage, call `FoliageInstances` with `Operation=Query`, exact `IFAPath` and `FoliageTypePath`; page with `Offset` and `Limit` (up to 100). To `Update`, `Remove`, or `Move` selected `Indices`, first preview with the default `bDryRun=true`, then repeat the same request with `bDryRun=false`, `ExpectedCurrentSnapshotHash`, and `ExpectedPlanHash`. `Update` requires one transform per index. `Move` also needs a distinct loaded `TargetIFAPath` and `ExpectedTargetSnapshotHash`; in World Partition, both the source and destination foliage partitions must be loaded and the locations must belong to the selected partitions. Indices identify instances only within the matching snapshot. If it becomes stale, query the partition again, select the instances from the new result, and preview before applying.

## Preview and apply scattering

`ScatterFoliage` previews deterministic candidates for an existing loaded foliage type on traced WorldStatic ground. Supply the exact IFA/type paths, XY rectangle (`MinX`, `MinY`, `MaxX`, `MaxY`), accepted Z range, `Seed`, `MaxSlopeDegrees`, and `MinSpacing`, plus either `Count` (at most 100) or `Density`; `MaxSamples` bounds the search. Check that the candidates fall where you intended. If you change the area, seed, or spacing, preview again and apply using both hashes from the new result. For non-foliage ISM/HISM components, `InstancedMeshes` provides paged `Query` and previewed `Add`, `Update`, and `Remove` using exact `ComponentPath`, world `Transforms`, and snapshot indices. It rejects foliage components; use `FoliageInstances` for those.
