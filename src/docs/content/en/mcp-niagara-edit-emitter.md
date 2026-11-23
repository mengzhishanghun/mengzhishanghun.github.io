---
title: Add and Edit Niagara Emitters
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
sourceHash: a2f7d85feecd9971dd1c737f64d0383de72ddb62802e8e56416a1ad857407cce
translationStatus: translated
generatedBodyHash: 14c658ac3408580bc83f2a8ec1591a51e981991629ef49917bb730269558e367
docPage:
  work: mcp-niagara
  group: features
  slug: edit-emitter
  order: 4
---

## Copy and edit emitters

Read the target system’s emitter list first to identify the emitter you want to edit. To add an emitter, use `AddEmitter`; it uses NiagaraEditor’s supported copy path to assign a unique name, rebuild emitter nodes, and synchronize the overview graph. `RemoveEmitter` and `RenameEmitter` require an unambiguous name. Add, remove, and rename operations are transactional and broadcast the system edit notification.

`SetEmitterProperties` atomically writes 1–64 properties on `FVersionedNiagaraEmitterData`: every property and value is validated before any change is committed, and each changed property receives a version-aware post-edit notification. Editable scalar, enum, string, name, and safe struct properties are supported. Top-level properties must be editable and neither transient nor deprecated; nested struct members recursively reject object references, containers, delegates, transient fields, and deprecated fields. The dynamic-object schemas for `SetEmitterProperties` and `SetModuleParameters` accept only strings, numbers, or booleans and match the runtime count bounds. String inputs and dynamic property names have schema and runtime limits of at most 4096 characters, with stricter limits for some asset paths; input JSON is also limited to 8 levels and 2048 values. Every tool that loads an existing system returns its canonical object `SystemPath` on success. Final error text is limited to 4096 characters, and available-name candidates have both count and text bounds.

Limitation: UE 5.2 does not export NiagaraEditor's private merge-adapter cache invalidation API. `RemoveEmitter` destroys referencing instances, removes and reconnects the public system graph, synchronizes the overview graph, and broadcasts the edit, but it cannot explicitly clear that private cache. The response includes `Warnings`; refresh or reopen the system before immediately running an inherited-emitter merge workflow. The plugin does not depend on engine Private headers or unexported symbols to bypass this boundary.
