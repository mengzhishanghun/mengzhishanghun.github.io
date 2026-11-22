---
title: Preview UI and Diagnose Runtime Behavior
type: doc
slug: mcp-umg-preview-runtime
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/preview-runtime/
lang: en
translationKey: doc:mcp-umg:preview-runtime
sourceHash: 9e9eaaece16d1046d83e917b9ebf8207caeec6e48d53eb702395a5f68b4daa8e
translationStatus: translated
generatedBodyHash: 08ce2b0bceca96744d502f2ee44c116cfe503c09e868b86d8e036ccbeaf58506
docPage:
  work: mcp-umg
  group: workflows
  slug: preview-runtime
  order: 4
---

## Preview

### CaptureWidgetPreview

List samples use temporary asset copies, without passing the original assets directly to list entries. External resources referenced by those copies may still be shared. Widget lifecycles and list callbacks can run project code; this is not a script sandbox. Business logic used for previews should have no side effects.

`CaptureWidgetPreview` creates a fresh temporary instance of a compiled Widget Blueprint, applies preview-only data and returns an off-screen PNG. It is a design preview, not a screenshot of the running game's Widget.

The tool does not edit or save the Widget Blueprint, its WidgetTree or existing PIE/Game instances, nor modify assets supplied as list samples. It does not compile the Blueprint either. Compile explicitly first and ensure its status is `UpToDate`.

#### Parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `BlueprintPath` | Yes | Widget Blueprint asset path. |
| `Width`, `Height` | Yes | Positive integer pixels, each at most 4096, with a product no greater than 8 MP. |
| `InstanceProperties` | No | Editable properties on the temporary `UUserWidget` instance, formatted as `{ "Property": "UE text format" }`. |
| `WidgetOverrides` | No | Up to 64 `{ "name": "WidgetName", "properties": { ... } }` entries; properties affect only the corresponding Widget in the temporary tree. |
| `ListSamples` | No | Up to 64 `{ "name": "ListWidgetName", "items": ["/Game/...Asset.Asset"] }` entries; data binds only to temporary ListView/TileView/TreeView widgets. At most 100 items per list and 200 per call; empty lists are allowed. |
| `AnimationName`, `TimeSeconds` | No | Must be supplied together. Time is a non-negative absolute timeline time within the MovieScene playback range, not an offset from the start of the animation. |

Every `WidgetOverrides` entry requires non-empty `properties`. Widget names in `WidgetOverrides` and list names in `ListSamples` must each be unique within their respective arrays. Duplicate asset paths within a list are rejected. Values in each `properties` map use Unreal text format, following the same rules as `SetWidgetProperties`.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "Width": 1280,
  "Height": 720,
  "InstanceProperties": { "Title": "预览背包" },
  "WidgetOverrides": [
    { "name": "TitleText", "properties": { "RenderOpacity": "0.8" } }
  ],
  "ListSamples": [
    { "name": "ItemList", "items": ["/Game/Items/DA_Sword.DA_Sword"] },
    { "name": "EmptyStateList", "items": [] }
  ]
}
```

The response explicitly reports `PreviewState: TemporaryNewInstance`, `RuntimeState: NotRuntime`, `ProductionState: Unchanged` and `SaveStatus: NotSaved`, with the PNG. It also returns the actual RenderTarget dimensions, pixel count, two layout renders, and counts of applied Widget overrides and list samples.

When an animation is specified, the tool samples visual tracks on a temporary animation copy with a silent MovieScene evaluator, removes event tracks and returns the quantized `ActualTimeSeconds`. Supported visual tracks include Float, Bool, Enum, Color, 2D Transform, Margin and Widget Material. Other tracks cannot serve as arbitrary script execution. This mechanism does not prevent project code in Widget Construct or list callbacks from running.

For Widget Material animation, the tool creates a separate dynamic material instance (MID) for each material location actually used by the track, copies the original instance's parameter overrides and replaces only the corresponding Brush on the temporary Widget. Sampling does not modify shared source MIDs or other Widgets. The Brush must use a valid MID with a valid parent material that is not itself an MID. MIDs with runtime virtual texture, sparse volume texture, texture collection or parameter collection overrides cannot be copied completely, so these previews are rejected.

Creating any `UUserWidget` enters its Blueprint construction lifecycle. The tool does not call project-specific initialization methods or arbitrary Blueprint functions, but user-authored Construct code may itself have side effects. It therefore cannot promise that every Blueprint behaves as a pure function.

## RuntimeWorkflow

### Runtime interaction and diagnostics

These tools operate on existing PIE/Game `UUserWidget` instances. Run the target page first, then find its instances with `BlueprintPath` in `ListRuntimeWidgets`. The returned `Instances[].RuntimeInstanceToken` binds to the current Widget, World, session and local player. Obtain a new token after restarting PIE or recreating the Widget. `InstanceIndex` remains available for older read-only inspections, but cannot replace a token in tools that require one. Tokens identify targets; they are not authentication.

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","Offset":0,"MaxItems":32}
```

