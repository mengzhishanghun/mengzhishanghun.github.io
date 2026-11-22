---
title: 预览界面并对比截图
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
  group: preview-diagnostics
  slug: preview-runtime
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/preview-runtime/
lang: zh
translationKey: doc:mcp-umg:preview-runtime
---

## 离屏预览

列表样本使用临时资产副本，不把原资产直接交给列表条目。副本引用的外部资源仍可能共享；Widget 生命周期与列表回调可以运行项目代码，这不是脚本沙箱。用于预览的业务逻辑应无副作用。

`CaptureWidgetPreview` 会创建一个已经编译的 Widget Blueprint 的全新临时实例，应用仅用于预览的数据，并返回离屏渲染的 PNG。需要查看实际游戏画面时，请用下文的运行时截图工具。

该工具不会编辑或保存 Widget Blueprint、其 WidgetTree、已有 PIE/Game 实例，也不会修改作为列表样本传入的资产。它同样不会编译 Blueprint；请先显式编译，并确保 Blueprint 状态为 `UpToDate`。

### 单张预览的参数

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

## 按状态和尺寸批量预览

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

## 截取正在运行或设计中的控件

| 工具 | 用途 |
| --- | --- |
| CaptureWidgetScreenshot | 将 Widget 设计视图截取为 PNG |
| CaptureRuntimeWidgetScreenshot | 按实际 Slate 窗口几何截取 PIE/Game 中已存在的 Widget 实例为 PNG；不会创建 Widget 或注入预览状态 |
| CompareUIImages | 在不自动缩放、裁剪或对齐的前提下比较两张 UI 图片并返回热图 |

`CaptureRuntimeWidgetScreenshot` 需要加载 MCPUMG 编辑器模块并存在目标运行态 Widget；单独的 `-game` 进程不保证提供 MCPUMG 服务。
