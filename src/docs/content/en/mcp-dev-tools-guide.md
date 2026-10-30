---
title: MCPDevTools User Guide
description: Installation, connection, tools and limitations of MCPDevTools
type: doc
slug: mcp-dev-tools-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-dev-tools
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/mcp-dev-tools-guide/
lang: en
translationKey: mcp-dev-tools-guide
sourceHash: c7ab24878a9237602fd80ecba5761359e041077bf3b1b7b16fe3945758f7eddc
translationStatus: translated
generatedBodyHash: 05ae36cc0607b0eb020b60af34684511aec6c7a5210ff120f7cf3449529efd8b
---

# MCPDevTools

MCPDevTools provides asset queries, editing, and read-only development diagnostics over HTTP MCP in Unreal Editor. It currently registers 33 tools: the original 30 asset tools plus `GetDevContext`, `ListProjectPlugins`, and `ReadDevLog`. Use the `tools/list` response and tool results from the target editor as the authority.

## Enable and connect

Place `Plugins/MCPDevTools` in your project's `Plugins` directory and enable `MCPDevTools` in the `.uproject` `Plugins` array. After opening the editor, configure the port and automatic startup under **Project Settings → Plugins → MCPDevTools**. The default address is `http://127.0.0.1:8768/mcp`. If the port is occupied, the server tries subsequent ports; use the actual address in the editor log. InputAction and InputMappingContext tools also require EnhancedInput. Creating either asset type requires the InputEditor module.

## Tools

| Type | Tools | Purpose and main parameters |
|---|---|---|
| General queries | `ListAssets`, `GetAssetInfo`, `GetAssetReferences`, `GetAssetTypeSchema` | Page through standalone assets in mounted content directories; read registration information, dependencies, or referencers using `AssetPath`; query the types, tools, and restrictions supported by the current engine, plus fields, enums, and defaults for an optional `ClassPath`. Reference edges do not prove that an asset is safe to delete. |
| DataAsset | `ListDataAssets`, `GetDataAsset`, `CreateDataAsset`, `SetDataAssetProperties` | Search `/Game` folders with pagination and read reflected properties; create assets using `AssetPath` and `ClassPath`; edit using `Properties` and matching `ExpectedValues`. |
| DataTable | `GetDataTable`, `CreateDataTable`, `PatchDataTableRows` | Read complete rows by page; specify an existing `RowStructPath` when creating; edit with the current `RowStructPath`, `Changes`, and complete old rows in `ExpectedValues`. Supports Add, Update, and Remove. Does not generate or convert row structures. |
| Curve | `GetCurve`, `CreateCurve`, `SetCurve` | Read or create Float, Vector, and LinearColor curves; replace selected channels using `Channels` and the corresponding complete old channels in `ExpectedValues`. Unspecified channels retain their values. |
| CurveTable | `GetCurveTable`, `CreateCurveTable`, `PatchCurveTableRows` | Read Simple or Rich rows by page; specify `Mode` when creating; use `Mode`, `Changes`, and complete old rows in `ExpectedValues` for Add, Replace, and Remove. Does not convert between Simple and Rich modes. |
| StringTable | `GetStringTable`, `CreateStringTable`, `PatchStringTable` | Read keys, source text, and metadata by page; specify a fixed `Namespace` when creating; edit with `Namespace`, `TableId`, `Changes`, and complete old entries in `ExpectedValues`. Supports Add, Update, and Remove. |
| PrimaryAssetLabel | `GetPrimaryAssetLabel`, `CreatePrimaryAssetLabel`, `SetPrimaryAssetLabel` | Read native labels, create labels, or change editable fields with `Properties` and `ExpectedValues`. Derived bundle data is read-only. |
| InputAction | `GetInputAction`, `CreateInputAction`, `SetInputAction` | Read settings and their Trigger, Modifier, and PlayerMappable instances; edit with `ExpectedSettings`, `ExpectedTriggers`, `ExpectedModifiers`, `ExpectedPlayerMappableKeySettings`, and the corresponding new `Properties`, `Triggers`, `Modifiers`, and `PlayerMappableKeySettings`. |
| InputMappingContext | `GetInputMappingContext`, `CreateInputMappingContext`, `SetInputMappingContext` | Read settings, ordered default `Mappings`, and version-supported `MappingProfileOverrides`; edit with `ExpectedSettings`, `ExpectedMappings`, new `Properties`, and complete new `Mappings`. Versions that support profiles also require `ExpectedMappingProfileOverrides` and complete new `MappingProfileOverrides`. |
| Save | `SaveAsset` | Explicitly save one supported standalone asset package under `/Game` using `AssetPath`. Does not save referenced assets or automatically check out read-only files. |
| Development context | `GetDevContext` | Read the project, actual engine/plugin versions, instance and session identifiers, server status, actual port, and listener observations. `IncludePaths` defaults to false. Explicitly set it to true to return absolute paths to the current project file and engine directory. |
| Project plugins | `ListProjectPlugins` | Read allowlisted fields from loaded plugin-manager information. `Scope` defaults to `enabled` and also accepts `discovered`. Results use stable sorting and pagination. |
| Plugin logs | `ReadDevLog` | Read only `LogMCPDevTools` entries captured after module registration completes. Page using `Cursor`, `Limit`, and optional `VerbosityFilter`. |

