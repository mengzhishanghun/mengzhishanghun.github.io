---
title: Read and Edit Material Instance Parameters
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
sourceHash: 7b934e58485ac35a2eee70ef9c32991c1aa125bbd9a09c93ce44799e25df4c39
translationStatus: translated
generatedBodyHash: 44bebed5f081dbbddf209a89d514d62cd6ceff4fbc0a3c4b31a66845a9d15fbe
docPage:
  work: mcp-material
  group: features
  slug: instance-parameters
  order: 4
---

## Structured instance parameters

Call `GetMaterialParameters` with `IncludeStructuredParameters: true` to add `Parameters` rows with `Type`, `Name`, `Association`, `Index`, resolved `Value`, local `Overridden`, and `ExpressionGuid`. An ancestor override affects the resolved value but leaves the child's `Overridden` false. Omitting the flag keeps the existing response shape.

The new list uses `Offset` and `MaxResults` independently of the legacy arrays, with `StructuredTotalCount`, `StructuredReturned`, and `StructuredOffset`. `SupportedParameterTypes` is unpaginated: UE 5.2–5.4 expose nine types, 5.5–5.6 add TextureCollection, and 5.7+ add ParameterCollection. Rows sort by Scalar, Vector, DoubleVector, Texture, Font, RuntimeVirtualTexture, SparseVolumeTexture, StaticSwitch, StaticComponentMask, TextureCollection, ParameterCollection, then Association, Index, and name.

Find the row you want to edit and use its type, name, association, and index to identify the parameter. If a global parameter and a layer parameter share a name, use the full identity from the intended row. `SetInstanceParameters` accepts 1–1000 entries, each with a full identity and a new value:

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

## Texture and parameter compatibility

Legacy name maps and reset selectors accept only uniquely identified Global parameters. Use structured identities for Layer and Blend parameters.

`SetInstanceParameters` validates ordinary texture parameters against the parent material's current compiled resource. 2D, Cube, 2D/Cube Array, Volume, and Virtual textures are not interchangeable. The dedicated `SparseVolumeTextureParameters` map reads and writes `USparseVolumeTexture` assets, and `ResetInstanceParameter` uses `ParameterType: "SparseVolumeTexture"`. The write is rejected when the parent has no usable resource or the parameter is absent from the active static-switch permutation.

`GetMaterialParameters` uses one `Offset`/`MaxResults` cursor across Scalar, Vector, Texture, SparseVolumeTexture, and StaticSwitch in that order. Responses include totals, returned counts, and next cursors; every page is capped at 1000 entries.

Use structured parameters for advanced types and check the engine version required by each type. Runtime Virtual Texture consumers require virtual texturing; Sparse Volume Texture assets need initialized frame data.

Close the target editor before writing and follow the [material asset closing and saving rules](/en/works/mcp-material/docs/material-assets/) after editing.
