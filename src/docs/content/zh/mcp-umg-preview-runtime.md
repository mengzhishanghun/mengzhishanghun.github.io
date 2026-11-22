---
title: 预览界面并诊断运行时表现
type: doc
slug: mcp-umg-preview-runtime
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: workflows
  slug: preview-runtime
  order: 4
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/preview-runtime/
lang: zh
translationKey: doc:mcp-umg:preview-runtime
---

## Preview

### CaptureWidgetPreview

列表样本使用临时资产副本，不把原资产直接交给列表条目。副本引用的外部资源仍可能共享；Widget 生命周期与列表回调可以运行项目代码，这不是脚本沙箱。用于预览的业务逻辑应无副作用。

`CaptureWidgetPreview` 会创建一个已经编译的 Widget Blueprint 的全新临时实例，应用仅用于预览的数据，并返回离屏渲染的 PNG。它是设计预览，不是正在运行的游戏 Widget 截图。

该工具不会编辑或保存 Widget Blueprint、其 WidgetTree、已有 PIE/Game 实例，也不会修改作为列表样本传入的资产。它同样不会编译 Blueprint；请先显式编译，并确保 Blueprint 状态为 `UpToDate`。

#### 参数

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `BlueprintPath` | 是 | Widget Blueprint 资产路径。 |
| `Width`、`Height` | 是 | 正整数像素，每个不超过 4096，乘积不超过 8 MP。 |
| `InstanceProperties` | 否 | 临时 `UUserWidget` 实例的可编辑属性，格式为 `{ "Property": "UE 文本格式" }`。 |
| `WidgetOverrides` | 否 | 最多 64 个 `{ "name": "WidgetName", "properties": { ... } }`；属性只作用于临时树中对应的 Widget。 |
| `ListSamples` | 否 | 最多 64 个 `{ "name": "ListWidgetName", "items": ["/Game/...Asset.Asset"] }`；数据只绑定到临时 ListView/TileView/TreeView。每个列表最多 100 个项目，单次调用共最多 200 个；允许空列表。 |
| `AnimationName`、`TimeSeconds` | 否 | 必须成对提供。时间是非负且位于 MovieScene 播放范围内的绝对轴时间，不是从动画开头算起的偏移。 |

每个 `WidgetOverrides` 条目都必须提供非空的 `properties`。`WidgetOverrides` 中的 Widget 名称、`ListSamples` 中的列表名称必须各自唯一。同一列表中重复的资产路径会被拒绝。每个 `properties` 映射的值都使用 Unreal 文本格式，规则与 `SetWidgetProperties` 相同。

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

响应会明确给出 `PreviewState: TemporaryNewInstance`、`RuntimeState: NotRuntime`、`ProductionState: Unchanged` 与 `SaveStatus: NotSaved`，并附带 PNG。还会返回实际 RenderTarget 尺寸、像素数、两次布局渲染，以及实际应用的 Widget 覆盖和列表样本计数。

指定动画时，工具在临时动画副本上以静默 MovieScene 评估器采样视觉轨道，移除事件轨道，并返回量化后的 `ActualTimeSeconds`。支持的视觉轨道包括 Float、Bool、Enum、Color、2D Transform、Margin 和 Widget Material；其他轨道不能当作通用脚本执行。此机制不阻止 Widget Construct 或列表回调中的项目代码。

Widget Material 动画会为轨道实际使用的每个材质位置创建独立的动态材质实例（MID），复制原实例的参数覆盖，并只替换临时 Widget 的对应画刷。采样不会修改共享的源 MID 或其他 Widget。画刷必须使用有效的 MID，且其父材质必须有效、不能也是 MID。带有运行时虚拟纹理、稀疏体积纹理、纹理集合或参数集合覆盖的 MID 无法完整复制，工具会拒绝这类预览。

创建任何 `UUserWidget` 都会进入其 Blueprint 构造生命周期。该工具不会调用项目特定初始化方法或任意 Blueprint 函数，但用户编写的 Construct 代码本身可能有副作用，因此无法承诺所有 Blueprint 都是纯函数。

## RuntimeWorkflow

### 运行时交互与诊断

