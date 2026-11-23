---
title: Read and Edit Blueprint Class Defaults
type: doc
slug: mcp-blueprint-class-defaults
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/class-defaults/
lang: en
translationKey: doc:mcp-blueprint:class-defaults
sourceHash: 09ef9f0e746d0e9d3c6ea5c3fac57979c650a20845a524097069cae941ecf760
translationStatus: translated
generatedBodyHash: 1ac5f49f0344b29ec12129296c6eabf393f0605fe054ba94c7a58cbd7d53b9e2
docPage:
  work: mcp-blueprint
  group: features
  slug: class-defaults
  order: 11
---

## Find editable class properties

| Tool | Purpose | Notes |
| --- | --- | --- |
| `GetClassDefaults` | Reads editable CDO defaults by page. | Page through large property sets. |
| `SetClassDefaults` | Changes Blueprint CDO defaults, including inherited properties. | Property names are case-sensitive; values use UE text. |

## Edit the class default object and inherited properties

Look up the property with `GetClassDefaults` and use the name as returned. Names are case-sensitive. Supply a UE-text `Properties` map, such as `bReplicates: "True"` or `JumpMaxCount: "2"`. This changes the Blueprint CDO defaults used by future placed or spawned instances without overrides; it does not retroactively replace existing instance values. It can also access properties inherited from a C++ or Blueprint parent, which `ModifyVariable` cannot edit as declarations. Use `SaveAsset` when you want to keep the change.

Use the class-default tools for values on the generated class. Use `ModifyVariable` for variable declaration metadata, or `SetComponentProperties` for an SCS component template added by this Blueprint.