`InspectWidgetRuntime` uses `RuntimeInstanceToken` to read a named child widget (`WidgetName`) or page through the running WidgetTree using `Offset` and `MaxItems`. `MaxItems` defaults to 100 and has a maximum of 200. Inspect the target widget and window state before sending input.

#### Input, lists and operation IDs

`InteractWithWidget` requires `RuntimeInstanceToken`, an exact `WidgetName`, `Action` and a caller-generated `RequestId`. `Action` is `Click`, `Wheel`, `Text`, `Drag`, `DragDrop` or `Navigate`. Depending on the action, supply `WheelDelta`, `Text`, normalized endpoint `EndX`/`EndY`, `DropWidgetName`, or `Direction` and optional `Device`. Text is limited to 1 to 128 printable BMP characters. IME, control characters and clipboard input are not supported. Input goes to the target runtime window; confirm that it is the intended page before execution.

`ControlWidgetList` requires `RuntimeInstanceToken`, `ListName` and `Action`. Start with `Action: "Snapshot"` to obtain list-item `ItemToken` values. You can then `Select`, `AddSelection`, `Deselect`, `ClearSelection`, `ScrollIntoView`, `Expand` or `Collapse`. For ScrollBox, use `ScrollWidgetIntoView` with `TargetWidgetName`. All actions except `Snapshot` require `RequestId`; all except `Snapshot` and `ClearSelection` require an `ItemToken` from the snapshot.

Use a new `RequestId` for each new action, and reuse it only when retrying the exact same request. Reuse with conflicting parameters is rejected. Tools that return `OperationId` after starting can be queried with `GetRuntimeOperation` for `Status`, `Data` and errors. Status may be `Pending`, `Completed`, `Failed`, `Cancelled`, `TimedOut` or `Invalidated`; expired or unrecognized IDs return `Unknown`. `CancelRuntimeOperation` accepts only a pending `OperationId`. Cancellation may still require cleanup; `bCleanupPending` means the final state has not been confirmed. Continue querying until it finishes. Completed results are retained briefly, so do not treat `OperationId` as a permanent record.

#### Performance sampling and Trace

`InspectWidgetPerformance` reads design-time structural complexity and cannot replace runtime measurement. `MeasureWidgetPerformance` requires `RuntimeInstanceToken` and `RequestId`. Optional parameters are `Frames` (default 30, maximum 120) and `MaxNodes` (default 100, maximum 500). It aggregates per-Widget **inclusive GameThread CPU** time from actual Slate paint, invalidation and update events. This is neither exclusive time nor GPU time. Query the results with the returned `OperationId`.

`CaptureWidgetTrace` applies only to PIE instances with a cached Slate Widget. It requires `RuntimeInstanceToken` and `RequestId`; optional `DurationSeconds` defaults to 3 and ranges from 0.1 to 10 seconds. It starts a process-wide native Slate Trace and will not take over an existing Trace that is running or finishing. After completion, use `GetRuntimeOperation` to inspect `Data.TraceStatus`, `TracePath`, actual byte count and cleanup state. The Trace includes the entire process; filter by the returned target Slate Widget ID in Unreal Insights. It is not exclusive Widget timing or GPU timing. A file is retained only after it is closed and is no larger than **16 MiB**. Oversized or cancelled captures are discarded. `CleanupPending` / `CleanupUnconfirmed` means the file cannot yet be treated as a usable result.

Runtime operations do not save Widget Blueprints. Design changes still require an explicit call to the appropriate save tool. Use `tools/list` from the current editor for available capabilities and parameters.

## PreviewMatrix

### CaptureWidgetPreviewMatrix

