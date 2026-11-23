---
title: 分析 Widget 性能
type: doc
slug: mcp-umg-widget-performance
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: features
  slug: widget-performance
  order: 17
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/widget-performance/
lang: zh
translationKey: doc:mcp-umg:widget-performance
---

## 测量 Slate CPU 工作并捕获 Trace

如果还不知道该检查哪里，可以先看设计态的树深度和绑定数量。如果已能在 PIE 复现卡顿，就在问题出现时取样。比较两次测量时，尽量保持页面状态和操作一致。

`InspectWidgetPerformance` 读取设计态结构复杂度，不能代替运行时测量。`MeasureWidgetPerformance` 必填 `RuntimeInstanceToken`、`RequestId`；可设 `Frames`（默认 30，最大 120）和 `MaxNodes`（默认 100，最大 500）。它汇总实际 Slate paint、invalidation、update 事件的逐 Widget **包含式 GameThread CPU** 时间，不是独占时间或 GPU 时间。用返回的 `OperationId` 查询结果。

`CaptureWidgetTrace` 仅用于有缓存 Slate Widget 的 PIE 实例，必填 `RuntimeInstanceToken`、`RequestId`，`DurationSeconds` 可选（默认 3，范围 0.1–10 秒）。它启动进程级原生 Slate Trace；已有 Trace 正在运行或收尾时不会接管。结束后用 `GetRuntimeOperation` 查看 `Data.TraceStatus`、`TracePath`、实际字节数及清理状态。Trace 包含整个进程，需在 Unreal Insights 中按返回的目标 Slate Widget ID 过滤；它不是该 Widget 的独占或 GPU 计时。文件最终仅在已关闭且不超过 **16 MiB** 时保留，超限或取消会丢弃；`CleanupPending` / `CleanupUnconfirmed` 表示还不能把文件当成可用结果。

## 从设计态 Widget 树检查复杂度

`InspectWidgetPerformance` 只读取一个 Widget Blueprint 的设计态 WidgetTree，并汇总可能影响 UI 复杂度的结构性信号。它不会创建 Widget、进入 PIE、编译、保存或修改资产。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` 为必填 Widget Blueprint 资产路径。`MaxWidgets` 可选，默认 `500`，必须是 `1` 到 `1000` 的 JSON 整数；不接受小数、字符串或布尔值。如果看到 `bTruncated: true`，统计只包括达到上限前走过的节点，不能当作整棵树的总数。

### 结构检查的返回值

- `MeasurementStatus` 固定为 `AuthoredIndicatorsOnly`，说明结果是已编辑结构的信号，不是实测性能。
- `WidgetsAnalyzed`、`MaxDepth` 与 `WidgetClassCounts`：已分析节点数、最大树深度和控件类计数。
- `PanelComplexity`：Canvas Panel 与 Overlay 的实例数，以及各自单个容器的最大直接子控件数。
- `PropertyBindingCount`：Widget Blueprint 中的属性绑定条目数。
- `VolatileWidgetCount`、`RetainerBoxCount`、`InvalidationBoxCount`、`ListViewCount`：对应控件或标记的实例数。
- `bCycleDetected`：Widget 在当前递归路径中再次出现时为 `true`。工具会停止该路径，避免循环导致无界遍历。
- `bDuplicateReferenceDetected`：已经统计过的 Widget 又从另一条路径可达时为 `true`。共享引用会去重，不会被误报为循环。
- `bTruncated`：分析节点达到 `MaxWidgets` 时为 `true`。

这些指标不能给出毫秒、CPU、GPU、内存、Slate Tick/Paint 开销或实际运行时失效行为。它们用于找出值得进一步观察的结构，例如过深的层级、大量直接子控件、过多绑定或易失控件。需要在运行中的 Widget 上取样时，使用 `MeasureWidgetPerformance`；需要有限时长的原生 Trace 时，使用 `CaptureWidgetTrace`，并遵循[运行时工作流](/zh/works/mcp-umg/docs/runtime-diagnostics/#找到目标运行时实例)中的目标与清理规则。进一步分析可使用 Unreal Insights；检查实际 Slate 层级、无效化和绘制行为可使用 Widget Reflector。