`AssetPath` is a package path such as `/Game/Data/DA_Example`, not a short name, object path, or subobject path. `ClassPath` is a full class object path, such as `/Script/Engine.DataAsset` or a compiled Blueprint class path like `/Game/Data/BP_Example.BP_Example_C`. Standard lists and paged reads return 20 items by default, with at most 100 per page. Continue using `bHasMore` and `NextOffset`. Editing supports seven asset categories: DataAsset, DataTable, Curve, CurveTable, StringTable, PrimaryAssetLabel, and Enhanced Input (InputAction/InputMappingContext).

## Read-only development diagnostics

The three diagnostic tools do not start processes or test jobs, load assets, save packages, or change configuration. Their inputs reject extra fields. Missing context returns a specific reason for unavailability.

`ListProjectPlugins` and `ReadDevLog` default to 100 items per page, with a maximum of 200. Continue with the returned `NextCursor`. Log pages also reserve a serialization budget for worst-case JSON escaping, with a maximum `TextContent` length of 512 Ki TCHAR. A page may therefore contain fewer entries than `Limit`; matching entries that were not returned remain available on the next page. Plugin lists return only the name, friendly name, version number/name, enabled state, source, and type. They do not return arbitrary descriptor JSON or plugin paths. List cursors are bound to a snapshot, Scope, and Limit. If the information or query conditions change, restart the query without Cursor.

Logs exist only in the current process's memory, with limits of 2,048 entries, 2 MiB of total text, and 8,192 TCHAR per entry. `VerbosityFilter` accepts `Fatal`, `Error`, `Warning`, `Display`, `Log`, `Verbose`, and `VeryVerbose`; omitting it or passing an empty array disables level filtering. Output includes `CaptureStartUtc`, `CaptureSession`, `NextCursor`, coverage-gap fields `bGap` / `DroppedSinceCursor`, and the truncation flag `bTruncated`. Even when no logs match, the cursor advances to the position already examined. Cursors from an earlier capture session are rejected, and the first read may already have a coverage gap. Module shutdown stops capture and unregisters the output device. The tool provides no disk logs, history from before registration, or guarantee of complete capture during a crash. Plugin logs produced by HTTP queries may appear on subsequent pages. Messages in this category may contain project names or paths; logs are not guaranteed to be free of private information.

On Windows, listener results come from read-only `GetExtendedTcpTable` observations of the current PID and ActualPort for IPv4/IPv6. `observed_loopback` requires both address-family queries to succeed and every matching address to be in IPv4 127/8 or IPv6 ::1; wildcard addresses produce `observed_non_loopback`. Query failure, ambiguous ownership, no matches, or a state change produces `unknown`; a stopped server produces `not_running`. Other platforms return the reason `unsupported_platform`. A returned 127.0.0.1 URL does not itself prove the actual binding. OS observations describe only the sampling instant and provide neither authentication nor an ongoing security guarantee. The tools do not change listeners, HTTP settings, firewalls, or permissions.

