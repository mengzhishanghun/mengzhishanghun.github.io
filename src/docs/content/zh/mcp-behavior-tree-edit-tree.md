---
title: 检查、编辑与验证行为树
type: doc
slug: mcp-behavior-tree-edit-tree
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-behavior-tree
docPage:
  work: mcp-behavior-tree
  group: features
  slug: edit-tree
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-behavior-tree/docs/edit-tree/
lang: zh
translationKey: doc:mcp-behavior-tree:edit-tree
---

## 创建并检查行为树

新建树时，用 `CreateBehaviorTree` 指定黑板路径。要编辑已有的树，先用 `ListBehaviorTrees` 查到资产，再打开详情定位节点。

`GetBehaviorTreeDetail` 会返回编辑工具可复用的稳定 `NodeId`、关联黑板及键、嵌套树结构、装饰器、服务、反射导出的可编辑属性和游离节点。大结果受深度、节点数、属性数和文本上限保护，未完整返回时会设置 `bTruncated`。`ListBehaviorTrees` 支持确定性排序、过滤以及 `Offset`/`MaxResults` 分页。

## 编辑树结构与节点

| 领域 | 工具 |
|---|---|
| 树结构 | `AddCompositeNode`、`AddTaskNode`、`ConnectNodes`、`RemoveNode` |
| 节点 | `SetNodeProperties`、`AddDecorator`、`AddService` |

移动或修改已有节点前，先从详情里取得对应节点的 `NodeId`。编辑使用 Unreal 事务，改动先留在内存中。节点属性采用 Unreal import-text 字符串：布尔值使用 `true`/`false`，枚举使用名称，向量使用 `(X=0.0,Y=0.0,Z=0.0)`。属性映射只接受字符串值；导入失败时会保留该属性原值。黑板选择器属性接收黑板键名，并按选择器的原生类型过滤器验证。

本插件不编写 Blueprint 任务、装饰器和服务的内部逻辑。请先通过具备 Blueprint 能力的工具创建并编译这些类，再传入生成的 `_C` 类路径。

## 验证、保存与修复

运行 `ValidateBehaviorTree` 并修正报告的问题，再保存。

`SimpleParallel` 具有 `Default` 与 `Background` 输出引脚。添加或移动后台子树时使用 `ParentOutputPin="Background"`。验证会报告结构错误、缺失类、无效键绑定、无效装饰器中止模式和未连接节点。

资产参数使用 `/Game/AI/BT_Enemy`、`/Game/AI/BB_Enemy` 这类 Unreal 内容路径。新建或编辑后的资产保持脏状态，直到 `SaveAsset` 成功。

`SaveAsset`、`OpenAsset` 和 `CloseAsset` 只接受行为树或黑板资产。编辑器图无法同步或 Unreal 无法写入包时，保存会直接失败；因此 MCP 返回成功即表示包保存成功。

若行为树已有运行时节点却缺失编辑器图，插件会拒绝把它重建为空图。请先在 Behavior Tree 编辑器中修复资产，再使用 MCP 编辑或保存工具。
