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
  group: workflows
  slug: animation-blueprint
  order: 2
documentKind: product-manual
websiteRoute: /zh/works/mcp-animation/docs/animation-blueprint/
lang: zh
translationKey: doc:mcp-animation:animation-blueprint
---

### Animation Blueprint 与状态机编辑

| 工具 | 用途 |
|---|---|
| `CreateAnimBlueprint` | 为指定 Skeleton 创建 Animation Blueprint。 |
| `AddState` / `RemoveState` | 添加或移除状态。 |
| `SetStateAnimation` | 仅在能确认唯一直接驱动状态结果的 Sequence Player 时设置动画。 |
| `AddTransition` | 在两个状态之间创建过渡。 |
| `SetTransitionRule` | 设置受支持的过渡规则。 |
| `CompileAnimBlueprint` | 编译并返回包括 AnimGraph、状态图和过渡图在内的诊断。 |
