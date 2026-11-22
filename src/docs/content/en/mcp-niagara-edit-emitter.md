---
title: Edit Emitters and Renderers
type: doc
slug: mcp-niagara-edit-emitter
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
documentKind: product-manual
websiteRoute: /en/works/mcp-niagara/docs/edit-emitter/
lang: en
translationKey: doc:mcp-niagara:edit-emitter
sourceHash: 87cd7926df557b4bb93b503985f87d0ce227fe0b32a4ee98d4d793ae061bb547
translationStatus: translated
generatedBodyHash: 1f1e226ffc1d934fb9b00fed7d72927606af9dcca2fde7a38230e63ec50b96bd
docPage:
  work: mcp-niagara
  group: workflows
  slug: edit-emitter
  order: 2
---

## Emitter editing

`AddEmitter` uses NiagaraEditor's supported copy path to assign a unique name, rebuild emitter nodes, and synchronize the overview graph. `RemoveEmitter` and `RenameEmitter` require an unambiguous name. Add, remove, and rename operations are transactional and broadcast the system edit notification.

`SetEmitterProperties` atomically writes 1–64 properties on `FVersionedNiagaraEmitterData`: every property and value is validated before any change is committed, and each changed property receives a version-aware post-edit notification. Editable scalar, enum, string, name, and safe struct properties are supported. Top-level properties must be editable and neither transient nor deprecated; nested struct members recursively reject object references, containers, delegates, transient fields, and deprecated fields. The dynamic-object schemas for `SetEmitterProperties` and `SetModuleParameters` accept only strings, numbers, or booleans and match the runtime count bounds. String inputs and dynamic property names have schema and runtime limits of at most 4096 characters, with stricter limits for some asset paths; input JSON is also limited to 8 levels and 2048 values. Every tool that loads an existing system returns its canonical object `SystemPath` on success. Final error text is limited to 4096 characters, and available-name candidates have both count and text bounds.

Limitation: UE 5.2 does not export NiagaraEditor's private merge-adapter cache invalidation API. `RemoveEmitter` destroys referencing instances, removes and reconnects the public system graph, synchronizes the overview graph, and broadcasts the edit, but it cannot explicitly clear that private cache. The response includes `Warnings`; refresh or reopen the system before immediately running an inherited-emitter merge workflow. The plugin does not depend on engine Private headers or unexported symbols to bypass this boundary.

## Renderer editing

`SetRendererType` replaces up to 64 renderers on an unambiguously named emitter in one undo transaction. The new renderer is created before old entries are removed, so construction failure preserves the existing configuration. The UE 5.2+ common public types are Sprite, Mesh, Ribbon, Light, Decal, and Component; newer-only Volume support is not exposed unconditionally.

`SetRendererProperties` atomically writes 1–64 properties per call. Every name and value is first validated on a temporary renderer, then committed together with per-property PostEditChange notifications so binding rebuilds and required compile invalidation occur. Editable scalar, enum, string, name, struct, and type-compatible material-reference properties are supported. Containers, delegates, non-material object references, transient, deprecated, and non-editable properties are rejected. `RendererIndex` must be non-negative, and the tool schemas declare the same enum, count, and value-type bounds.