## Recommended workflow

1. Use the relevant `Get...` tool to read the complete current values. If the type or fields are unclear, call `GetAssetTypeSchema`. For creation, keep the default `bDryRun=true` first, check the path, class, or mode, then set `bDryRun=false`.
2. For edits, copy the complete old values into the corresponding `Expected...` parameters and provide the new values. Start with the default dry-run, then set `bDryRun=false`. Conflicts or invalid fields cause rejection. Created or edited assets are dirty in memory.
3. Once you have checked the result, call `SaveAsset` separately to write that asset package. Tools do not automatically check out files, overwrite an existing creation path, or save referenced assets.

Existing DataAsset calls remain unchanged. For example, after `GetDataAsset` returns `"Old"` as the current `Title`, call `SetDataAssetProperties`:

```json
{
  "AssetPath": "/Game/Data/DA_Example",
  "Properties": { "Title": "New" },
  "ExpectedValues": { "Title": "Old" },
  "bDryRun": true
}
```

Input Trigger, Modifier, and PlayerMappable settings are instances owned by the asset, rather than ordinary object references. Replace an instance using the shape `{ "ClassPath": "/Script/EnhancedInput.InputTriggerHold", "Properties": {} }`. Arrays retain input order, and `PlayerMappableKeySettings` accepts that object shape or `null`. Each InputMappingContext mapping contains `Properties`, `Triggers`, and `Modifiers`, with optional `PlayerMappableKeySettings`. `MappingProfileOverrides` is an object mapping profile names to complete mapping arrays. UE 5.8 exposes profiles; UE 5.2 has no such field and rejects profile parameters. First read `bProfileOverridesSupported` and the complete old values for the current engine from `GetInputMappingContext`.

## Values and restrictions

- Writable types include booleans, finite numbers within the type's range, valid enum names, strings, names, value-type structs, arrays, sets, Maps with string or name keys, and hard/soft object and class references. Read and write 64-bit integers beyond JSON's exact integer range as decimal strings. Structs may omit unchanged fields; arrays, Sets, and Maps are replaced in full.
- Read and write `FText` as an identity object: `{"InvariantText":"内容"}`, `{"StringTableId":"...","StringTableKey":"..."}`, or the localized form `{"Namespace":"...","Key":"...","Source":"..."}`. The localized form in UE 5.8 also includes `DevNotes`. Text that cannot be represented losslessly, such as formatted or numeric text, is read-only.
- Field names are case-sensitive. JSON objects must not contain duplicate keys or keys that differ only in case. Property names, enum names, `FName` values and keys, and paths reject embedded NUL. Ordinary string values are compared at their full length. Duplicate Set values and Map-key normalization collisions are rejected.
- Ordinary property references use a full path to an existing object of the matching type, or JSON `null` to clear the value. Generic DataAsset property editing does not accept inline subobjects, delegates, Transient or read-only fields, or unsupported types. Use the dedicated parameters above for Input instances.
- `ListDataAssets` filters `ClassPath` by inheritance and accepts abstract DataAsset base classes such as `DataAsset` and `PrimaryDataAsset`. Class-path requirements and the requirement for a currently successful Blueprint compile still apply. `CreateDataAsset` requires a concrete, non-abstract class and uses the generic DataAsset factory. Use the corresponding creation tool for types requiring a dedicated factory. `SaveAsset` saves only supported single-asset packages; read-only files are rejected.

## Capability limits

Behavior on other platforms, native Manage/SearchableName dependency edges, Cook/actual Chunk output, and non-empty ExplicitBlueprints remains unconfirmed. The current tools do not provide Automation/Build/Cook/Package jobs, arbitrary commands, or editing of user C++ source code.
