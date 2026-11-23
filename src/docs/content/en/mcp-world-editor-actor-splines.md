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
sourceHash: 1a5d41c950c0667954b9c2d370a8869bbb8a9a91cce6c25029c34a41afc2aae3
translationStatus: translated
generatedBodyHash: c9bd91f3fb430ab7b44f83cfdd1c9cffdca423d77808be015192bcfc0ac685b0
docPage:
  work: mcp-world-editor
  group: features
  slug: actor-splines
  order: 9
---

## Read and edit spline points

For an ordinary spline component, call `GetSplineData` with `ActorName`, exact `ComponentName`, and optional `CoordinateSpace=Local|World`. Pass its `SnapshotHash` to `ApplySplinePatch` with an ordered `Operations` array (`Add`, `Remove`, `SetLocation`, `SetTangents`, `SetRotation`, `SetScale`, `SetType`, or `SetClosedLoop`). Preview first; execution needs `bDryRun=false` and the preview `PlanHash`. Insertion and deletion shift later indices in the same patch. `SetSplineMesh` edits one spline-mesh component with local `Start`, `StartTangent`, `End`, and `EndTangent`; optional scales, roll, forward axis, and static mesh can be supplied. For Landscape splines, use the tools in “Edit Landscape Splines.”

`ApplySplinePatch` supports Blueprint SCS spline components and verifies the current component again after construction reruns. It rejects splines already modified by a construction script or configured to pass their points to that script. A reconstruction or readback failure may retain changes in the Undo transaction; inspect the reported state before retrying.

For example, if you remove a point and then edit a later point, use its index after the removal. Read the spline back afterward and check the points, their order, and whether the loop is closed.
