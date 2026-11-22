---
title: Diagnose Runtime Interaction and Performance
type: doc
slug: mcp-umg-runtime-diagnostics
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/runtime-diagnostics/
lang: en
translationKey: doc:mcp-umg:runtime-diagnostics
sourceHash: 92b51b3a7d4e31f6d57aff428bf1e0b6826fabe182e7bea18bf76922931f5e34
translationStatus: translated
generatedBodyHash: 065b6f22f71e5c74308ec1ec3d895346864749782e521a68e389add1733d5768
docPage:
  work: mcp-umg
  group: preview-diagnostics
  slug: runtime-diagnostics
  order: 2
---

## Find the target runtime instance

These tools operate on existing PIE/Game `UUserWidget` instances. Run the target page first, then find its instances with `BlueprintPath` in `ListRuntimeWidgets`. The returned `Instances[].RuntimeInstanceToken` binds to the current Widget, World, session and local player. Obtain a new token after restarting PIE or recreating the Widget. `InstanceIndex` remains available for older read-only inspections, but cannot replace a token in tools that require one. These are target identifiers. They do not authenticate the caller.

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","Offset":0,"MaxItems":32}
```

`InspectWidgetRuntime` uses `RuntimeInstanceToken` to read a named child widget (`WidgetName`) or page through the running WidgetTree using `Offset` and `MaxItems`. `MaxItems` defaults to 100 and has a maximum of 200. Inspect the target widget and window state before sending input.

## Input, lists, and operation status

`InteractWithWidget` requires `RuntimeInstanceToken`, an exact `WidgetName`, `Action` and a caller-generated `RequestId`. `Action` is `Click`, `Wheel`, `Text`, `Drag`, `DragDrop` or `Navigate`. Depending on the action, supply `WheelDelta`, `Text`, normalized endpoint `EndX`/`EndY`, `DropWidgetName`, or `Direction` and optional `Device`. Text is limited to 1 to 128 printable BMP characters. IME, control characters and clipboard input are not supported. Input goes to the target runtime window; confirm that it is the intended page before execution.

`ControlWidgetList` requires `RuntimeInstanceToken`, `ListName` and `Action`. Start with `Action: "Snapshot"` to obtain list-item `ItemToken` values. You can then `Select`, `AddSelection`, `Deselect`, `ClearSelection`, `ScrollIntoView`, `Expand` or `Collapse`. For ScrollBox, use `ScrollWidgetIntoView` with `TargetWidgetName`. All actions except `Snapshot` require `RequestId`; all except `Snapshot` and `ClearSelection` require an `ItemToken` from the snapshot.

Use a new `RequestId` for each new action, and reuse it only when retrying the exact same request. Reuse with conflicting parameters is rejected. Tools that return `OperationId` after starting can be queried with `GetRuntimeOperation` for `Status`, `Data` and errors. Status may be `Pending`, `Completed`, `Failed`, `Cancelled`, `TimedOut` or `Invalidated`; expired or unrecognized IDs return `Unknown`. `CancelRuntimeOperation` accepts only a pending `OperationId`. Cancellation may still require cleanup; `bCleanupPending` means the final state has not been confirmed. Continue querying until it finishes. Completed results are retained briefly, so do not treat `OperationId` as a permanent record.

## Sample Slate CPU work and capture a Trace

`InspectWidgetPerformance` reads design-time structural complexity and cannot replace runtime measurement. `MeasureWidgetPerformance` requires `RuntimeInstanceToken` and `RequestId`. Optional parameters are `Frames` (default 30, maximum 120) and `MaxNodes` (default 100, maximum 500). It aggregates per-Widget **inclusive GameThread CPU** time from actual Slate paint, invalidation and update events. This is neither exclusive time nor GPU time. Query the results with the returned `OperationId`.

`CaptureWidgetTrace` applies only to PIE instances with a cached Slate Widget. It requires `RuntimeInstanceToken` and `RequestId`; optional `DurationSeconds` defaults to 3 and ranges from 0.1 to 10 seconds. It starts a process-wide native Slate Trace and will not take over an existing Trace that is running or finishing. After completion, use `GetRuntimeOperation` to inspect `Data.TraceStatus`, `TracePath`, actual byte count and cleanup state. The Trace includes the entire process; filter by the returned target Slate Widget ID in Unreal Insights. It is not exclusive Widget timing or GPU timing. A file is retained only after it is closed and is no larger than **16 MiB**. Oversized or cancelled captures are discarded. `CleanupPending` / `CleanupUnconfirmed` means the file cannot yet be treated as a usable result.

Runtime operations do not save Widget Blueprints. Design changes still require an explicit call to the appropriate save tool. Use `tools/list` from the current editor for available capabilities and parameters.

## Check design-time widget tree complexity

`InspectWidgetPerformance` reads only the design-time WidgetTree of one Widget Blueprint and summarizes structural indicators that may affect UI complexity. It does not create Widgets, enter PIE, compile, save or modify assets.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` is the required Widget Blueprint asset path. Optional `MaxWidgets` defaults to `500` and must be a JSON integer from `1` to `1000`. Fractions, strings and booleans are rejected. Reaching the limit returns `bTruncated: true`, meaning the statistics cover only the traversed prefix, not the entire tree.

### Structure inspection results

- `MeasurementStatus` is always `AuthoredIndicatorsOnly`: results are indicators of the authored structure, not measured performance.
- `WidgetsAnalyzed`, `MaxDepth` and `WidgetClassCounts`: analyzed node count, maximum tree depth and widget class counts.
- `PanelComplexity`: Canvas Panel and Overlay instance counts and the largest number of direct children in any single container of each type.
- `PropertyBindingCount`: number of property binding entries in the Widget Blueprint.
- `VolatileWidgetCount`, `RetainerBoxCount`, `InvalidationBoxCount`, `ListViewCount`: counts of the corresponding widgets or flags.
- `bCycleDetected`: `true` when a Widget appears again on the current recursion path. The tool stops that path to avoid unbounded traversal.
- `bDuplicateReferenceDetected`: `true` when an already-counted Widget is reachable through another path. Shared references are deduplicated and are not misreported as cycles.
- `bTruncated`: `true` when the analyzed node count reaches `MaxWidgets`.

These indicators do not report milliseconds, CPU, GPU, memory, Slate Tick/Paint cost or actual runtime invalidation behavior. They help identify structures worth investigating, such as deep hierarchies, many direct children, excessive bindings or volatile widgets. To sample running Widgets, use `MeasureWidgetPerformance`; for a bounded native Trace, use `CaptureWidgetTrace` and follow the target and cleanup rules in the [runtime workflow](/en/works/mcp-umg/docs/runtime-diagnostics/#find-the-target-runtime-instance). Use Unreal Insights for further analysis and Widget Reflector to inspect actual Slate hierarchy, invalidation and painting behavior.
