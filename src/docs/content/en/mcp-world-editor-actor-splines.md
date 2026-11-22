---
title: Edit Actor Splines
type: doc
slug: mcp-world-editor-actor-splines
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/actor-splines/
lang: en
translationKey: doc:mcp-world-editor:actor-splines
sourceHash: ae34220eb80d97b33b874fe20d6ced06fc572eaf5d61b2102c6caf719368b135
translationStatus: translated
generatedBodyHash: af8d740e35adbd52bbbe70fc1bd1ad0eedb5fd43a774b9c2eaf2877c5e78f31c
docPage:
  work: mcp-world-editor
  group: actors
  slug: actor-splines
  order: 4
---

## Read and edit spline points

For an ordinary spline component, call `GetSplineData` with `ActorName`, exact `ComponentName`, and optional `CoordinateSpace=Local|World`. Pass its `SnapshotHash` to `ApplySplinePatch` with an ordered `Operations` array (`Add`, `Remove`, `SetLocation`, `SetTangents`, `SetRotation`, `SetScale`, `SetType`, or `SetClosedLoop`). Preview first; execution needs `bDryRun=false` and the preview `PlanHash`. Insertion and deletion shift later indices in the same patch. `SetSplineMesh` edits one spline-mesh component with local `Start`, `StartTangent`, `End`, and `EndTangent`; optional scales, roll, forward axis, and static mesh can be supplied. Landscape splines use the separate tools below.

`ApplySplinePatch` supports Blueprint SCS spline components and verifies the current component again after construction reruns. It rejects splines already modified by a construction script or configured to pass their points to that script. A reconstruction or readback failure may retain changes in the Undo transaction; inspect the reported state before retrying.
