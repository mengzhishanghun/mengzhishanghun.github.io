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
  group: features
  slug: events-navigation-animation
  order: 10
documentKind: product-manual
websiteRoute: /zh/works/mcp-umg/docs/events-navigation-animation/
lang: zh
translationKey: doc:mcp-umg:events-navigation-animation
---

## 事件节点与交互逻辑

先确认要处理的是哪一个事件，以及触发后希望看到什么变化。例如，给现有按钮加点击动作时，提供 Widget Blueprint 路径、按钮名称和所需动作；属性绑定可单独用 `SetPropertyBinding` 设置。

选定目标 Widget Blueprint 和控件后，先用 `BindWidgetEvent` 绑定事件，再用 `AddEventActions` 设置触发后的动作。要移除绑定时，用 `UnbindWidgetEvent`。如需高级图表操作，请先[连接 MCPBlueprint](/zh/works/mcp-blueprint/docs/connect/)。

| 工具 | 用途 |
| --- | --- |
| BindWidgetEvent | 绑定 Widget 事件 |
| UnbindWidgetEvent | 删除 Widget 事件绑定 |
| AddEventActions | 添加事件动作 |
| SetPropertyBinding | 设置 Widget 属性绑定 |

要验证实际交互，请在 PIE 中打开目标界面，再[检查运行时实例](/zh/works/mcp-umg/docs/runtime-diagnostics/)。焦点移动规则见[设置 UMG 焦点导航](/zh/works/mcp-umg/docs/navigation/)，时间轴和关键帧见[编辑 UMG 动画](/zh/works/mcp-umg/docs/animation/)。
