---
title: 查找、编辑和截取蓝图图表
type: doc
slug: mcp-blueprint-graphs
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-blueprint
docPage:
  work: mcp-blueprint
  group: workflows
  slug: graphs
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/graphs/
lang: zh
translationKey: doc:mcp-blueprint:graphs
---

### 3. `SetPinDefaults`：只改未连接输入 Pin 的字面量

从 `GetGraphDetail` 取得目标节点标识，传入非空 `PinDefaults` 映射，例如 `{"Duration": "2.0", "InString": "Hello"}`。对象/Class Pin 需要完整对象路径。该工具不改变节点、连线或图结构；若输入 Pin 已连接，运行时会忽略它的默认值。结构变化请改用 `ApplyGraphPatch`。

## 教程：创建计算函数

下面的示例创建：

```text
FinalScore = (BaseScore + Bonus) × Multiplier
```

1. 用 `CreateBlueprint` 创建 Actor 蓝图。
2. 用 `CreateFunction` 创建 `CalculateScore`，包含三个 `double` 输入和一个 `double` 输出。
3. 用 `GetGraphDetail` 找到新函数的 Entry/Result 节点标识。
4. 在这个函数图中搜索 `Add` 和 `Multiply`，使用返回的 `Operator:Add` 和 `Operator:Multiply`。
5. 预览一个同时包含两个节点和五条数据连接的 `ApplyGraphPatch`。
6. 对完全相同的 Patch 执行写入，使用原生 `double` 类型提升和自动 `Balanced` 布局。
7. 需要保留这项改动时，调用 `SaveAsset`。

最终图从左到右呈现 `BaseScore + Bonus` 后再乘以 `Multiplier` 的计算流程。

## 正常编辑器截图与业务规则修改对比

以下示例展示 Blueprint Editor 中常见的计算函数、完整业务图和规则调整前后的可见差异。它们用于帮助你理解节点、连线和默认值变化。

### 正常图表示例

`CalculateScore` 展示 Add 与 Multiply 节点如何组合为一个清晰的计算函数。

![正常 Blueprint Editor 中的 CalculateScore](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A1)

### 复杂正式业务流程全图

`EvaluateOrderBatchV2` 展示一个订单结算函数如何在同一张图中处理订单累计、折扣、运费、税费、积分、风险分数和最终结果。

![正常 Blueprint Editor 中的完整订单结算流程](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A2)

### 修改 1：Region 1 增加首单免运费

修改前，Region 1 直接执行 `ShippingCents = 1000`，不区分是否为首单。

![Region 1 增加首单免运费之前](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A3)

修改后，Region 1 增加 `FirstOrder` 分支：首单运费为 `0`，其他订单仍为 `1000`。

![Region 1 增加首单免运费之后](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A4)

### 修改 2：积分基数排除运费

修改前：`PointsEarned = TotalCents / 100`。

![积分排除运费之前](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A5)

修改后：`PointsEarned = (TotalCents - ShippingCents) / 100`，新增 Subtract 节点以排除运费。

![积分排除运费之后](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A6)

### 修改 3：首单折扣由固定值改为小计 5%

修改前：`SubtotalCents × 0` 后再加固定值 `500`，因此输出始终是固定折扣 `500`。

![修改首单折扣规则之前](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A7)

修改后：固定值路径改为 `SubtotalCents / 20`，即小计的 5% 折扣。

![修改首单折扣规则之后](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A8)

修改逻辑前，先使用 dry-run（若工具支持）了解影响；涉及引用更新或数据丢失时，按工具要求显式批准。需要保留改动时使用 `SaveAsset`。

## 查找资产与图表

- 用 `ListBlueprints` 分页查找资产。
- 用 `GetBlueprintOverview` 查看图、变量、函数、组件、接口和父类。
- 用 `ListBlueprintMembers` 查看函数、自定义事件、事件分发器和局部变量。
- 用 `GetGraphDetail` 查看节点、Pin、默认值、连线和布局。
- 用 `GetCompileErrors` 或 `CompileBlueprint` 查看编辑器诊断。

使用插件返回的资产路径。大型图请分页查看，避免一次返回过多内容。

## 安全添加图表逻辑

使用 Unreal 英文动作名搜索，例如 `Branch`、`For Loop`、`For Each Loop`、`Switch on Int`、`Switch on Name`、`Switch on String`、`Add`、`Subtract`、`Multiply` 或 `Divide`。

`ApplyGraphPatch` 支持：

- 带临时 ID 和 Action Registry `SpawnerId` 的 `Nodes`。
- `Connections` 与 `Disconnections`。
- 通过节点标识定位的 `RemoveNodes`。
- 通过节点标识和图坐标定位的 `MoveNodes`。
- 可选的 `PinDefaults`、`PromotedType`、布局范围和布局风格。

整个 Patch 只使用一个事务，失败时会尝试自动回滚。如果工具提示恢复失败，请停止继续修改，重新打开资产确认当前状态后再处理。

## 截取图表

先调用 `OpenAsset`，再使用 `CaptureGraphScreenshot`。可以截取完整图表、聚焦某个节点，或复用指定视口。分享图片前，请确认标题、Pin 和连线清晰可读。

截图工具要求已初始化的蓝图图表编辑器控件。未打开图表编辑器或图表控件尺寸为零时，截图请求会被拒绝。
