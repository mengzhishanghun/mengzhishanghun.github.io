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
sourceHash: 07908d593621894662162d6c501fd4fc82ab26091365b2a04bdf8318d751633a
translationStatus: translated
generatedBodyHash: faa600a8fbab6c921c79c32685ccd66dc449a04210cf28f3a047b5ac7a128184
docPage:
  work: mcp-world-editor
  group: features
  slug: materials
  order: 22
---

## Parent material and destination path

`CreateMaterialInstance` accepts a writable long package name under the project `/Game/` content root, such as `/Game/Materials/MI_Wall`. It rejects Developers and generated ExternalActors/ExternalObjects directories, invalid package names, and destinations that already exist in memory or on disk. The parent may be any loadable `MaterialInterface`, including a material instance.

Check that the parent material loads, then choose an unused destination package path. Use that path to find the resulting instance after creation.

## Save results and failure cleanup

The tool saves the created asset through the official `EditorAssetSubsystem`. Success requires the exact expected object path, a discoverable on-disk package, and a clean package, and returns `Saved=true`. On type, path, or persistence failure, cleanup is force-deleted only when the returned object exactly matches this call's target, and succeeds only when the target object, in-memory package, and on-disk package are all absent afterward. An unexpected object is never blindly deleted, and the error warns that partial state may remain. You cannot undo asset creation with a normal editor transaction. Failure cleanup uses Unreal Force Delete, which may clear the existing Undo history.

After a failure, check the target path for a remaining object, in-memory package, or file on disk before deciding whether to reuse it or choose another destination.
