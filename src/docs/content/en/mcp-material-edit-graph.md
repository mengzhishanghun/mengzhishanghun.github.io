---
title: Edit Material Graphs and Nodes
type: doc
slug: mcp-material-edit-graph
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-material
documentKind: product-manual
websiteRoute: /en/works/mcp-material/docs/edit-graph/
lang: en
translationKey: doc:mcp-material:edit-graph
sourceHash: 08e1ebc8ba09296f8d73338f43490824ec76b2f30a0c34f9fd8c27ea261c9426
translationStatus: translated
generatedBodyHash: f6c06d7342efe27d4eaefe602cbb923b20b080180d4bc0b39ed69c047261a34e
docPage:
  work: mcp-material
  group: features
  slug: edit-graph
  order: 3
---

## Inspect expressions, nodes, and connections

`SearchMaterialExpressions` returns a stable `ClassPath`, `Creatable`, an uncreatable reason, and input/output indices. When short class names collide, `ApplyMaterialPatch` rejects guessing and requires an exact `ClassPath`; duplicate pin names must be addressed as `[index]`.

`GetMaterialDetail` uses `NodeOffset`/`MaxNodes` for nodes and `ConnectionOffset`/`MaxConnections` for connections. Each response gives the total, the number returned, and the next cursor, with up to 1000 entries per page. Page through nodes and connections separately. Once you find the node, check that you have read the relevant connections too.

## Edit the graph

Use `ApplyMaterialPatch` to edit nodes and connections in batches and `SetMaterialProperties` to edit material properties. Use `RemoveConnection` to remove a connection and `FormatGraph` to arrange the graph.

`ApplyMaterialPatch` does not create or remove Composite, PinBase, Function Input/Output, Named Reroute, or other nodes that require specialized editor-managed structure.

`ApplyMaterialPatch` allows at most 1,000 items in each of Nodes, Connections, RemoveNodes, and UpdateNodes, with a combined limit of 2,000 operations. Known pagination, preview-size, graph-spacing, connection-index, and parameter-type bounds are validated before execution.

`SetMaterialProperties` and `ApplyMaterialPatch.Defaults` reject properties disabled by the final property combination.

Close the target editor before writing and follow the [material asset closing and saving rules](/en/works/mcp-material/docs/material-assets/) after editing.

## Editing existing nodes

Call `GetMaterialDetail` with `IncludeEditableProperties: true` to read the current node page's `EditableProperties` (`Name`, `Type`, `ValueText`, `Editable`) and actual `Inputs`/`Outputs` (`Index`, `Name`, numeric material-value `Type`). The response also includes `EditableMaterialProperties` for the material. `Type` in a property description is its UE C++ type; `ValueText` uses UE text format. `Editable` reflects both server support and the current property combination. Omitting the flag preserves the previous response shape.

Find the node in the readback and confirm that the property is editable. Use that node’s GUID in the request. The example below edits one node’s default value in place:

```json
{
  "AssetPath": "/Game/Materials/M_Example",
  "Patch": {
    "UpdateNodes": [
      {"NodeGuid": "<GetMaterialDetail 返回的 GUID>", "Properties": {"DefaultValue": 0.75}}
    ]
  }
}
```

The response's `UpdatedNodeGuids` lists updated nodes. Property updates preserve node GUIDs, parameter GUIDs, and existing connections unless the same patch explicitly edits those connections. For a Constant3Vector, set `Constant` to a UE color string such as `"(R=1,G=0,B=0,A=1)"`.

`UpdateNodes` accepts 1–1000 entries and shares the 2000-operation patch limit with `Nodes`, `Connections`, and `RemoveNodes`. GUIDs identify existing nodes in the requested material. Duplicate GUIDs and updating/removing the same node are rejected. Identity changes, parameter renaming, dynamic pin changes, containers, and external references requiring a dedicated adapter are unavailable through this update mode. Existing `Nodes.Defaults` creation requests retain their supported behavior.

TextureSample updates support the `Texture` reference. When `SamplerType` is absent, the sampler type follows the final texture; an explicit `SamplerType` takes precedence regardless of property order or name casing. The whole patch is rolled back when a later connection fails. A `StateUnknown` error means restoration could not be verified; stop writes and inspect the asset. Compile the material after editing and save it explicitly.
