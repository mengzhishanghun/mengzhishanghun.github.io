---
title: Convert Instanced Meshes
type: doc
slug: mcp-world-editor-instanced-meshes
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/instanced-meshes/
lang: en
translationKey: doc:mcp-world-editor:instanced-meshes
sourceHash: c7c90b03e4386bf83fc646ea9cde9302828458822bc0681e4533492b375e1642
translationStatus: translated
generatedBodyHash: e5d87b2db37aca0dd2b00ad069def27bb0f24546cd5e45073a5b77c325ee9718
docPage:
  work: mcp-world-editor
  group: actors
  slug: instanced-meshes
  order: 3
---

## Conversion and target validation

`ConvertInstancedMeshes` converts simple `StaticMeshActor` objects to grouped ISM/HISM instances (`Direction=ActorsToInstances`, exact `ActorPaths`, optional `bUseHISM`) or selected non-foliage component instances back to actors (`Direction=InstancesToActors`, exact `ComponentPath` and `Indices`). Preview first, then apply with `ExpectedCurrentSnapshotHash` and `ExpectedPlanHash`. Sources remain by default. With `bDeleteSource=true`, known external loaded actor references, component referencers, and level-script references refuse actor deletion, including when `bAllowLossyConversion=true`. The preview and result report `ReferenceCoverageComplete=false`, `ReferenceCoverage`, and `UninspectableReferenceSources`: native `FGCObject` owners behind `GCObjectReferencer` cannot be fully inspected, and unloaded partitions and project-wide soft references are unscanned. Native hard references are not migrated; deleting sources may break their semantics. Actor deletion additionally requires `bAllowLossyConversion=true` and fresh preview hashes. The plan hash includes the reference policy and observed coverage, but cannot prove that opaque native references stayed unchanged. Conversion creates and verifies targets before deleting sources, and cannot preserve actor identity and all actor-specific or custom instance data.
