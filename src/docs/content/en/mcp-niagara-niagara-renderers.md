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
sourceHash: f347f32a9c1a166d309fee418bfbd199b47ba45d7a9b43b0e30bc2a3c70f9c15
translationStatus: translated
generatedBodyHash: 1856144debe44d125d3c6fa55fb5d78681f65fb1e6cc22420ce91590d0de8573
docPage:
  work: mcp-niagara
  group: effects
  slug: niagara-renderers
  order: 2
---

## Renderer types and properties

`SetRendererType` replaces up to 64 renderers on an unambiguously named emitter in one undo transaction. The new renderer is created before old entries are removed, so construction failure preserves the existing configuration. The UE 5.2+ common public types are Sprite, Mesh, Ribbon, Light, Decal, and Component; newer-only Volume support is not exposed unconditionally.

`SetRendererProperties` atomically writes 1–64 properties per call. Every name and value is first validated on a temporary renderer, then committed together with per-property PostEditChange notifications so binding rebuilds and required compile invalidation occur. Editable scalar, enum, string, name, struct, and type-compatible material-reference properties are supported. Containers, delegates, non-material object references, transient, deprecated, and non-editable properties are rejected. `RendererIndex` must be non-negative, and the tool schemas declare the same enum, count, and value-type bounds.
