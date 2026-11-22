---
title: Install and Connect the Blueprint Editing Tools
type: doc
slug: mcp-blueprint-connect
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /en/works/mcp-blueprint/docs/connect/
lang: en
translationKey: doc:mcp-blueprint:connect
sourceHash: 75bca0c29479111587d84956ed0f39678d253c3557d828665f1be2161e4c84f2
translationStatus: translated
generatedBodyHash: d3647ca8bcdf83c24068a79b3b57efca9a1dd74f3613240e02ba370d27e68ed1
docPage:
  work: mcp-blueprint
  group: setup
  slug: connect
  order: 1
---

MCPBlueprint provides Blueprint discovery, graph editing, member and component tools, asset lifecycle operations, compilation feedback, and graph screenshots to AI clients over MCP. This guide covers the 55 tools in the published Fab release. Use the `tools/list` response from your editor session for available tool names and parameters.

## Requirements and installation

- Unreal Engine 5.2+ Editor on Windows, macOS, or Linux.
- An MCP client that supports a local HTTP server.
- A package matching the exact Unreal Engine minor version.

Install once per engine:

```text
<UE_5.x>/Engine/Plugins/Marketplace/MCPBlueprint/
```

MCPBlueprint is an optional editor tool installed with the engine. Its `.uplugin` uses `Installed=true` and `EnabledByDefault=true`. Do not copy it into every project or add MCPBlueprint to a project's `.uproject`. Restart the editor for the corresponding engine version after replacing the plugin package.

## Connect an AI client

MCPBlueprint enables itself automatically. With Auto Start enabled, its local MCP server starts with the editor. You do not need to enable it manually in each project or add a plugin declaration to the project's `.uproject`.

Follow your AI client's MCP setup process and give it the endpoint shown in the plugin toolbar. The default endpoint is `http://127.0.0.1:8766/mcp`. If the configured port is occupied, MCPBlueprint tries up to nine subsequent ports. Client configuration formats differ, so this guide does not prescribe a client-specific JSON file or manual port-configuration procedure.

The MCP client normally handles `initialize` and `tools/list` automatically. `ping` is for troubleshooting and does not need to be run manually for every session.

The server binds only to the local machine. Browser-style `Origin` values are limited to `localhost`, `127.0.0.1`, and `[::1]`; ordinary non-browser MCP clients can omit `Origin`.

## Feature overview

The current version registers 55 tools:

| Capability | Count | Tools |
|---|---:|---|
| Discovery and reading | 6 | `ListBlueprints`, `GetBlueprintOverview`, `ListBlueprintMembers`, `GetGraphDetail`, `SearchGraphNodes`, `GetCompileErrors` |
| User Defined Structs and Enums | 6 | `CreateUserDefinedStruct`, `GetUserDefinedStruct`, `ModifyUserDefinedStruct`, `CreateUserDefinedEnum`, `GetUserDefinedEnum`, `ModifyUserDefinedEnum` |
| Variables, functions, events, and pins | 17 | `AddVariable`, `ModifyVariable`, `RemoveVariable`, `CreateFunction`, `RenameFunction`, `ModifyFunctionSignature`, `RemoveFunction`, `CreateCustomEvent`, `AddEventNode`, `AddBoundEvent`, `AddLocalVariable`, `RemoveLocalVariable`, `AddNodePin`, `RemoveNodePin`, `AddInterface`, `AddEventDispatcher`, `RemoveEventDispatcher` |
| Graph editing and layout | 4 | `ApplyGraphPatch`, `SetPinDefaults`, `FormatGraph`, `AddCommentBox` |
| Components and defaults | 11 | `GetComponents`, `AddComponent`, `SetComponentProperties`, `RenameComponent`, `RemoveComponent`, `ReparentComponent`, `SetRootComponent`, `DuplicateComponent`, `GetComponentProperties`, `GetClassDefaults`, `SetClassDefaults` |
| Asset lifecycle and screenshots | 11 | `CreateBlueprint`, `ReparentBlueprint`, `CompileBlueprint`, `SaveAsset`, `OpenAsset`, `CloseAsset`, `ReloadBlueprintFromDisk`, `DeleteAsset`, `RenameAsset`, `DuplicateAsset`, `CaptureGraphScreenshot` |

