---
title: Create and Save Material Instances
type: doc
slug: mcp-world-editor-materials
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-world-editor
documentKind: product-manual
websiteRoute: /en/works/mcp-world-editor/docs/materials/
lang: en
translationKey: doc:mcp-world-editor:materials
sourceHash: 3e36918b717c9f62b1bdb9a5a817fa12299acadc3d7906898d2eebf797d63d38
translationStatus: translated
generatedBodyHash: 240a8289bc6cb44a1b33c4ea5fd79c29e002c0216aaff896100a6a80f3bbcc65
docPage:
  work: mcp-world-editor
  group: materials
  slug: materials
  order: 1
---

## Parent material and destination path

`CreateMaterialInstance` accepts a writable long package name under the project `/Game/` content root, such as `/Game/Materials/MI_Wall`. It rejects Developers and generated ExternalActors/ExternalObjects directories, invalid package names, and destinations that already exist in memory or on disk. The parent may be any loadable `MaterialInterface`, including a material instance.

## Save results and failure cleanup

The tool saves the created asset through the official `EditorAssetSubsystem`. Success requires the exact expected object path, a discoverable on-disk package, and a clean package, and returns `Saved=true`. On type, path, or persistence failure, cleanup is force-deleted only when the returned object exactly matches this call's target, and succeeds only when the target object, in-memory package, and on-disk package are all absent afterward. An unexpected object is never blindly deleted, and the error warns that partial state may remain. You cannot undo asset creation with a normal editor transaction. Failure cleanup uses Unreal Force Delete, which may clear the existing Undo history.
