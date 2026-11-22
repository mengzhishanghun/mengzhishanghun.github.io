---
title: Set User Parameters and Preview Effects
type: doc
slug: mcp-niagara-parameters-preview
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
documentKind: product-manual
websiteRoute: /en/works/mcp-niagara/docs/parameters-preview/
lang: en
translationKey: doc:mcp-niagara:parameters-preview
sourceHash: dd77ab3c7d95570620e664451bd6a1b350e5f338bd7ab034ab21bffb6e49014b
translationStatus: translated
generatedBodyHash: 73467a7dd260998b5226917e8fa6313bf7b343a3f1686d38a172c9f6e1eb8d41
docPage:
  work: mcp-niagara
  group: workflows
  slug: parameters-preview
  order: 3
---

## User parameter editing

`AddUserParameter` adds a float, int, bool, Vector, Vector2, Vector4, or Color value parameter in an undo transaction and sends a system PostEditChange. `SetSystemParameters` atomically writes 1–64 existing value parameters per call: all names and values are validated and old values are snapshotted before commit. JSON booleans are stored using Niagara's `FNiagaraBool` representation. `RemoveUserParameter` uses the same public exposed-parameter removal semantics as UE 5.8 External and requires an unambiguous name.

Object and data-interface parameters require typed asset or instance handling and cannot safely use text-value import, so `AddUserParameter` and `SetSystemParameters` do not claim support for them. Removal does not guess how graph references should be rewritten; callers must update references separately. UE 5.2–5.8 do not share an exported user-parameter rename and reference-propagation API, so the plugin does not depend on Private headers to offer `RenameUserParameter`.

## Asset lifecycle and preview

`CreateNiagaraSystem` accepts only a valid long package name in a writable mount and rejects a `.ObjectName` suffix. Disk packages, loaded packages, and exact Asset Registry entries are checked before creation, so an existing asset is never overwritten. `TemplatePath` performs a real template duplication; without it, the Niagara factory creates an empty system. The response reports the canonical object path, package name, and dirty state; call `SaveAsset` to persist it.

`SaveAsset` uses non-fatal package-name conversion and rejects read-only targets. It succeeds only when `SavePackage` succeeds, the file exists, and the package is no longer dirty. `OpenAsset` checks both the editor and AssetEditorSubsystem lifecycle. `CapturePreview` reads only a thumbnail already cached in memory or stored in a saved package; it does not render or replace the thumbnail cache. Exactly one PNG is returned, bounded to 1024×1024 pixels, 16 MiB raw data, and 8 MiB compressed data.
