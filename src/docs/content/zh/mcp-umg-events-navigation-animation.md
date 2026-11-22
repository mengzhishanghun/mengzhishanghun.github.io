---
title: 配置 UMG 事件逻辑
type: doc
slug: mcp-umg-events-navigation-animation
draft: false
sitePublish: true
tags:
  - Unreal Engine
  - MCP
workIds:
  - mcp-umg
docPage:
  work: mcp-umg
  group: interaction-frameworks
  slug: events-navigation-animation
  order: 1
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/events-navigation-animation/
lang: zh
translationKey: doc:mcp-umg:events-navigation-animation
---

## 事件节点与交互逻辑

找到目标 Widget Blueprint 和控件后，用 `BindWidgetEvent` 添加绑定，并用 `AddEventActions` 添加动作。删除绑定时用 `UnbindWidgetEvent`。如需高级图表操作，请先[连接 MCPBlueprint](/zh/works/mcp-blueprint/docs/connect/)。

| 工具 | 用途 |
| --- | --- |
| BindWidgetEvent | 绑定 Widget 事件 |
| UnbindWidgetEvent | 删除 Widget 事件绑定 |
| AddEventActions | 添加事件动作 |
| SetPropertyBinding | 设置 Widget 属性绑定 |

要验证实际交互，请在 PIE 中打开目标界面，再[检查运行时实例](/zh/works/mcp-umg/docs/runtime-diagnostics/)。焦点移动规则见[设置 UMG 焦点导航](/zh/works/mcp-umg/docs/navigation/)，时间轴和关键帧见[编辑 UMG 动画](/zh/works/mcp-umg/docs/animation/)。
