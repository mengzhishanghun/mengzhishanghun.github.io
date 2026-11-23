---
title: Find and Inspect Niagara Assets
type: doc
slug: mcp-niagara-inspect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-niagara
documentKind: product-manual
websiteRoute: /en/works/mcp-niagara/docs/inspect/
lang: en
translationKey: doc:mcp-niagara:inspect
sourceHash: e4c238c6f398196a18660edca90081f988d7e596b4ba875935dca91b9461adba
translationStatus: translated
generatedBodyHash: 09f7e5c7433e8a99da1a80674dfc384a748064b794acb62d4c494c6ed1cb431b
docPage:
  work: mcp-niagara
  group: features
  slug: inspect
  order: 1
---

MCP Niagara provides MCP tools in Unreal Editor for Niagara systems, emitters, module stacks, parameters, renderers, compile status, and asset lifecycle operations.

## Asset discovery and pagination

`ListNiagaraSystems`, `ListNiagaraEmitters`, and `SearchModules` provide stable pagination:

- `MaxResults` must be between 1 and 500 and defaults to 100.
- `Offset` must be a non-negative integer and defaults to 0.
- Responses include `TotalCount`, `Returned`, `Offset`, and `HasMore`; `NextOffset` is included when another page exists.
- Results are sorted by full asset object path, so consecutive pages do not depend on Asset Registry enumeration order.

`SearchModules` returns only visible Niagara module library assets accepted by the Niagara editor. Deprecated, hidden, and non-library scripts are excluded, and the search does not load every script asset individually.

`GetSystemDetail` pages emitters and user parameters independently: `MaxEmitters` is 1–128, `MaxUserParameters` is 1–256, and both offsets must be non-negative. Each emitter returns at most 64 renderers and 64 simulation stages with total and truncation fields. User parameters are stably sorted by name and type; value text is limited to 4096 characters, while object and data-interface parameters return object paths. Every tool schema rejects undeclared root fields by default, and tools with enums, pagination, or dynamic objects declare their additional bounds.

## Module details

`GetModuleDetail` inspects only modules on the selected Spawn, Update, or Event parameter-map chain, so `ModuleIndex` follows actual execution order. Duplicate names require an index; when both a name and index are supplied, they must identify the same module. `GetModuleDetail`, `AddModule`, `RemoveModule`, and `ReorderModule` all require `UsageId` when an emitter has multiple Event stages; successful responses return the selected output GUID.

Identify the execution stage first. Locate the module by its order within that stage. If there are multiple Event stages, identify the target stage before sending the request. Page through module inputs with `MaxResults` (1–256, default 100) and `Offset`. Each input reports its Niagara type and `ValueSource`; graph overrides, linked or dynamic overrides, and rapid-iteration values are distinguished explicitly. `Value` is limited to 4096 characters, and `bValueTruncated` explicitly reports truncation. Inputs without an override are reported as `ModuleDefaultOrBinding`. To remain self-contained on UE 5.2+, the tool does not depend on NiagaraEditor-internal default-topology APIs and does not guess whether that source is a module default or an internal binding.

## Versions and usage limitations

The plugin includes compatibility paths for UE 5.2 and later. Asset editing, saving, reopening, and packaging behavior has not yet been validated in the target engine. Check these operations in a copy of your project first.

## Feedback

Send feedback to [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com).