Capabilities include:

- Stable, bounded pagination for large asset, member, graph, and pin queries.
- Node IDs returned by the Action Registry, with no invented node types.
- Single-transaction graph patches for creation, connection, disconnection, removal, movement, defaults, and layout. Failures trigger an automatic rollback attempt; the response explicitly reports rollback failure.
- Three deterministic layout styles: `Balanced`, `Straight`, and `Compact`.
- Protection of native Comment Box containment in local and whole-graph layouts.
- Dry-run impact analysis and explicit approval requirements for high-risk edits.
- Transaction rollback and single-step Undo within Unreal's supported scope.
- Explicit persistence: ordinary edits only mark assets dirty. `SaveAsset` writes to disk; `DeleteAsset` explicitly deletes disk assets after stricter checks.
- Automatic discovery and loading from the engine directory without a project declaration.

## Concepts: choose the right editing target

These objects often appear next to each other in Unreal Editor, but they represent different state. Choosing the wrong tool may produce a successful call whose effect appears somewhere other than you expected.

| Editing target | Meaning and tool | Distinct from |
|---|---|---|
| Variable default | The declaration default of a member variable declared by this Blueprint. Use `ModifyVariable` with `DefaultValue`. | Node-pin literals and overrides on existing level instances. |
| Function parameter / pin | Parameters on function Entry/Result nodes form the function signature; use `ModifyFunctionSignature`. Use `SetPinDefaults` for an input literal on an existing graph node. | Member-variable defaults. Connected input-pin defaults have no runtime effect. |
| Component-template property | A component template added to this Blueprint's SCS, such as `RelativeLocation` or `StaticMesh`. Use `SetComponentProperties`. | Class Defaults and component overrides on Actor instances in a scene. |
| Class Defaults | CDO defaults of the Blueprint-generated class, including editable inherited properties. Use `SetClassDefaults`. | Variable-declaration metadata edited by `ModifyVariable`, and current values on placed or spawned instances. |
| Blueprint parent class | The class inherited by the Blueprint class. Use `ReparentBlueprint`. | Parent-component relationships in the component tree. |
| Component hierarchy | SceneComponent attachment hierarchy within one Actor Blueprint. Use `ReparentComponent`, or `SetRootComponent` for the local root. | Blueprint class inheritance. |

## Complete tool reference (55 tools)

Ordinary editing tools only mark assets dirty; they do not silently save. Use `SaveAsset` to keep changes. The table describes each tool's purpose and the limits that affect its use.