这些工具操作已经存在的 PIE/Game `UUserWidget` 实例。先运行目标页面，再用 `ListRuntimeWidgets` 的 `BlueprintPath` 查找实例；返回的 `Instances[].RuntimeInstanceToken` 绑定当前 Widget、World、会话和本地玩家。PIE 重启或 Widget 重建后重新取令牌。`InstanceIndex` 仍可用于旧版只读检查，但需要运行时令牌的工具不可用索引代替。令牌用于定位，不是身份认证。

```json
{"BlueprintPath":"/Game/UI/WBP_Inventory","Offset":0,"MaxItems":32}
```

`InspectWidgetRuntime` 使用 `RuntimeInstanceToken` 读取命名子控件（`WidgetName`），或用 `Offset`、`MaxItems` 分页读取运行中 WidgetTree；`MaxItems` 默认 100，最大 200。实际输入操作前，先检查目标控件和窗口状态。

#### 输入、列表与操作编号

`InteractWithWidget` 必填 `RuntimeInstanceToken`、精确 `WidgetName`、`Action` 和调用者生成的 `RequestId`。`Action` 为 `Click`、`Wheel`、`Text`、`Drag`、`DragDrop` 或 `Navigate`；分别按需要提供 `WheelDelta`、`Text`、归一化终点 `EndX`/`EndY`、`DropWidgetName`，或 `Direction` 与可选 `Device`。文本限制为 1–128 个可打印 BMP 字符；此工具不提供 IME、控制字符或剪贴板输入。输入作用于目标运行时窗口，执行前请确认它正是要操作的页面。

`ControlWidgetList` 必填 `RuntimeInstanceToken`、`ListName` 和 `Action`。先用 `Action: "Snapshot"` 取得列表项 `ItemToken`；随后可 `Select`、`AddSelection`、`Deselect`、`ClearSelection`、`ScrollIntoView`、`Expand`、`Collapse`，或对 ScrollBox 使用 `ScrollWidgetIntoView` 与 `TargetWidgetName`。除 `Snapshot` 外，修改操作需要 `RequestId`；除 `Snapshot`、`ClearSelection` 外，需要快照中的 `ItemToken`。

每个新动作使用新的 `RequestId`；仅在重试完全相同的请求时复用。参数冲突的复用会被拒绝。启动后返回 `OperationId` 的工具可用 `GetRuntimeOperation` 查询 `Status`、`Data` 和错误；状态可能是 `Pending`、`Completed`、`Failed`、`Cancelled`、`TimedOut`、`Invalidated`，过期或未知编号返回 `Unknown`。`CancelRuntimeOperation` 只接受仍在等待的 `OperationId`。取消可能仍需清理，`bCleanupPending` 表示尚未确认最终状态；继续查询直至结束。已完成结果只短暂保留，不应把 `OperationId` 当永久记录。

#### 性能采样和 Trace

`InspectWidgetPerformance` 读取设计态结构复杂度，不能代替运行时测量。`MeasureWidgetPerformance` 必填 `RuntimeInstanceToken`、`RequestId`；可设 `Frames`（默认 30，最大 120）和 `MaxNodes`（默认 100，最大 500）。它汇总实际 Slate paint、invalidation、update 事件的逐 Widget **包含式 GameThread CPU** 时间，不是独占时间或 GPU 时间。用返回的 `OperationId` 查询结果。

`CaptureWidgetTrace` 仅用于有缓存 Slate Widget 的 PIE 实例，必填 `RuntimeInstanceToken`、`RequestId`，`DurationSeconds` 可选（默认 3，范围 0.1–10 秒）。它启动进程级原生 Slate Trace；已有 Trace 正在运行或收尾时不会接管。结束后用 `GetRuntimeOperation` 查看 `Data.TraceStatus`、`TracePath`、实际字节数及清理状态。Trace 包含整个进程，需在 Unreal Insights 中按返回的目标 Slate Widget ID 过滤；它不是该 Widget 的独占或 GPU 计时。文件最终仅在已关闭且不超过 **16 MiB** 时保留，超限或取消会丢弃；`CleanupPending` / `CleanupUnconfirmed` 表示还不能把文件当成可用结果。

运行时操作不会保存 Widget Blueprint。设计态修改仍需显式调用相应保存工具；能力与参数以当前编辑器的 `tools/list` 为准。

