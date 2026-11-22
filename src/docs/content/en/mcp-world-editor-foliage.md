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
sourceHash: d3f385e77fa196f05b903c081879d043c8c642ea0dfa3f30eda2e45485ccfed0
translationStatus: translated
generatedBodyHash: 0e6871892f641dbf561988515f48fefd4bb63e7a1748f1fdb7370618955dc0b6
docPage:
  work: mcp-world-editor
  group: actors
  slug: foliage
  order: 2
---

## Find and edit foliage instances

Use `ListFoliageTypes` to find loaded foliage types and their exact paths. `AddFoliageInstances` adds a static mesh with `MeshPath` and either world-space `Transforms` or legacy `Locations` (identity rotation and scale). For existing loaded foliage, call `FoliageInstances` with `Operation=Query`, exact `IFAPath` and `FoliageTypePath`; page with `Offset` and `Limit` (up to 100). To `Update`, `Remove`, or `Move` selected `Indices`, first preview with the default `bDryRun=true`, then repeat the same request with `bDryRun=false`, `ExpectedCurrentSnapshotHash`, and `ExpectedPlanHash`. `Update` requires one transform per index. `Move` also needs a distinct loaded `TargetIFAPath` and `ExpectedTargetSnapshotHash`; in World Partition, both the source and destination foliage partitions must be loaded and the locations must belong to the selected partitions. Indices only identify instances in their matching snapshot.

## Preview and apply scattering

`ScatterFoliage` previews deterministic candidates for an existing loaded foliage type on traced WorldStatic ground. Supply the exact IFA/type paths, XY rectangle (`MinX`, `MinY`, `MaxX`, `MaxY`), accepted Z range, `Seed`, `MaxSlopeDegrees`, and `MinSpacing`, plus either `Count` (at most 100) or `Density`; `MaxSamples` bounds the search. Review the preview and pass both returned hashes to execute. For non-foliage ISM/HISM components, `InstancedMeshes` provides paged `Query` and previewed `Add`, `Update`, and `Remove` using exact `ComponentPath`, world `Transforms`, and snapshot indices. It rejects foliage components; use `FoliageInstances` for those.
