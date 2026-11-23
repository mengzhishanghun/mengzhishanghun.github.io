---
title: Analyze Widget Performance
type: doc
slug: mcp-umg-widget-performance
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
documentKind: product-manual
websiteRoute: /en/works/mcp-umg/docs/widget-performance/
lang: en
translationKey: doc:mcp-umg:widget-performance
sourceHash: 97590740dbb486f8791f8663c1351b23a1c95876fe1f3ba4df7ef4dcdcdf9b94
translationStatus: translated
generatedBodyHash: 7b476ca442d635c34d9f67cb311cb3c0f67029af9e9e8939cb8e62e775e69505
docPage:
  work: mcp-umg
  group: features
  slug: widget-performance
  order: 17
---

## Sample Slate CPU work and capture a Trace

If you are unsure where to look, start with the design-time tree depth and binding counts. If you can reproduce a slowdown in PIE, sample when it occurs. Keep the page state and actions consistent when comparing two measurements.

`InspectWidgetPerformance` reads design-time structural complexity and cannot replace runtime measurement. `MeasureWidgetPerformance` requires `RuntimeInstanceToken` and `RequestId`. Optional parameters are `Frames` (default 30, maximum 120) and `MaxNodes` (default 100, maximum 500). It aggregates per-Widget **inclusive GameThread CPU** time from actual Slate paint, invalidation and update events. This is neither exclusive time nor GPU time. Query the results with the returned `OperationId`.

`CaptureWidgetTrace` applies only to PIE instances with a cached Slate Widget. It requires `RuntimeInstanceToken` and `RequestId`; optional `DurationSeconds` defaults to 3 and ranges from 0.1 to 10 seconds. It starts a process-wide native Slate Trace and will not take over an existing Trace that is running or finishing. After completion, use `GetRuntimeOperation` to inspect `Data.TraceStatus`, `TracePath`, actual byte count and cleanup state. The Trace includes the entire process; filter by the returned target Slate Widget ID in Unreal Insights. It is not exclusive Widget timing or GPU timing. A file is retained only after it is closed and is no larger than **16 MiB**. Oversized or cancelled captures are discarded. `CleanupPending` / `CleanupUnconfirmed` means the file cannot yet be treated as a usable result.

## Check design-time widget tree complexity

`InspectWidgetPerformance` reads only the design-time WidgetTree of one Widget Blueprint and summarizes structural indicators that may affect UI complexity. It does not create Widgets, enter PIE, compile, save or modify assets.

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` is the required Widget Blueprint asset path. Optional `MaxWidgets` defaults to `500` and must be a JSON integer from `1` to `1000`. Fractions, strings and booleans are rejected. If you see `bTruncated: true`, the totals cover only the nodes visited before the limit, not the entire tree.

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