## PreviewMatrix

### CaptureWidgetPreviewMatrix

`CaptureWidgetPreviewMatrix` 以 `States × Sizes` 生成一组设计预览 PNG。每个格子都会创建全新的临时 Widget 实例，因此不同状态不会相互污染；结果按状态名、尺寸名排序，`Cells[].PngIndex` 对应返回图片数组的索引。

`States` 与 `Sizes` 必填且非空，笛卡尔积最多 16 格，累计像素最多 32 MP；每张图片仍受 `CaptureWidgetPreview` 的 4096 单边和 8 MP 限制。每个状态可包含同名工具已有的 `InstanceProperties`、`WidgetOverrides` 和 `ListSamples`。

`ListSamples.items` 支持安全顶层资产路径字符串，或 `{ "class": "...", "properties": { ... } }` 动态样本。动态类必须是非 abstract、未废弃、`Within=UObject` 的 `UDataAsset` 或 `UCurveBase` 派生类；Actor、ActorComponent、World、GameInstance、Subsystem 等类型一律拒绝。`UDataAsset` 本身是 abstract，必须提供项目中的具体子类；也可以使用 `/Script/Engine.CurveFloat`。属性先在 CDO 验证，再通过 `NewObject` 在 transient package 创建对象。工具不会调用任意函数、保存对象或写入业务资产。已有样本会逐格复制到 transient package，避免条目逻辑直接修改源资产或跨状态共享同一实例。

这不是递归隔离：资产的外部引用、以及 Widget Construct/列表条目代码对外部系统产生的副作用仍不能由本工具阻止。

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

这仍是 `TemporaryNewInstance` 设计态预览，不代表 PIE/Game 运行状态。当前阶段不接受动画时间参数，避免在跨 UE 版本时把未实际评估的动画帧误报为截图结果。

## Performance

### Widget 性能结构诊断

`InspectWidgetPerformance` 只读取一个 Widget Blueprint 的设计态 WidgetTree，并汇总可能影响 UI 复杂度的结构性信号。它不会创建 Widget、进入 PIE、编译、保存或修改资产。

```json
{
  "BlueprintPath": "/Game/UI/WBP_Inventory",
  "MaxWidgets": 500
}
```

`BlueprintPath` 为必填 Widget Blueprint 资产路径。`MaxWidgets` 可选，默认 `500`，必须是 `1` 到 `1000` 的 JSON 整数；不接受小数、字符串或布尔值。达到上限时返回 `bTruncated: true`，这表示统计只覆盖已遍历的前缀，不能将其视为全树总数。

#### 返回内容

- `MeasurementStatus` 固定为 `AuthoredIndicatorsOnly`，说明结果是已编辑结构的信号，不是实测性能。
- `WidgetsAnalyzed`、`MaxDepth` 与 `WidgetClassCounts`：已分析节点数、最大树深度和控件类计数。
- `PanelComplexity`：Canvas Panel 与 Overlay 的实例数，以及各自单个容器的最大直接子控件数。
- `PropertyBindingCount`：Widget Blueprint 中的属性绑定条目数。
- `VolatileWidgetCount`、`RetainerBoxCount`、`InvalidationBoxCount`、`ListViewCount`：对应控件或标记的实例数。
- `bCycleDetected`：Widget 在当前递归路径中再次出现时为 `true`。工具会停止该路径，避免循环导致无界遍历。
- `bDuplicateReferenceDetected`：已经统计过的 Widget 又从另一条路径可达时为 `true`。共享引用会去重，不会被误报为循环。
- `bTruncated`：分析节点达到 `MaxWidgets` 时为 `true`。

这些指标不能给出毫秒、CPU、GPU、内存、Slate Tick/Paint 开销或实际运行时失效行为。它们用于找出值得进一步观察的结构，例如过深的层级、大量直接子控件、过多绑定或易失控件。需要在运行中的 Widget 上取样时，使用 `MeasureWidgetPerformance`；需要有限时长的原生 Trace 时，使用 `CaptureWidgetTrace`，并遵循[运行时工作流](#runtimeworkflow)中的目标与清理规则。进一步分析可使用 Unreal Insights；检查实际 Slate 层级、无效化和绘制行为可使用 Widget Reflector。
