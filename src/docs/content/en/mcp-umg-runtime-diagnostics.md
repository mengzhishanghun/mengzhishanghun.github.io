---
title: Inspect Runtime Instances and Interaction
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
sourceHash: 7a972aefb34a0978dcb97e07abb6254ae0a8a5e10779a3c712841dc3d9975ace
translationStatus: translated
generatedBodyHash: fdb7b29d8d7af5895a3fd62683f6171d18598ca8e259e7e9a0732986416d2f9b
docPage:
  work: mcp-umg
  group: features
  slug: runtime-diagnostics
  order: 16
---

## Find the target runtime instance

These tools operate on existing PIE/Game `UUserWidget` instances. Run the target page first, then find its instances with `BlueprintPath` in `ListRuntimeWidgets`. The returned `Instances[].RuntimeInstanceToken` binds to the current Widget, World, session and local player. Obtain a new token after restarting PIE or recreating the Widget. `InstanceIndex` remains available for older read-only inspections, but cannot replace a token in tools that require one. The token identifies the target instance. It does not authenticate the caller.

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","Offset":0,"MaxItems":32}
```

`InspectWidgetRuntime` uses `RuntimeInstanceToken` to read a named child widget (`WidgetName`) or page through the running WidgetTree using `Offset` and `MaxItems`. `MaxItems` defaults to 100 and has a maximum of 200. Inspect the target widget and window state before sending input.

## Input, lists, and operation status

To test a button, for example, read its state on the live page, send the action to that same instance, and watch for the expected change. If the request times out or the screen stays the same, check the existing operation and current instance before sending another action.

`InteractWithWidget` requires `RuntimeInstanceToken`, an exact `WidgetName`, `Action` and a caller-generated `RequestId`. `Action` is `Click`, `Wheel`, `Text`, `Drag`, `DragDrop` or `Navigate`. Depending on the action, supply `WheelDelta`, `Text`, normalized endpoint `EndX`/`EndY`, `DropWidgetName`, or `Direction` and optional `Device`. Text is limited to 1 to 128 printable BMP characters. IME, control characters and clipboard input are not supported. Input goes to the target runtime window; confirm that it is the intended page before execution.

`ControlWidgetList` requires `RuntimeInstanceToken`, `ListName` and `Action`. Start with `Action: "Snapshot"` to obtain list-item `ItemToken` values. You can then `Select`, `AddSelection`, `Deselect`, `ClearSelection`, `ScrollIntoView`, `Expand` or `Collapse`. For ScrollBox, use `ScrollWidgetIntoView` with `TargetWidgetName`. All actions except `Snapshot` require `RequestId`; all except `Snapshot` and `ClearSelection` require an `ItemToken` from the snapshot.

Use a new `RequestId` for each new action, and reuse it only when retrying the exact same request. Reuse with conflicting parameters is rejected. Tools that return `OperationId` after starting can be queried with `GetRuntimeOperation` for `Status`, `Data` and errors. Status may be `Pending`, `Completed`, `Failed`, `Cancelled`, `TimedOut` or `Invalidated`; expired or unrecognized IDs return `Unknown`. `CancelRuntimeOperation` accepts only a pending `OperationId`. Cancellation may still require cleanup; `bCleanupPending` means the final state has not been confirmed. Continue querying until it finishes. Completed results are retained briefly, so do not treat `OperationId` as a permanent record.

Runtime operations do not save Widget Blueprints. Design changes still require an explicit call to the appropriate save tool. Use `tools/list` from the current editor for available capabilities and parameters.
