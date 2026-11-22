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
sourceHash: ccb76d653cf431401d3c88f7a61d4cac7329b263503314d3641454e7f72bda96
translationStatus: translated
generatedBodyHash: 422b71fb9dc479e6ff4d2bd045006f7085334c55c0ca80ca3c6a3714979fc36d
docPage:
  work: mcp-blueprint
  group: class-structure
  slug: class-defaults
  order: 2
---

## Find editable class properties

| Tool | Purpose | Notes |
| --- | --- | --- |
| `GetClassDefaults` | Reads editable CDO defaults by page. | Page through large property sets. |
| `SetClassDefaults` | Changes Blueprint CDO defaults, including inherited properties. | Property names are case-sensitive; values use UE text. |

## Edit the class default object and inherited properties

Use `GetClassDefaults` to find editable, case-sensitive reflected property names. Supply a UE-text `Properties` map, such as `bReplicates: "True"` or `JumpMaxCount: "2"`. This changes the Blueprint CDO defaults used by future placed or spawned instances without overrides; it does not retroactively replace existing instance values. It can also access properties inherited from a C++ or Blueprint parent, which `ModifyVariable` cannot edit as declarations. Use `SaveAsset` when you want to keep the change.

Blueprint CDO defaults are separate from the variable-declaration metadata that `ModifyVariable` edits.