`CaptureWidgetPreviewMatrix` generates design-preview PNGs for `States × Sizes`. Every cell creates a fresh temporary Widget instance so states do not contaminate each other. Results are sorted by state name and size name; `Cells[].PngIndex` indexes the returned image array.

`States` and `Sizes` are required and non-empty. Their Cartesian product is limited to 16 cells and 32 MP in total. Each image still has the `CaptureWidgetPreview` limits of 4096 pixels per side and 8 MP. Each state can include the `InstanceProperties`, `WidgetOverrides` and `ListSamples` options already supported by `CaptureWidgetPreview`.

`ListSamples.items` supports safe top-level asset path strings or dynamic samples in the form `{ "class": "...", "properties": { ... } }`. Dynamic classes must be non-abstract, non-deprecated subclasses of `UDataAsset` or `UCurveBase` with `Within=UObject`. Actor, ActorComponent, World, GameInstance, Subsystem and similar types are rejected. `UDataAsset` itself is abstract; supply a concrete project subclass or use `/Script/Engine.CurveFloat`. Properties are validated against the CDO before `NewObject` creates the object in the transient package. The tool does not call arbitrary functions, save objects or write business assets. Existing samples are copied into the transient package for each cell, preventing entry logic from directly modifying source assets or sharing one instance across states.

This isolation is not recursive. The tool cannot prevent effects through external asset references or side effects that Widget Construct/list-entry code produces in external systems.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "States": [
    { "name": "empty", "ListSamples": [{ "name": "ItemList", "items": [] }] },
    { "name": "populated", "ListSamples": [{ "name": "ItemList", "items": ["/Game/Items/DA_Sword.DA_Sword"] }] },
    { "name": "curve", "ListSamples": [{ "name": "ItemList", "items": [{ "class": "/Script/Engine.CurveFloat" }] }] },
    { "name": "disabled", "WidgetOverrides": [{ "name": "BuyButton", "properties": { "bIsEnabled": "False" } }] }
  ],
  "Sizes": [
    { "name": "phone", "width": 390, "height": 844 },
    { "name": "desktop", "width": 1280, "height": 720 }
  ]
}
```

This remains a `TemporaryNewInstance` design preview and does not represent PIE/Game runtime state. Animation time parameters are not currently accepted, to avoid reporting unevaluated animation frames as screenshot results across UE versions.

## Performance

### Widget performance structure diagnostics

`InspectWidgetPerformance` reads only the design-time WidgetTree of one Widget Blueprint and summarizes structural indicators that may affect UI complexity. It does not create Widgets, enter PIE, compile, save or modify assets.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` is the required Widget Blueprint asset path. Optional `MaxWidgets` defaults to `500` and must be a JSON integer from `1` to `1000`. Fractions, strings and booleans are rejected. Reaching the limit returns `bTruncated: true`, meaning the statistics cover only the traversed prefix, not the entire tree.

#### Returned data

- `MeasurementStatus` is always `AuthoredIndicatorsOnly`: results are indicators of the authored structure, not measured performance.
- `WidgetsAnalyzed`, `MaxDepth` and `WidgetClassCounts`: analyzed node count, maximum tree depth and widget class counts.
- `PanelComplexity`: Canvas Panel and Overlay instance counts and the largest number of direct children in any single container of each type.
- `PropertyBindingCount`: number of property binding entries in the Widget Blueprint.
- `VolatileWidgetCount`, `RetainerBoxCount`, `InvalidationBoxCount`, `ListViewCount`: counts of the corresponding widgets or flags.
- `bCycleDetected`: `true` when a Widget appears again on the current recursion path. The tool stops that path to avoid unbounded traversal.
- `bDuplicateReferenceDetected`: `true` when an already-counted Widget is reachable through another path. Shared references are deduplicated and are not misreported as cycles.
- `bTruncated`: `true` when the analyzed node count reaches `MaxWidgets`.

These indicators do not report milliseconds, CPU, GPU, memory, Slate Tick/Paint cost or actual runtime invalidation behavior. They help identify structures worth investigating, such as deep hierarchies, many direct children, excessive bindings or volatile widgets. To sample running Widgets, use `MeasureWidgetPerformance`; for a bounded native Trace, use `CaptureWidgetTrace` and follow the target and cleanup rules in the [runtime workflow](#runtimeworkflow). Use Unreal Insights for further analysis and Widget Reflector to inspect actual Slate hierarchy, invalidation and painting behavior.