| Tool | What it does | Important notes |
|---|---|---|
| `ListBlueprints` | Finds project Blueprint assets with pagination. | Use `PathFilter` and pagination to narrow large projects. |
| `GetBlueprintOverview` | Shows the Blueprint parent, graphs, variables, components, and interfaces. | Provide an exact `BlueprintPath`. |
| `ListBlueprintMembers` | Lists functions, events, dispatchers, and local variables by page. | Use pagination for large Blueprints. |
| `GetGraphDetail` | Shows nodes, pins, links, and layout in the selected graph. | Use `GraphName` to select a graph. |
| `SearchGraphNodes` | Finds creatable nodes by English action name. | Create nodes only with returned `SpawnerId` values. |
| `GetCompileErrors` | Retrieves current Blueprint compilation diagnostics. | Use it to handle errors or warnings reported by the editor. |
| `CreateUserDefinedStruct` | Creates a User Defined Struct under `/Game`. | Does not save automatically. |
| `GetUserDefinedStruct` | Shows Struct field definitions. | Read large Structs with pagination. |
| `ModifyUserDefinedStruct` | Adds, edits, or removes Struct fields. | Start with `bDryRun`; potential data loss requires explicit approval. |
| `CreateUserDefinedEnum` | Creates a User Defined Enum under `/Game`. | Does not save automatically. |
| `GetUserDefinedEnum` | Shows Enum entries, values, and display names. | Read large Enums with pagination. |
| `ModifyUserDefinedEnum` | Adds, edits, or removes Enum entries. | Start with `bDryRun`; changing serialized meaning requires explicit approval. |
| `AddVariable` | Adds a Blueprint member variable. | Requires a Blueprint path, variable name, and `TypeName`. |
| `ModifyVariable` | Changes member-variable type, default, name, editability, category, or tooltip. | Referenced variables cannot change type; RepNotify variables cannot be renamed here. |
| `RemoveVariable` | Removes a member variable. | References or an inability to recover safely block removal. |
| `CreateFunction` | Creates a Blueprint function and its parameters. | Requires a Blueprint path, function name, and parameter definitions. |
| `RenameFunction` | Renames a user function and updates references that can be updated safely. | Start with dry-run; reference updates require explicit approval. |
| `ModifyFunctionSignature` | Adds, renames, removes, or changes the type of a function parameter. | Defaults to dry-run; removal or type changes may lose data and require explicit approval. |
| `RemoveFunction` | Removes a user function. | References or an inability to recover safely block removal. |
| `CreateCustomEvent` | Creates a Custom Event in an Event Graph. | The target must be an actual Event Graph. |
| `AddEventNode` | Adds a supported event node. | Specify the Blueprint and event type. |
| `AddBoundEvent` | Adds a bound event for a component or delegate. | The component and delegate must be resolvable. |
| `AddLocalVariable` | Adds a local variable to a function graph. | Requires a function name, variable name, and type. |
| `RemoveLocalVariable` | Removes a function-local variable. | References or an inability to recover safely block removal. |
| `AddNodePin` | Adds a pin to a node that supports variable pin counts. | Obtain the target node identifier from graph details first. |
| `RemoveNodePin` | Removes an editable user pin from a node. | Locate the exact target pin. |
| `AddInterface` | Adds an interface to a Blueprint. | Use the interface class path. |
| `AddEventDispatcher` | Adds an Event Dispatcher. | Specify its name and signature. |
| `RemoveEventDispatcher` | Removes an Event Dispatcher. | References or an inability to recover safely block removal. |
| `ApplyGraphPatch` | Creates, connects, disconnects, removes, and moves nodes, sets defaults, and lays out the graph in one operation. | Search for nodes first. Supports dry-run and attempts rollback on failure. |
| `SetPinDefaults` | Changes input-pin literals on existing nodes. | Connected input pins ignore their literals at runtime. |
| `FormatGraph` | Organizes graph layout using `Balanced`, `Straight`, or `Compact`. | Select a graph or a layout scope. |
| `AddCommentBox` | Adds a native Comment Box. | Specify text and bounds or target nodes. |
| `GetComponents` | Shows an Actor Blueprint's component tree, parents, and template information. | Applies only to Actor Blueprints. |
| `AddComponent` | Adds a local SCS component. | Specify the component class, name, and optional parent component. |
| `SetComponentProperties` | Changes local SCS component-template properties. | Use UE-text values; an invalid property rolls back the whole edit. |
| `RenameComponent` | Renames a local SCS component and updates member references. | The new name must be unique. |
| `RemoveComponent` | Removes a component. | References or an inability to recover safely block removal. |
| `ReparentComponent` | Moves a local SceneComponent below another SceneComponent. | Cannot create cycles; use SetRootComponent for an actual local root. |
| `SetRootComponent` | Makes a local SceneComponent the root. | The target must be a local SceneComponent. |
| `DuplicateComponent` | Duplicates a local component and its template properties. | The actual local scene root cannot be duplicated. |
| `GetComponentProperties` | Reads editable component-template properties by page. | Supply the Blueprint path, component name, and pagination parameters. |
| `GetClassDefaults` | Reads editable CDO defaults by page. | Page through large property sets. |
| `SetClassDefaults` | Changes Blueprint CDO defaults, including inherited properties. | Property names are case-sensitive; values use UE text. |
| `CreateBlueprint` | Creates a supported Blueprint asset. | Supply the asset path and parent class; creation does not save automatically. |
| `ReparentBlueprint` | Changes a Blueprint's parent class. | Start with `bDryRun`; hierarchy or interface conflicts may require `bAllowPotentialDataLoss`. |
| `CompileBlueprint` | Compiles the selected Blueprint and returns diagnostics. | Use it to handle errors or warnings reported by the editor. |
| `SaveAsset` | Explicitly saves the asset's current changes to disk. | Ordinary edits do not save automatically. |
| `OpenAsset` | Opens a Blueprint in the editor. | Required before capturing its graph. |
| `CloseAsset` | Closes the asset editor. | Save changes you want to keep before closing. |
| `ReloadBlueprintFromDisk` | Replaces the in-memory Blueprint with its disk version. | Defaults to dry-run; discarding unsaved changes requires explicit approval. |
| `DeleteAsset` | Deletes an asset. | Deletion has stricter reference and recovery-safety checks. |
| `RenameAsset` | Renames or moves an asset. | Specify source and destination paths. |
| `DuplicateAsset` | Duplicates an asset. | Specify source and destination paths. |
| `CaptureGraphScreenshot` | Captures an open Blueprint graph. | Call `OpenAsset` first; the graph widget must be initialized. |

