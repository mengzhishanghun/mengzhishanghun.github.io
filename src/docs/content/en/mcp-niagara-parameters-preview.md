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
sourceHash: b136b3ae2bd0a6476eee8e1b11f906b8b0b0ac35e23ada32d91f2a9d41429fca
translationStatus: translated
generatedBodyHash: 736c6c7afa32ad2206cbf955a3597a3fc3e598f57dd35be4609801a244f5b2fd
docPage:
  work: mcp-niagara
  group: features
  slug: parameters-preview
  order: 6
---

## User parameter editing

`AddUserParameter` adds a float, int, bool, Vector, Vector2, Vector4, or Color value parameter in an undo transaction and sends a system PostEditChange. `SetSystemParameters` atomically writes 1–64 existing value parameters per call: all names and values are validated and old values are snapshotted before commit. JSON booleans are stored using Niagara's `FNiagaraBool` representation. `RemoveUserParameter` uses the same public exposed-parameter removal semantics as UE 5.8 External and requires an unambiguous name.

Read the system’s user parameters first and confirm the target by name and type. Use the add tool for a new parameter and the set tool to change an existing value. Object and data-interface parameters require typed asset or instance handling and cannot safely use text-value import, so `AddUserParameter` and `SetSystemParameters` do not claim support for them. Removal does not guess how graph references should be rewritten; callers must update references separately. UE 5.2–5.8 do not share an exported user-parameter rename and reference-propagation API. The plugin does not use private headers to work around that limit and does not offer `RenameUserParameter`.
