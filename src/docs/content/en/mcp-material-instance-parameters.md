---
title: Edit Material Instance Parameters
type: doc
slug: mcp-material-instance-parameters
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
documentKind: product-manual
websiteRoute: /en/works/mcp-material/docs/instance-parameters/
lang: en
translationKey: doc:mcp-material:instance-parameters
sourceHash: efebc4442ddecee42b8986a00c9e6e35655dc160d83157b4e48268009b4a7180
translationStatus: translated
generatedBodyHash: 15492f7d041deb1fdc5ffdb831cf1e8607e8d043f5e13da19078ff51bd59c221
docPage:
  work: mcp-material
  group: workflows
  slug: instance-parameters
  order: 2
---

## Structured instance parameters

Call `GetMaterialParameters` with `IncludeStructuredParameters: true` to add `Parameters` rows with `Type`, `Name`, `Association`, `Index`, resolved `Value`, local `Overridden`, and `ExpressionGuid`. An ancestor override affects the resolved value but leaves the child's `Overridden` false. Omitting the flag keeps the existing response shape.

The new list uses `Offset` and `MaxResults` independently of the legacy arrays, with `StructuredTotalCount`, `StructuredReturned`, and `StructuredOffset`. `SupportedParameterTypes` is unpaginated: UE 5.2–5.4 expose nine types, 5.5–5.6 add TextureCollection, and 5.7+ add ParameterCollection. Rows sort by Scalar, Vector, DoubleVector, Texture, Font, RuntimeVirtualTexture, SparseVolumeTexture, StaticSwitch, StaticComponentMask, TextureCollection, ParameterCollection, then Association, Index, and name.

For `SetInstanceParameters`, pass 1–1000 full identities and values:

```json
{"AssetPath":"/Game/Materials/MI_Example","Parameters":[{"Type":"Scalar","Name":"Amount","Association":"Global","Index":-1,"Value":0.5}]}
```

`Global` requires `Index: -1`; `Layer` and `Blend` require an existing parameter at that stack index. Duplicate identities compare names using UE FName semantics. Combining `Parameters` with any legacy map, including an empty map, rejects the whole request before editing. Structured updates validate the whole list before a single transaction. Legacy maps retain partial-success behavior.

| Type | Value |
| --- | --- |
| Scalar | Finite number within float range. |
| Vector / DoubleVector | `{R,G,B,A}` finite numbers; DoubleVector preserves double precision. |
| StaticSwitch | Boolean. |
| StaticComponentMask | `{R,G,B,A}` booleans. |
| Font | `{AssetPath,Page}` for an Offline font with a valid texture page. |
| Texture / RuntimeVirtualTexture / SparseVolumeTexture / TextureCollection | Asset path of the matching resource class; ordinary textures also match the compiled texture type. |
| ParameterCollection | A collection derived from the expression's original collection; requires UE 5.7+. |

Reset one local override with `ResetInstanceParameter` and `Parameter: {Type,Name,Association,Index}`. Do not combine `Parameter` with old `ParameterName` or `ParameterType` selectors. The value inherits from the parent while other local overrides and the layer stack remain in place.

Successful edits report `Applied`, dirty/save fields, `RequiredSaveSet`, and `CompileStatus: "NotCompiled"`. Compile and save explicitly. A failed edit reports verified restoration when possible. `RecoveryFailed/StateUnknown` means restoration could not be verified: stop writes and do not save the asset.
