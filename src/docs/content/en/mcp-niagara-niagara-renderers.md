---
title: Replace and Configure Niagara Renderers
type: doc
slug: mcp-niagara-niagara-renderers
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
documentKind: product-manual
websiteRoute: /en/works/mcp-niagara/docs/niagara-renderers/
lang: en
translationKey: doc:mcp-niagara:niagara-renderers
sourceHash: 0c756e1fe3045dd33376599632f79ee9d87fce2e7d5e0cea3b2aeb966a6f13a5
translationStatus: translated
generatedBodyHash: 57a0b8f1d2367880ad2f21c067ca293e742cc0d7ced8a3315dae42e92f4b5ec0
docPage:
  work: mcp-niagara
  group: features
  slug: niagara-renderers
  order: 5
---

## Renderer types and properties

Inspect the target system first. Confirm that the emitter name is unique and check its current renderers. To change the type, use `SetRendererType`; it replaces up to 64 renderers on an unambiguously named emitter in one undo transaction. The new renderer is created before old entries are removed, so construction failure preserves the existing configuration. The UE 5.2+ common public types are Sprite, Mesh, Ribbon, Light, Decal, and Component; newer-only Volume support is not exposed unconditionally.

`SetRendererProperties` atomically writes 1–64 properties per call. Every name and value is first validated on a temporary renderer, then committed together with per-property PostEditChange notifications so binding rebuilds and required compile invalidation occur. Editable scalar, enum, string, name, struct, and type-compatible material-reference properties are supported. Containers, delegates, non-material object references, transient, deprecated, and non-editable properties are rejected. If you only need to change one renderer’s properties, find its `RendererIndex` in the current list. The index must be non-negative. After changing the type, read the system again before selecting a renderer. The input schema lists the same limits on enum values, counts, and types.
