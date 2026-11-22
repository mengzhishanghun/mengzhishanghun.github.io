---
title: 编辑动画蓝图与状态机
type: doc
slug: mcp-animation-animation-blueprint
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-animation
docPage:
  work: mcp-animation
  group: editing
  slug: animation-blueprint
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/animation-blueprint/
lang: zh
translationKey: doc:mcp-animation:animation-blueprint
---

## 发现与检查状态机

| 工具 | 用途 |
|---|---|
| `ListAnimBlueprints` | 稳定分页列出 Animation Blueprint。 |
| `GetAnimBPOverview` | 读取 Animation Blueprint、AnimGraph 和状态机概览。 |
| `GetStateMachineDetail` | 有界读取状态、过渡与 Conduit 摘要。 |

## 修改并编译动画蓝图

| 工具 | 用途 |
|---|---|
| `CreateAnimBlueprint` | 为指定 Skeleton 创建 Animation Blueprint。 |
| `AddState` / `RemoveState` | 添加或移除状态。 |
| `SetStateAnimation` | 仅在能确认唯一直接驱动状态结果的 Sequence Player 时设置动画。 |
| `AddTransition` | 在两个状态之间创建过渡。 |
| `SetTransitionRule` | 设置受支持的过渡规则。 |
| `CompileAnimBlueprint` | 编译并返回包括 AnimGraph、状态图和过渡图在内的诊断。 |

复杂或歧义的状态结果图不会被猜测修改；请先调整为单一直接驱动结构或使用 Unreal Editor 手工编辑。

写入前后请遵循[打开与保存动画资产](/zh/works/mcp-animation/docs/find-assets/)一节的路径、事务和保存规则。
