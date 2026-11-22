---
title: Place, Organize, and Attach Actors
type: doc
slug: mcp-world-editor-actors
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/actors/
lang: en
translationKey: doc:mcp-world-editor:actors
sourceHash: a817577f49dabc4d20cfcc76ca7e40e772b6e20fd9914f777989b08af2d1fba1
translationStatus: translated
generatedBodyHash: 77b88dba610745e61af3d79b91e37495b8766db4c7811b577e840c3b4d2173c6
docPage:
  work: mcp-world-editor
  group: workflows
  slug: actors
  order: 2
---

### Foliage and instanced meshes

Use `ListFoliageTypes` to find loaded foliage types and their exact paths. `AddFoliageInstances` adds a static mesh with `MeshPath` and either world-space `Transforms` or legacy `Locations` (identity rotation and scale). For existing loaded foliage, call `FoliageInstances` with `Operation=Query`, exact `IFAPath` and `FoliageTypePath`; page with `Offset` and `Limit` (up to 100). To `Update`, `Remove`, or `Move` selected `Indices`, first preview with the default `bDryRun=true`, then repeat the same request with `bDryRun=false`, `ExpectedCurrentSnapshotHash`, and `ExpectedPlanHash`. `Update` requires one transform per index. `Move` also needs a distinct loaded `TargetIFAPath` and `ExpectedTargetSnapshotHash`; in World Partition, both the source and destination foliage partitions must be loaded and the locations must belong to the selected partitions. Indices only identify instances in their matching snapshot.

`ScatterFoliage` previews deterministic candidates for an existing loaded foliage type on traced WorldStatic ground. Supply the exact IFA/type paths, XY rectangle (`MinX`, `MinY`, `MaxX`, `MaxY`), accepted Z range, `Seed`, `MaxSlopeDegrees`, and `MinSpacing`, plus either `Count` (at most 100) or `Density`; `MaxSamples` bounds the search. Review the preview and pass both returned hashes to execute. For non-foliage ISM/HISM components, `InstancedMeshes` provides paged `Query` and previewed `Add`, `Update`, and `Remove` using exact `ComponentPath`, world `Transforms`, and snapshot indices. It rejects foliage components; use `FoliageInstances` for those.

`ConvertInstancedMeshes` converts simple `StaticMeshActor` objects to grouped ISM/HISM instances (`Direction=ActorsToInstances`, exact `ActorPaths`, optional `bUseHISM`) or selected non-foliage component instances back to actors (`Direction=InstancesToActors`, exact `ComponentPath` and `Indices`). Preview first, then apply with `ExpectedCurrentSnapshotHash` and `ExpectedPlanHash`. Sources remain by default. With `bDeleteSource=true`, known external loaded actor references, component referencers, and level-script references refuse actor deletion, including when `bAllowLossyConversion=true`. The preview and result report `ReferenceCoverageComplete=false`, `ReferenceCoverage`, and `UninspectableReferenceSources`: native `FGCObject` owners behind `GCObjectReferencer` cannot be fully inspected, and unloaded partitions and project-wide soft references are unscanned. Native hard references are not migrated; deleting sources may break their semantics. Actor deletion additionally requires `bAllowLossyConversion=true` and fresh preview hashes. The plan hash includes the reference policy and observed coverage, but cannot prove that opaque native references stayed unchanged. Conversion creates and verifies targets before deleting sources, and cannot preserve actor identity and all actor-specific or custom instance data.

### Actor placement and splines

`PlaceActors` uses `Mode=Ground`, `Surface`, `Grid`, `Bounds`, or `Vertex` with `ActorNames` (up to 100 exact paths or unique names) to reposition existing actors. Ground and Surface trace downward and place the transformed bounds bottom on the hit; `bAlignNormal` optionally aligns Surface local +Z. Grid rounds world pivot coordinates using `GridSize`. Bounds places actors successively beside `ReferenceActor` using `Axis`, `Side`, and `Gap`. Vertex snaps to a vertex of `ReferenceActor`'s specified static-mesh `ReferenceComponent` and `LOD` within `SearchRadius` and `MaxVertices`. `Mode=Array` instead duplicates `SourceActor` `Count` times (1–100); `Spacing`, optional per-axis variation, and `Seed` control the resulting world transforms. Review the returned final transforms before saving.

For an ordinary spline component, call `GetSplineData` with `ActorName`, exact `ComponentName`, and optional `CoordinateSpace=Local|World`. Pass its `SnapshotHash` to `ApplySplinePatch` with an ordered `Operations` array (`Add`, `Remove`, `SetLocation`, `SetTangents`, `SetRotation`, `SetScale`, `SetType`, or `SetClosedLoop`). Preview first; execution needs `bDryRun=false` and the preview `PlanHash`. Insertion and deletion shift later indices in the same patch. `SetSplineMesh` edits one spline-mesh component with local `Start`, `StartTangent`, `End`, and `EndTangent`; optional scales, roll, forward axis, and static mesh can be supplied. Landscape splines use the separate tools below.

`ApplySplinePatch` supports Blueprint SCS spline components and verifies the current component again after construction reruns. It rejects splines already modified by a construction script or configured to pass their points to that script. A reconstruction or readback failure may retain changes in the Undo transaction; inspect the reported state before retrying.

## Actor grouping

`GroupActors` resolves and validates the complete actor list before making changes, rejects duplicate or cross-level grouping targets, and calls Unreal Engine's actor-array grouping APIs directly. It does not clear or replace the editor selection to drive the operation, so selections of surviving actors are preserved. If an explicitly selected GroupActor is disbanded and destroyed, that removed object naturally disappears from the selection.

## Actor attachment transactions

`AttachActor` and `DetachActor` include both actors and the scene components that actually change hierarchy in the editor transaction, so Undo/Redo restores the component hierarchy, socket, and transform. If the engine rejects an operation or the resulting parent state does not match the request, the tool attempts to restore the original parent component, socket, and transform before returning an error. `Original attachment restored` reports whether that restoration was verified; when it is `false`, treat editor state as potentially changed and inspect it before continuing.

## Component creation safety

`AddComponent` accepts an exact full component class path or a short name that uniquely matches a currently loaded class; ambiguous short names are rejected with sorted full-path candidates. It rejects non-`ActorComponent`, abstract, deprecated, superseded, and `ClassWithin`-incompatible classes. Instance components follow the Unreal Editor creation order for serialization, creation notification, and registration; attachment, root assignment, or registration failure cleans up the new component and cancels the transaction.
