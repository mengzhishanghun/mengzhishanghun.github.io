---
title: 诊断运行时交互与性能
type: doc
slug: mcp-umg-runtime-diagnostics
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: preview-diagnostics
  slug: runtime-diagnostics
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/runtime-diagnostics/
lang: zh
translationKey: doc:mcp-umg:runtime-diagnostics
---

## 找到目标运行时实例

这些工具操作已经存在的 PIE/Game `UUserWidget` 实例。先运行目标页面，再用 `ListRuntimeWidgets` 的 `BlueprintPath` 查找实例；返回的 `Instances[].RuntimeInstanceToken` 绑定当前 Widget、World、会话和本地玩家。PIE 重启或 Widget 重建后重新取令牌。`InstanceIndex` 仍可用于旧版只读检查，但需要运行时令牌的工具不可用索引代替。令牌只用于定位目标，不提供身份认证。

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","Offset":0,"MaxItems":32}
```

`InspectWidgetRuntime` 使用 `RuntimeInstanceToken` 读取命名子控件（`WidgetName`），或用 `Offset`、`MaxItems` 分页读取运行中 WidgetTree；`MaxItems` 默认 100，最大 200。实际输入操作前，先检查目标控件和窗口状态。

## 输入、列表与操作进度

`InteractWithWidget` 必填 `RuntimeInstanceToken`、精确 `WidgetName`、`Action` 和调用者生成的 `RequestId`。`Action` 为 `Click`、`Wheel`、`Text`、`Drag`、`DragDrop` 或 `Navigate`；分别按需要提供 `WheelDelta`、`Text`、归一化终点 `EndX`/`EndY`、`DropWidgetName`，或 `Direction` 与可选 `Device`。文本限制为 1–128 个可打印 BMP 字符；此工具不提供 IME、控制字符或剪贴板输入。输入作用于目标运行时窗口，执行前请确认它正是要操作的页面。

`ControlWidgetList` 必填 `RuntimeInstanceToken`、`ListName` 和 `Action`。先用 `Action: "Snapshot"` 取得列表项 `ItemToken`；随后可 `Select`、`AddSelection`、`Deselect`、`ClearSelection`、`ScrollIntoView`、`Expand`、`Collapse`，或对 ScrollBox 使用 `ScrollWidgetIntoView` 与 `TargetWidgetName`。除 `Snapshot` 外，修改操作需要 `RequestId`；除 `Snapshot`、`ClearSelection` 外，需要快照中的 `ItemToken`。

每个新动作使用新的 `RequestId`；仅在重试完全相同的请求时复用。参数冲突的复用会被拒绝。启动后返回 `OperationId` 的工具可用 `GetRuntimeOperation` 查询 `Status`、`Data` 和错误；状态可能是 `Pending`、`Completed`、`Failed`、`Cancelled`、`TimedOut`、`Invalidated`，过期或未知编号返回 `Unknown`。`CancelRuntimeOperation` 只接受仍在等待的 `OperationId`。取消可能仍需清理，`bCleanupPending` 表示尚未确认最终状态；继续查询直至结束。已完成结果只短暂保留，不应把 `OperationId` 当永久记录。

## 测量 Slate CPU 工作并捕获 Trace

`InspectWidgetPerformance` 读取设计态结构复杂度，不能代替运行时测量。`MeasureWidgetPerformance` 必填 `RuntimeInstanceToken`、`RequestId`；可设 `Frames`（默认 30，最大 120）和 `MaxNodes`（默认 100，最大 500）。它汇总实际 Slate paint、invalidation、update 事件的逐 Widget **包含式 GameThread CPU** 时间，不是独占时间或 GPU 时间。用返回的 `OperationId` 查询结果。

`CaptureWidgetTrace` 仅用于有缓存 Slate Widget 的 PIE 实例，必填 `RuntimeInstanceToken`、`RequestId`，`DurationSeconds` 可选（默认 3，范围 0.1–10 秒）。它启动进程级原生 Slate Trace；已有 Trace 正在运行或收尾时不会接管。结束后用 `GetRuntimeOperation` 查看 `Data.TraceStatus`、`TracePath`、实际字节数及清理状态。Trace 包含整个进程，需在 Unreal Insights 中按返回的目标 Slate Widget ID 过滤；它不是该 Widget 的独占或 GPU 计时。文件最终仅在已关闭且不超过 **16 MiB** 时保留，超限或取消会丢弃；`CleanupPending` / `CleanupUnconfirmed` 表示还不能把文件当成可用结果。

运行时操作不会保存 Widget Blueprint。设计态修改仍需显式调用相应保存工具；能力与参数以当前编辑器的 `tools/list` 为准。

## 从设计态 Widget 树检查复杂度

`InspectWidgetPerformance` 只读取一个 Widget Blueprint 的设计态 WidgetTree，并汇总可能影响 UI 复杂度的结构性信号。它不会创建 Widget、进入 PIE、编译、保存或修改资产。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` 为必填 Widget Blueprint 资产路径。`MaxWidgets` 可选，默认 `500`，必须是 `1` 到 `1000` 的 JSON 整数；不接受小数、字符串或布尔值。达到上限时返回 `bTruncated: true`，这表示统计只覆盖已遍历的前缀，不能将其视为全树总数。

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
