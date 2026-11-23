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
sourceHash: 6dda7bfbffedb4ebdfb91068c469a001f92df0718daa7f67eebfc2da1a6286c7
translationStatus: translated
generatedBodyHash: 299f936534fe01831b3a3c4c2cb6ad9b7d62ba9ef2c25cfad9f93d9757428983
docPage:
  work: mcp-world-editor
  group: features
  slug: instanced-meshes
  order: 8
---

## Conversion and target validation

`ConvertInstancedMeshes` converts simple `StaticMeshActor` objects to grouped ISM/HISM instances (`Direction=ActorsToInstances`, exact `ActorPaths`, optional `bUseHISM`) or selected non-foliage component instances back to actors (`Direction=InstancesToActors`, exact `ComponentPath` and `Indices`). Preview the conversion and check its direction and target count. Apply with that preview’s `ExpectedCurrentSnapshotHash` and `ExpectedPlanHash`. By default, the source stays in place so you can compare it with the result. With `bDeleteSource=true`, known external loaded actor references, component referencers, and level-script references refuse actor deletion, including when `bAllowLossyConversion=true`. The preview and result report `ReferenceCoverageComplete=false`, `ReferenceCoverage`, and `UninspectableReferenceSources`: native `FGCObject` owners behind `GCObjectReferencer` cannot be fully inspected, and unloaded partitions and project-wide soft references are unscanned. Native hard references are not migrated; deleting sources may break their semantics. Actor deletion additionally requires `bAllowLossyConversion=true` and fresh preview hashes. The plan hash includes the reference policy and observed coverage, but cannot prove that opaque native references stayed unchanged. Conversion creates and verifies targets before deleting sources, and cannot preserve actor identity and all actor-specific or custom instance data.
