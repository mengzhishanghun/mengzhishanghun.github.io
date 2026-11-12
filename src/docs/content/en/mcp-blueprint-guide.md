---
title: MCPBlueprint User Guide
description: Installation, connection, tools and limitations of MCPBlueprint
type: doc
slug: mcp-blueprint-guide
categoryId: ue-plugins
categoryName: UE plugins
categoryOrder: 0
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
documentKind: product-manual
websiteRoute: /docs/zh/guides/ue-tools/mcp-blueprint-guide/
lang: en
translationKey: mcp-blueprint-guide
sourceHash: 281136d72dec36c917f468b3866e04302f489e4afa36ffb00e1245e86f4f1293
translationStatus: translated
generatedBodyHash: 3e4d5f6e9476a6fbbace4b69cf58969989851e764c6e0f043f5417302e210e8b
---

# MCPBlueprint user guide

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

### 1. `ModifyVariable`: declaration defaults and node values

Use `GetBlueprintOverview` to find a member variable declared by this Blueprint. Supply only the fields to change: `TypeName`, `DefaultValue`, `NewName`, `bInstanceEditable`, `Category`, or `Tooltip`. `DefaultValue` uses UE text; an empty `Category` restores Unreal's default category, and an empty `Tooltip` removes its metadata. Referenced variables cannot change type, and RepNotify variables cannot be renamed through this tool. Use `SaveAsset` when you want to keep the change.

### 2. `ModifyFunctionSignature`: function parameters and node pins

Use `GetGraphDetail` to find the function graph and required Entry/Result identifiers; do not substitute display names. Choose one operation: `AddInput`, `AddOutput`, `RenamePin`, `RemovePin`, or `ChangePinType`. The default is `bDryRun=true`; reference updates require `bApproveReferenceUpdates=true`. Parameter removal or type changes also require `bAllowPotentialDataLoss=true`. The tool updates call sites that can be handled safely and attempts rollback on failure. It does not save automatically.

### 3. `SetPinDefaults`: literals on unconnected input pins

Obtain the target node identifier from `GetGraphDetail` and provide a nonempty `PinDefaults` map, for example `{"Duration": "2.0", "InString": "Hello"}`. Object/Class pins require full object paths. This tool does not change nodes, connections, or graph structure. A connected input ignores its default at runtime. Use `ApplyGraphPatch` for structural changes.

### 4. `SetComponentProperties`: SCS template properties

Use `GetComponents` to find the local SCS `ComponentName`. Supply `Properties` as a map of property names to UE-text values, for example `RelativeLocation: "(X=0,Y=0,Z=50)"` or `bHiddenInGame: "True"`. The tool edits only component templates added by this Blueprint. An invalid property rolls back the whole call and reports the property name with a format hint. Save separately with `SaveAsset` when needed.

### 5. `SetClassDefaults`: CDO defaults and inherited properties

Use `GetClassDefaults` to find editable, case-sensitive reflected property names. Supply a UE-text `Properties` map, such as `bReplicates: "True"` or `JumpMaxCount: "2"`. This changes the Blueprint CDO defaults used by future placed or spawned instances without overrides; it does not retroactively replace existing instance values. It can also access properties inherited from a C++ or Blueprint parent, which `ModifyVariable` cannot edit as declarations. Use `SaveAsset` when you want to keep the change.

### 6. `ReparentBlueprint` and `ReparentComponent`: class and component parents

`ReparentBlueprint` changes class inheritance. Supply `NewParentClassPath` as a full native path, a unique loaded short name, or a Blueprint-generated class. Start with `bDryRun=true` to inspect the risks. Explicit `bAllowPotentialDataLoss=true` is required if the new parent is not a subclass of the old parent, the old parent is missing, or interfaces conflict. The tool refreshes graphs and attempts Undo rollback on failure.

`ReparentComponent` changes the attachment tree of local SceneComponents within the same Actor Blueprint. Supply the component name and new `NewParentName`. A component cannot attach to itself or a descendant, and non-SceneComponents cannot be reparented. Use `SetRootComponent` for the actual local root.

## Recommended workflow

For writes that change structure or data:

1. Locate the target asset, graph, pin, member, or component.
2. Search with `SearchGraphNodes` to obtain a valid `SpawnerId`.
3. Preview with `bDryRun=true` where supported. Check affected assets, normalized operations, restrictions, and blockers.
4. Apply using returned identifiers. Do not invent a `SpawnerId`.
5. Call `SaveAsset` only when you want to keep the changes.

Dry-run cannot display every generated pin, type promotion, or final layout. This preview limitation does not mean the tool writes automatically. Use a `SpawnerId` from the current search results before writing.

## Tutorial: create a calculation function

This example creates:

```text
FinalScore = (BaseScore + Bonus) × Multiplier
```

1. Use `CreateBlueprint` to create an Actor Blueprint.
2. Use `CreateFunction` to add `CalculateScore` with three `double` inputs and one `double` output.
3. Use `GetGraphDetail` to find the new function's Entry and Result node identifiers.
4. Search this function graph for `Add` and `Multiply`, then use the returned `Operator:Add` and `Operator:Multiply` actions.
5. Preview an `ApplyGraphPatch` containing the two nodes and five data connections.
6. Apply the same patch with native `double` promotion and automatic `Balanced` layout.
7. Call `SaveAsset` if you want to keep the change.

