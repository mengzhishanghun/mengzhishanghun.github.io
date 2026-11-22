---
title: Edit Niagara User Parameters
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
sourceHash: 35ae32df7f027892f9bb1da272236df0cf5ec4388c1b5c607ec9a065401ed22a
translationStatus: translated
generatedBodyHash: 597b80fe367904b533fb3a119d5f629e704c7246b2d13464929df0783471392e
docPage:
  work: mcp-niagara
  group: effects
  slug: parameters-preview
  order: 3
---

## User parameter editing

`AddUserParameter` adds a float, int, bool, Vector, Vector2, Vector4, or Color value parameter in an undo transaction and sends a system PostEditChange. `SetSystemParameters` atomically writes 1–64 existing value parameters per call: all names and values are validated and old values are snapshotted before commit. JSON booleans are stored using Niagara's `FNiagaraBool` representation. `RemoveUserParameter` uses the same public exposed-parameter removal semantics as UE 5.8 External and requires an unambiguous name.

Object and data-interface parameters require typed asset or instance handling and cannot safely use text-value import, so `AddUserParameter` and `SetSystemParameters` do not claim support for them. Removal does not guess how graph references should be rewritten; callers must update references separately. UE 5.2–5.8 do not share an exported user-parameter rename and reference-propagation API, so the plugin does not depend on Private headers to offer `RenameUserParameter`.
