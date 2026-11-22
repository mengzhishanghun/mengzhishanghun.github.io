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
sourceHash: 831aa2fa4376aa52806cc0ad453cd0ce5aa9602377b652999e5a2a843a64cd17
translationStatus: translated
generatedBodyHash: 761ba59d955d716d402c1ff63f354f4701987c1221d2990b31eafc4d1063d45d
docPage:
  work: mcp-world-editor
  group: workflows
  slug: materials
  order: 5
---

## Material instance creation

`CreateMaterialInstance` accepts a writable long package name under the project `/Game/` content root, such as `/Game/Materials/MI_Wall`. It rejects Developers and generated ExternalActors/ExternalObjects directories, invalid package names, and destinations that already exist in memory or on disk. The parent may be any loadable `MaterialInterface`, including a material instance.

## Material instance asset persistence

`CreateMaterialInstance` accepts only a valid new package path under the project's `/Game/...` root and rejects Developers plus generated ExternalActors/ExternalObjects directories. It rejects packages already present in memory or on disk, then saves the created asset through the official `EditorAssetSubsystem`. Success requires the exact expected object path, a discoverable on-disk package, and a clean package, and returns `Saved=true`. On type, path, or persistence failure, cleanup is force-deleted only when the returned object exactly matches this call's target, and succeeds only when the target object, in-memory package, and on-disk package are all absent afterward. An unexpected object is never blindly deleted, and the error warns that partial state may remain. Asset creation itself is not a normal Undo transaction; however, failure cleanup uses Unreal Force Delete and may clear the editor's existing Undo history.

For questions or feedback, email [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com). I will respond when I see your message.