The finished graph adds `BaseScore` and `Bonus`, then multiplies the result by `Multiplier` from left to right.

## Editor screenshots and business-rule changes

These Blueprint Editor examples show a calculation function, a complete business graph, and visible changes before and after rule edits. They illustrate how nodes, links, and defaults change.

### A standard graph example

`CalculateScore` adds `BaseScore` and `Bonus`, then multiplies the result by `Multiplier`.

![CalculateScore graph](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A1)

### A complete business workflow

`EvaluateOrderBatchV2` keeps order totals, discounts, shipping, tax, points, risk scoring, and the final result in one connected function graph.

![Order settlement graph](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A2)

### Change 1: free shipping for first orders in Region 1

Before the change, Region 1 always sets `ShippingCents = 1000`.

![Region 1 before](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A3)

After the change, a `FirstOrder` branch sets shipping to `0` for first orders and keeps `1000` for other orders.

![Region 1 after](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A4)

### Change 2: exclude shipping from points

Before the change: `PointsEarned = TotalCents / 100`.

![Points before](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A5)

After the change: `PointsEarned = (TotalCents - ShippingCents) / 100`. A new Subtract node excludes shipping.

![Points after](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A6)

### Change 3: replace a fixed first-order discount with 5% of subtotal

Before the change, the graph calculates `SubtotalCents × 0` and then adds `500`, always returning a fixed discount of `500`.

![Discount before](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A7)

After the change, `SubtotalCents / 20` produces a 5% discount.

![Discount after](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A8)

Before changing logic, use dry-run where supported to understand its impact. Explicitly approve reference updates or potential data loss when the tool requires it. Use `SaveAsset` to keep changes.

## Find assets and graphs

- Use `ListBlueprints` to find assets with pagination.
- Use `GetBlueprintOverview` to inspect graphs, variables, functions, components, interfaces, and the parent class.
- Use `ListBlueprintMembers` to inspect functions, Custom Events, Event Dispatchers, and local variables.
- Use `GetGraphDetail` to inspect nodes, pins, defaults, links, and layout.
- Use `GetCompileErrors` or `CompileBlueprint` to read editor diagnostics.

Use asset paths returned by the plugin. Page through large graphs to avoid returning too much content at once.

## Add graph logic safely

Search with Unreal's English action names, such as `Branch`, `For Loop`, `For Each Loop`, `Switch on Int`, `Switch on Name`, `Switch on String`, `Add`, `Subtract`, `Multiply`, or `Divide`.

`ApplyGraphPatch` supports:

- `Nodes` with temporary IDs and Action Registry `SpawnerId` values.
- `Connections` and `Disconnections`.
- `RemoveNodes` addressed by node identifiers.
- `MoveNodes` addressed by node identifiers and graph coordinates.
- Optional `PinDefaults`, `PromotedType`, layout scope, and layout style.

The entire patch uses one transaction and attempts automatic rollback on failure. If the tool reports recovery failure, stop editing and reopen the asset to inspect its current state before proceeding.

## Members, functions, Structs, and Enums

- Variable tools manage types, defaults, Category, Tooltip, and safe removal.
- Function tools create, rename, make supported signature changes, or safely remove user functions.
- Local-variable operations require function-graph and variable-declaration identifiers.
- Struct/Enum edits use field or entry identifiers and report reference impact.
- Operations that may lose data or change the meaning of serialized Enum values require separate explicit approval.

Function renames and signature edits analyze impact first. Unsafe overrides, Delegate bindings, derived classes, or references cause rejection before the edit.

### Function rename example

These two images show a function definition and its call site after renaming. Use dry-run before renaming and explicitly approve reference updates when required. Use `SaveAsset` to keep the change.

![Renamed function](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A9)

![Updated function caller](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A10)

### Functions, events, and bound events

These examples show a function with input and output parameters, a component-event helper function graph, and common structures for Actor lifecycle events, component-bound events, and variable pin counts.

![Function signature and connected implementation](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A11)

![Component-event helper graph](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A12)

![Actor lifecycle, bound component event, and variable-pin flow](/media-occurrence/doc%3Amcp-blueprint-guide%3Amedia%3A13)

## Components and class defaults

Read the current component hierarchy before adding, renaming, duplicating, reparenting, setting a root, editing template properties, or removing components. Class-default tools read or edit supported Blueprint defaults; instance values are not presented as class defaults.

## Asset lifecycle

Asset tools create, duplicate, rename, reparent, compile, open, close, reload, delete, and save supported Blueprint assets.

- Reloading from disk defaults to dry-run and requires explicit approval before discarding in-memory state.
- Destructive deletion has stricter Undo/Redo and Package safety requirements than ordinary graph edits.

## Capture graphs

Call `OpenAsset` before `CaptureGraphScreenshot`. Capture the full graph, focus on a node, or reuse a specified viewport. Check that titles, pins, and links are readable before sharing.

The screenshot tool requires an initialized Blueprint graph editor widget. It rejects requests when the graph editor is closed or its widget has zero size.

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