## Focused guides: defaults, signatures, components, and inheritance

## Recommended workflow

For writes that change structure or data:

1. Locate the target asset, graph, pin, member, or component.
2. Search with `SearchGraphNodes` to obtain a valid `SpawnerId`.
3. Preview with `bDryRun=true` where supported. Check affected assets, normalized operations, restrictions, and blockers.
4. Apply using returned identifiers. Do not invent a `SpawnerId`.
5. Call `SaveAsset` only when you want to keep the changes.

Dry-run cannot display every generated pin, type promotion, or final layout. This preview limitation does not mean the tool writes automatically. Use a `SpawnerId` from the current search results before writing.

## Asset lifecycle

Asset tools create, duplicate, rename, reparent, compile, open, close, reload, delete, and save supported Blueprint assets.

- Reloading from disk defaults to dry-run and requires explicit approval before discarding in-memory state.
- Destructive deletion has stricter Undo/Redo and Package safety requirements than ordinary graph edits.

## Settings

Open **Project Settings → Plugins → MCP Blueprint**:

- **Port**: defaults to `8766`; if occupied, tries up to nine subsequent ports.
- **Auto Start**: starts the server with the editor.
- **Auto Compile After Modify**: compiles automatically after supported writes.
- **Request Timeout Seconds**: timeout for ordinary tools.
- **Compile Timeout Seconds**: separate timeout for compilation tools.

## Current limits

- Supports Windows, macOS, and Linux Editor; no Runtime/Shipping module is provided.
- There is currently no generic tool to invoke an arbitrary Blueprint function and return its runtime result.
- Custom Event and Event Dispatcher signature editing is less complete than ordinary function signature editing.
- Blueprint Actions that cannot be handled safely cause the operation to be rejected.
- Screenshots require an initialized Blueprint Graph Editor widget.

## Troubleshooting

- **Cannot connect:** use the actual endpoint in the toolbar; the configured port may be occupied.
- **Missing tool:** refresh `tools/list` instead of relying on an old cache.
- **Write rejected:** read every blocker and approval-parameter requirement, then read the target again before retrying.
- **Compilation failed:** obtain compiler diagnostics and fix the reported Blueprint errors before saving.
- **Unexpected graph result:** compare `GetGraphDetail` before and after; use Undo where applicable.
- **Plugin requests a rebuild:** install a package matching the exact engine minor version.
- **Plugin missing from the project:** check that it is installed under that engine's `Engine/Plugins/Marketplace`. Do not work around this by adding a project dependency.
- **UE 5.5 reports an outdated project file because the installed MCPBlueprint is absent from the project descriptor:** choose **Not Now**. The engine plugin still loads automatically. **Update** adds MCPBlueprint to the project's `.uproject`, creating the project-side dependency this installation model explicitly avoids.

## Support

For questions or feedback, use the [contact page](https://mzsh.me/contact/).
