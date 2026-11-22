---
title: Edit Material Graphs and Check Compilation
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
sourceHash: 5dac18360cf9bb1965f93be47e7e30a7d67aa21c58facffaca991114928cdb11
translationStatus: translated
generatedBodyHash: a2198c25d62b003ebd67677af01d63a87e51d8abb49d4a199104cde714e63868
docPage:
  work: mcp-material
  group: workflows
  slug: edit-graph
  order: 1
---

MCPMaterial exposes Unreal Editor material and material-instance workflows to AI clients through MCP tools. The plugin supports Unreal Engine 5.2 and later. Its default endpoint is `http://127.0.0.1:8763/mcp`; when the port is occupied, the server tries a limited sequence of higher ports.

## Capabilities

- Discover materials, material instances, and available expression classes.
- Read material graphs, connections, properties, and Scalar, Vector, Texture, Sparse Volume Texture, and Static Switch parameters.
- Create materials and material instances, then batch-edit properties, parameters, expression nodes, and connections.
- Compile materials and material instances, save assets, open or close asset editors, and capture material previews.
- Write tools use transactions and mark packages dirty. Call `CompileMaterial` before `SaveAsset` when the material must be validated first.

## Safe workflow

1. Use `ListMaterials`, `GetMaterialDetail`, `GetMaterialParameters`, and `SearchMaterialExpressions` to obtain real paths, GUIDs, pins, and parameter identities.
2. If the target material or material instance is open in an asset editor, save or resolve the editor changes and then call `CloseAsset`.
3. Call `ApplyMaterialPatch`, `SetMaterialProperties`, `SetInstanceParameters`, `ResetInstanceParameter`, `RemoveConnection`, or `FormatGraph`.
4. Call `CompileMaterial` and inspect the terminal compile result.
5. Call `SaveAsset` to persist the changes. Call `OpenAsset` afterward when a manual review is needed.

Write, compile, and save tools reject targets that are still open in an asset editor. This prevents the Material Editor's transient preview and the backing asset from diverging, and prevents a later editor Apply operation from overwriting completed MCP changes.

## Compilation results

`CompileMaterial` accepts a Material or MaterialInstanceConstant in `AssetPath`. Inspect `CompileStatus` (`Success` or `Error`) and the `Errors` array before saving.

| Result field | Meaning |
| --- | --- |
| `AssetPath` | The requested path, preserved as supplied. |
| `AssetType` | `Material` or `MaterialInstanceConstant`, identifying the requested asset. |
| `ResourceOwnerPath` | The actual compiled resource owner's full object path, such as `/Game/Materials/MI_Example.MI_Example`. |

An instance with a static permutation compiles its own resource. An instance without one uses its effective parent resource, which can belong to a parent material or an ancestor instance; `ResourceOwnerPath` reports that owner. Close both the requested asset's editor and its resource owner's editor before compiling. A missing resource returns `CompileStatus: "Error"`, a nonempty `Errors` array, and an empty `ResourceOwnerPath`. An instance without a complete shader map also reports an error.

## Editing existing nodes

Call `GetMaterialDetail` with `IncludeEditableProperties: true` to read the current node page's `EditableProperties` (`Name`, `Type`, `ValueText`, `Editable`) and actual `Inputs`/`Outputs` (`Index`, `Name`, numeric material-value `Type`). The response also includes `EditableMaterialProperties` for the material. `Type` in a property description is its UE C++ type; `ValueText` uses UE text format. `Editable` reflects both server support and the current property combination. Omitting the flag preserves the previous response shape.

Use a discovered node GUID to edit the same node:

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

## Important boundaries

- Legacy name maps and reset selectors accept only uniquely identified Global parameters. Use structured identities for Layer and Blend parameters.
- `SetInstanceParameters` validates ordinary texture parameters against the parent material's current compiled resource. 2D, Cube, 2D/Cube Array, Volume, and Virtual textures are not interchangeable. The dedicated `SparseVolumeTextureParameters` map reads and writes `USparseVolumeTexture` assets, and `ResetInstanceParameter` uses `ParameterType: "SparseVolumeTexture"`. The write is rejected when the parent has no usable resource or the parameter is absent from the active static-switch permutation.
- `SearchMaterialExpressions` returns a stable `ClassPath`, `Creatable`, an uncreatable reason, and input/output indices. When short class names collide, `ApplyMaterialPatch` rejects guessing and requires an exact `ClassPath`; duplicate pin names must be addressed as `[index]`.
- `ApplyMaterialPatch` does not create or remove Composite, PinBase, Function Input/Output, Named Reroute, or other nodes that require specialized editor-managed structure.
- The server recursively enforces every tool input schema, rejecting unknown fields, missing required fields, invalid types, and out-of-range values even for raw `tools/call` requests. `ApplyMaterialPatch` allows at most 1,000 items in each of Nodes, Connections, RemoveNodes, and UpdateNodes, with a combined limit of 2,000 operations. Known pagination, preview-size, graph-spacing, connection-index, and parameter-type bounds are validated before execution.
- HTTP request bodies default to a 1 MiB limit and JSON-RPC response bodies to 8 MiB; both are configurable in the MCP Material project settings. `CapturePreview` is capped at 1024×1024 and rejects compressed PNG data larger than 4 MiB. Oversized tool results preserve the real success/error terminal state while omitting excessive content; do not blindly retry a successful write tool solely because its result was omitted.
- `GetMaterialDetail` uses `NodeOffset`/`MaxNodes` for nodes and `ConnectionOffset`/`MaxConnections` for connections. `GetMaterialParameters` uses one `Offset`/`MaxResults` cursor across Scalar, Vector, Texture, SparseVolumeTexture, and StaticSwitch in that order. Responses include totals, returned counts, and next cursors; every page is capped at 1000 entries.
- Advanced parameter types use the structured contract and engine-version capabilities above. Runtime Virtual Texture consumers require virtual texturing; Sparse Volume Texture assets need initialized frame data.
- `SetMaterialProperties` and `ApplyMaterialPatch.Defaults` reject properties disabled by the final property combination. Newly created assets remain dirty in memory until `SaveAsset` is called explicitly; an underlying save failure returns an MCP error terminal state instead of a warning inside a successful result.
- JSON-RPC treats only messages without an `id` member as notifications; an explicit `id:null` still receives a response with a null id.
- A timeout cannot forcibly stop an editor operation after the GameThread has claimed it. After a timeout error, inspect editor state before retrying.

For questions or feedback, email [mzsh.me@icloud.com](mailto:mzsh.me@icloud.com). I will respond when I see your message.
