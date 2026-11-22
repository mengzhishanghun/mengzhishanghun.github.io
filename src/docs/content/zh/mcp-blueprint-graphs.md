---
title: 编辑蓝图节点、连线与布局
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
  group: assets-graphs
  slug: graphs
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-blueprint/docs/graphs/
lang: zh
translationKey: doc:mcp-blueprint:graphs
---

## 读取图表并查找可创建的节点

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `GetGraphDetail` | 查看指定图的节点、Pin、连线和布局信息。 | 可用 `GraphName` 限定目标图。 |
| `SearchGraphNodes` | 按英文动作名查找可创建的节点。 | 后续创建节点时只能使用返回的 `SpawnerId`。 |

使用插件返回的资产路径，分页读取大型图表。`GetGraphDetail` 也会返回 Pin 默认值。用 Unreal 的英文动作名搜索，例如 `Branch`、`For Loop`、`For Each Loop`、`Switch on Int`、`Switch on Name`、`Switch on String`、`Add`、`Subtract`、`Multiply` 或 `Divide`。

## 预检、应用和保存图表补丁

涉及结构或数据变化的写操作可按以下顺序进行：

1. **定位**： 确定目标资产、图、Pin、成员或组件。
2. **搜索**： 通过 `SearchGraphNodes` 获取合法 `SpawnerId`。
3. **预览**： 工具支持时使用 `bDryRun=true`，检查受影响资产、规范化操作、限制和 blocker。
4. **应用**： 使用工具返回的标识，不编造 `SpawnerId`。
5. **保存**： 只有需要保留改动时才调用 `SaveAsset`。

Dry-run 不能展示所有生成 Pin、类型提升或最终布局。预检不会自动写入。应用前，请使用当前搜索结果中的 `SpawnerId`。

## ApplyGraphPatch 的编辑范围

`ApplyGraphPatch` 支持：

- 带临时 ID 和 Action Registry `SpawnerId` 的 `Nodes`。
- `Connections` 与 `Disconnections`。
- 通过节点标识定位的 `RemoveNodes`。
- 通过节点标识和图坐标定位的 `MoveNodes`。
- 可选的 `PinDefaults`、`PromotedType`、布局范围和布局风格。

整个 Patch 只使用一个事务，失败时会尝试自动回滚。如果工具提示恢复失败，请停止继续修改，重新打开资产确认当前状态后再处理。

- **写入被拒绝：** 阅读所有 blocker 和批准参数要求，重试前重新读取目标。
- **图表结果异常：** 对比前后的 `GetGraphDetail`，适用时执行 Undo。
- 某些 Blueprint Action 无法安全处理时，工具会直接拒绝操作。

## 设置未连接输入 Pin 的默认值

从 `GetGraphDetail` 取得目标节点标识，传入非空 `PinDefaults` 映射，例如 `{"Duration": "2.0", "InString": "Hello"}`。对象/Class Pin 需要完整对象路径。该工具不改变节点、连线或图结构；若输入 Pin 已连接，运行时会忽略它的默认值。结构变化请改用 `ApplyGraphPatch`。

## 修改可变 Pin 与整理图表

| 工具 | 用途 | 注意事项 |
| --- | --- | --- |
| `AddNodePin` | 为支持可变 Pin 的节点增加 Pin。 | 先从图表详情取得目标节点标识。 |
| `RemoveNodePin` | 删除节点上可编辑的用户 Pin。 | 需要准确定位目标 Pin。 |
| `FormatGraph` | 用 `Balanced`、`Straight` 或 `Compact` 整理图表布局。 | 可按图或范围指定布局。 |
| `AddCommentBox` | 添加原生 Comment Box。 | 指定文字和范围或目标节点。 |

`Balanced`、`Straight`、`Compact` 是确定性布局风格。无论整理局部还是全图，布局都会保护原生 Comment Box 的包围关系。UE 支持时，可用单步 Undo 撤销。

## 示例：创建计算函数

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

## 示例：修改订单结算规则

以下示例使用 [`EvaluateOrderBatchV2` 订单结算图](/zh/works/mcp-blueprint/docs/graph-screenshots/)，展示修改节点、连线和默认值后的结果。

### Region 1 首单免运费

修改前，Region 1 直接执行 `ShippingCents = 1000`，不区分是否为首单。

![Region 1 增加首单免运费之前](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A1)

修改后，Region 1 增加 `FirstOrder` 分支：首单运费为 `0`，其他订单仍为 `1000`。

![Region 1 增加首单免运费之后](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A2)

### 积分计算排除运费

修改前：`PointsEarned = TotalCents / 100`。

![积分排除运费之前](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A3)

修改后：`PointsEarned = (TotalCents - ShippingCents) / 100`，新增 Subtract 节点以排除运费。

![积分排除运费之后](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A4)

### 首单折扣改为小计的 5%

修改前：`SubtotalCents × 0` 后再加固定值 `500`，因此输出始终是固定折扣 `500`。

![修改首单折扣规则之前](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A5)

修改后：固定值路径改为 `SubtotalCents / 20`，即小计的 5% 折扣。

![修改首单折扣规则之后](/media-occurrence/doc%3Amcp-blueprint%3Agraphs%3Amedia%3A6)

修改逻辑前，先使用 dry-run（若工具支持）了解影响；涉及引用更新或数据丢失时，按工具要求显式批准。需要保留改动时使用 `SaveAsset`。
