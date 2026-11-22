---
title: Create Data Assets and Edit Properties
type: doc
slug: mcp-dev-tools-data-assets
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /en/works/mcp-dev-tools/docs/data-assets/
lang: en
translationKey: doc:mcp-dev-tools:data-assets
sourceHash: f91b4cdac6a4aa2c0c6116476e54bcd42a289fc653d6c0483284b363dd2643b8
translationStatus: translated
generatedBodyHash: 0e181415d6f7e9657a68ab977b94e30ce1bf0368627ac30290918966af3f892e
docPage:
  work: mcp-dev-tools
  group: data
  slug: data-assets
  order: 1
---

## Read and write

| Type | Tools | Purpose and main parameters |
|---|---|---|
| DataAsset | `ListDataAssets`, `GetDataAsset`, `CreateDataAsset`, `SetDataAssetProperties` | Search `/Game` folders with pagination and read reflected properties; create assets using `AssetPath` and `ClassPath`; edit using `Properties` and matching `ExpectedValues`. |

`AssetPath` is a package path such as `/Game/Data/DA_Example`, not a short name, object path, or subobject path. `ClassPath` is a full class object path, such as `/Script/Engine.DataAsset` or a compiled Blueprint class path like `/Game/Data/BP_Example.BP_Example_C`.

## Type and value validation

- Writable types include booleans, finite numbers within the type's range, valid enum names, strings, names, value-type structs, arrays, sets, Maps with string or name keys, and hard/soft object and class references. Read and write 64-bit integers beyond JSON's exact integer range as decimal strings. Structs may omit unchanged fields; arrays, Sets, and Maps are replaced in full.
- Read and write `FText` as an identity object: `{"InvariantText":"内容"}`, `{"StringTableId":"...","StringTableKey":"..."}`, or the localized form `{"Namespace":"...","Key":"...","Source":"..."}`. The localized form in UE 5.8 also includes `DevNotes`. Text that cannot be represented losslessly, such as formatted or numeric text, is read-only.
- Field names are case-sensitive. JSON objects must not contain duplicate keys or keys that differ only in case. Property names, enum names, `FName` values and keys, and paths reject embedded NUL. Ordinary string values are compared at their full length. Duplicate Set values and Map-key normalization collisions are rejected.
- Ordinary property references use a full path to an existing object of the matching type, or JSON `null` to clear the value. Generic DataAsset property editing does not accept inline subobjects, delegates, Transient or read-only fields, or unsupported types.
- `ListDataAssets` filters `ClassPath` by inheritance and accepts abstract DataAsset base classes such as `DataAsset` and `PrimaryDataAsset`. Class-path requirements and the requirement for a currently successful Blueprint compile still apply. `CreateDataAsset` requires a concrete, non-abstract class and uses the generic DataAsset factory. Use the corresponding creation tool for types requiring a dedicated factory. `SaveAsset` saves only supported single-asset packages; read-only files are rejected.

## Property edit example

For example, if `GetDataAsset` returns `"Old"` for `Title`, preview the change with `SetDataAssetProperties`:

```json
{
  "AssetPath": "/Game/Data/DA_Example",
  "Properties": { "Title": "New" },
  "ExpectedValues": { "Title": "Old" },
  "bDryRun": true
}
```

Preview changes before applying them, then save separately. See the [preview and save workflow](/en/works/mcp-dev-tools/docs/connect/).
